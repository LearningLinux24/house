/**
 * Global Architectural Parameters & Engine Configurations
 * Source: Ground Floor Specification (Section 2 & 13)
 */

export const GLOBAL_PARAMS = {
  T_INT: 0.375,         // Interior wall thickness: 4.5"
  T_EXT: 0.750,         // Exterior wall thickness: 9.0"
  Z_STREET: 0.00,       // Street level datum
  Z_PLINTH: 1.50,       // Raised plinth floor level
  Z_CEIL: 11.50,        // Underside of slab (10' clear height)
  T_SLAB: 0.50,         // Slab thickness
  Z_UPPER: 12.00,       // Top of first floor slab (arrival of stairs)
  H_DOOR: 7.00,         // Clear head height of interior doors (Z = 8.5 on plinth)
  PLOT_BOUNDS: {
    X_MIN: -0.75,
    X_MAX: 50.00,
    Y_MIN: -0.75,
    Y_MAX: 24.00,
    Z_MIN: -0.50,
    Z_MAX: 12.00
  }
};

export const PLAYER_CONFIG = {
  radius: 0.8,              // Clearance radius in feet
  height: 5.8,              // Total human height in feet
  eyeHeight: 5.3,           // Camera offset from feet in feet
  speed: 8.5,               // Walk speed in ft/sec
  sprintMultiplier: 1.7,    // Sprint multiplier
  stepMaxHeight: 1.1,       // Maximum step height human can climb (e.g. risers)
  groundSnapSpeed: 15.0     // Smoothing factor for floor elevation
};

/**
 * Axis Mapping between Architectural Plan and Three.js Coordinate Systems:
 * - Three.js X = Spec X (East)
 * - Three.js Y = Spec Z (Up / Elevation)
 * - Three.js Z = -Spec Y (North points to -Z)
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
