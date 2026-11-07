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

    // ═════════════════════════════════════════════════════════════════════
    // TIER 1 · TERRACE FLOOR  (unscaledElev >= 18.0)
    // ═════════════════════════════════════════════════════════════════════
    if (unscaledElev >= 18.0) {
      // Lane A stairwell opening (X=26.375–29.625, Y=4.0–11.0)
      // When entering the staircase to descend south-to-north:
      if (xs >= 26.375 && xs <= 29.625 && ys >= 4.0 && ys <= 11.0) {
        const k = Math.min(13, Math.max(1, Math.ceil((14.01 - ys) / 0.770)));
        return (12.00 + 0.75 * k) * s;
      }

      // Entire terrace floor slab & shaft ceiling grating:
      // Includes roof slabs RF1, RF2-S, RF2-N, RF2-E, RF3, RF4-S, RF4-W, RF4-N,
      // and the walkable stainless steel ceiling/terrace grating (X=27.625–32.375, Y=19.125–22.875).
      return 22.50 * s;
    }

    // ═════════════════════════════════════════════════════════════════════
    // TIER 2 · FIRST FLOOR  (6.5 <= unscaledElev < 18.0)
    // ═════════════════════════════════════════════════════════════════════
    if (unscaledElev >= 6.5) {
      // 1. Upper stair flight Lane A (climbing south to terrace)
      if (xs >= 26.375 && xs <= 29.625) {
        if (ys < 4.0) {
          return 22.50 * s; // Terrace arrival landing
        }
        if (ys <= 14.01) {
          const k = Math.min(13, Math.max(1, Math.ceil((14.01 - ys) / 0.770)));
          return (12.00 + 0.75 * k) * s;
        }
        // North of stair foot: First floor plate
        return 12.00 * s;
      }

      // 2. Lower stair flight Lane B (descending south to ground floor)
      if (xs >= 30.125 && xs <= 33.875) {
        if (ys >= 13.24 && ys <= 15.0) {
          return 12.00 * s; // First Floor landing
        }
        if (ys >= 4.0 && ys < 13.24) {
          const treadIndex = Math.min(12, Math.max(1, Math.floor((ys - 4.0) / 0.770) + 1));
          return (1.50 + 0.8077 * treadIndex) * s;
        }
        // South of flight foot (ys < 4.0): First floor slab above ground hallway
        return 12.00 * s;
      }

      // 3. Everywhere across First Floor plate (including shaft alcove walkable floor grating)
      return 12.00 * s;
    }

    // ═════════════════════════════════════════════════════════════════════
    // TIER 3 · GROUND FLOOR  (unscaledElev < 6.5)
    // ═════════════════════════════════════════════════════════════════════
    // Lower stair flight Lane B (ascending north to first floor)
    if (xs >= 30.125 && xs <= 33.875) {
      if (ys >= 13.24 && ys <= 15.0) {
        return 1.50 * s; // Ground Floor under landing slab
      }
      if (ys >= 4.0 && ys < 13.24) {
        const treadIndex = Math.min(12, Math.max(1, Math.floor((ys - 4.0) / 0.770) + 1));
        return (1.50 + 0.8077 * treadIndex) * s;
      }
      return 1.50 * s; // Ground floor hallway
    }

    // Garage threshold two steps (Override O4: X=34.25–41.25, Y=14.0–15.0)
    if (xs >= 34.25 && xs <= 41.25 && ys >= 14.0 && ys <= 15.0) {
      return 1.00 * s;
    }

    // Garage floor (flat ground level, Z = 0.00)
    if (xs >= 34.25 && xs <= 49.25 && ys >= 0.0 && ys <= 15.0) {
      return 0.00;
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
      if (item.disabled) {
        continue;
      }

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
    const isTerrace = playerElev >= 18.0 * this.scale;
    const isFirstFloor = playerElev >= 6.5 * this.scale && !isTerrace;

    if (isTerrace) {
      return {
        id: 'TER',
        name: 'Terrace (Open Air)'
      };
    }

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
