/**
 * Collision & Elevation System
 * Evaluates exact floor elevations across plinths, stairs, garage ramps, and steps.
 * Resolves horizontal wall circle-to-AABB collisions with smooth sliding physics.
 *
 * Supports ground floor (Z_F0 = 1.50 * s) and first floor (Z_F1 = 12.00 * s).
 * The player's current feetElevation is used to disambiguate which floor
 * they are on when both floors share the same X/Y footprint.
 */

import { WORLD_SCALE } from '../config/constants.js';

export class CollisionSystem {
  constructor(zones, colliders, scale = WORLD_SCALE) {
    this.zones = zones;
    this.colliders = colliders;
    this.scale = scale;
  }

  /**
   * Samples exact floor surface elevation in feet at Three.js coordinates (x, z).
   * @param {number} x - Three.js X (= spec X)
   * @param {number} z - Three.js Z (= -spec Y)
   * @param {number} [currentElev=0] - player's current feet elevation, used for multi-floor disambiguation
   */
  getFloorElevation(x, z, currentElev = 0) {
    const s = this.scale;
    const xs = x / s;         // canonical spec X
    const ys = -z / s;        // canonical spec Y
    const unscaledElev = currentElev / s;

    // 0. Outside plot boundary — street level
    if (xs < -0.75 || xs > 50.0 || ys < -0.75 || ys > 24.0) {
      return 0.00;
    }

    // ── STAIR FLIGHT LANE B (Ground Floor <-> First Floor) ───────────────
    // Connects Ground Floor (Z = 1.50) to First Floor (Z = 12.00)
    // Seamless in both ascending (south to north) and descending (north to south)
    if (xs >= 30.125 && xs <= 33.875) {
      // Arrival landing at top of ground flight (First Floor slab level)
      if (ys >= 13.24 && ys <= 15.0) {
        if (unscaledElev >= 6.5) {
          return 12.00 * s; // First Floor landing
        }
        return 1.50 * s;    // Ground Floor under landing slab
      }

      // The 12 stair treads climbing from 1.50 to 12.00
      if (ys >= 4.0 && ys <= 13.24) {
        const treadIndex = Math.min(12, Math.max(1, Math.floor((ys - 4.0) / 0.770) + 1));
        return (1.50 + 0.8077 * treadIndex) * s;
      }

      // South of flight foot (ys < 4.0):
      // If player is on first floor slab above: 12.00
      // Otherwise ground floor hallway: 1.50
      if (unscaledElev >= 6.5) {
        return 12.00 * s;
      }
      return 1.50 * s;
    }

    // ── UPPER FLOORS (First Floor & Terrace: unscaledElev >= 6.5) ────────
    if (unscaledElev >= 6.5) {
      // Upper flight Lane A (X = 26.375 to 29.625) climbing south to Terrace
      if (xs >= 26.375 && xs <= 29.625) {
        if (ys >= 0.0 && ys < 4.0) {
          return 22.50 * s; // Terrace roof level
        }
        if (ys >= 4.0 && ys <= 14.01) {
          const k = Math.min(13, Math.max(1, Math.ceil((14.01 - ys) / 0.770)));
          return (12.00 + 0.75 * k) * s;
        }
        // North of upper stair foot: First floor plate
        return 12.00 * s;
      }

      // Terrace level for terrace players
      if (unscaledElev >= 18.0) {
        return 22.50 * s;
      }

      // Everywhere across First Floor plate
      return 12.00 * s;
    }

    // ── GROUND FLOOR (unscaledElev < 6.5) ────────────────────────────────
    // NOTE: On Ground Floor, Lane A (xs = 26.375 to 29.625) is Zone Z9A
    // (Stairs Bay West Passage) and South Hallway at Z = 1.50 * s.
    // It is NEVER treated as upper terrace stairs!

    // Garage threshold two steps (Override O4: X=34.25–41.25, Y=14.0–15.0)
    if (xs >= 34.25 && xs <= 41.25 && ys >= 14.0 && ys <= 15.0) {
      return 1.00 * s;
    }

    // Garage floor (sloped wedge, Z = Y/30, range 0.00–0.50)
    if (xs >= 34.25 && xs <= 49.25 && ys >= 0.0 && ys <= 15.0) {
      return ((ys / 15.0) * 0.50) * s;
    }

    // Entrance steps (ground spec 7.1)
    if (ys >= 0.0 && ys <= 7.5) {
      if (xs >= 3.25  && xs < 3.75)   return 0.00;
      if (xs >= 3.75  && xs < 4.55)   return 0.50 * s;
      if (xs >= 4.55  && xs < 5.35)   return 1.00 * s;
      if (xs >= 5.35  && xs <= 6.15)  return 1.50 * s;
      if (xs >  6.15  && xs <= 13.625) return 1.50 * s;
    }

    // Ground-floor plinth raised floors (+1.50)
    if (xs >= 3.25   && xs <= 34.25  && ys >= 7.5  && ys <= 23.25) return 1.50 * s;
    if (xs >= 13.625 && xs <= 34.25  && ys >= 0.0  && ys <= 7.5)   return 1.50 * s;
    if (xs >= 6.15   && xs <= 13.625 && ys >= 0.0  && ys <= 7.5)   return 1.50 * s;
    if (xs >= 34.25  && xs <= 49.25  && ys >= 15.0 && ys <= 23.25) return 1.50 * s;

    // Gate landing & garden / street
    return 0.00;
  }

