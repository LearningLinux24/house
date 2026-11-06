/**
 * First Floor Structural Specification Data
 * Source: first_floor_3d_simulation_specification.md (Sections 4, 5, 7, 8, 9, 13)
 *
 * Box format: [xmin, xmax, ymin, ymax, zmin, zmax] in feet (spec Z-up axes).
 * Three.js axis mapping:  engine_x = X,  engine_y = Z,  engine_z = -Y
 *
 * Z_F1 = 12.00  (first-floor level = top of ground slab)
 * Z_CEIL1 = 22.00  (underside of roof slab, 10 ft clear)
 * Z_TERRACE = 22.50  (top of roof slab, upper stair arrives here)
 * T_INT = 0.375 ft,  T_EXT = 0.75 ft
 * Door head = 7.00 ft above floor  =>  Z = 19.00; lintel Z = 19.00 to 22.00
 */

export const FIRST_FLOOR_DATA = {
  id: 'first_floor',
  name: 'First Floor',
  level: 1,

  // Spawn at the top of the ground-floor staircase, on the first-floor slab
  spawn: {
    x: 32.0,
    y_spec: 14.6,
    elev: 12.0,
    yaw: Math.PI // Facing west (into lobby)
  },

  solids: [

    // ─────────────────────────────────────────────────────────────────────
    // STEP 1 · Projecting Floor Plate (Z = 11.50 to 12.00)
    // Note: Boxes FL1-FL4 are identical to ground-floor SL1-SL4 (already in scene).
    // Per spec section 13.1 & 13.9: "Build FL1 to FL4 only once if the ground floor
    // model (SL1 to SL4) is already present."
    // ES-W and ES-S are new (7.6): cantilever overhangs carrying the west wall,
    // balcony, and south wall that project over the ground-floor garden & gates.
    // ─────────────────────────────────────────────────────────────────────
    { id: 'ES-W', box: [-0.750,  3.250, -0.750, 24.000, 11.500, 12.000], type: 'floor_plate' },
    { id: 'ES-S', box: [ 3.250, 50.000, -0.750,  0.000, 11.500, 12.000], type: 'floor_plate' },

    // ─────────────────────────────────────────────────────────────────────
    // STEP 2 · Exterior Walls  (Z = 12.00 to 22.00, T_EXT = 0.75 ft)
    // All four are unbroken — no windows, no gates on this floor.
    // The west and south walls span over what were gate openings on the ground floor.
    // ─────────────────────────────────────────────────────────────────────
    { id: 'F-EXT-N', box: [-0.750, 50.000, 23.250, 24.000, 12.000, 22.000], type: 'wall_ext' },
    { id: 'F-EXT-E', box: [49.250, 50.000,  0.000, 23.250, 12.000, 22.000], type: 'wall_ext' },
    { id: 'F-EXT-W', box: [-0.750,  0.000,  0.000, 23.250, 12.000, 22.000], type: 'wall_ext' },
    { id: 'F-EXT-S', box: [-0.750, 50.000, -0.750,  0.000, 12.000, 22.000], type: 'wall_ext' },

    // ─────────────────────────────────────────────────────────────────────
    // STEP 3 · Interior Walls  (Z = 12.00 to 22.00, T_INT = 0.375 ft)
    // ─────────────────────────────────────────────────────────────────────

    // F-INT-01: Master bedroom east wall / basin niche west wall (Y 15.0 to 23.25)
    //   Master bedroom door: gap at Y = 11.75 to 15.0
    { id: 'F-INT-01',  box: [13.625, 14.000, 15.000, 23.250, 12.000, 22.000], type: 'wall_int' },

    // F-INT-02: Master bedroom south wall / kitchen north wall (full width X 0 to 14.0)
    //   Includes owner's thin black line for X = 0 to 3.25 (balcony north wall)
    { id: 'F-INT-02',  box: [ 0.000, 14.000, 11.375, 11.750, 12.000, 22.000], type: 'wall_int' },

    // F-INT-03: Kitchen west wall / balcony east wall (Y 4.375 to 11.375)
    { id: 'F-INT-03',  box: [ 3.250,  3.625,  4.375, 11.375, 12.000, 22.000], type: 'wall_int' },

    // F-INT-04: Kitchen south wall / south balcony north wall (full width X 3.25 to 13.625)
    //   Includes owner's heavy black bar (X 10.4 to 13.625). No opening by default.
    { id: 'F-INT-04',  box: [ 3.250, 13.625,  4.000,  4.375, 12.000, 22.000], type: 'wall_int' },

    // F-INT-05: Lobby west wall, south part (Y 0 to 8.375). No door here.
    //   Kitchen door: gap at Y = 8.375 to 11.375
    { id: 'F-INT-05',  box: [13.625, 14.000,  0.000,  8.375, 12.000, 22.000], type: 'wall_int' },

    // F-INT-06: Basin niche east wall / Bathroom 1 west wall (Y 18.875 to 23.25)
    { id: 'F-INT-06',  box: [17.250, 17.625, 18.875, 23.250, 12.000, 22.000], type: 'wall_int' },

    // F-INT-07: Bathroom 1 south wall, east of its door (X 20.125 to 27.0)
    //   Bathroom 1 door: gap at X = 17.625 to 20.125
    { id: 'F-INT-07',  box: [20.125, 27.000, 18.875, 19.250, 12.000, 22.000], type: 'wall_int' },

    // F-INT-08: Bathroom 1 east wall / shaft alcove west wall (Y 19.25 to 23.25)
    { id: 'F-INT-08',  box: [26.625, 27.000, 19.250, 23.250, 12.000, 22.000], type: 'wall_int' },

    // F-INT-09: Stairs bay west wall / lobby east wall (Y 0 to 15.0)
    //   Ends at Y = 15.0 → lobby opens into north gallery beyond
    { id: 'F-INT-09',  box: [26.000, 26.375,  0.000, 15.000, 12.000, 22.000], type: 'wall_int' },

    // F-INT-10: Stairs bay east wall / hallway west wall (Y 0 to 15.0)
    { id: 'F-INT-10',  box: [33.875, 34.250,  0.000, 15.000, 12.000, 22.000], type: 'wall_int' },

    // F-INT-11: Bathroom 2 west wall / shaft alcove east wall (Y 19.25 to 23.25)
    { id: 'F-INT-11',  box: [32.500, 32.875, 19.250, 23.250, 12.000, 22.000], type: 'wall_int' },

    // F-INT-12: Bathroom 2 south wall, west of its door (X 32.5 to 37.125)
    //   Bathroom 2 door: gap at X = 37.125 to 39.875
    { id: 'F-INT-12',  box: [32.500, 37.125, 18.875, 19.250, 12.000, 22.000], type: 'wall_int' },

    // F-INT-13: Hallway / child bedroom wall, also Bathroom 2 east wall (Y 12.875 to 23.25)
    //   Child bedroom door: gap at Y = 9.375 to 12.875
    { id: 'F-INT-13',  box: [39.875, 40.250, 12.875, 23.250, 12.000, 22.000], type: 'wall_int' },

    // F-INT-14: Mandir north wall / child bedroom south wall
    { id: 'F-INT-14',  box: [39.875, 49.250,  9.000,  9.375, 12.000, 22.000], type: 'wall_int' },

    // F-INT-15: Mandir west wall, south part (Y 0 to 6.5)
    //   Mandir door: gap at Y = 6.5 to 9.0
    { id: 'F-INT-15',  box: [39.875, 40.250,  0.000,  6.500, 12.000, 22.000], type: 'wall_int' },

    // ─────────────────────────────────────────────────────────────────────
    // Door Lintels  (Z = 19.00 to 22.00 — head is 7.0 ft above Z_F1 = 12.00)
    // ─────────────────────────────────────────────────────────────────────
    { id: 'F-LIN-01', box: [13.625, 14.000, 11.750, 15.000, 19.000, 22.000], type: 'lintel' }, // Master bedroom door (3.25 ft)
    { id: 'F-LIN-02', box: [13.625, 14.000,  8.375, 11.375, 19.000, 22.000], type: 'lintel' }, // Kitchen door (3.00 ft)
    { id: 'F-LIN-03', box: [17.625, 20.125, 18.875, 19.250, 19.000, 22.000], type: 'lintel' }, // Bathroom 1 door (2.50 ft)
    { id: 'F-LIN-04', box: [37.125, 39.875, 18.875, 19.250, 19.000, 22.000], type: 'lintel' }, // Bathroom 2 door (2.75 ft)
    { id: 'F-LIN-05', box: [39.875, 40.250,  9.375, 12.875, 19.000, 22.000], type: 'lintel' }, // Child bedroom door (3.50 ft)
    { id: 'F-LIN-06', box: [39.875, 40.250,  6.500,  9.000, 19.000, 22.000], type: 'lintel' }, // Mandir door (2.50 ft)

    // ─────────────────────────────────────────────────────────────────────
    // STEP 4 · Upper Staircase — Lane A  (X = 26.375 to 29.625, ascending SOUTH)
    // 13 treads, riser = 0.750 ft, run = 0.770 ft, from Y=14.010 down to Y=4.000
    // 14th riser at Y=4.0 reaches terrace Z=22.50
    // ─────────────────────────────────────────────────────────────────────
    { id: 'U01', box: [26.375, 29.625, 13.240, 14.010, 12.000, 12.750], type: 'tread' },
    { id: 'U02', box: [26.375, 29.625, 12.470, 13.240, 12.000, 13.500], type: 'tread' },
    { id: 'U03', box: [26.375, 29.625, 11.700, 12.470, 12.000, 14.250], type: 'tread' },
    { id: 'U04', box: [26.375, 29.625, 10.930, 11.700, 12.000, 15.000], type: 'tread' },
    { id: 'U05', box: [26.375, 29.625, 10.160, 10.930, 12.000, 15.750], type: 'tread' },
    { id: 'U06', box: [26.375, 29.625,  9.390, 10.160, 12.000, 16.500], type: 'tread' },
    { id: 'U07', box: [26.375, 29.625,  8.620,  9.390, 12.000, 17.250], type: 'tread' },
    { id: 'U08', box: [26.375, 29.625,  7.850,  8.620, 12.000, 18.000], type: 'tread' },
    { id: 'U09', box: [26.375, 29.625,  7.080,  7.850, 12.000, 18.750], type: 'tread' },
    { id: 'U10', box: [26.375, 29.625,  6.310,  7.080, 12.000, 19.500], type: 'tread' },
    { id: 'U11', box: [26.375, 29.625,  5.540,  6.310, 12.000, 20.250], type: 'tread' },
    { id: 'U12', box: [26.375, 29.625,  4.770,  5.540, 12.000, 21.000], type: 'tread' },
    { id: 'U13', box: [26.375, 29.625,  4.000,  4.770, 12.000, 21.750], type: 'tread' },

    // ─────────────────────────────────────────────────────────────────────
    // STEP 5 · Roof Slab  (Z = 22.00 to 22.50)
    // Four boxes leave out the lane A opening: X=26.375–29.625, Y=4.0–11.0
    // ─────────────────────────────────────────────────────────────────────
    { id: 'RF1', box: [-0.750, 26.375, -0.750, 24.000, 22.000, 22.500], type: 'slab' },
    { id: 'RF2', box: [29.625, 50.000, -0.750, 24.000, 22.000, 22.500], type: 'slab' },
    { id: 'RF3', box: [26.375, 29.625, -0.750,  4.000, 22.000, 22.500], type: 'slab' },
    { id: 'RF4', box: [26.375, 29.625, 11.000, 24.000, 22.000, 22.500], type: 'slab' },

    // ─────────────────────────────────────────────────────────────────────
    // STEP 6 · Fixtures (spec section 9 — four drawn items only)
    // ─────────────────────────────────────────────────────────────────────
    { id: 'FX-KT-W',   box: [ 3.625,  5.625,  4.375, 11.375, 12.000, 14.750], type: 'fixture' }, // Kitchen platform, west arm (2.0×7.0 ft)
    { id: 'FX-KT-S',   box: [ 3.625, 11.000,  4.375,  6.625, 12.000, 14.750], type: 'fixture' }, // Kitchen platform, south arm (7.375×2.25 ft)
    { id: 'FX-BASIN',  box: [34.250, 36.250,  3.000,  6.750, 12.000, 14.750], type: 'fixture' }, // Hallway basin counter (2.0×3.75 ft)
    { id: 'FX-WM',     box: [37.875, 39.875,  0.000,  2.000, 12.000, 15.000], type: 'fixture' }, // Washing machine (2.0×2.0 ft)

    // ─────────────────────────────────────────────────────────────────────
    // STEP 7 · Shaft marker  (thin raised border on floor, default build — no walls)
    // Same XY as ground floor shaft Z10; one shaft through both floors.
    // ─────────────────────────────────────────────────────────────────────
    { id: 'FSH-S', box: [28.000, 32.000, 19.500, 19.600, 12.000, 12.100], type: 'shaft' },
    { id: 'FSH-N', box: [28.000, 32.000, 22.400, 22.500, 12.000, 12.100], type: 'shaft' },
    { id: 'FSH-W', box: [28.000, 28.100, 19.600, 22.400, 12.000, 12.100], type: 'shaft' },
    { id: 'FSH-E', box: [31.900, 32.000, 19.600, 22.400, 12.000, 12.100], type: 'shaft' }
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // Rooms / Zones  (for zone detection & minimap rendering)
  // ─────────────────────────────────────────────────────────────────────────
  zones: [
    { id: 'F1',  name: 'South Balcony (13\'7.5" × 4\')',      bounds: [ 0.000, 13.625,  0.000,  4.000] },
    { id: 'F2',  name: 'West Balcony (3\'3" × 7\'4.5")',      bounds: [ 0.000,  3.250,  4.000, 11.375] },
    { id: 'F3',  name: 'Kitchen (10\'0" × 7\'0")',            bounds: [ 3.625, 13.625,  4.375, 11.375] },
    { id: 'F4',  name: 'Master Bedroom (13\'7.5" × 11\'6")',  bounds: [ 0.000, 13.625, 11.750, 23.250] },
    { id: 'F5',  name: 'Basin Niche (3\'3" × 4\'4.5")',       bounds: [14.000, 17.250, 18.875, 23.250] },
    { id: 'F6',  name: 'Bathroom 1 (9\'0" × 4\'0")',          bounds: [17.625, 26.625, 19.250, 23.250] },
    { id: 'F7',  name: 'Lobby (12\'0" × 18\'10.5")',          bounds: [14.000, 26.000,  0.000, 18.875] },
    { id: 'F8',  name: 'Stairs Bay',                           bounds: [26.375, 33.875,  0.000, 15.000] },
    { id: 'F9',  name: 'North Gallery (8\'3" × 3\'10.5")',    bounds: [26.000, 34.250, 15.000, 18.875] },
    { id: 'F10', name: 'Shaft Alcove (5\'6" × 4\'4.5")',      bounds: [27.000, 32.500, 18.875, 23.250] },
    { id: 'F11', name: 'Bathroom 2 (7\'0" × 4\'0")',          bounds: [32.875, 39.875, 19.250, 23.250] },
    { id: 'F12', name: 'Hallway (5\'7.5" × 18\'10.5")',       bounds: [34.250, 39.875,  0.000, 18.875] },
    { id: 'F13', name: 'Child Bedroom (9\'0" × 13\'10.5")',   bounds: [40.250, 49.250,  9.375, 23.250] },
    { id: 'F14', name: 'Mandir (9\'0" × 9\'0")',              bounds: [40.250, 49.250,  0.000,  9.000] }
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // Floating 3D Room Labels
  // ─────────────────────────────────────────────────────────────────────────
  labels: [
    { text: 'MASTER BEDROOM', sub: "13'7\" × 11'6\"",   x:  6.812, y_spec: 17.500, elev: 19.0 },
    { text: 'KITCHEN',        sub: "10'0\" × 7'0\"",    x:  8.625, y_spec:  7.875, elev: 19.0 },
    { text: 'BALCONY',        sub: "W.D 3'3\"",         x:  1.625, y_spec:  7.688, elev: 19.0 },
    { text: 'LOBBY',          sub: "12'0\" × 18'10.5\"",x: 20.000, y_spec:  9.438, elev: 19.0 },
    { text: 'BATHROOM 1',     sub: "9'0\" × 4'0\"",     x: 22.125, y_spec: 21.250, elev: 19.0 },
    { text: 'BATHROOM 2',     sub: "7'0\" × 4'0\"",     x: 36.375, y_spec: 21.250, elev: 19.0 },
    { text: 'HALLWAY',        sub: "5'7.5\" × 18'10.5\"",x:37.062, y_spec:  9.438, elev: 19.0 },
    { text: 'CHILD BEDROOM',  sub: "9'0\" × 13'10.5\"", x: 44.750, y_spec: 16.313, elev: 19.0 },
    { text: 'MANDIR',         sub: "9'0\" × 9'0\"",     x: 44.750, y_spec:  4.500, elev: 19.0 },
    { text: 'STAIRS UP →',    sub: "To Terrace",        x: 28.000, y_spec:  9.000, elev: 19.0 }
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // Quick Teleport Locations
  // ─────────────────────────────────────────────────────────────────────────
  teleports: [
    { label: '🏠 1F · Stair Arrival',         x: 32.0,  y_spec: 14.6,  elev: 12.0 },
    { label: '🛋️ 1F · Lobby',                 x: 20.0,  y_spec: 10.0,  elev: 12.0 },
    { label: '🛏️ 1F · Master Bedroom',        x:  6.8,  y_spec: 17.5,  elev: 12.0 },
    { label: '🍳 1F · Kitchen',               x:  8.6,  y_spec:  7.9,  elev: 12.0 },
    { label: '🌿 1F · Balcony',               x:  5.0,  y_spec:  2.0,  elev: 12.0 },
    { label: '🚿 1F · Bathroom 1',            x: 22.0,  y_spec: 21.5,  elev: 12.0 },
    { label: '🚿 1F · Bathroom 2',            x: 36.0,  y_spec: 21.5,  elev: 12.0 },
    { label: '🚪 1F · Hallway',               x: 37.0,  y_spec:  9.0,  elev: 12.0 },
    { label: '🛏️ 1F · Child Bedroom',         x: 44.5,  y_spec: 16.0,  elev: 12.0 },
    { label: '🕌 1F · Mandir',                x: 44.5,  y_spec:  4.5,  elev: 12.0 },
    { label: '🪜 1F · Upper Stair (foot)',    x: 28.0,  y_spec: 13.6,  elev: 12.0 },
    { label: '🏔️ 1F · Terrace Level',         x: 28.0,  y_spec:  3.5,  elev: 22.5 }
  ]
};
