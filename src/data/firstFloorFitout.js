/**
 * First Floor Interior Fitout Data
 * Sources:
 *   - first_floor_3d_fitout_and_interior_specification.md  (the fitout spec)
 *   - first_floor_3d_simulation_specification.md           (the base spec)
 *
 * Coordinate system:  [xmin, xmax, ymin, ymax, zmin, zmax]  absolute feet, Z-up.
 * First floor level:  Z = 12.00.  Roof slab underside: Z = 22.00.
 *
 * All boxes are RAW (unscaled). src/data/index.js multiplies every coordinate
 * by WORLD_SCALE = 1.35 before values reach Three.js.
 */

// ─────────────────────────────────────────────────────────────────────────────
// OPEN SHAFT / COURTYARD GRILLS (Floor & Ceiling Walkable Gratings)
// Walkable stainless steel gratings with open gaps between bars:
// - Looking down from 1F: ground floor is visible below without falling
// - Looking up from 1F: upper terrace and open sky are visible
// - On terrace: walkable surface at Z = 22.50
// ─────────────────────────────────────────────────────────────────────────────

function createShaftGrills() {
  const grills = [];
  const xmin = 27.625, xmax = 32.375;
  const ymin = 19.125, ymax = 22.875;
  const frameThickness = 0.08;

  // 1. FIRST FLOOR FLOOR GRILL (Walkable grating at Z = 11.94 to 12.00)
  grills.push(
    { id: 'GR-FL-S', name: 'Floor grill frame south', category: 'furniture', type: 'railing', box: [xmin, xmax, ymin, ymin + frameThickness, 11.940, 12.000], material: 'M-STEEL-SS' },
    { id: 'GR-FL-N', name: 'Floor grill frame north', category: 'furniture', type: 'railing', box: [xmin, xmax, ymax - frameThickness, ymax, 11.940, 12.000], material: 'M-STEEL-SS' },
    { id: 'GR-FL-W', name: 'Floor grill frame west',  category: 'furniture', type: 'railing', box: [xmin, xmin + frameThickness, ymin, ymax, 11.940, 12.000], material: 'M-STEEL-SS' },
    { id: 'GR-FL-E', name: 'Floor grill frame east',  category: 'furniture', type: 'railing', box: [xmax - frameThickness, xmax, ymin, ymax, 11.940, 12.000], material: 'M-STEEL-SS' }
  );
  for (let y = ymin + 0.35; y <= ymax - 0.20; y += 0.35) {
    const ry = Math.round(y * 1000) / 1000;
    grills.push({
      id: `GR-FL-X-${ry}`,
      name: 'Floor grill longitudinal bar',
      category: 'furniture',
      type: 'railing',
      box: [xmin + frameThickness, xmax - frameThickness, ry - 0.018, ry + 0.018, 11.950, 12.000],
      material: 'M-STEEL-SS'
    });
  }
  for (let x = xmin + 0.40; x <= xmax - 0.25; x += 0.40) {
    const rx = Math.round(x * 1000) / 1000;
    grills.push({
      id: `GR-FL-Y-${rx}`,
      name: 'Floor grill cross bar',
      category: 'furniture',
      type: 'railing',
      box: [rx - 0.018, rx + 0.018, ymin + frameThickness, ymax - frameThickness, 11.940, 11.985],
      material: 'M-STEEL-SS'
    });
  }

  // 2. CEILING / TERRACE FLOOR GRILL (Walkable grating at Z = 22.44 to 22.50)
  grills.push(
    { id: 'GR-CL-S', name: 'Ceiling grill frame south', category: 'furniture', type: 'railing', box: [xmin, xmax, ymin, ymin + frameThickness, 22.440, 22.500], material: 'M-STEEL-SS' },
    { id: 'GR-CL-N', name: 'Ceiling grill frame north', category: 'furniture', type: 'railing', box: [xmin, xmax, ymax - frameThickness, ymax, 22.440, 22.500], material: 'M-STEEL-SS' },
    { id: 'GR-CL-W', name: 'Ceiling grill frame west',  category: 'furniture', type: 'railing', box: [xmin, xmin + frameThickness, ymin, ymax, 22.440, 22.500], material: 'M-STEEL-SS' },
    { id: 'GR-CL-E', name: 'Ceiling grill frame east',  category: 'furniture', type: 'railing', box: [xmax - frameThickness, xmax, ymin, ymax, 22.440, 22.500], material: 'M-STEEL-SS' }
  );
  for (let y = ymin + 0.35; y <= ymax - 0.20; y += 0.35) {
    const ry = Math.round(y * 1000) / 1000;
    grills.push({
      id: `GR-CL-X-${ry}`,
      name: 'Ceiling grill longitudinal bar',
      category: 'furniture',
      type: 'railing',
      box: [xmin + frameThickness, xmax - frameThickness, ry - 0.018, ry + 0.018, 22.450, 22.500],
      material: 'M-STEEL-SS'
    });
  }
  for (let x = xmin + 0.40; x <= xmax - 0.25; x += 0.40) {
    const rx = Math.round(x * 1000) / 1000;
    grills.push({
      id: `GR-CL-Y-${rx}`,
      name: 'Ceiling grill cross bar',
      category: 'furniture',
      type: 'railing',
      box: [rx - 0.018, rx + 0.018, ymin + frameThickness, ymax - frameThickness, 22.440, 22.485],
      material: 'M-STEEL-SS'
    });
  }

  return grills;
}

const SHAFT_GRILLS = createShaftGrills();

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 4 – WINDOWS & VENTILATORS
// ─────────────────────────────────────────────────────────────────────────────

