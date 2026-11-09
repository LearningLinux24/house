/**
 * Global Architectural Parameters & Engine Configurations
 * Source: Ground Floor Specification (Section 2 & 13)
 */

/**
 * Global Map Scale Factor:
 * Scales length, width, and height in equal proportion to eliminate
 * claustrophobia while strictly preserving all CAD aspect ratios.
 * 1.0 = strict CAD feet
 * 1.35 = spacious, comfortable architectural walkthrough
 */
export const WORLD_SCALE = 1.35;

export const GLOBAL_PARAMS = {
  T_INT: 0.375 * WORLD_SCALE,         // Interior wall thickness: 4.5"
  T_EXT: 0.750 * WORLD_SCALE,         // Exterior wall thickness: 9.0"
  Z_STREET: 0.00,                     // Street level datum
  Z_PLINTH: 1.50 * WORLD_SCALE,       // Raised plinth floor level
  Z_CEIL: 11.50 * WORLD_SCALE,        // Underside of slab
  T_SLAB: 0.50 * WORLD_SCALE,         // Slab thickness
  Z_UPPER: 12.00 * WORLD_SCALE,       // Top of first floor slab
  H_DOOR: 7.00 * WORLD_SCALE,         // Clear head height of interior doors
  PLOT_BOUNDS: {
    X_MIN: -0.75 * WORLD_SCALE,
    X_MAX: 50.00 * WORLD_SCALE,
    Y_MIN: -0.75 * WORLD_SCALE,
    Y_MAX: 24.00 * WORLD_SCALE,
    Z_MIN: -0.50 * WORLD_SCALE,
    Z_MAX: 22.50 * WORLD_SCALE
  }
};

export const PLAYER_CONFIG = {
  radius: 0.5,                           // Collision cylinder radius (1.0 ft diameter, realistic human profile)
  height: 5.8,                           // Total human height in feet (5'10")
  eyeHeight: 5.3,                        // Camera offset from feet
  speed: 10.5,                           // Walk speed in ft/sec (comfortable pace for scaled space)
  sprintMultiplier: 1.75,                // Sprint multiplier
  stepMaxHeight: 1.40 * WORLD_SCALE,     // Maximum step height human can climb (comfortable riser climbing)
  groundSnapSpeed: 22.0,                 // Smoothing factor for floor elevation
  jumpForce: 15.0 * WORLD_SCALE,         // Initial jump impulse velocity (ft/sec)
  gravity: 46.0 * WORLD_SCALE            // Gravity acceleration (ft/sec^2) for crisp, athletic jump
};

/**
 * Axis Mapping between Architectural Plan and Three.js Coordinate Systems (East-Facing House):
 * - Three.js +Z = -Spec Y (East: Front Street / Main Entrance Gates / Garage)
 * - Three.js -Z = Spec Y (West: Rear Backyard / Washrooms)
 * - Three.js +X = Spec X (North: Mandir / Storeroom / Right Boundary)
 * - Three.js -X = -Spec X (South: Side Garden / Master Bedroom / Porch)
 * - Three.js Y  = Spec Z (Up / Elevation)
 */
export function specToEngine(x, y_spec, z_elev) {
  return {
    x: x,
    y: z_elev,
    z: -y_spec
  };
}

export function engineToSpec(x, y_elev, z_engine) {
  return {
    x: x,
    y_spec: -z_engine,
    z_elev: y_elev
  };
}

export function specBoxToThree(box) {
  const [xmin, xmax, ymin, ymax, zmin, zmax] = box;
  return {
    position: {
      x: (xmin + xmax) / 2,
      y: (zmin + zmax) / 2,
      z: - (ymin + ymax) / 2
    },
    size: {
      x: xmax - xmin,
      y: zmax - zmin,
      z: ymax - ymin
    }
  };
}
