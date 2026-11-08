/**
 * Interior Furniture Colliders
 * Carefully calibrated bounding boxes for major solid furniture items.
 *
 * Each box is specified in CAD feet [xmin, xmax, ymin, ymax, zmin, zmax].
 * Crucial Design Rules:
 * 1. Strategic insets (0.20 - 0.35 ft) on walking sides ensure pathways remain
 *    wide and spacious, completely preventing player snagging or getting stuck.
 * 2. Bed and seating colliders are paired with interactive furniture items
 *    so they are dynamically bypassed during sitting/sleeping transitions.
 */

export const INTERIOR_COLLIDERS = [
  // ── Ground Floor Bedroom ──
  {
    id: 'COL-BED-08',
    fitoutId: 'BED-08',
    name: 'Master Bedroom Wardrobe',
    floor: 'ground_floor',
    // Fitout: [3.750, 9.750, 7.875, 9.875, 1.500, 8.500]
    // Inset North front (9.875 -> 9.675) & East side (9.750 -> 9.550)
    box: [3.750, 9.550, 7.875, 9.675, 1.500, 8.500],
    type: 'interior_furniture'
  },
  {
    id: 'COL-BED-01',
    fitoutId: 'BED-01',
    name: 'Master Bedroom Queen Bed',
    floor: 'ground_floor',
    // Fitout: [5.375, 10.375, 12.375, 18.875, 1.500, 3.200]
    // Inset West (5.375 -> 5.700), East (10.375 -> 10.050), South foot (12.375 -> 12.750)
    box: [5.700, 10.050, 12.750, 18.875, 1.500, 3.200],
    type: 'interior_furniture'
  },

  // ── Ground Floor Kitchen ──
  {
    id: 'COL-KIT-01',
    fitoutId: 'KIT-01',
    name: 'Kitchen Base Cabinet South',
    floor: 'ground_floor',
    // Fitout: [14.000, 24.000, 4.375, 6.375, 1.500, 4.100]
    box: [14.000, 24.000, 4.375, 6.175, 1.500, 4.100],
    type: 'interior_furniture'
  },
  {
    id: 'COL-KIT-03',
    fitoutId: 'KIT-03',
    name: 'Kitchen Base Cabinet West',
    floor: 'ground_floor',
    // Fitout: [14.000, 16.000, 6.375, 11.375, 1.500, 4.100]
    box: [14.000, 15.800, 6.375, 11.375, 1.500, 4.100],
    type: 'interior_furniture'
  },
  {
    id: 'COL-KIT-11',
    fitoutId: 'KIT-11',
    name: 'Kitchen Refrigerator',
    floor: 'ground_floor',
    // Fitout: [24.200, 26.000, 4.375, 6.400, 1.500, 7.000]
    box: [24.350, 25.850, 4.375, 6.200, 1.500, 7.000],
    type: 'interior_furniture'
  },

  // ── Ground Floor Dining & Living ──
  {
    id: 'COL-LOB-09',
    fitoutId: 'LOB-09',
    name: 'Dining Table',
    floor: 'ground_floor',
    // Fitout: [17.500, 21.500, 12.500, 15.000, 1.500, 4.000]
    box: [17.750, 21.250, 12.750, 14.750, 1.500, 4.000],
    type: 'interior_furniture'
  },
  {
    id: 'COL-LOB-01',
    fitoutId: 'LOB-01',
    name: 'Living Sofa',
    floor: 'ground_floor',
    // Fitout: [16.250, 19.000, 19.000, 23.200, 1.500, 3.500]
    box: [16.450, 18.800, 19.300, 23.200, 1.500, 3.500],
    type: 'interior_furniture'
  },

  // ── First Floor Master Bedroom ──
  {
    id: 'COL-MB-08',
    fitoutId: 'MB-08',
    name: '1F Master Wardrobe',
    floor: 'first_floor',
    // Fitout: [3.350, 10.350, 11.750, 13.750, 12.000, 19.000]
    box: [3.550, 10.150, 11.750, 13.550, 12.000, 19.000],
    type: 'interior_furniture'
  },
  {
    id: 'COL-MB-01',
    fitoutId: 'MB-01',
    name: '1F Master King Bed',
    floor: 'first_floor',
    // Fitout: [4.000, 10.000, 16.750, 23.250, 12.000, 13.800]
    box: [4.350, 9.650, 17.100, 23.250, 12.000, 13.800],
    type: 'interior_furniture'
  },

  // ── First Floor Kitchen ──
  {
    id: 'COL-KF-01',
    fitoutId: 'KF-01',
    name: '1F Kitchen Base Cabinet West',
    floor: 'first_floor',
    // Fitout: [3.625, 5.625, 4.375, 11.375, 12.000, 14.600]
    box: [3.625, 5.425, 4.375, 11.375, 12.000, 14.600],
    type: 'interior_furniture'
  },
  {
    id: 'COL-KF-03',
    fitoutId: 'KF-03',
    name: '1F Kitchen Base Cabinet South',
    floor: 'first_floor',
    // Fitout: [3.625, 11.000, 4.375, 6.625, 12.000, 14.600]
    box: [3.625, 11.000, 4.375, 6.425, 12.000, 14.600],
    type: 'interior_furniture'
  },
  {
    id: 'COL-KF-11',
    fitoutId: 'KF-11',
    name: '1F Refrigerator',
    floor: 'first_floor',
    // Fitout: [5.900, 7.700, 9.375, 11.375, 12.000, 17.500]
    box: [6.050, 7.550, 9.575, 11.375, 12.000, 17.500],
    type: 'interior_furniture'
  },

  // ── First Floor Lobby Living ──
  {
    id: 'COL-LB-01',
    fitoutId: 'LB-01',
    name: '1F Lobby Sofa',
    floor: 'first_floor',
    // Fitout: [16.800, 19.550, 3.500, 10.000, 12.000, 14.800]
    box: [17.050, 19.300, 3.750, 9.750, 12.000, 14.800],
    type: 'interior_furniture'
  },

  // ── First Floor Child Bedroom ──
  {
    id: 'COL-CH-07',
    fitoutId: 'CH-07',
    name: '1F Child Wardrobe',
    floor: 'first_floor',
    // Fitout: [44.500, 48.500, 9.375, 11.375, 12.000, 19.000]
    box: [44.700, 48.500, 9.375, 11.175, 12.000, 19.000],
    type: 'interior_furniture'
  },
  {
    id: 'COL-CH-01',
    fitoutId: 'CH-01',
    name: '1F Child Bed',
    floor: 'first_floor',
    // Fitout: [42.750, 49.250, 13.500, 17.500, 12.000, 13.600]
    box: [43.100, 49.250, 13.750, 17.250, 12.000, 13.600],
    type: 'interior_furniture'
  }
];
