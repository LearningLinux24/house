/**
 * Collision & Elevation System
 * Evaluates exact floor elevations across plinths, stairs, garage ramps, and steps.
 * Resolves horizontal wall circle-to-AABB collisions with smooth sliding physics.
 *
 * Supports ground floor (Z_F0 = 1.50) and first floor (Z_F1 = 12.00).
 * The player's current feetElevation is used to disambiguate which floor
 * they are on when both floors share the same X/Y footprint.
 */

export class CollisionSystem {
  constructor(zones, colliders) {
    this.zones = zones;
    this.colliders = colliders;
  }

  /**
   * Samples exact floor surface elevation in feet at Three.js coordinates (x, z).
   * @param {number} x - Three.js X (= spec X)
   * @param {number} z - Three.js Z (= -spec Y)
   * @param {number} [currentElev=0] - player's current feet elevation, used for multi-floor disambiguation
   */
  getFloorElevation(x, z, currentElev = 0) {
    const xs = x;         // spec X
    const ys = -z;        // spec Y

    // 0. Outside plot boundary — street level
    if (xs < -0.75 || xs > 50.0 || ys < -0.75 || ys > 24.0) {
      return 0.00;
    }

    // ── FIRST FLOOR ZONES (player is at or above Z ≈ 11.5) ──────────────
    if (currentElev >= 11.0) {

      // Upper staircase lane A (ascending south, X=26.375–29.625)
      // 13 treads, riser=0.750, run=0.770, top of tread 1 starts at Y=14.01
      if (xs >= 26.375 && xs <= 29.625 && ys >= 4.0 && ys <= 14.01) {
        // k = tread number (1 at top, 13 at bottom near Y=4.0)
        const k = Math.min(13, Math.max(1, Math.ceil((14.01 - ys) / 0.770)));
        return 12.0 + 0.75 * k;
      }

      // Terrace level — above the topmost upper tread
      if (xs >= 26.375 && xs <= 29.625 && ys >= 0.0 && ys < 4.0) {
        return 22.50;
      }

      // First-floor slab — the entire footprint at Z = 12.00
      // Stairwell void (lane B: X=30.125–33.875, Y=7.0–13.25) is an open hole;
      // player cannot stand there — return a very low value so they fall back.
      if (xs >= 30.125 && xs <= 33.875 && ys >= 7.0 && ys <= 13.25) {
        return -99; // void — no floor here on the first floor
      }

      return 12.00; // everywhere else on the first floor
    }

    // ── GROUND FLOOR ZONES ───────────────────────────────────────────────

    // Ground stair flight lane B (X=30.125–33.875, ascending north)
    // 12 treads, riser=0.8077, run=0.770
    if (xs >= 30.125 && xs <= 33.875) {
      if (ys >= 4.0 && ys <= 13.24) {
        const treadIndex = Math.min(12, Math.max(1, Math.floor((ys - 4.0) / 0.770) + 1));
        return 1.50 + 0.8077 * treadIndex;
      } else if (ys > 13.24 && ys <= 15.0) {
        return 12.00; // Landing at the top of the ground flight → first floor
      }
    }

    // Garage threshold two steps (Override O4: X=34.25–41.25, Y=14.0–15.0)
    if (xs >= 34.25 && xs <= 41.25 && ys >= 14.0 && ys <= 15.0) {
      return 1.00;
    }

    // Garage floor (sloped wedge, Z = Y/30, range 0.00–0.50)
    if (xs >= 34.25 && xs <= 49.25 && ys >= 0.0 && ys <= 15.0) {
      return (ys / 15.0) * 0.50;
    }

    // Entrance steps (ground spec 7.1)
    if (ys >= 0.0 && ys <= 7.5) {
      if (xs >= 3.25  && xs < 3.75)   return 0.00;
      if (xs >= 3.75  && xs < 4.55)   return 0.50;
      if (xs >= 4.55  && xs < 5.35)   return 1.00;
      if (xs >= 5.35  && xs <= 6.15)  return 1.50;
      if (xs >  6.15  && xs <= 13.625) return 1.50;
    }

    // Ground-floor plinth raised floors (+1.50)
    if (xs >= 3.25   && xs <= 34.25  && ys >= 7.5  && ys <= 23.25) return 1.50;
    if (xs >= 13.625 && xs <= 34.25  && ys >= 0.0  && ys <= 7.5)   return 1.50;
    if (xs >= 6.15   && xs <= 13.625 && ys >= 0.0  && ys <= 7.5)   return 1.50;
    if (xs >= 34.25  && xs <= 49.25  && ys >= 15.0 && ys <= 23.25) return 1.50;

    // Gate landing & garden / street
    return 0.00;
  }

  /**
   * Resolves horizontal circle-to-AABB collisions against walls and doorway lintels.
   */
  resolveWallCollisions(px, pz, radius, playerElev) {
    let resolvedX = px;
    let resolvedZ = pz;

    for (const item of this.colliders) {
      const [xmin, xmax, ymin, ymax, zmin, zmax] = item.box;

      // Skip boxes that don't vertically intersect the player torso
      if (zmax <= playerElev + 0.3 || zmin >= playerElev + 5.0) {
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
    const isFirstFloor = playerElev >= 11.0;

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