const WINDOWS = [
  // WF-1  Master bedroom west window  4 × 4 ft  sill Z 15.00
  { id: 'WF-1-GLASS', name: 'Master bedroom west window glass',  category: 'windows', type: 'window',    box: [-0.750, 0.000, 15.500, 19.500, 15.000, 19.000], material: 'M-GLASS' },
  // WF-2  Kitchen window (west, onto balcony)  3 × 3 ft  sill Z 15.50
  { id: 'WF-2-GLASS', name: 'Kitchen west window glass',        category: 'windows', type: 'window',    box: [3.250, 3.625, 6.750, 9.750, 15.500, 18.500], material: 'M-GLASS' },
  // WF-3  Lobby south window west  4 × 4 ft  sill Z 15.00
  { id: 'WF-3-GLASS', name: 'Lobby south window west glass',    category: 'windows', type: 'window',    box: [15.000, 19.000, -0.750, 0.000, 15.000, 19.000], material: 'M-GLASS' },
  // WF-4  Lobby south window east  4 × 4 ft  sill Z 15.00
  { id: 'WF-4-GLASS', name: 'Lobby south window east glass',    category: 'windows', type: 'window',    box: [21.000, 25.000, -0.750, 0.000, 15.000, 19.000], material: 'M-GLASS' },
  // WF-7  Mandir north window (relocated to North wall)  3 × 3 ft  sill Z 15.50
  { id: 'WF-7-GLASS', name: 'Mandir north window glass',        category: 'windows', type: 'window',    box: [49.250, 50.000, 3.000, 6.000, 15.500, 18.500], material: 'M-GLASS' },
  // WF-8  Child bedroom north window  4 × 4 ft  sill Z 15.00
  { id: 'WF-8-GLASS', name: 'Child bedroom north window glass', category: 'windows', type: 'window',    box: [43.500, 47.500, 23.250, 24.000, 15.000, 19.000], material: 'M-GLASS' },
  // VF-1  Bathroom 1 ventilator (north)  2 × 1.5 ft  sill Z 17.50
  { id: 'VF-1-GLASS', name: 'Bathroom 1 ventilator glass',      category: 'windows', type: 'ventilator',box: [22.800, 24.800, 23.250, 24.000, 17.500, 19.000], material: 'M-GLASS' },
  // VF-2  Bathroom 2 ventilator (north)  2 × 1.5 ft  sill Z 17.50
  { id: 'VF-2-GLASS', name: 'Bathroom 2 ventilator glass',      category: 'windows', type: 'ventilator',box: [35.400, 37.400, 23.250, 24.000, 17.500, 19.000], material: 'M-GLASS' },
  // EF-F  Kitchen exhaust fan opening (vents to balcony)  1 × 1 ft  sill Z 17.50
  { id: 'EF-F-FRAME', name: 'Kitchen exhaust fan opening',      category: 'windows', type: 'ventilator',box: [8.000, 9.000, 4.000, 4.375, 17.500, 18.500], material: 'M-STEEL-SS' },
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 5 – DOORS & FRAMES
// Note: Balcony doors DF3 and DF8 retain clean architectural frames while leaving
// the walk-through completely open and unobstructed into the balcony.
// ─────────────────────────────────────────────────────────────────────────────

const DOORS = [
  // DF1 – Master bedroom door (teak)
  { id: 'DF1-FJ1',  name: 'DF1 jamb south',   category: 'doors', type: 'door-frame', box: [13.625, 14.000, 11.750, 11.920, 12.000, 18.830], material: 'M-FRAME-WOOD' },
  { id: 'DF1-FJ2',  name: 'DF1 jamb north',   category: 'doors', type: 'door-frame', box: [13.625, 14.000, 14.830, 15.000, 12.000, 18.830], material: 'M-FRAME-WOOD' },
  { id: 'DF1-FH',   name: 'DF1 head',         category: 'doors', type: 'door-frame', box: [13.625, 14.000, 11.750, 15.000, 18.830, 19.000], material: 'M-FRAME-WOOD' },
  { id: 'DF1-LEAF', name: 'DF1 leaf',         category: 'doors', type: 'door-leaf',  box: [13.755, 13.870, 11.940, 14.810, 12.040, 18.810], material: 'M-DOOR-TEAK' },

  // DF2 – Kitchen door (teak)
  { id: 'DF2-FJ1',  name: 'DF2 jamb south',   category: 'doors', type: 'door-frame', box: [13.625, 14.000,  8.375,  8.545, 12.000, 18.830], material: 'M-FRAME-WOOD' },
  { id: 'DF2-FJ2',  name: 'DF2 jamb north',   category: 'doors', type: 'door-frame', box: [13.625, 14.000, 11.205, 11.375, 12.000, 18.830], material: 'M-FRAME-WOOD' },
  { id: 'DF2-FH',   name: 'DF2 head',         category: 'doors', type: 'door-frame', box: [13.625, 14.000,  8.375, 11.375, 18.830, 19.000], material: 'M-FRAME-WOOD' },
  { id: 'DF2-LEAF', name: 'DF2 leaf',         category: 'doors', type: 'door-leaf',  box: [13.755, 13.870,  8.565, 11.185, 12.040, 18.810], material: 'M-DOOR-TEAK' },

  // DF3 – Kitchen to balcony door frame (open walk-through)
  { id: 'DF3-FJ1',  name: 'DF3 jamb west',    category: 'doors', type: 'door-frame', box: [11.000, 11.170, 4.000, 4.375, 12.000, 18.830], material: 'M-ALU-FRAME' },
  { id: 'DF3-FJ2',  name: 'DF3 jamb east',    category: 'doors', type: 'door-frame', box: [13.455, 13.625, 4.000, 4.375, 12.000, 18.830], material: 'M-ALU-FRAME' },
  { id: 'DF3-FH',   name: 'DF3 head',         category: 'doors', type: 'door-frame', box: [11.000, 13.625, 4.000, 4.375, 18.830, 19.000], material: 'M-ALU-FRAME' },

  // DF4 – Bathroom 1 door (PVC)
  { id: 'DF4-FJ1',  name: 'DF4 jamb west',    category: 'doors', type: 'door-frame', box: [17.625, 17.795, 18.875, 19.250, 12.000, 18.830], material: 'M-FRAME-WOOD' },
  { id: 'DF4-FJ2',  name: 'DF4 jamb east',    category: 'doors', type: 'door-frame', box: [19.955, 20.125, 18.875, 19.250, 12.000, 18.830], material: 'M-FRAME-WOOD' },
  { id: 'DF4-FH',   name: 'DF4 head',         category: 'doors', type: 'door-frame', box: [17.625, 20.125, 18.875, 19.250, 18.830, 19.000], material: 'M-FRAME-WOOD' },
  { id: 'DF4-LEAF', name: 'DF4 PVC leaf',     category: 'doors', type: 'door-leaf',  box: [17.815, 19.935, 19.005, 19.120, 12.040, 18.810], material: 'M-DOOR-PVC' },

  // DF5 – Bathroom 2 door (PVC)
  { id: 'DF5-FJ1',  name: 'DF5 jamb west',    category: 'doors', type: 'door-frame', box: [37.125, 37.295, 18.875, 19.250, 12.000, 18.830], material: 'M-FRAME-WOOD' },
  { id: 'DF5-FJ2',  name: 'DF5 jamb east',    category: 'doors', type: 'door-frame', box: [39.705, 39.875, 18.875, 19.250, 12.000, 18.830], material: 'M-FRAME-WOOD' },
  { id: 'DF5-FH',   name: 'DF5 head',         category: 'doors', type: 'door-frame', box: [37.125, 39.875, 18.875, 19.250, 18.830, 19.000], material: 'M-FRAME-WOOD' },
  { id: 'DF5-LEAF', name: 'DF5 PVC leaf',     category: 'doors', type: 'door-leaf',  box: [37.315, 39.685, 19.005, 19.120, 12.040, 18.810], material: 'M-DOOR-PVC' },

  // DF6 – Child bedroom door (teak)
  { id: 'DF6-FJ1',  name: 'DF6 jamb south',   category: 'doors', type: 'door-frame', box: [39.875, 40.250,  9.375,  9.545, 12.000, 18.830], material: 'M-FRAME-WOOD' },
  { id: 'DF6-FJ2',  name: 'DF6 jamb north',   category: 'doors', type: 'door-frame', box: [39.875, 40.250, 12.705, 12.875, 12.000, 18.830], material: 'M-FRAME-WOOD' },
  { id: 'DF6-FH',   name: 'DF6 head',         category: 'doors', type: 'door-frame', box: [39.875, 40.250,  9.375, 12.875, 18.830, 19.000], material: 'M-FRAME-WOOD' },
  { id: 'DF6-LEAF', name: 'DF6 leaf',         category: 'doors', type: 'door-leaf',  box: [40.005, 40.120,  9.565, 12.685, 12.040, 18.810], material: 'M-DOOR-TEAK' },

  // DF7 – Mandir door (teak)
  { id: 'DF7-FJ1',  name: 'DF7 jamb south',   category: 'doors', type: 'door-frame', box: [39.875, 40.250, 6.500, 6.670, 12.000, 18.830], material: 'M-FRAME-WOOD' },
  { id: 'DF7-FJ2',  name: 'DF7 jamb north',   category: 'doors', type: 'door-frame', box: [39.875, 40.250, 8.830, 9.000, 12.000, 18.830], material: 'M-FRAME-WOOD' },
  { id: 'DF7-FH',   name: 'DF7 head',         category: 'doors', type: 'door-frame', box: [39.875, 40.250, 6.500, 9.000, 18.830, 19.000], material: 'M-FRAME-WOOD' },
  { id: 'DF7-LEAF', name: 'DF7 leaf',         category: 'doors', type: 'door-leaf',  box: [40.005, 40.120, 6.690, 8.810, 12.040, 18.810], material: 'M-DOOR-TEAK' },

  // DF8 – Master bedroom to balcony door frame (open walk-through)
  { id: 'DF8-FJ1',  name: 'DF8 jamb west',    category: 'doors', type: 'door-frame', box: [0.500, 0.670, 11.375, 11.750, 12.000, 18.830], material: 'M-ALU-FRAME' },
  { id: 'DF8-FJ2',  name: 'DF8 jamb east',    category: 'doors', type: 'door-frame', box: [3.080, 3.250, 11.375, 11.750, 12.000, 18.830], material: 'M-ALU-FRAME' },
  { id: 'DF8-FH',   name: 'DF8 head',         category: 'doors', type: 'door-frame', box: [0.500, 3.250, 11.375, 11.750, 18.830, 19.000], material: 'M-ALU-FRAME' },
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 6 – RAILINGS (Stair Guard Rails & Full-Height Balcony Railings)
// Full 3.5 ft modern stainless steel railings around balcony perimeter (no walls!)
// ─────────────────────────────────────────────────────────────────────────────

function createBalconyBalusters() {
  const balusters = [];
  // South run: from X = -0.40 to 13.70 at step ~0.40 ft (Y = -0.65)
  for (let x = -0.40; x <= 13.70; x += 0.40) {
    const rx = Math.round(x * 1000) / 1000;
    balusters.push({
      id: `BAL-S-B-${rx}`,
      name: 'Balcony south baluster',
      category: 'furniture',
      type: 'railing',
      box: [rx - 0.018, rx + 0.018, -0.668, -0.632, 12.160, 15.420],
      material: 'M-STEEL-SS'
    });
  }
  // West run: from Y = -0.40 to 11.50 at step ~0.40 ft (X = -0.65)
  for (let y = -0.40; y <= 11.50; y += 0.40) {
    const ry = Math.round(y * 1000) / 1000;
    balusters.push({
      id: `BAL-W-B-${ry}`,
      name: 'Balcony west baluster',
      category: 'furniture',
      type: 'railing',
      box: [-0.668, -0.632, ry - 0.018, ry + 0.018, 12.160, 15.420],
      material: 'M-STEEL-SS'
    });
  }
  return balusters;
}

const RAILINGS = [
  // 6.2 Guard rail around stair floor opening (over ground flight)
  { id: 'GR-S-P1', name: 'Guard rail south post 1', category: 'furniture', type: 'railing', box: [30.125, 30.225, 6.900, 7.000, 12.000, 15.000], material: 'M-STEEL-SS' },
  { id: 'GR-S-P2', name: 'Guard rail south post 2', category: 'furniture', type: 'railing', box: [31.950, 32.050, 6.900, 7.000, 12.000, 15.000], material: 'M-STEEL-SS' },
  { id: 'GR-S-P3', name: 'Guard rail south post 3', category: 'furniture', type: 'railing', box: [33.775, 33.875, 6.900, 7.000, 12.000, 15.000], material: 'M-STEEL-SS' },
  { id: 'GR-S-RAIL', name: 'Guard rail south top rail', category: 'furniture', type: 'railing', box: [30.125, 33.875, 6.930, 6.995, 14.935, 14.965], material: 'M-STEEL-SS' },
  { id: 'GR-S-MID',  name: 'Guard rail south mid rail',  category: 'furniture', type: 'railing', box: [30.125, 33.875, 6.940, 6.990, 13.470, 13.530], material: 'M-STEEL-SS' },
  { id: 'GR-W-P1', name: 'Guard rail west post 1', category: 'furniture', type: 'railing', box: [30.025, 30.125, 7.000, 7.100, 12.000, 15.000], material: 'M-STEEL-SS' },
  { id: 'GR-W-P2', name: 'Guard rail west post 2', category: 'furniture', type: 'railing', box: [30.025, 30.125, 10.075, 10.175, 12.000, 15.000], material: 'M-STEEL-SS' },
  { id: 'GR-W-P3', name: 'Guard rail west post 3', category: 'furniture', type: 'railing', box: [30.025, 30.125, 13.150, 13.250, 12.000, 15.000], material: 'M-STEEL-SS' },
  { id: 'GR-W-RAIL', name: 'Guard rail west top rail', category: 'furniture', type: 'railing', box: [30.030, 30.090, 7.000, 13.250, 14.935, 14.965], material: 'M-STEEL-SS' },
  { id: 'GR-W-MID',  name: 'Guard rail west mid rail',  category: 'furniture', type: 'railing', box: [30.040, 30.085, 7.000, 13.250, 13.470, 13.530], material: 'M-STEEL-SS' },

  // 6.3 FULL-HEIGHT BALCONY RAILINGS (Z = 12.00 to 15.50 ft, gleaming Stainless Steel)
  // Replaces all walls with open 3.5 ft railings.
  // Main structural posts (0.10 × 0.10 ft from Z = 12.00 to 15.50):
  { id: 'BAL-CORNER-P', name: 'Balcony SW corner post', category: 'furniture', type: 'railing', box: [-0.700, -0.600, -0.700, -0.600, 12.000, 15.500], material: 'M-STEEL-SS' },
  { id: 'BAL-S-P1', name: 'Balcony south post 1', category: 'furniture', type: 'railing', box: [ 2.200,  2.300, -0.700, -0.600, 12.000, 15.500], material: 'M-STEEL-SS' },
  { id: 'BAL-S-P2', name: 'Balcony south post 2', category: 'furniture', type: 'railing', box: [ 5.100,  5.200, -0.700, -0.600, 12.000, 15.500], material: 'M-STEEL-SS' },
  { id: 'BAL-S-P3', name: 'Balcony south post 3', category: 'furniture', type: 'railing', box: [ 8.050,  8.150, -0.700, -0.600, 12.000, 15.500], material: 'M-STEEL-SS' },
  { id: 'BAL-S-P4', name: 'Balcony south post 4', category: 'furniture', type: 'railing', box: [11.000, 11.100, -0.700, -0.600, 12.000, 15.500], material: 'M-STEEL-SS' },
  { id: 'BAL-S-P5', name: 'Balcony south post 5', category: 'furniture', type: 'railing', box: [13.900, 14.000, -0.700, -0.600, 12.000, 15.500], material: 'M-STEEL-SS' },
  { id: 'BAL-W-P1', name: 'Balcony west post 1', category: 'furniture', type: 'railing', box: [-0.700, -0.600,  2.350,  2.450, 12.000, 15.500], material: 'M-STEEL-SS' },
  { id: 'BAL-W-P2', name: 'Balcony west post 2', category: 'furniture', type: 'railing', box: [-0.700, -0.600,  5.450,  5.550, 12.000, 15.500], material: 'M-STEEL-SS' },
  { id: 'BAL-W-P3', name: 'Balcony west post 3', category: 'furniture', type: 'railing', box: [-0.700, -0.600,  8.550,  8.650, 12.000, 15.500], material: 'M-STEEL-SS' },
  { id: 'BAL-W-P4', name: 'Balcony west post 4', category: 'furniture', type: 'railing', box: [-0.700, -0.600, 11.650, 11.750, 12.000, 15.500], material: 'M-STEEL-SS' },

  // Top Handrails (Z = 15.42 to 15.50):
  { id: 'BAL-S-TOP',  name: 'Balcony south top rail', category: 'furniture', type: 'railing', box: [-0.700, 14.000, -0.690, -0.610, 15.420, 15.500], material: 'M-STEEL-SS' },
  { id: 'BAL-W-TOP',  name: 'Balcony west top rail',  category: 'furniture', type: 'railing', box: [-0.690, -0.610, -0.700, 11.750, 15.420, 15.500], material: 'M-STEEL-SS' },

  // Mid Rails (Z = 13.72 to 13.78):
  { id: 'BAL-S-MID',  name: 'Balcony south mid rail', category: 'furniture', type: 'railing', box: [-0.700, 14.000, -0.665, -0.635, 13.720, 13.780], material: 'M-STEEL-SS' },
  { id: 'BAL-W-MID',  name: 'Balcony west mid rail',  category: 'furniture', type: 'railing', box: [-0.665, -0.635, -0.700, 11.750, 13.720, 13.780], material: 'M-STEEL-SS' },

  // Bottom Rails (Z = 12.10 to 12.16):
  { id: 'BAL-S-BOT',  name: 'Balcony south bottom rail', category: 'furniture', type: 'railing', box: [-0.700, 14.000, -0.665, -0.635, 12.100, 12.160], material: 'M-STEEL-SS' },
  { id: 'BAL-W-BOT',  name: 'Balcony west bottom rail',  category: 'furniture', type: 'railing', box: [-0.665, -0.635, -0.700, 11.750, 12.100, 12.160], material: 'M-STEEL-SS' },

  // Vertical Balusters:
  ...createBalconyBalusters()
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 8 – ROOM FURNITURE
// ─────────────────────────────────────────────────────────────────────────────

// 8.1  Master bedroom (F4)
const MASTER_BEDROOM = [
  { id: 'MB-01', name: 'King bed frame 6×6.5 ft',          category: 'furniture', type: 'furniture', box: [4.000, 10.000, 16.750, 23.250, 12.000, 13.000], material: 'M-WOOD-DARK' },
  { id: 'MB-02', name: 'Mattress 5.85×6.2 ft',             category: 'furniture', type: 'furniture', box: [4.075,  9.925, 16.900, 23.100, 13.000, 13.800], material: 'M-FABRIC-BEIGE' },
  { id: 'MB-03', name: 'Headboard 6 ft wide 3.5 ft high',  category: 'furniture', type: 'furniture', box: [4.000, 10.000, 23.000, 23.250, 12.000, 15.500], material: 'M-WOOD-DARK' },
  { id: 'MB-04', name: 'Pillow pair left',                  category: 'furniture', type: 'furniture', box: [4.500,  6.500, 22.300, 23.000, 13.800, 14.150], material: 'M-FABRIC-WHITE' },
  { id: 'MB-05', name: 'Pillow pair right',                 category: 'furniture', type: 'furniture', box: [7.500,  9.500, 22.300, 23.000, 13.800, 14.150], material: 'M-FABRIC-WHITE' },
  { id: 'MB-06', name: 'Bedside table west 1.5×1.5 ft',    category: 'furniture', type: 'furniture', box: [2.500,  4.000, 21.750, 23.250, 12.000, 13.750], material: 'M-WOOD-DARK' },
  { id: 'MB-07', name: 'Bedside table east 1.5×1.5 ft',    category: 'furniture', type: 'furniture', box: [10.000, 11.500, 21.750, 23.250, 12.000, 13.750], material: 'M-WOOD-DARK' },
  { id: 'MB-08', name: 'Wardrobe 7 ft wide×2 ft deep',     category: 'furniture', type: 'furniture', box: [3.350, 10.350, 11.750, 13.750, 12.000, 19.000], material: 'M-LAMINATE-WALNUT' },
  { id: 'MB-09', name: 'Dressing table 1.5×3.25 ft',       category: 'furniture', type: 'furniture', box: [0.000,  1.500, 20.000, 23.250, 12.000, 14.500], material: 'M-LAMINATE-WALNUT' },
  { id: 'MB-10', name: 'Dressing mirror 2.45×3.5 ft',      category: 'furniture', type: 'furniture', box: [0.000,  0.100, 20.400, 22.850, 14.500, 18.000], material: 'M-MIRROR' },
  { id: 'MB-11', name: 'Dressing stool',                   category: 'furniture', type: 'furniture', box: [1.600,  2.400, 20.800, 21.600, 12.000, 13.500], material: 'M-WOOD-DARK' },
  { id: 'MB-12', name: 'Curtain west window',              category: 'furniture', type: 'furniture', box: [0.050,  0.200, 15.000, 20.000, 12.100, 19.300], material: 'M-FABRIC-CURTAIN' },
];

// 8.2  Basin niche (F5)
const BASIN_NICHE = [
  { id: 'NB-01', name: 'Wash basin bowl 1.75×1.3 ft',  category: 'furniture', type: 'furniture', box: [14.750, 16.500, 21.950, 23.250, 14.000, 14.750], material: 'M-SANITARY-WHITE' },
  { id: 'NB-02', name: 'Basin pedestal',               category: 'furniture', type: 'furniture', box: [15.250, 16.000, 22.500, 23.000, 12.000, 14.000], material: 'M-SANITARY-WHITE' },
  { id: 'NB-03', name: 'Basin mirror 1.55×2 ft',       category: 'furniture', type: 'furniture', box: [14.850, 16.400, 23.150, 23.250, 16.000, 18.000], material: 'M-MIRROR' },
];

// 8.3  Bathroom 1 (F6)
const BATHROOM_1 = [
  { id: 'B1-01', name: 'WC floor mounted 1.25×2.25 ft',    category: 'furniture', type: 'furniture', box: [21.000, 22.250, 21.000, 23.250, 12.000, 13.400], material: 'M-SANITARY-WHITE' },
  { id: 'B1-02', name: 'Basin bowl 1.75×1.3 ft',           category: 'furniture', type: 'furniture', box: [18.000, 19.750, 21.950, 23.250, 14.000, 14.750], material: 'M-SANITARY-WHITE' },
  { id: 'B1-03', name: 'Basin pedestal',                   category: 'furniture', type: 'furniture', box: [18.500, 19.250, 22.500, 23.000, 12.000, 14.000], material: 'M-SANITARY-WHITE' },
  { id: 'B1-04', name: 'Mirror 1.55×2 ft above basin',    category: 'furniture', type: 'furniture', box: [18.100, 19.650, 23.150, 23.250, 16.000, 18.000], material: 'M-MIRROR' },
  { id: 'B1-05', name: 'Electric geyser 15L above WC',    category: 'furniture', type: 'furniture', box: [21.100, 22.000, 22.350, 23.250, 17.500, 18.900], material: 'M-SANITARY-WHITE' },
  { id: 'B1-06', name: 'Shower head',                     category: 'furniture', type: 'furniture', box: [25.050, 25.550, 22.300, 22.800, 18.350, 18.400], material: 'M-CHROME' },
  { id: 'B1-07', name: 'Shower arm',                      category: 'furniture', type: 'furniture', box: [25.200, 25.400, 22.800, 23.250, 18.400, 18.500], material: 'M-CHROME' },
  { id: 'B1-08', name: 'Shower mixer valve',              category: 'furniture', type: 'furniture', box: [25.100, 25.500, 23.100, 23.250, 15.300, 15.600], material: 'M-CHROME' },
  { id: 'B1-09', name: 'Floor drain grate 0.4×0.4 ft',   category: 'furniture', type: 'furniture', box: [25.100, 25.500, 21.000, 21.400, 12.000, 12.020], material: 'M-STEEL-SS' },
];

// 8.4  Bathroom 2 (F11)
const BATHROOM_2 = [
  { id: 'B2-01', name: 'WC floor mounted 1.25×2.25 ft',    category: 'furniture', type: 'furniture', box: [35.400, 36.650, 21.000, 23.250, 12.000, 13.400], material: 'M-SANITARY-WHITE' },
  { id: 'B2-02', name: 'Basin bowl 1.75×1.3 ft',           category: 'furniture', type: 'furniture', box: [38.000, 39.750, 21.950, 23.250, 14.000, 14.750], material: 'M-SANITARY-WHITE' },
  { id: 'B2-03', name: 'Basin pedestal',                   category: 'furniture', type: 'furniture', box: [38.500, 39.250, 22.500, 23.000, 12.000, 14.000], material: 'M-SANITARY-WHITE' },
  { id: 'B2-04', name: 'Mirror 1.5×2 ft above basin',     category: 'furniture', type: 'furniture', box: [38.100, 39.600, 23.150, 23.250, 16.000, 18.000], material: 'M-MIRROR' },
  { id: 'B2-05', name: 'Electric geyser 15L east wall',   category: 'furniture', type: 'furniture', box: [38.975, 39.875, 22.200, 23.100, 17.500, 18.900], material: 'M-SANITARY-WHITE' },
  { id: 'B2-06', name: 'Shower head',                     category: 'furniture', type: 'furniture', box: [33.650, 34.150, 22.300, 22.800, 18.350, 18.400], material: 'M-CHROME' },
  { id: 'B2-07', name: 'Shower arm',                      category: 'furniture', type: 'furniture', box: [33.800, 34.000, 22.800, 23.250, 18.400, 18.500], material: 'M-CHROME' },
  { id: 'B2-08', name: 'Shower mixer valve',              category: 'furniture', type: 'furniture', box: [33.700, 34.100, 23.100, 23.250, 15.300, 15.600], material: 'M-CHROME' },
  { id: 'B2-09', name: 'Floor drain grate 0.4×0.4 ft',   category: 'furniture', type: 'furniture', box: [33.700, 34.100, 21.000, 21.400, 12.000, 12.020], material: 'M-STEEL-SS' },
];

// 8.5  Kitchen (F3)
const KITCHEN = [
  { id: 'KF-01', name: 'Base cabinet west leg 2×7 ft',          category: 'furniture', type: 'furniture', box: [3.625,  5.625,  4.375, 11.375, 12.000, 14.600], material: 'M-LAMINATE-GREY' },
  { id: 'KF-02-S', name: 'Granite top west leg south',          category: 'furniture', type: 'furniture', box: [3.625,  5.700,  4.375,  7.000, 14.600, 14.750], material: 'M-GRANITE-BLACK' },
  { id: 'KF-02-N', name: 'Granite top west leg north',          category: 'furniture', type: 'furniture', box: [3.625,  5.700,  9.500, 11.375, 14.600, 14.750], material: 'M-GRANITE-BLACK' },
  { id: 'KF-02-REAR', name: 'Granite top west leg behind sink',  category: 'furniture', type: 'furniture', box: [3.625,  3.850,  7.000,  9.500, 14.600, 14.750], material: 'M-GRANITE-BLACK' },
  { id: 'KF-02-FRONT', name: 'Granite top west leg front lip',   category: 'furniture', type: 'furniture', box: [5.450,  5.700,  7.000,  9.500, 14.600, 14.750], material: 'M-GRANITE-BLACK' },
  { id: 'KF-03', name: 'Base cabinet south leg 7.375×2.25 ft',  category: 'furniture', type: 'furniture', box: [3.625, 11.000,  4.375,  6.625, 12.000, 14.600], material: 'M-LAMINATE-GREY' },
  { id: 'KF-04', name: 'Granite top south leg',                 category: 'furniture', type: 'furniture', box: [3.625, 11.000,  4.375,  6.700, 14.600, 14.750], material: 'M-GRANITE-BLACK' },
  { id: 'KF-05', name: 'Double-bowl steel sink 2.5×1.6 ft',     category: 'furniture', type: 'furniture', box: [3.850,  5.450,  7.000,  9.500, 14.050, 14.750], material: 'M-STEEL-SS' },
  { id: 'KF-06', name: 'Sink tap',                             category: 'furniture', type: 'furniture', box: [3.650,  4.000,  8.100,  8.400, 14.750, 15.450], material: 'M-CHROME' },
  { id: 'KF-07', name: '4-burner gas hob 2×1.6 ft',            category: 'furniture', type: 'furniture', box: [7.500,  9.500,  4.600,  6.200, 14.750, 14.850], material: 'M-GLASS-BLACK' },
  { id: 'KF-08', name: 'Wall cabinet south wall west of fan',  category: 'furniture', type: 'furniture', box: [3.625,  6.900,  4.375,  5.375, 18.250, 20.500], material: 'M-LAMINATE-GREY' },
  { id: 'KF-09', name: 'Wall cabinet south wall east of fan',  category: 'furniture', type: 'furniture', box: [9.750, 11.000,  4.375,  5.375, 18.250, 20.500], material: 'M-LAMINATE-GREY' },
  { id: 'KF-10', name: 'Wall cabinet west wall north of window',category: 'furniture', type: 'furniture', box: [3.625,  4.625, 10.000, 11.375, 18.250, 20.500], material: 'M-LAMINATE-GREY' },
  { id: 'KF-11', name: 'Refrigerator single door 1.8×2×5.5 ft',category: 'furniture', type: 'furniture', box: [5.900,  7.700,  9.375, 11.375, 12.000, 17.500], material: 'M-STEEL-SS' },
];

// 8.6  Lobby: living and dining (F7)
const LOBBY = [
  { id: 'LB-01', name: 'Sofa seat base 2.75×6.5 ft',      category: 'furniture', type: 'furniture', box: [16.800, 19.550,  3.500, 10.000, 12.000, 12.600], material: 'M-FABRIC-GREY' },
  { id: 'LB-02', name: 'Sofa seat cushions',              category: 'furniture', type: 'furniture', box: [17.550, 19.550,  4.000,  9.500, 12.600, 13.500], material: 'M-FABRIC-GREY' },
  { id: 'LB-03', name: 'Sofa back',                       category: 'furniture', type: 'furniture', box: [16.800, 17.550,  3.500, 10.000, 12.600, 14.800], material: 'M-FABRIC-GREY' },
  { id: 'LB-04', name: 'Sofa arm south',                  category: 'furniture', type: 'furniture', box: [17.550, 19.550,  3.500,  4.000, 12.600, 14.100], material: 'M-FABRIC-GREY' },
  { id: 'LB-05', name: 'Sofa arm north',                  category: 'furniture', type: 'furniture', box: [17.550, 19.550,  9.500, 10.000, 12.600, 14.100], material: 'M-FABRIC-GREY' },
  { id: 'LB-06', name: 'Centre table 2×2.5×1.4 ft',       category: 'furniture', type: 'furniture', box: [20.800, 22.800,  5.500,  8.000, 12.000, 13.400], material: 'M-WOOD-DARK' },
  { id: 'LB-07', name: 'TV unit 1.25×4×1.3 ft east wall', category: 'furniture', type: 'furniture', box: [24.750, 26.000,  4.000,  8.000, 12.000, 13.300], material: 'M-LAMINATE-WALNUT' },
  { id: 'LB-08', name: '55-inch TV wall mounted',          category: 'furniture', type: 'furniture', box: [25.850, 26.000,  4.000,  8.000, 14.350, 16.650], material: 'M-GLASS-BLACK' },
  { id: 'LB-09', name: 'Dining table top 5×3 ft',         category: 'furniture', type: 'furniture', box: [17.500, 22.500, 12.000, 15.000, 14.300, 14.500], material: 'M-WOOD-DARK' },
  { id: 'LB-10', name: 'Dining table leg SW',             category: 'furniture', type: 'furniture', box: [17.500, 17.700, 12.000, 12.200, 12.000, 14.300], material: 'M-WOOD-DARK' },
  { id: 'LB-11', name: 'Dining table leg SE',             category: 'furniture', type: 'furniture', box: [22.300, 22.500, 12.000, 12.200, 12.000, 14.300], material: 'M-WOOD-DARK' },
  { id: 'LB-12', name: 'Dining table leg NW',             category: 'furniture', type: 'furniture', box: [17.500, 17.700, 14.800, 15.000, 12.000, 14.300], material: 'M-WOOD-DARK' },
  { id: 'LB-13', name: 'Dining table leg NE',             category: 'furniture', type: 'furniture', box: [22.300, 22.500, 14.800, 15.000, 12.000, 14.300], material: 'M-WOOD-DARK' },
  { id: 'LB-14', name: 'Dining chair west end',           category: 'furniture', type: 'furniture', box: [16.000, 17.700, 12.750, 14.250, 12.000, 13.600], material: 'M-WOOD-DARK' },
  { id: 'LB-15', name: 'Dining chair east end',           category: 'furniture', type: 'furniture', box: [22.300, 24.000, 12.750, 14.250, 12.000, 13.600], material: 'M-WOOD-DARK' },
  { id: 'LB-16', name: 'Dining chair south left',         category: 'furniture', type: 'furniture', box: [18.000, 19.500, 10.750, 12.250, 12.000, 13.600], material: 'M-WOOD-DARK' },
  { id: 'LB-17', name: 'Dining chair south right',        category: 'furniture', type: 'furniture', box: [20.500, 22.000, 10.750, 12.250, 12.000, 13.600], material: 'M-WOOD-DARK' },
  { id: 'LB-18', name: 'Dining chair north left',         category: 'furniture', type: 'furniture', box: [18.000, 19.500, 14.750, 16.000, 12.000, 13.600], material: 'M-WOOD-DARK' },
  { id: 'LB-19', name: 'Dining chair north right',        category: 'furniture', type: 'furniture', box: [20.500, 22.000, 14.750, 16.000, 12.000, 13.600], material: 'M-WOOD-DARK' },
  { id: 'LB-20', name: 'Curtain south window left',       category: 'furniture', type: 'furniture', box: [14.500, 19.500,  0.050,  0.200, 12.100, 19.300], material: 'M-FABRIC-CURTAIN' },
  { id: 'LB-21', name: 'Curtain south window right',      category: 'furniture', type: 'furniture', box: [20.500, 25.500,  0.050,  0.200, 12.100, 19.300], material: 'M-FABRIC-CURTAIN' },
];

// 8.7  Hallway (F12)
const HALLWAY = [
  { id: 'HW-01', name: 'Vanity base cabinet 2×3.75 ft',  category: 'furniture', type: 'furniture', box: [34.250, 36.250, 3.000, 6.750, 12.000, 14.600], material: 'M-LAMINATE-GREY' },
  { id: 'HW-02', name: 'Granite vanity top',             category: 'furniture', type: 'furniture', box: [34.250, 36.325, 3.000, 6.750, 14.600, 14.750], material: 'M-GRANITE-BLACK' },
  { id: 'HW-03', name: 'Wash basin bowl 1.4×1.6 ft',    category: 'furniture', type: 'furniture', box: [34.500, 35.900, 4.050, 5.650, 14.000, 14.750], material: 'M-SANITARY-WHITE' },
  { id: 'HW-04', name: 'Basin tap',                     category: 'furniture', type: 'furniture', box: [34.300, 34.600, 4.700, 5.000, 14.750, 15.400], material: 'M-CHROME' },
  { id: 'HW-05', name: 'Mirror 2.1×2.5 ft west wall',   category: 'furniture', type: 'furniture', box: [34.250, 34.350, 3.800, 5.900, 16.000, 18.500], material: 'M-MIRROR' },
  { id: 'HW-06', name: 'Washing machine front loader',   category: 'furniture', type: 'furniture', box: [37.875, 39.875, 0.000, 2.000, 12.000, 15.000], material: 'M-SANITARY-WHITE' },
];

// 8.8  Child bedroom (F13)
const CHILD_BEDROOM = [
  { id: 'CH-01', name: 'Single bed frame 4×6.5 ft',          category: 'furniture', type: 'furniture', box: [42.750, 49.250, 13.500, 17.500, 12.000, 12.900], material: 'M-WOOD-DARK' },
  { id: 'CH-02', name: 'Mattress 3.9×6.4 ft',               category: 'furniture', type: 'furniture', box: [42.850, 49.150, 13.600, 17.400, 12.900, 13.600], material: 'M-FABRIC-BEIGE' },
  { id: 'CH-03', name: 'Headboard 4 ft wide 2.8 ft above fl',category: 'furniture', type: 'furniture', box: [49.000, 49.250, 13.500, 17.500, 12.000, 14.800], material: 'M-WOOD-DARK' },
  { id: 'CH-04', name: 'Pillow',                            category: 'furniture', type: 'furniture', box: [48.000, 48.900, 14.200, 15.800, 13.600, 13.950], material: 'M-FABRIC-WHITE' },
  { id: 'CH-05', name: 'Bedside table south 1.5×1.5 ft',    category: 'furniture', type: 'furniture', box: [47.750, 49.250, 12.000, 13.500, 12.000, 13.600], material: 'M-WOOD-DARK' },
  { id: 'CH-06', name: 'Bedside table north 1.5×1.5 ft',    category: 'furniture', type: 'furniture', box: [47.750, 49.250, 17.500, 19.000, 12.000, 13.600], material: 'M-WOOD-DARK' },
  { id: 'CH-07', name: 'Wardrobe 4×2×7 ft south wall',      category: 'furniture', type: 'furniture', box: [44.500, 48.500,  9.375, 11.375, 12.000, 19.000], material: 'M-LAMINATE-WALNUT' },
  { id: 'CH-08', name: 'Study desk top 2×4 ft',             category: 'furniture', type: 'furniture', box: [40.250, 42.250, 19.000, 23.000, 14.300, 14.500], material: 'M-WOOD-DARK' },
  { id: 'CH-09', name: 'Desk side panel south',             category: 'furniture', type: 'furniture', box: [40.250, 42.250, 19.000, 19.100, 12.000, 14.300], material: 'M-WOOD-DARK' },
  { id: 'CH-10', name: 'Desk side panel north',             category: 'furniture', type: 'furniture', box: [40.250, 42.250, 22.900, 23.000, 12.000, 14.300], material: 'M-WOOD-DARK' },
  { id: 'CH-11', name: 'Study chair seat',                  category: 'furniture', type: 'furniture', box: [42.250, 43.750, 20.000, 21.500, 12.000, 13.600], material: 'M-WOOD-DARK' },
  { id: 'CH-12', name: 'Study chair back',                  category: 'furniture', type: 'furniture', box: [43.550, 43.750, 20.000, 21.500, 13.600, 15.200], material: 'M-WOOD-DARK' },
  { id: 'CH-13', name: 'Bookshelf 1×3 ft 6 ft high',        category: 'furniture', type: 'furniture', box: [48.250, 49.250, 20.000, 23.000, 12.000, 18.000], material: 'M-WOOD-DARK' },
  { id: 'CH-14', name: 'Curtain north window',              category: 'furniture', type: 'furniture', box: [43.000, 48.000, 23.050, 23.200, 12.100, 19.300], material: 'M-FABRIC-CURTAIN' },
];

// 8.9  Mandir (F14) - Positioned against New East wall (Y = 0) per Indian Vastu Shastra
const MANDIR = [
  { id: 'MD-01', name: 'Marble platform 5.2×2.0 ft 1.8 ft high', category: 'furniture', type: 'furniture', box: [42.150, 47.350, 0.000, 2.000, 12.000, 13.800], material: 'M-MARBLE-WHITE' },
  { id: 'MD-02', name: 'Wooden temple shrine with holy photo',   category: 'furniture', type: 'furniture', box: [42.350, 47.150, 0.000, 1.200, 13.800, 18.200], material: 'M-WOOD-DARK' },
  { id: 'MD-03', name: 'Brass diya south',                      category: 'furniture', type: 'furniture', box: [42.350, 42.750, 1.450, 1.850, 13.800, 14.800], material: 'M-BRASS' },
  { id: 'MD-04', name: 'Brass diya north',                      category: 'furniture', type: 'furniture', box: [46.750, 47.150, 1.450, 1.850, 13.800, 14.800], material: 'M-BRASS' },
  { id: 'MD-05', name: 'Prayer mat 2×2 ft',                     category: 'furniture', type: 'furniture', box: [43.750, 45.750, 2.800, 4.800, 12.000, 12.040], material: 'M-CARPET-RED' },
];

// 8.10  Balcony (F1, F2) — Completely empty per user requirement
const BALCONIES = [];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 9 – ELECTRICAL / SWITCHBOARDS
// ─────────────────────────────────────────────────────────────────────────────

const ELECTRICAL = [
  { id: 'SB-MB',   name: 'Switchboard master bedroom',  category: 'electrical', type: 'switchboard', box: [13.525, 13.625, 15.200, 15.600, 15.800, 16.200], material: 'M-PAINT-INT' },
  { id: 'SB-KIT',  name: 'Switchboard kitchen',         category: 'electrical', type: 'switchboard', box: [13.525, 13.625,  7.600,  8.000, 15.800, 16.200], material: 'M-PAINT-INT' },
  { id: 'SB-LOB',  name: 'Switchboard lobby',           category: 'electrical', type: 'switchboard', box: [14.000, 14.100, 15.300, 15.700, 15.800, 16.200], material: 'M-PAINT-INT' },
  { id: 'SB-B1',   name: 'Switchboard bathroom 1',      category: 'electrical', type: 'switchboard', box: [20.400, 20.800, 19.250, 19.350, 15.800, 16.200], material: 'M-PAINT-INT' },
  { id: 'SB-B2',   name: 'Switchboard bathroom 2',      category: 'electrical', type: 'switchboard', box: [36.500, 36.900, 19.250, 19.350, 15.800, 16.200], material: 'M-PAINT-INT' },
  { id: 'SB-CH',   name: 'Switchboard child bedroom',   category: 'electrical', type: 'switchboard', box: [40.250, 40.350, 13.100, 13.500, 15.800, 16.200], material: 'M-PAINT-INT' },
  { id: 'SB-MD',   name: 'Switchboard mandir',          category: 'electrical', type: 'switchboard', box: [40.250, 40.350,  5.600,  6.000, 15.800, 16.200], material: 'M-PAINT-INT' },
  { id: 'SB-HALL', name: 'Switchboard hallway',         category: 'electrical', type: 'switchboard', box: [34.250, 34.350,  8.000,  8.400, 15.800, 16.200], material: 'M-PAINT-INT' },
  { id: 'SUB-DB',  name: 'First floor sub-distribution board', category: 'electrical', type: 'switchboard', box: [24.000, 24.800, 18.775, 18.875, 16.000, 17.000], material: 'M-STEEL-SS' },
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 8.16 – TERRACE GYM & YOGA ROOM + ROOFTOP WATER TANK + LADDER
// ─────────────────────────────────────────────────────────────────────────────

function createGymRoofLadder() {
  const items = [];
  // Straight vertical ladder on the north exterior wall facing terrace (X = 14.50 to 14.85, Y = 17.5 to 19.0)
  // Base at terrace floor Z = 22.50 to Gym roof Z = 32.50 (with 3.0ft safety extension to Z = 35.50)
  const lx = 14.65;
  const ly1 = 17.80;
  const ly2 = 19.30;
  const zBottom = 22.50;
  const zTop = 35.50;
  const railThick = 0.08;

  // Left vertical rail
  items.push({
    id: 'TER-GYM-LADDER-RAIL-L',
    name: 'Gym Roof Ladder Left Stringer',
    category: 'furniture',
    type: 'ladder',
    box: [lx, lx + railThick, ly1, ly1 + railThick, zBottom, zTop],
    material: 'M-STEEL-GREY'
  });

  // Right vertical rail
  items.push({
    id: 'TER-GYM-LADDER-RAIL-R',
    name: 'Gym Roof Ladder Right Stringer',
    category: 'furniture',
    type: 'ladder',
    box: [lx, lx + railThick, ly2 - railThick, ly2, zBottom, zTop],
    material: 'M-STEEL-GREY'
  });

  // Wall stand-off brackets fixing ladder to gym exterior concrete wall
  [24.0, 28.0, 31.8].forEach((bz, idx) => {
    items.push({
      id: `TER-GYM-LADDER-BRKT-${idx}`,
      name: 'Gym Ladder Wall Stand-off',
      category: 'furniture',
      type: 'ladder',
      box: [14.45, lx, (ly1 + ly2) / 2 - 0.45, (ly1 + ly2) / 2 + 0.45, bz - 0.04, bz + 0.04],
      material: 'M-STEEL-GREY'
    });
  });

  // Ladder rungs (spaced 1.0 ft apart from Z = 23.50 to 32.50)
  let rungIdx = 1;
  for (let rz = 23.50; rz <= 32.50; rz += 1.00) {
    items.push({
      id: `TER-GYM-LADDER-RUNG-${rungIdx++}`,
      name: 'Gym Roof Ladder Rung',
      category: 'furniture',
      type: 'ladder_rung',
      box: [lx, lx + railThick, ly1 + railThick, ly2 - railThick, rz - 0.04, rz + 0.04],
      material: 'M-STEEL-SS'
    });
  }

  return items;
}

const TERRACE_GYM_AND_TANK = [
  // Gym Door: Glass Sliding Door on North Wall (X = 14.0 to 14.5, Y = 10.0 to 14.5, Z = 22.5 to 29.5)
  {
    id: 'TER-GYM-DR-FRM-L',
    name: 'Gym Door North Jamb',
    category: 'doors',
    type: 'door_frame',
    box: [14.000, 14.500, 10.000, 10.200, 22.500, 29.500],
    material: 'M-ALU-FRAME'
  },
  {
    id: 'TER-GYM-DR-FRM-R',
    name: 'Gym Door South Jamb',
    category: 'doors',
    type: 'door_frame',
    box: [14.000, 14.500, 14.300, 14.500, 22.500, 29.500],
    material: 'M-ALU-FRAME'
  },
  {
    id: 'TER-GYM-DR-FRM-T',
    name: 'Gym Door Top Rail',
    category: 'doors',
    type: 'door_frame',
    box: [14.000, 14.500, 10.000, 14.500, 29.300, 29.500],
    material: 'M-ALU-FRAME'
  },
  {
    id: 'TER-GYM-DR-GLZ-FIX',
    name: 'Gym Fixed Glass Panel',
    category: 'doors',
    type: 'glazing',
    box: [14.200, 14.280, 10.200, 12.000, 22.500, 29.300],
    material: 'M-GLASS'
  },
  {
    id: 'TER-GYM-DR-GLZ-SLD',
    name: 'Gym Sliding Glass Panel (Open Walkway)',
    category: 'doors',
    type: 'glazing',
    // Leave Y = 12.00 to 14.30 open as entrance doorway, parked panel behind fixed pane
    box: [14.280, 14.360, 10.250, 12.000, 22.500, 29.300],
    material: 'M-GLASS'
  },

  // East Panoramic Window (X = 3.5 to 10.5, Y = -0.75 to 0.00, Z = 25.5 to 29.5)
  {
    id: 'TER-GYM-WIN-E-FRM',
    name: 'Gym East Window Frame',
    category: 'windows',
    type: 'window_frame',
    box: [3.500, 10.500, -0.450, -0.350, 25.500, 29.500],
    material: 'M-ALU-FRAME'
  },
  {
    id: 'TER-GYM-WIN-E-GLZ',
    name: 'Gym East Window Glass',
    category: 'windows',
    type: 'glazing',
    box: [3.600, 10.400, -0.410, -0.390, 25.600, 29.400],
    material: 'M-GLASS'
  },

  // West Scenic Yoga Window (X = 3.5 to 10.5, Y = 23.25 to 24.00, Z = 25.5 to 29.5)
  {
    id: 'TER-GYM-WIN-W-FRM',
    name: 'Gym West Window Frame',
    category: 'windows',
    type: 'window_frame',
    box: [3.500, 10.500, 23.550, 23.650, 25.500, 29.500],
    material: 'M-ALU-FRAME'
  },
  {
    id: 'TER-GYM-WIN-W-GLZ',
    name: 'Gym West Window Glass',
    category: 'windows',
    type: 'glazing',
    box: [3.600, 10.400, 23.590, 23.610, 25.600, 29.400],
    material: 'M-GLASS'
  },

  // Full-Length Workout Mirror along South Wall (X = 0.01 to 0.08, Y = 3.0 to 20.0, Z = 23.0 to 29.0)
  {
    id: 'TER-GYM-MIRROR',
    name: 'Gym Workout Mirror',
    category: 'furniture',
    type: 'mirror',
    box: [0.010, 0.080, 3.000, 20.000, 23.000, 29.000],
    material: 'M-MIRROR'
  },

  // Yoga Mats (placed on west side facing scenic yoga window and south mirror)
  {
    id: 'TER-YOGA-MAT-1',
    name: 'Terrace Yoga Mat 1 (Purple)',
    category: 'furniture',
    type: 'yoga_mat',
    box: [2.500, 5.000, 17.500, 22.800, 22.580, 22.620],
    material: 'M-YOGA-MAT-PURPLE'
  },
  {
    id: 'TER-YOGA-MAT-2',
    name: 'Terrace Yoga Mat 2 (Teal)',
    category: 'furniture',
    type: 'yoga_mat',
    box: [6.500, 9.000, 17.500, 22.800, 22.580, 22.620],
    material: 'M-YOGA-MAT-TEAL'
  },

  // Multi-Tier Dumbbell Rack & Weights (along north interior wall: X = 12.0 to 13.5, Y = 1.5 to 6.5)
  {
    id: 'TER-GYM-DBRACK',
    name: 'Gym Dumbbell Rack Stand',
    category: 'furniture',
    type: 'gym_dumbbell_rack',
    box: [12.000, 13.500, 1.500, 6.500, 22.580, 25.500],
    material: 'M-STEEL-GREY'
  },

  // Adjustable Workout Weight Bench (East workout zone: X = 5.5 to 7.8, Y = 2.5 to 7.0)
  {
    id: 'TER-GYM-BENCH',
    name: 'Gym Weight Bench',
    category: 'furniture',
    type: 'gym_bench',
    box: [5.500, 7.800, 2.500, 7.000, 22.580, 24.200],
    material: 'M-GYM-RUBBER'
  },

  // Modern Electric Treadmill (Near East Window: X = 2.0 to 4.2, Y = 1.5 to 6.8)
  {
    id: 'TER-GYM-TREADMILL',
    name: 'Gym Electric Treadmill',
    category: 'furniture',
    type: 'gym_treadmill',
    box: [2.000, 4.200, 1.500, 6.800, 22.580, 26.200],
    material: 'M-STEEL-GREY'
  },

  // Commercial Rooftop Water Tank (Sintex Style) on Top of Gym Roof (X = 4.5 to 9.0, Y = 8.5 to 13.0, Z = 32.60 to 37.60)
  {
    id: 'TER-WATER-TANK',
    name: 'Rooftop Water Storage Tank',
    category: 'furniture',
    type: 'water_tank',
    box: [4.500, 9.000, 8.500, 13.000, 32.600, 37.600],
    material: 'M-WATER-TANK'
  },

  // Rooftop Water Tank Overflow & Supply PVC Piping (Descending down gym exterior wall)
  {
    id: 'TER-TANK-PIPE-VERT',
    name: 'Water Tank Vertical Supply Pipe',
    category: 'electrical',
    type: 'pipe',
    box: [14.550, 14.750, 8.500, 8.700, 22.500, 36.500],
    material: 'M-PVC-PIPE'
  },
  {
    id: 'TER-TANK-PIPE-HORIZ',
    name: 'Water Tank Inflow Pipe Horizontal',
    category: 'electrical',
    type: 'pipe',
    box: [9.000, 14.550, 8.500, 8.700, 36.350, 36.550],
    material: 'M-PVC-PIPE'
  },

  // Straight Ladder to access Roof & Water Tank
  ...createGymRoofLadder()
];

// ─────────────────────────────────────────────────────────────────────────────
// MASTER EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export const FIRST_FLOOR_FITOUT = [
  ...SHAFT_GRILLS,
  ...WINDOWS,
  ...DOORS,
  ...RAILINGS,
  ...MASTER_BEDROOM,
  ...BASIN_NICHE,
  ...BATHROOM_1,
  ...BATHROOM_2,
  ...KITCHEN,
  ...LOBBY,
  ...HALLWAY,
  ...CHILD_BEDROOM,
  ...MANDIR,
  ...BALCONIES,
  ...ELECTRICAL,
  ...TERRACE_GYM_AND_TANK,
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 9.1 – CEILING FANS (5 total)
// ceilZ = 22.0 (unscaled) → first floor roof slab underside
// ─────────────────────────────────────────────────────────────────────────────

export const FF_FANS = [
  { id: 'FN-F1', name: 'Master bedroom fan',          room: 'Master Bedroom', cx:  6.800, cy_spec: 17.500, ceilZ: 22.0 },
  { id: 'FN-F2', name: 'Lobby living area fan',       room: 'Lobby',          cx: 21.000, cy_spec:  6.500, ceilZ: 22.0 },
  { id: 'FN-F3', name: 'Lobby dining area fan',       room: 'Lobby',          cx: 20.000, cy_spec: 13.500, ceilZ: 22.0 },
  { id: 'FN-F4', name: 'Child bedroom fan',           room: 'Child Bedroom',  cx: 45.000, cy_spec: 16.500, ceilZ: 22.0 },
  { id: 'FN-F5', name: 'Mandir fan',                  room: 'Mandir',         cx: 44.750, cy_spec:  4.500, ceilZ: 22.0 },
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 9.2 – CEILING LIGHTS (18 LED panels)
// ceilZ = 22.0 (unscaled) — panels sit at Z 21.94–22.00.
// ─────────────────────────────────────────────────────────────────────────────

export const FF_LIGHTS = [
  { id: 'LT-F1',  name: 'Master bedroom LED',    room: 'Master Bedroom', cx:  6.800, cy_spec: 20.500, sizeX: 2.0, sizeY: 2.0, ceilZ: 22.0 },
  { id: 'LT-F2',  name: 'Kitchen LED',           room: 'Kitchen',        cx:  8.625, cy_spec:  8.000, sizeX: 2.0, sizeY: 2.0, ceilZ: 22.0 },
  { id: 'LT-F3',  name: 'Lobby SW LED',          room: 'Lobby',          cx: 17.500, cy_spec:  6.000, sizeX: 2.0, sizeY: 2.0, ceilZ: 22.0 },
  { id: 'LT-F4',  name: 'Lobby SE LED',          room: 'Lobby',          cx: 22.500, cy_spec:  6.000, sizeX: 2.0, sizeY: 2.0, ceilZ: 22.0 },
  { id: 'LT-F5',  name: 'Lobby dining W LED',    room: 'Lobby',          cx: 17.500, cy_spec: 14.000, sizeX: 2.0, sizeY: 2.0, ceilZ: 22.0 },
  { id: 'LT-F6',  name: 'Lobby dining E LED',    room: 'Lobby',          cx: 22.500, cy_spec: 14.000, sizeX: 2.0, sizeY: 2.0, ceilZ: 22.0 },
  { id: 'LT-F7',  name: 'Lobby north LED',       room: 'Lobby',          cx: 20.000, cy_spec: 17.500, sizeX: 2.0, sizeY: 2.0, ceilZ: 22.0 },
  { id: 'LT-F8',  name: 'North gallery W LED',   room: 'Gallery',        cx: 29.000, cy_spec: 16.900, sizeX: 2.0, sizeY: 2.0, ceilZ: 22.0 },
  { id: 'LT-F9',  name: 'North gallery E LED',   room: 'Gallery',        cx: 32.500, cy_spec: 16.900, sizeX: 2.0, sizeY: 2.0, ceilZ: 22.0 },
  { id: 'LT-F10', name: 'Hallway south LED',     room: 'Hallway',        cx: 37.000, cy_spec:  4.000, sizeX: 2.0, sizeY: 2.0, ceilZ: 22.0 },
  { id: 'LT-F11', name: 'Hallway centre LED',    room: 'Hallway',        cx: 37.000, cy_spec: 10.000, sizeX: 2.0, sizeY: 2.0, ceilZ: 22.0 },
  { id: 'LT-F12', name: 'Hallway north LED',     room: 'Hallway',        cx: 37.000, cy_spec: 16.000, sizeX: 2.0, sizeY: 2.0, ceilZ: 22.0 },
  { id: 'LT-F13', name: 'Child bedroom LED',     room: 'Child Bedroom',  cx: 45.000, cy_spec: 19.500, sizeX: 2.0, sizeY: 2.0, ceilZ: 22.0 },
  { id: 'LT-F14', name: 'Mandir LED',            room: 'Mandir',         cx: 44.750, cy_spec:  6.500, sizeX: 2.0, sizeY: 2.0, ceilZ: 22.0 },
  { id: 'LT-F15', name: 'Basin niche LED',       room: 'Basin Niche',    cx: 15.600, cy_spec: 21.000, sizeX: 1.0, sizeY: 1.0, ceilZ: 22.0 },
  { id: 'LT-F16', name: 'Bathroom 1 LED',        room: 'Bathroom 1',     cx: 22.125, cy_spec: 21.250, sizeX: 1.0, sizeY: 1.0, ceilZ: 22.0 },
  { id: 'LT-F17', name: 'Bathroom 2 LED',        room: 'Bathroom 2',     cx: 36.375, cy_spec: 21.250, sizeX: 1.0, sizeY: 1.0, ceilZ: 22.0 },
  { id: 'LT-F18', name: 'South balcony bulkhead',room: 'Balcony',        cx:  6.800, cy_spec:  2.000, sizeX: 1.0, sizeY: 0.5, ceilZ: 22.0 },
];
