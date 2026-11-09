/**
 * Interior Furniture Colliders
 * Comprehensive physical collision bounds for all interior objects across
 * the ground and first floors (tables, chairs, cabinets, sinks, toilets,
 * beds, sofas, nightstands, desks, and vehicles).
 *
 * Each box is specified in canonical CAD feet [xmin, xmax, ymin, ymax, zmin, zmax].
 * - isStepable: true allows jumping and standing on top of the surface without getting ejected.
 * - Walkway insets (0.05 - 0.20 ft) on open sides ensure smooth navigation through corridors.
 */

export const INTERIOR_COLLIDERS = [
  // =========================================================================
  // 1. GROUND FLOOR · BEDROOM
  // =========================================================================
  {
    id: 'COL-BED-08',
    fitoutId: 'BED-08',
    name: 'Master Bedroom Wardrobe',
    floor: 'ground_floor',
    box: [3.750, 9.600, 7.875, 9.700, 1.500, 8.500],
    type: 'interior_furniture',
    isStepable: false // tall wardrobe
  },
  {
    id: 'COL-BED-01',
    fitoutId: 'BED-01',
    name: 'Master Bedroom Queen Bed',
    floor: 'ground_floor',
    // Inset slightly on walking sides; top surface at 3.20 ft allows jumping/standing on bed
    box: [5.500, 10.250, 12.500, 18.875, 1.500, 3.200],
    type: 'interior_furniture',
    isStepable: true
  },
  {
    id: 'COL-BED-06',
    fitoutId: 'BED-06',
    name: 'Bedside Nightstand West',
    floor: 'ground_floor',
    box: [3.750, 5.250, 17.375, 18.875, 1.500, 3.250],
    type: 'interior_furniture',
    isStepable: true
  },
  {
    id: 'COL-BED-07',
    fitoutId: 'BED-07',
    name: 'Bedside Nightstand East',
    floor: 'ground_floor',
    box: [10.500, 12.000, 17.375, 18.875, 1.500, 3.250],
    type: 'interior_furniture',
    isStepable: true
  },

  // =========================================================================
  // 2. GROUND FLOOR · WEST & EAST WASHROOMS (TOILETS & SINKS)
  // =========================================================================
  {
    id: 'COL-WW-01',
    fitoutId: 'WW-01',
    name: 'West Washroom Toilet',
    floor: 'ground_floor',
    box: [8.000, 9.250, 21.000, 23.250, 1.500, 2.900],
    type: 'interior_furniture',
    isStepable: true
  },
  {
    id: 'COL-WW-02',
    fitoutId: 'WW-02',
    name: 'West Washroom Basin & Pedestal',
    floor: 'ground_floor',
    box: [10.000, 11.750, 21.950, 23.250, 1.500, 4.250],
    type: 'interior_furniture',
    isStepable: true
  },
  {
    id: 'COL-EW-01',
    fitoutId: 'EW-01',
    name: 'East Washroom Toilet',
    floor: 'ground_floor',
    box: [36.750, 38.000, 21.000, 23.250, 1.500, 2.900],
    type: 'interior_furniture',
    isStepable: true
  },
  {
    id: 'COL-EW-02',
    fitoutId: 'EW-02',
    name: 'East Washroom Basin & Pedestal',
    floor: 'ground_floor',
    box: [39.400, 41.150, 21.950, 23.250, 1.500, 4.250],
    type: 'interior_furniture',
    isStepable: true
  },

  // =========================================================================
  // 3. GROUND FLOOR · KITCHEN (COUNTERS, SINKS, CUPBOARDS, FRIDGE)
  // =========================================================================
  {
    id: 'COL-KIT-01',
    fitoutId: 'KIT-01',
    name: 'Kitchen Base Cabinet South',
    floor: 'ground_floor',
    box: [14.000, 24.000, 4.375, 6.200, 1.500, 4.250],
    type: 'interior_furniture',
    isStepable: true
  },
  {
    id: 'COL-KIT-03',
    fitoutId: 'KIT-03',
    name: 'Kitchen Base Cabinet West',
    floor: 'ground_floor',
    box: [14.000, 15.850, 6.375, 11.375, 1.500, 4.250],
    type: 'interior_furniture',
    isStepable: true
  },
  {
    id: 'COL-KIT-05',
    fitoutId: 'KIT-05',
    name: 'Kitchen Stainless Steel Sink',
    floor: 'ground_floor',
    box: [16.500, 19.000, 4.500, 6.200, 1.500, 4.250],
    type: 'interior_furniture',
    isStepable: true
  },
  {
    id: 'COL-KIT-11',
    fitoutId: 'KIT-11',
    name: 'Kitchen Refrigerator',
    floor: 'ground_floor',
    box: [24.250, 25.950, 4.375, 6.300, 1.500, 7.000],
    type: 'interior_furniture',
    isStepable: false
  },
  {
    id: 'COL-KIT-08',
    fitoutId: 'KIT-08',
    name: 'Kitchen Wall Cabinet West',
    floor: 'ground_floor',
    box: [14.000, 15.000, 6.500, 11.000, 6.250, 8.500],
    type: 'interior_furniture',
    isStepable: false
  },
  {
    id: 'COL-KIT-09',
    fitoutId: 'KIT-09',
    name: 'Kitchen Wall Cupboard SW',
    floor: 'ground_floor',
    box: [14.000, 16.250, 4.375, 5.375, 6.250, 8.500],
    type: 'interior_furniture',
    isStepable: false
  },
  {
    id: 'COL-KIT-10',
    fitoutId: 'KIT-10',
    name: 'Kitchen Wall Cupboard SE',
    floor: 'ground_floor',
    box: [22.750, 24.000, 4.375, 5.375, 6.250, 8.500],
    type: 'interior_furniture',
    isStepable: false
  },

  // =========================================================================
  // 4. GROUND FLOOR · LIVING & DINING (SOFA, TABLES, CHAIRS, CONSOLE)
  // =========================================================================
  {
    id: 'COL-LOB-01',
    fitoutId: 'LOB-01',
    name: 'Living Room Sofa',
    floor: 'ground_floor',
    box: [16.350, 18.900, 19.100, 23.200, 1.500, 3.300],
    type: 'interior_furniture',
    isStepable: true
  },
  {
    id: 'COL-LOB-06',
    fitoutId: 'LOB-06',
    name: 'Living Centre Coffee Table',
    floor: 'ground_floor',
    box: [20.600, 22.400, 20.300, 22.100, 1.500, 2.800],
    type: 'interior_furniture',
    isStepable: true
  },
  {
    id: 'COL-LOB-07',
    fitoutId: 'LOB-07',
    name: 'TV Console Unit',
    floor: 'ground_floor',
    box: [24.800, 25.950, 19.150, 23.050, 1.500, 2.800],
    type: 'interior_furniture',
    isStepable: true
  },
  {
    id: 'COL-LOB-09',
    fitoutId: 'LOB-09',
    name: 'Dining Table',
    floor: 'ground_floor',
    box: [17.650, 21.350, 12.650, 14.850, 1.500, 4.000],
    type: 'interior_furniture',
    isStepable: true
  },
  {
    id: 'COL-LOB-14',
    fitoutId: 'LOB-14',
    name: 'Dining Chair North Left',
    floor: 'ground_floor',
    box: [17.850, 19.150, 14.600, 15.900, 1.500, 3.100],
    type: 'interior_furniture',
    isStepable: true
  },
  {
    id: 'COL-LOB-15',
    fitoutId: 'LOB-15',
    name: 'Dining Chair North Right',
    floor: 'ground_floor',
    box: [19.850, 21.150, 14.600, 15.900, 1.500, 3.100],
    type: 'interior_furniture',
    isStepable: true
  },
  {
    id: 'COL-LOB-16',
    fitoutId: 'LOB-16',
    name: 'Dining Chair South Left',
    floor: 'ground_floor',
    box: [17.850, 19.150, 11.850, 13.150, 1.500, 3.100],
    type: 'interior_furniture',
    isStepable: true
  },
  {
    id: 'COL-LOB-17',
    fitoutId: 'LOB-17',
    name: 'Dining Chair South Right',
    floor: 'ground_floor',
    box: [19.850, 21.150, 11.850, 13.150, 1.500, 3.100],
    type: 'interior_furniture',
    isStepable: true
  },

  // =========================================================================
  // 5. GROUND FLOOR · STOREROOM, PORCH & GARAGE CAR
  // =========================================================================
  {
    id: 'COL-STO-01',
    fitoutId: 'STO-01',
    name: 'Storeroom Steel Rack North',
    floor: 'ground_floor',
    box: [42.100, 49.200, 21.800, 23.250, 1.500, 7.000],
    type: 'interior_furniture',
    isStepable: false
  },
  {
    id: 'COL-STO-02',
    fitoutId: 'STO-02',
    name: 'Storeroom Steel Rack East',
    floor: 'ground_floor',
    box: [47.800, 49.250, 15.500, 21.700, 1.500, 7.000],
    type: 'interior_furniture',
    isStepable: false
  },
  {
    id: 'COL-POR-01',
    fitoutId: 'POR-01',
    name: 'South Hallway 3-Tier Almirah',
    floor: 'ground_floor',
    box: [8.000, 11.000, 0.000, 1.200, 1.500, 4.500],
    type: 'interior_furniture',
    isStepable: true
  },
  {
    id: 'COL-GAR-03',
    fitoutId: 'GAR-03',
    name: 'Garage 3-Tier Tool Chest',
    floor: 'ground_floor',
    box: [34.500, 37.000, 3.500, 6.500, 0.000, 3.200],
    type: 'interior_furniture',
    isStepable: true
  },
  {
    id: 'COL-GAR-01',
    fitoutId: 'GAR-01',
    name: 'Garage Hatchback Car',
    floor: 'ground_floor',
    box: [40.200, 45.550, 1.100, 13.400, 0.000, 4.500],
    type: 'interior_furniture',
    isStepable: true
  },

  // =========================================================================
  // 6. FIRST FLOOR · MASTER BEDROOM
  // =========================================================================
  {
    id: 'COL-MB-08',
    fitoutId: 'MB-08',
    name: '1F Master Wardrobe',
    floor: 'first_floor',
    box: [3.450, 10.250, 11.750, 13.650, 12.000, 19.000],
    type: 'interior_furniture',
    isStepable: false
  },
  {
    id: 'COL-MB-01',
    fitoutId: 'MB-01',
    name: '1F Master King Bed',
    floor: 'first_floor',
    box: [4.150, 9.850, 16.900, 23.250, 12.000, 13.800],
    type: 'interior_furniture',
    isStepable: true
  },
  {
    id: 'COL-MB-06',
    fitoutId: 'MB-06',
    name: '1F Master Bedside Nightstand West',
    floor: 'first_floor',
    box: [2.500, 4.000, 21.750, 23.250, 12.000, 13.750],
    type: 'interior_furniture',
    isStepable: true
  },
  {
    id: 'COL-MB-07',
    fitoutId: 'MB-07',
    name: '1F Master Bedside Nightstand East',
    floor: 'first_floor',
    box: [10.000, 11.500, 21.750, 23.250, 12.000, 13.750],
    type: 'interior_furniture',
    isStepable: true
  },
  {
    id: 'COL-MB-09',
    fitoutId: 'MB-09',
    name: '1F Master Dressing Table',
    floor: 'first_floor',
    box: [0.000, 1.450, 20.100, 23.200, 12.000, 14.500],
    type: 'interior_furniture',
    isStepable: true
  },

  // =========================================================================
  // 7. FIRST FLOOR · KITCHEN (CABINETS, SINKS, FRIDGE)
  // =========================================================================
  {
    id: 'COL-KF-01',
    fitoutId: 'KF-01',
    name: '1F Kitchen Base Cabinet West Leg',
    floor: 'first_floor',
    box: [3.625, 5.500, 4.375, 11.375, 12.000, 14.600],
    type: 'interior_furniture',
    isStepable: true
  },
  {
    id: 'COL-KF-03',
    fitoutId: 'KF-03',
    name: '1F Kitchen Base Cabinet South Leg',
    floor: 'first_floor',
    box: [3.625, 11.000, 4.375, 6.500, 12.000, 14.600],
    type: 'interior_furniture',
    isStepable: true
  },
  {
    id: 'COL-KF-05',
    fitoutId: 'KF-05',
    name: '1F Kitchen Double Sink Counter',
    floor: 'first_floor',
    box: [3.625, 5.500, 6.500, 9.000, 12.000, 14.600],
    type: 'interior_furniture',
    isStepable: true
  },
  {
    id: 'COL-KF-11',
    fitoutId: 'KF-11',
    name: '1F Refrigerator',
    floor: 'first_floor',
    box: [5.950, 7.650, 9.450, 11.375, 12.000, 17.500],
    type: 'interior_furniture',
    isStepable: false
  },
  {
    id: 'COL-KF-08',
    fitoutId: 'KF-08',
    name: '1F Kitchen Wall Cabinet South West',
    floor: 'first_floor',
    box: [3.625, 6.900, 4.375, 5.375, 18.250, 20.500],
    type: 'interior_furniture',
    isStepable: false
  },
  {
    id: 'COL-KF-09',
    fitoutId: 'KF-09',
    name: '1F Kitchen Wall Cabinet South East',
    floor: 'first_floor',
    box: [9.750, 11.000, 4.375, 5.375, 18.250, 20.500],
    type: 'interior_furniture',
    isStepable: false
  },
  {
    id: 'COL-KF-10',
    fitoutId: 'KF-10',
    name: '1F Kitchen Wall Cabinet West North',
    floor: 'first_floor',
    box: [3.625, 4.625, 10.000, 11.375, 18.250, 20.500],
    type: 'interior_furniture',
    isStepable: false
  },

  // =========================================================================
  // 8. FIRST FLOOR · LOBBY LIVING & DINING (SOFA, TABLES, 6 CHAIRS, TV UNIT)
  // =========================================================================
  {
    id: 'COL-LB-01',
    fitoutId: 'LB-01',
    name: '1F Lobby Sofa',
    floor: 'first_floor',
    box: [16.900, 19.450, 3.600, 9.900, 12.000, 14.800],
    type: 'interior_furniture',
    isStepable: true
  },
  {
    id: 'COL-LB-06',
    fitoutId: 'LB-06',
    name: '1F Lobby Coffee Table',
    floor: 'first_floor',
    box: [20.600, 22.900, 5.600, 7.400, 12.000, 13.400],
    type: 'interior_furniture',
    isStepable: true
  },
  {
    id: 'COL-LB-07',
    fitoutId: 'LB-07',
    name: '1F TV Console Unit',
    floor: 'first_floor',
    box: [24.800, 25.950, 4.100, 8.900, 12.000, 13.800],
    type: 'interior_furniture',
    isStepable: true
  },
  {
    id: 'COL-LB-09',
    fitoutId: 'LB-09',
    name: '1F Dining Table',
    floor: 'first_floor',
    box: [17.650, 22.350, 12.150, 14.850, 12.000, 14.500],
    type: 'interior_furniture',
    isStepable: true
  },
  {
    id: 'COL-LB-14',
    fitoutId: 'LB-14',
    name: '1F Dining Chair West End',
    floor: 'first_floor',
    box: [16.100, 17.600, 12.850, 14.150, 12.000, 13.600],
    type: 'interior_furniture',
    isStepable: true
  },
  {
    id: 'COL-LB-15',
    fitoutId: 'LB-15',
    name: '1F Dining Chair East End',
    floor: 'first_floor',
    box: [22.400, 23.900, 12.850, 14.150, 12.000, 13.600],
    type: 'interior_furniture',
    isStepable: true
  },
  {
    id: 'COL-LB-16',
    fitoutId: 'LB-16',
    name: '1F Dining Chair South Left',
    floor: 'first_floor',
    box: [18.100, 19.400, 10.850, 12.150, 12.000, 13.600],
    type: 'interior_furniture',
    isStepable: true
  },
  {
    id: 'COL-LB-17',
    fitoutId: 'LB-17',
    name: '1F Dining Chair South Right',
    floor: 'first_floor',
    box: [20.600, 21.900, 10.850, 12.150, 12.000, 13.600],
    type: 'interior_furniture',
    isStepable: true
  },
  {
    id: 'COL-LB-18',
    fitoutId: 'LB-18',
    name: '1F Dining Chair North Left',
    floor: 'first_floor',
    box: [18.100, 19.400, 14.850, 15.900, 12.000, 13.600],
    type: 'interior_furniture',
    isStepable: true
  },
  {
    id: 'COL-LB-19',
    fitoutId: 'LB-19',
    name: '1F Dining Chair North Right',
    floor: 'first_floor',
    box: [20.600, 21.900, 14.850, 15.900, 12.000, 13.600],
    type: 'interior_furniture',
    isStepable: true
  },

  // =========================================================================
  // 9. FIRST FLOOR · BATHROOMS & HANDWASH NICHE (TOILETS & SINKS)
  // =========================================================================
  {
    id: 'COL-HW-01',
    fitoutId: 'HW-01',
    name: '1F Handwash Vanity Base & Basin',
    floor: 'first_floor',
    box: [34.250, 36.150, 3.000, 6.750, 12.000, 14.750],
    type: 'interior_furniture',
    isStepable: true
  },
  {
    id: 'COL-HW-06',
    fitoutId: 'HW-06',
    name: '1F Washing Machine',
    floor: 'first_floor',
    box: [37.875, 39.875, 0.000, 2.000, 12.000, 15.000],
    type: 'interior_furniture',
    isStepable: true
  },
  {
    id: 'COL-NB-01',
    fitoutId: 'NB-01',
    name: '1F West Gallery Basin & Pedestal',
    floor: 'first_floor',
    box: [14.750, 16.500, 21.950, 23.250, 12.000, 14.750],
    type: 'interior_furniture',
    isStepable: true
  },
  {
    id: 'COL-B1-01',
    fitoutId: 'B1-01',
    name: '1F Bathroom 1 Toilet',
    floor: 'first_floor',
    box: [21.000, 22.250, 21.000, 23.250, 12.000, 13.400],
    type: 'interior_furniture',
    isStepable: true
  },
  {
    id: 'COL-B1-02',
    fitoutId: 'B1-02',
    name: '1F Bathroom 1 Basin & Pedestal',
    floor: 'first_floor',
    box: [18.000, 19.750, 21.950, 23.250, 12.000, 14.750],
    type: 'interior_furniture',
    isStepable: true
  },
  {
    id: 'COL-B2-01',
    fitoutId: 'B2-01',
    name: '1F Bathroom 2 Toilet',
    floor: 'first_floor',
    box: [35.400, 36.650, 21.000, 23.250, 12.000, 13.400],
    type: 'interior_furniture',
    isStepable: true
  },
  {
    id: 'COL-B2-02',
    fitoutId: 'B2-02',
    name: '1F Bathroom 2 Basin & Pedestal',
    floor: 'first_floor',
    box: [38.000, 39.750, 21.950, 23.250, 12.000, 14.750],
    type: 'interior_furniture',
    isStepable: true
  },

  // =========================================================================
  // 10. FIRST FLOOR · CHILD BEDROOM (WARDROBE, BED, DESK, CHAIR, NIGHTSTANDS)
  // =========================================================================
  {
    id: 'COL-CH-07',
    fitoutId: 'CH-07',
    name: '1F Child Wardrobe',
    floor: 'first_floor',
    box: [44.600, 48.500, 9.375, 11.250, 12.000, 19.000],
    type: 'interior_furniture',
    isStepable: false
  },
  {
    id: 'COL-CH-01',
    fitoutId: 'CH-01',
    name: '1F Child Single Bed',
    floor: 'first_floor',
    box: [42.950, 49.250, 13.600, 17.400, 12.000, 13.600],
    type: 'interior_furniture',
    isStepable: true
  },
  {
    id: 'COL-CH-05',
    fitoutId: 'CH-05',
    name: '1F Child Bedside Nightstand South',
    floor: 'first_floor',
    box: [47.750, 49.250, 12.000, 13.500, 12.000, 13.600],
    type: 'interior_furniture',
    isStepable: true
  },
  {
    id: 'COL-CH-06',
    fitoutId: 'CH-06',
    name: '1F Child Bedside Nightstand North',
    floor: 'first_floor',
    box: [47.750, 49.250, 17.500, 19.000, 12.000, 13.600],
    type: 'interior_furniture',
    isStepable: true
  },
  {
    id: 'COL-CH-08',
    fitoutId: 'CH-08',
    name: '1F Child Study Desk',
    floor: 'first_floor',
    box: [40.250, 42.150, 19.100, 22.900, 12.000, 14.500],
    type: 'interior_furniture',
    isStepable: true
  },
  {
    id: 'COL-CH-11',
    fitoutId: 'CH-11',
    name: '1F Child Study Chair',
    floor: 'first_floor',
    box: [42.350, 43.650, 20.100, 21.400, 12.000, 13.600],
    type: 'interior_furniture',
    isStepable: true
  },

  // =========================================================================
  // 11. FIRST FLOOR · MANDIR / PRAYER ROOM
  // =========================================================================
  {
    id: 'COL-MD-01',
    fitoutId: 'MD-01',
    name: '1F Mandir Marble Platform',
    floor: 'first_floor',
    box: [42.750, 46.750, 0.000, 2.000, 12.000, 14.500],
    type: 'interior_furniture',
    isStepable: true
  },
  {
    id: 'COL-MD-02',
    fitoutId: 'MD-02',
    name: '1F Mandir Wooden Temple Unit',
    floor: 'first_floor',
    box: [43.250, 46.250, 0.000, 1.500, 14.500, 19.000],
    type: 'interior_furniture',
    isStepable: false
  }
];
