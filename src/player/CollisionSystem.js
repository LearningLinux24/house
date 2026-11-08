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

    // Base floor elevation across grounds, plinth, and stairs
    let baseElev = 0.00;

    // 0. Outside plot boundary — street level
    if (xs < -0.75 || xs > 50.0 || ys < -0.75 || ys > 24.0) {
      baseElev = 0.00;
    } else if (unscaledElev >= 18.0) {
      // ═════════════════════════════════════════════════════════════════════
      // TIER 1 · TERRACE FLOOR  (unscaledElev >= 18.0)
      // ═════════════════════════════════════════════════════════════════════
      if (xs >= 26.375 && xs <= 29.625 && ys >= 4.0 && ys <= 11.0) {
        const k = Math.min(13, Math.max(1, Math.ceil((14.01 - ys) / 0.770)));
        baseElev = (12.00 + 0.75 * k) * s;
      } else {
        baseElev = 22.50 * s;
      }
    } else if (unscaledElev >= 6.5) {
      // ═════════════════════════════════════════════════════════════════════
      // TIER 2 · FIRST FLOOR  (6.5 <= unscaledElev < 18.0)
      // ═════════════════════════════════════════════════════════════════════
      if (xs >= 26.375 && xs <= 29.625) {
        if (ys < 4.0) {
          baseElev = 22.50 * s;
        } else if (ys <= 14.01) {
          const k = Math.min(13, Math.max(1, Math.ceil((14.01 - ys) / 0.770)));
          baseElev = (12.00 + 0.75 * k) * s;
        } else {
          baseElev = 12.00 * s;
        }
      } else if (xs >= 30.125 && xs <= 33.875) {
        if (ys >= 13.24 && ys <= 15.0) {
          baseElev = 12.00 * s;
        } else if (ys >= 4.0 && ys < 13.24) {
          const treadIndex = Math.min(12, Math.max(1, Math.floor((ys - 4.0) / 0.770) + 1));
          baseElev = (1.50 + 0.8077 * treadIndex) * s;
        } else {
          baseElev = 12.00 * s;
        }
      } else {
        baseElev = 12.00 * s;
      }
    } else {
      // ═════════════════════════════════════════════════════════════════════
      // TIER 3 · GROUND FLOOR  (unscaledElev < 6.5)
      // ═════════════════════════════════════════════════════════════════════
      if (xs >= 30.125 && xs <= 33.875) {
        if (ys >= 13.24 && ys <= 15.0) {
          baseElev = 1.50 * s;
        } else if (ys >= 4.0 && ys < 13.24) {
          const treadIndex = Math.min(12, Math.max(1, Math.floor((ys - 4.0) / 0.770) + 1));
          baseElev = (1.50 + 0.8077 * treadIndex) * s;
        } else {
          baseElev = 1.50 * s;
        }
      } else if (xs >= 34.25 && xs <= 41.25 && ys >= 14.0 && ys <= 15.0) {
        baseElev = 1.00 * s;
      } else if (xs >= 34.25 && xs <= 49.25 && ys >= 0.0 && ys <= 15.0) {
        baseElev = 0.00;
      } else if (xs >= 13.625 && xs <= 34.25 && ys >= 0.0 && ys <= 7.5) {
        // P2 Plinth (South Hallway & South Porch)
        baseElev = 1.50 * s;
      } else if (xs >= 28.5 && xs <= 31.75 && ys >= -0.75 && ys < 0.0) {
        // D7 Door Threshold
        baseElev = 1.50 * s;
      } else if (xs >= 28.0 && xs <= 32.25 && ys >= -2.5 && ys < -0.75) {
        // D7 Exterior Landing Step
        baseElev = 0.75 * s;
      } else if (xs >= 6.15 && xs <= 13.625 && ys >= 0.0 && ys <= 7.5) {
        // P3 Plinth (Entrance Porch)
        baseElev = 1.50 * s;
      } else if (ys >= 0.0 && ys <= 7.5 && xs >= 3.25 && xs < 6.15) {
        // Entrance steps S1, S2, S3
        if (xs >= 3.25 && xs < 3.75) baseElev = 0.00;
        else if (xs >= 3.75 && xs < 4.55) baseElev = 0.50 * s;
        else if (xs >= 4.55 && xs < 5.35) baseElev = 1.00 * s;
        else baseElev = 1.50 * s;
      } else if (xs >= 3.25 && xs <= 34.25 && ys >= 7.5 && ys <= 23.25) {
        // P1 Plinth (Main Ground Floor)
        baseElev = 1.50 * s;
      } else if (xs >= 34.25 && xs <= 49.25 && ys >= 15.0 && ys <= 23.25) {
        // P4 Plinth (Kitchen Wing)
        baseElev = 1.50 * s;
      } else {
        baseElev = 0.00;
      }
    }

    // Sample stepable furniture surface elevations (beds, tables, counters, nightstands, chairs, sofas)
    let highestSurface = baseElev;

    if (this.colliders) {
      for (const item of this.colliders) {
        if (item.disabled) continue;
        if (item.type !== 'interior_furniture' && !item.isStepable) continue;

        const [xmin, xmax, ymin, ymax, zmin, zmax] = item.box;

        // Skip tall wardrobes and full-height ceiling walls
        const obsHeight = zmax - zmin;
        if (obsHeight > 5.5 * s) continue;

        const bMinX = xmin;
        const bMaxX = xmax;
        const bMinZ = -ymax;
        const bMaxZ = -ymin;

        if (x >= bMinX && x <= bMaxX && z >= bMinZ && z <= bMaxZ) {
          const surfElev = zmax;
          // Player can stand on this surface if jumping toward it or already on it
          if (currentElev >= surfElev - 1.8 * s && currentElev <= surfElev + 4.5 * s) {
            if (surfElev > highestSurface) {
              highestSurface = surfElev;
            }
          }
        }
      }
    }

    return highestSurface;
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

      // If this obstacle is a stepable/walkable furniture item (bed, table, chair, counter)
      // and player's feet elevation is ON or ABOVE its top surface, player is standing on it!
      // Skip horizontal wall collision so player can freely walk and stand on top.
      const isStepableFurniture = (item.type === 'interior_furniture' || item.isStepable) &&
        ((zmax - zmin) <= 5.5 * s);

      if (isStepableFurniture && playerElev >= zmax - 0.20 * s) {
        continue;
      }

      // Skip boxes that don't vertically intersect the player torso
      if (zmax <= playerElev + 0.25 * s || zmin >= playerElev + 5.0 * s) {
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
   * Enable or disable a specific collision obstacle by id (e.g. occupied bed/sofa or open door)
   */
  setColliderDisabled(id, disabled) {
    const col = this.colliders.find(c => c.id === id);
    if (col) {
      col.disabled = disabled;
    }
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