  /**
   * Resolves horizontal circle-to-AABB collisions against walls and doorway lintels.
   */
  resolveWallCollisions(px, pz, radius, playerElev) {
    let resolvedX = px;
    let resolvedZ = pz;
    const s = this.scale;

    for (const item of this.colliders) {
      const [xmin, xmax, ymin, ymax, zmin, zmax] = item.box;

      // Skip boxes that don't vertically intersect the player torso
      if (zmax <= playerElev + 0.3 * s || zmin >= playerElev + 5.0 * s) {
        continue;
      }

      const bMinX = xmin;
      const bMaxX = xmax;
      const bMinZ = -ymax; // spec Y-max → Three.js -Z min
      const bMaxZ = -ymin; // spec Y-min → Three.js -Z max

      const closestX = Math.max(bMinX, Math.min(resolvedX, bMaxX));
      const closestZ = Math.max(bMinZ, Math.min(resolvedZ, bMaxZ));

      const distX = resolvedX - closestX;
      const distZ = resolvedZ - closestZ;
      const distSq = distX * distX + distZ * distZ;

      if (distSq < radius * radius && distSq > 0.000001) {
        const dist = Math.sqrt(distSq);
        const overlap = radius - dist;
        resolvedX += (distX / dist) * overlap;
        resolvedZ += (distZ / dist) * overlap;
      } else if (distSq <= 0.000001) {
        // Player centre inside box — push out along nearest axis
        const leftDist   = resolvedX - bMinX;
        const rightDist  = bMaxX - resolvedX;
        const topDist    = resolvedZ - bMinZ;
        const bottomDist = bMaxZ - resolvedZ;
        const minEdge = Math.min(leftDist, rightDist, topDist, bottomDist);

        if      (minEdge === leftDist)   resolvedX = bMinX - radius;
        else if (minEdge === rightDist)  resolvedX = bMaxX + radius;
        else if (minEdge === topDist)    resolvedZ = bMinZ - radius;
        else                             resolvedZ = bMaxZ + radius;
      }
    }

    return [resolvedX, resolvedZ];
  }

  /**
   * Detects which architectural zone player is standing in.
   * Uses player elevation to disambiguate between Ground Floor (Z ~ 1.5) and First Floor (Z ~ 12.0).
   */
  getZoneAt(x, z, playerElev = 0) {
    const xs = x;
    const ys = -z;
    const isFirstFloor = playerElev >= 6.5 * this.scale;

    for (const zone of this.zones) {
      const isZoneF1 = zone.id.startsWith('F');
      if (isFirstFloor !== isZoneF1) continue;

      const [x1, x2, y1, y2] = zone.bounds;
      if (xs >= x1 && xs <= x2 && ys >= y1 && ys <= y2) {
        return zone;
      }
    }

    return {
      id: 'EXT',
      name: isFirstFloor ? '1F Terrace / Open Air' : 'Exterior Street Area'
    };
  }
}
