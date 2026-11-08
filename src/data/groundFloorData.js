/**
 * Ground Floor Specification Data
 * Source:
 * - ground_floor_3d_simulation_specification.md (Sections 4, 5, 7, 13)
 * - ground_floor_3d_fitout_and_interior_specification.md (Section 3 Overrides O1-O5)
 *
 * Each box is formatted as: [xmin, xmax, ymin, ymax, zmin, zmax] in feet
 */

export const GROUND_FLOOR_DATA = {
  id: 'ground_floor',
  name: 'Ground Floor',
  level: 0,

  // Initial player spawn point
  spawn: {
    x: 1.60,
    y_spec: 3.75, // Gate landing
    elev: 0.00,
    yaw: Math.PI / 2 // Facing East towards the entrance steps
  },

  // Box Solids (Structural + Overrides O1-O5)
  solids: [
    // 1. Ground Base Slab
    { id: 'G0', box: [-0.750, 50.000, -0.750, 24.000, -0.500, 0.000], type: 'ground' },

    // Garden finishes on ground slab — pure green grass across entire garden zone
    { id: 'G-GRASS', box: [0.000, 3.250, 7.500, 23.250, 0.000, 0.020], type: 'grass' },

    // 2. Plinth Blocks (P1 - P4)
    { id: 'P1', box: [3.250, 34.250, 7.500, 23.250, 0.000, 1.500], type: 'plinth' },
    { id: 'P2', box: [13.625, 34.250, 0.000, 7.500, 0.000, 1.500], type: 'plinth' },
    { id: 'P3', box: [6.150, 13.625, 0.000, 7.500, 0.000, 1.500], type: 'plinth' },
    { id: 'P4', box: [34.250, 49.250, 15.000, 23.250, 0.000, 1.500], type: 'plinth' },

    // 3. Entrance Steps (S1 - S3) - Black Granite
    { id: 'S1', box: [3.750, 4.550, 0.000, 7.500, 0.000, 0.500], type: 'step' },
    { id: 'S2', box: [4.550, 5.350, 0.000, 7.500, 0.000, 1.000], type: 'step' },
    { id: 'S3', box: [5.350, 6.150, 0.000, 7.500, 0.000, 1.500], type: 'step' },

    // 4. Exterior Walls (W-EXT)
    // 4a. North Exterior Wall with apertures for WD-4, VT-2, VT-3
    { id: 'W-EXT-N-P1', box: [-0.750, 18.000, 23.250, 24.000, 0.000, 11.500], type: 'wall_ext' },
    { id: 'W-EXT-N-SILL1', box: [18.000, 22.000, 23.250, 24.000, 0.000, 4.500], type: 'wall_ext' }, // WD-4 Sill
    { id: 'W-EXT-N-LIN1', box: [18.000, 22.000, 23.250, 24.000, 8.500, 11.500], type: 'lintel' },   // WD-4 Lintel
    { id: 'W-EXT-N-P2', box: [22.000, 37.000, 23.250, 24.000, 0.000, 11.500], type: 'wall_ext' },
    { id: 'W-EXT-N-SILL2', box: [37.000, 39.000, 23.250, 24.000, 0.000, 7.000], type: 'wall_ext' }, // VT-2 Sill
    { id: 'W-EXT-N-LIN2', box: [37.000, 39.000, 23.250, 24.000, 8.500, 11.500], type: 'lintel' },   // VT-2 Lintel
    { id: 'W-EXT-N-P3', box: [39.000, 44.500, 23.250, 24.000, 0.000, 11.500], type: 'wall_ext' },
    { id: 'W-EXT-N-SILL3', box: [44.500, 46.500, 23.250, 24.000, 0.000, 7.000], type: 'wall_ext' }, // VT-3 Sill
    { id: 'W-EXT-N-LIN3', box: [44.500, 46.500, 23.250, 24.000, 8.500, 11.500], type: 'lintel' },   // VT-3 Lintel
    { id: 'W-EXT-N-P4', box: [46.500, 50.000, 23.250, 24.000, 0.000, 11.500], type: 'wall_ext' },

    { id: 'W-EXT-E', box: [49.250, 50.000, 0.000, 23.250, 0.000, 11.500], type: 'wall_ext' },
    // O1: West boundary wall is 6.0 ft garden wall
    { id: 'W-EXT-W', box: [-0.750, 0.000, 7.500, 23.250, 0.000, 6.000], type: 'wall_ext' },

    // 4b. South Exterior Wall with apertures for WD-1 and WD-2
    { id: 'W-EXT-S-P1', box: [-0.750, 18.000, -0.750, 0.000, 0.000, 11.500], type: 'wall_ext' },
    { id: 'W-EXT-S-SILL1', box: [18.000, 22.000, -0.750, 0.000, 0.000, 4.500], type: 'wall_ext' }, // WD-1 Sill
    { id: 'W-EXT-S-LIN1', box: [18.000, 22.000, -0.750, 0.000, 8.500, 11.500], type: 'lintel' },   // WD-1 Lintel
    { id: 'W-EXT-S-P2', box: [22.000, 28.000, -0.750, 0.000, 0.000, 11.500], type: 'wall_ext' },
    { id: 'W-EXT-S-SILL2', box: [28.000, 32.000, -0.750, 0.000, 0.000, 4.500], type: 'wall_ext' }, // WD-2 Sill
    { id: 'W-EXT-S-LIN2', box: [28.000, 32.000, -0.750, 0.000, 8.500, 11.500], type: 'lintel' },   // WD-2 Lintel
    { id: 'W-EXT-S-P3', box: [32.000, 36.500, -0.750, 0.000, 0.000, 11.500], type: 'wall_ext' },

    // O3: Solid band above garage gate and south-east missing corner
    { id: 'GB', box: [36.500, 50.000, -0.750, 0.000, 8.000, 11.500], type: 'wall_ext' },
    { id: 'SE-FILL', box: [49.250, 50.000, -0.750, 0.000, 0.000, 8.000], type: 'wall_ext' },

    // O4: Garage threshold two steps (top at Z = 1.000)
    { id: 'ST-G', box: [34.250, 41.250, 14.000, 15.000, 0.000, 1.000], type: 'step' },

    // 5. Interior Walls (W-INT)
    // W-INT-01 West wall with apertures for WD-3 (bedroom window to garden) and VT-1 (west bath vent)
    { id: 'W-INT-01-P1', box: [3.250, 3.625, 7.500, 11.375, 0.000, 11.500], type: 'wall_int' },
    { id: 'W-INT-01-SILL1', box: [3.250, 3.625, 11.375, 15.375, 0.000, 4.500], type: 'wall_int' }, // WD-3 Sill
    { id: 'W-INT-01-LIN1', box: [3.250, 3.625, 11.375, 15.375, 8.500, 11.500], type: 'lintel' },   // WD-3 Lintel
    { id: 'W-INT-01-P2', box: [3.250, 3.625, 15.375, 20.250, 0.000, 11.500], type: 'wall_int' },
    { id: 'W-INT-01-SILL2', box: [3.250, 3.625, 20.250, 22.250, 0.000, 7.000], type: 'wall_int' }, // VT-1 Sill
    { id: 'W-INT-01-LIN2', box: [3.250, 3.625, 20.250, 22.250, 8.500, 11.500], type: 'lintel' },   // VT-1 Lintel
    { id: 'W-INT-01-P3', box: [3.250, 3.625, 22.250, 23.250, 0.000, 11.500], type: 'wall_int' },

    { id: 'W-INT-02a', box: [3.625, 10.625, 7.500, 7.875, 0.000, 11.500], type: 'wall_int' },
    { id: 'W-INT-03', box: [3.625, 14.000, 18.875, 19.250, 0.000, 11.500], type: 'wall_int' },
    // O2: West washroom door is 2.5ft wide
    { id: 'W-INT-04a', box: [13.625, 14.000, 21.750, 23.250, 0.000, 11.500], type: 'wall_int' },
    { id: 'W-INT-05', box: [13.625, 14.000, 4.375, 15.000, 0.000, 11.500], type: 'wall_int' },

    // W-INT-06 Kitchen to South Hallway wall with aperture for WD-5
    { id: 'W-INT-06-P1', box: [13.625, 16.500, 4.000, 4.375, 0.000, 11.500], type: 'wall_int' },
    { id: 'W-INT-06-SILL', box: [16.500, 19.500, 4.000, 4.375, 0.000, 5.000], type: 'wall_int' }, // WD-5 Sill
    { id: 'W-INT-06-LIN', box: [16.500, 19.500, 4.000, 4.375, 8.000, 11.500], type: 'lintel' },    // WD-5 Lintel
    { id: 'W-INT-06-P2', box: [19.500, 26.375, 4.000, 4.375, 0.000, 11.500], type: 'wall_int' },
    { id: 'W-INT-07a', box: [14.000, 23.000, 11.375, 11.750, 0.000, 11.500], type: 'wall_int' },
    { id: 'W-INT-08', box: [26.000, 26.375, 4.375, 15.000, 0.000, 11.500], type: 'wall_int' },
    { id: 'W-INT-09', box: [26.000, 26.375, 18.875, 23.250, 0.000, 11.500], type: 'wall_int' },
    { id: 'W-INT-10a', box: [33.875, 34.250, 0.000, 15.000, 0.000, 11.500], type: 'wall_int' },
    { id: 'W-INT-10b', box: [33.875, 34.250, 18.875, 23.250, 0.000, 11.500], type: 'wall_int' },
    { id: 'W-INT-11a', box: [34.250, 38.750, 18.875, 19.250, 0.000, 11.500], type: 'wall_int' },
    { id: 'W-INT-12a', box: [41.250, 41.625, 18.875, 23.250, 0.000, 11.500], type: 'wall_int' },
    { id: 'W-INT-13', box: [41.250, 49.250, 15.000, 15.375, 0.000, 11.500], type: 'wall_int' },

    // 6. Doorway Lintels (head at 7.0' clear; Z = 8.5 to 11.5)
    { id: 'W-INT-02L', box: [10.625, 13.625, 7.500, 7.875, 8.500, 11.500], type: 'lintel' },
    // O2: Lintel W-INT-04L
    { id: 'W-INT-04L', box: [13.625, 14.000, 19.250, 21.750, 8.500, 11.500], type: 'lintel' },
    { id: 'W-INT-05L', box: [13.625, 14.000, 15.000, 18.875, 8.500, 11.500], type: 'lintel' },
    { id: 'W-INT-07L', box: [23.000, 26.000, 11.375, 11.750, 8.500, 11.500], type: 'lintel' },
    { id: 'W-INT-08L', box: [26.000, 26.375, 15.000, 18.875, 8.500, 11.500], type: 'lintel' },
    { id: 'W-INT-10L', box: [33.875, 34.250, 15.000, 18.875, 8.500, 11.500], type: 'lintel' },
    { id: 'W-INT-11L', box: [38.750, 41.250, 18.875, 19.250, 8.500, 11.500], type: 'lintel' },
    { id: 'W-INT-12L', box: [41.250, 41.625, 15.375, 18.875, 8.500, 11.500], type: 'lintel' },

    // 7. Stair Treads (12 solid treads climbing to Z_UPPER = 12.0)
    { id: 'T01', box: [30.125, 33.875, 4.000, 4.770, 1.500, 2.308], type: 'tread' },
    { id: 'T02', box: [30.125, 33.875, 4.770, 5.540, 1.500, 3.115], type: 'tread' },
    { id: 'T03', box: [30.125, 33.875, 5.540, 6.310, 1.500, 3.923], type: 'tread' },
    { id: 'T04', box: [30.125, 33.875, 6.310, 7.080, 1.500, 4.731], type: 'tread' },
    { id: 'T05', box: [30.125, 33.875, 7.080, 7.850, 1.500, 5.538], type: 'tread' },
    { id: 'T06', box: [30.125, 33.875, 7.850, 8.620, 1.500, 6.346], type: 'tread' },
    { id: 'T07', box: [30.125, 33.875, 8.620, 9.390, 1.500, 7.154], type: 'tread' },
    { id: 'T08', box: [30.125, 33.875, 9.390, 10.160, 1.500, 7.962], type: 'tread' },
    { id: 'T09', box: [30.125, 33.875, 10.160, 10.930, 1.500, 8.769], type: 'tread' },
    { id: 'T10', box: [30.125, 33.875, 10.930, 11.700, 1.500, 9.577], type: 'tread' },
    { id: 'T11', box: [30.125, 33.875, 11.700, 12.470, 1.500, 10.385], type: 'tread' },
    { id: 'T12', box: [30.125, 33.875, 12.470, 13.240, 1.500, 11.192], type: 'tread' },

    // 8. Ceiling / Roof Slabs (leaves stair opening and duct opening clear)
    { id: 'SL1', box: [3.250, 27.625, 0.000, 24.000, 11.500, 12.000], type: 'slab' },
    { id: 'SL1-S', box: [27.625, 30.125, 0.000, 19.125, 11.500, 12.000], type: 'slab' },
    { id: 'SL1-N', box: [27.625, 30.125, 22.875, 24.000, 11.500, 12.000], type: 'slab' },
    { id: 'SL2', box: [33.875, 50.000, 0.000, 24.000, 11.500, 12.000], type: 'slab' },
    { id: 'SL3', box: [30.125, 33.875, 0.000, 7.000, 11.500, 12.000], type: 'slab' },
    { id: 'SL4-S', box: [30.125, 33.875, 13.250, 19.125, 11.500, 12.000], type: 'slab' },
    { id: 'SL4-N', box: [30.125, 33.875, 22.875, 24.000, 11.500, 12.000], type: 'slab' },
    { id: 'SL4-E', box: [32.375, 33.875, 19.125, 22.875, 11.500, 12.000], type: 'slab' }
  ],

  // Rooms and Zones for Spatial Detection (Section 4)
  zones: [
    { id: 'Z1', name: 'Gate Landing', bounds: [0.000, 3.250, 0.000, 7.500] },
    { id: 'Z2', name: 'Garden (Open to Sky)', bounds: [0.000, 3.250, 7.500, 23.250] },
    { id: 'Z3', name: 'Entrance Porch & Steps', bounds: [3.250, 13.625, 0.000, 7.500] },
    { id: 'Z4', name: 'Bedroom (10\'0" x 11\'0")', bounds: [3.625, 13.625, 7.875, 18.875] },
    { id: 'Z5', name: 'West Washroom (10\'0" x 4\'0")', bounds: [3.625, 13.625, 19.250, 23.250] },
    { id: 'Z6', name: 'South Hallway (12\'9" x 4\'0")', bounds: [13.625, 26.375, 0.000, 4.000] },
    { id: 'Z7', name: 'Kitchen (12\'0" x 7\'0")', bounds: [14.000, 26.000, 4.375, 11.375] },
    { id: 'Z8', name: 'Central Lobby (12\'0" x 11\'6")', bounds: [14.000, 26.000, 11.750, 23.250] },
    { id: 'Z9A', name: 'Stairs Bay - West Passage', bounds: [26.375, 30.125, 0.000, 15.000] },
    { id: 'Z9B', name: 'Stairs Bay - Flight Lane', bounds: [30.125, 33.875, 0.000, 15.000] },
    { id: 'Z10', name: 'Ventilation Shaft (Open to Sky)', bounds: [27.625, 32.375, 19.125, 22.875] },
    { id: 'Z11', name: 'East Hallway', bounds: [26.375, 41.250, 15.000, 18.875] },
    { id: 'Z12', name: 'East Washroom (7\'0" x 4\'0")', bounds: [34.250, 41.250, 19.250, 23.250] },
    { id: 'Z13', name: 'Storeroom (7\'7.5" x 7\'10.5")', bounds: [41.625, 49.250, 15.375, 23.250] },
    { id: 'Z14', name: 'Garage (15\'0" x 15\'0")', bounds: [34.250, 49.250, 0.000, 15.000] },
    { id: 'Z15', name: 'Shaft Outer Alcove', bounds: [26.375, 33.875, 18.875, 23.250] }
  ],

  // 3D Floating Room Badges
  labels: [
    { text: 'BEDROOM', sub: "10'0\" x 11'0\"", x: 8.625, y_spec: 13.375, elev: 6.8 },
    { text: 'KITCHEN', sub: "12'0\" x 7'0\"", x: 20.000, y_spec: 7.875, elev: 6.8 },
    { text: 'LOBBY', sub: "12'0\" x 11'6\"", x: 20.000, y_spec: 17.500, elev: 6.8 },
    { text: 'GARAGE', sub: "15'0\" x 15'0\"", x: 41.750, y_spec: 7.500, elev: 6.8 },
    { text: 'STOREROOM', sub: "7'7\" x 7'10\"", x: 45.437, y_spec: 19.312, elev: 6.8 },
    { text: 'EAST BATH', sub: "7'0\" x 4'0\"", x: 37.750, y_spec: 21.250, elev: 6.8 },
    { text: 'WEST BATH', sub: "10'0\" x 4'0\"", x: 8.625, y_spec: 21.250, elev: 6.8 },
    { text: 'STAIRS BAY', sub: "3'9\" Flight", x: 32.000, y_spec: 8.620, elev: 6.8 },
    { text: 'PORCH', sub: "10'4\" x 7'6\"", x: 8.437, y_spec: 3.750, elev: 6.8 },
    { text: 'GARDEN', sub: "3'3\" x 15'9\"", x: 1.625, y_spec: 15.375, elev: 4.8 }
  ],

  // Quick Teleport Locations
  teleports: [
    { label: '🚪 Gate Landing', roomKey: 'gate', x: 1.6, y_spec: 3.75, elev: 0.0 },
    { label: '🌿 Garden', roomKey: 'garden', x: 1.6, y_spec: 15.0, elev: 0.0 },
    { label: '🏡 Entrance Porch (+1.5\')', roomKey: 'porch', x: 8.0, y_spec: 3.75, elev: 1.5 },
    { label: '🛏️ Bedroom (10\' x 11\')', roomKey: 'bedroom', x: 8.0, y_spec: 13.0, elev: 1.5 },
    { label: '🚿 West Washroom', roomKey: 'west_bath', x: 8.0, y_spec: 21.0, elev: 1.5 },
    { label: '🚪 South Hallway', roomKey: 'hallway', x: 20.0, y_spec: 2.0, elev: 1.5 },
    { label: '🍳 Kitchen (12\' x 7\')', roomKey: 'kitchen', x: 20.0, y_spec: 8.0, elev: 1.5 },
    { label: '🛋️ Central Lobby', roomKey: 'lobby', x: 20.0, y_spec: 17.0, elev: 1.5 },
    { label: '🪜 Stair West Passage', roomKey: 'stairs_passage', x: 28.0, y_spec: 2.0, elev: 1.5 },
    { label: '🪜 Foot of Stair Flight', roomKey: 'stairs_foot', x: 32.0, y_spec: 4.5, elev: 2.3 },
    { label: '🪜 Top Stair Landing (+12\')', roomKey: 'stairs_top', x: 32.0, y_spec: 14.0, elev: 12.0 },
    { label: '🚪 East Hallway', roomKey: 'east_hallway', x: 36.0, y_spec: 16.9, elev: 1.5 },
    { label: '🚿 East Washroom', roomKey: 'east_bath', x: 37.5, y_spec: 21.0, elev: 1.5 },
    { label: '📦 Storeroom', roomKey: 'storeroom', x: 45.0, y_spec: 19.0, elev: 1.5 },
    { label: '🚗 Garage (15\' x 15\')', roomKey: 'garage', x: 42.0, y_spec: 7.5, elev: 0.25 }
  ]
};
