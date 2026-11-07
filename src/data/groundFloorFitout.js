/**
 * Ground Floor Interior Fitout Data
 * Source:
 * - ground_floor_3d_fitout_and_interior_specification.md
 * - Coordinate system: [xmin, xmax, ymin, ymax, zmin, zmax] in feet (Z-up)
 */

export const GROUND_FLOOR_FITOUT = [
  // ==========================================
  // 1. WINDOWS & VENTILATORS (Category: 'windows')
  // ==========================================
  {
    id: 'WD-1',
    name: 'South Hallway Window (4x4)',
    category: 'windows',
    type: 'window',
    box: [18.000, 22.000, -0.750, 0.000, 4.500, 8.500],
    material: 'M-GLASS'
  },
  {
    id: 'WD-2',
    name: 'Stairs Bay Window (4x4)',
    category: 'windows',
    type: 'window',
    box: [28.000, 32.000, -0.750, 0.000, 4.500, 8.500],
    material: 'M-GLASS'
  },
  {
    id: 'WD-3',
    name: 'Bedroom Window to Garden (4x4)',
    category: 'windows',
    type: 'window',
    box: [3.250, 3.625, 11.375, 15.375, 4.500, 8.500],
    material: 'M-GLASS'
  },
  {
    id: 'WD-4',
    name: 'Lobby Window North (4x4)',
    category: 'windows',
    type: 'window',
    box: [18.000, 22.000, 23.250, 24.000, 4.500, 8.500],
    material: 'M-GLASS'
  },
  {
    id: 'WD-5',
    name: 'Kitchen Window to South Hallway',
    category: 'windows',
    type: 'window',
    box: [13.625, 26.375, 4.000, 4.375, 5.000, 8.000],
    material: 'M-GLASS'
  },
  {
    id: 'VT-1',
    name: 'West Washroom Ventilator (2x1.5)',
    category: 'windows',
    type: 'ventilator',
    box: [3.250, 3.625, 20.250, 22.250, 7.000, 8.500],
    material: 'M-GLASS'
  },
  {
    id: 'VT-2',
    name: 'East Washroom Ventilator (2x1.5)',
    category: 'windows',
    type: 'ventilator',
    box: [37.000, 39.000, 23.250, 24.000, 7.000, 8.500],
    material: 'M-GLASS'
  },
  {
    id: 'VT-3',
    name: 'Storeroom Ventilator (2x1.5)',
    category: 'windows',
    type: 'ventilator',
    box: [44.500, 46.500, 23.250, 24.000, 7.000, 8.500],
    material: 'M-GLASS'
  },

  // ==========================================
  // 2. DOORS & FRAMES (Category: 'doors')
  // ==========================================
  // D1: Bedroom Door (Teak)
  {
    id: 'D1-FJ1',
    name: 'Bedroom Door Jamb 1',
    category: 'doors',
    type: 'door_frame',
    box: [10.625, 10.795, 7.500, 7.875, 1.500, 8.330],
    material: 'M-FRAME-WOOD'
  },
  {
    id: 'D1-FJ2',
    name: 'Bedroom Door Jamb 2',
    category: 'doors',
    type: 'door_frame',
    box: [13.455, 13.625, 7.500, 7.875, 1.500, 8.330],
    material: 'M-FRAME-WOOD'
  },
  {
    id: 'D1-FH',
    name: 'Bedroom Door Frame Head',
    category: 'doors',
    type: 'door_frame',
    box: [10.625, 13.625, 7.500, 7.875, 8.330, 8.500],
    material: 'M-FRAME-WOOD'
  },
  {
    id: 'D1-LEAF',
    name: 'Bedroom Door Leaf',
    category: 'doors',
    type: 'door_leaf',
    box: [10.815, 13.435, 7.630, 7.745, 1.540, 8.310],
    material: 'M-DOOR-TEAK'
  },

  // D2: West Washroom Door (PVC)
  {
    id: 'D2-FJ1',
    name: 'West WC Door Jamb 1',
    category: 'doors',
    type: 'door_frame',
    box: [13.625, 14.000, 19.250, 19.420, 1.500, 8.330],
    material: 'M-FRAME-WOOD'
  },
  {
    id: 'D2-FJ2',
    name: 'West WC Door Jamb 2',
    category: 'doors',
    type: 'door_frame',
    box: [13.625, 14.000, 21.580, 21.750, 1.500, 8.330],
    material: 'M-FRAME-WOOD'
  },
  {
    id: 'D2-FH',
    name: 'West WC Door Frame Head',
    category: 'doors',
    type: 'door_frame',
    box: [13.625, 14.000, 19.250, 21.750, 8.330, 8.500],
    material: 'M-FRAME-WOOD'
  },
  {
    id: 'D2-LEAF',
    name: 'West WC Door Leaf',
    category: 'doors',
    type: 'door_leaf',
    box: [13.755, 13.870, 19.440, 21.560, 1.540, 8.310],
    material: 'M-DOOR-PVC'
  },

  // D3: Kitchen Door (Teak)
  {
    id: 'D3-FJ1',
    name: 'Kitchen Door Jamb 1',
    category: 'doors',
    type: 'door_frame',
    box: [23.000, 23.170, 11.375, 11.750, 1.500, 8.330],
    material: 'M-FRAME-WOOD'
  },
  {
    id: 'D3-FJ2',
    name: 'Kitchen Door Jamb 2',
    category: 'doors',
    type: 'door_frame',
    box: [25.830, 26.000, 11.375, 11.750, 1.500, 8.330],
    material: 'M-FRAME-WOOD'
  },
  {
    id: 'D3-FH',
    name: 'Kitchen Door Frame Head',
    category: 'doors',
    type: 'door_frame',
    box: [23.000, 26.000, 11.375, 11.750, 8.330, 8.500],
    material: 'M-FRAME-WOOD'
  },
  {
    id: 'D3-LEAF',
    name: 'Kitchen Door Leaf',
    category: 'doors',
    type: 'door_leaf',
    box: [23.190, 25.810, 11.505, 11.620, 1.540, 8.310],
    material: 'M-DOOR-TEAK'
  },

  // D4: East Washroom Door (PVC)
  {
    id: 'D4-FJ1',
    name: 'East WC Door Jamb 1',
    category: 'doors',
    type: 'door_frame',
    box: [38.750, 38.920, 18.875, 19.250, 1.500, 8.330],
    material: 'M-FRAME-WOOD'
  },
  {
    id: 'D4-FJ2',
    name: 'East WC Door Jamb 2',
    category: 'doors',
    type: 'door_frame',
    box: [41.080, 41.250, 18.875, 19.250, 1.500, 8.330],
    material: 'M-FRAME-WOOD'
  },
  {
    id: 'D4-FH',
    name: 'East WC Door Frame Head',
    category: 'doors',
    type: 'door_frame',
    box: [38.750, 41.250, 18.875, 19.250, 8.330, 8.500],
    material: 'M-FRAME-WOOD'
  },
  {
    id: 'D4-LEAF',
    name: 'East WC Door Leaf',
    category: 'doors',
    type: 'door_leaf',
    box: [38.940, 41.060, 19.005, 19.120, 1.540, 8.310],
    material: 'M-DOOR-PVC'
  },

  // D5: Storeroom Door (Teak)
  {
    id: 'D5-FJ1',
    name: 'Storeroom Door Jamb 1',
    category: 'doors',
    type: 'door_frame',
    box: [41.250, 41.625, 15.375, 15.545, 1.500, 8.330],
    material: 'M-FRAME-WOOD'
  },
  {
    id: 'D5-FJ2',
    name: 'Storeroom Door Jamb 2',
    category: 'doors',
    type: 'door_frame',
    box: [41.250, 41.625, 18.705, 18.875, 1.500, 8.330],
    material: 'M-FRAME-WOOD'
  },
  {
    id: 'D5-FH',
    name: 'Storeroom Door Frame Head',
    category: 'doors',
    type: 'door_frame',
    box: [41.250, 41.625, 15.375, 18.875, 8.330, 8.500],
    material: 'M-FRAME-WOOD'
  },
  {
    id: 'D5-LEAF',
    name: 'Storeroom Door Leaf',
    category: 'doors',
    type: 'door_leaf',
    box: [41.380, 41.495, 15.565, 18.685, 1.540, 8.310],
    material: 'M-DOOR-TEAK'
  },

  // D6: Central Lobby East Door / Gate (Facing towards garage & hallway)
  {
    id: 'D6-FJ1',
    name: 'Lobby East Door Jamb South',
    category: 'doors',
    type: 'door_frame',
    box: [26.000, 26.375, 15.000, 15.170, 1.500, 8.330],
    material: 'M-FRAME-WOOD'
  },
  {
    id: 'D6-FJ2',
    name: 'Lobby East Door Jamb North',
    category: 'doors',
    type: 'door_frame',
    box: [26.000, 26.375, 18.705, 18.875, 1.500, 8.330],
    material: 'M-FRAME-WOOD'
  },
  {
    id: 'D6-FH',
    name: 'Lobby East Door Frame Head',
    category: 'doors',
    type: 'door_frame',
    box: [26.000, 26.375, 15.000, 18.875, 8.330, 8.500],
    material: 'M-FRAME-WOOD'
  },
  {
    id: 'D6-LEAF',
    name: 'Lobby East Door Leaf (Open)',
    category: 'doors',
    type: 'door_leaf',
    box: [25.860, 25.980, 18.875, 22.400, 1.540, 8.310],
    material: 'M-DOOR-TEAK'
  },
  {
    id: 'D6-HANDLE',
    name: 'Lobby East Door Handle',
    category: 'doors',
    type: 'handle',
    box: [25.750, 25.860, 22.000, 22.200, 4.300, 4.700],
    material: 'M-STEEL-SS'
  },

  // ==========================================
  // 3. BOUNDARY GATES (Category: 'gates')
  // ==========================================
  // G1: Pedestrian Gate (MS)
  {
    id: 'G1-L1',
    name: 'Pedestrian Gate Leaf 1',
    category: 'gates',
    type: 'gate',
    box: [-0.435, -0.315, 0.020, 3.730, 0.150, 5.650],
    material: 'M-GATE-MS'
  },
  {
    id: 'G1-L2',
    name: 'Pedestrian Gate Leaf 2',
    category: 'gates',
    type: 'gate',
    box: [-0.435, -0.315, 3.770, 7.480, 0.150, 5.650],
    material: 'M-GATE-MS'
  },
  // G2: Garage Main Gate (MS)
  {
    id: 'G2-L1',
    name: 'Garage Gate Leaf 1',
    category: 'gates',
    type: 'gate',
    box: [36.520, 42.855, -0.435, -0.315, 0.100, 7.900],
    material: 'M-GATE-MS'
  },
  {
    id: 'G2-L2',
    name: 'Garage Gate Leaf 2',
    category: 'gates',
    type: 'gate',
    box: [42.895, 49.230, -0.435, -0.315, 0.100, 7.900],
    material: 'M-GATE-MS'
  },

  // ==========================================
  // 4. BEDROOM FURNITURE (Category: 'furniture')
  // ==========================================
  {
    id: 'BED-01',
    name: 'Queen Bed Frame (5x6.5)',
    category: 'furniture',
    type: 'furniture',
    box: [5.375, 10.375, 12.375, 18.875, 1.500, 2.500],
    material: 'M-WOOD-DARK'
  },
  {
    id: 'BED-02',
    name: 'Bed Mattress',
    category: 'furniture',
    type: 'furniture',
    box: [5.450, 10.300, 12.450, 18.800, 2.500, 3.200],
    material: 'M-FABRIC-BEIGE'
  },
  {
    id: 'BED-03',
    name: 'Headboard (5ft wide)',
    category: 'furniture',
    type: 'furniture',
    box: [5.375, 10.375, 18.625, 18.875, 1.500, 5.000],
    material: 'M-WOOD-DARK'
  },
  {
    id: 'BED-04',
    name: 'Pillow West',
    category: 'furniture',
    type: 'furniture',
    box: [5.800, 7.800, 17.900, 18.600, 3.200, 3.550],
    material: 'M-FABRIC-WHITE'
  },
  {
    id: 'BED-05',
    name: 'Pillow East',
    category: 'furniture',
    type: 'furniture',
    box: [8.000, 10.000, 17.900, 18.600, 3.200, 3.550],
    material: 'M-FABRIC-WHITE'
  },
  {
    id: 'BED-06',
    name: 'Bedside Table West',
    category: 'furniture',
    type: 'furniture',
    box: [3.750, 5.250, 17.375, 18.875, 1.500, 3.250],
    material: 'M-WOOD-DARK'
  },
  {
    id: 'BED-07',
    name: 'Bedside Table East',
    category: 'furniture',
    type: 'furniture',
    box: [10.500, 12.000, 17.375, 18.875, 1.500, 3.250],
    material: 'M-WOOD-DARK'
  },
  {
    id: 'BED-08',
    name: 'Wardrobe (6ft wide x 7ft high)',
    category: 'furniture',
    type: 'furniture',
    box: [3.750, 9.750, 7.875, 9.875, 1.500, 8.500],
    material: 'M-LAMINATE-WALNUT'
  },
  {
    id: 'BED-09',
    name: 'Curtain on Garden Window',
    category: 'furniture',
    type: 'furniture',
    box: [3.650, 3.800, 10.875, 15.875, 1.600, 8.800],
    material: 'M-FABRIC-CURTAIN'
  },

  // ==========================================
  // 5. WEST WASHROOM FIXTURES (Category: 'sanitary')
  // ==========================================
  {
    id: 'WW-01',
    name: 'West WC (Water Closet)',
    category: 'furniture',
    type: 'sanitary',
    box: [8.000, 9.250, 21.000, 23.250, 1.500, 2.900],
    material: 'M-SANITARY-WHITE'
  },
  {
    id: 'WW-02',
    name: 'West Wash Basin Bowl',
    category: 'furniture',
    type: 'sanitary',
    box: [10.000, 11.750, 21.950, 23.250, 3.500, 4.250],
    material: 'M-SANITARY-WHITE'
  },
  {
    id: 'WW-03',
    name: 'West Basin Pedestal',
    category: 'furniture',
    type: 'sanitary',
    box: [10.500, 11.250, 22.500, 23.000, 1.500, 3.500],
    material: 'M-SANITARY-WHITE'
  },
  {
    id: 'WW-04',
    name: 'West Bathroom Mirror',
    category: 'furniture',
    type: 'sanitary',
    box: [10.100, 11.650, 23.150, 23.250, 5.500, 7.500],
    material: 'M-MIRROR'
  },
  {
    id: 'WW-05',
    name: 'West Electric Geyser 15L',
    category: 'furniture',
    type: 'sanitary',
    box: [8.100, 9.000, 22.350, 23.250, 7.000, 8.400],
    material: 'M-SANITARY-WHITE'
  },
  {
    id: 'WW-06',
    name: 'West Shower Head',
    category: 'furniture',
    type: 'sanitary',
    box: [5.050, 5.550, 22.300, 22.800, 7.850, 7.900],
    material: 'M-CHROME'
  },
  {
    id: 'WW-09',
    name: 'West Bathroom Floor Drain',
    category: 'furniture',
    type: 'sanitary',
    box: [5.100, 5.500, 21.050, 21.450, 1.500, 1.520],
    material: 'M-STEEL-SS'
  },

  // ==========================================
  // 6. EAST WASHROOM FIXTURES (Category: 'sanitary')
  // ==========================================
  {
    id: 'EW-01',
    name: 'East WC (Water Closet)',
    category: 'furniture',
    type: 'sanitary',
    box: [36.750, 38.000, 21.000, 23.250, 1.500, 2.900],
    material: 'M-SANITARY-WHITE'
  },
  {
    id: 'EW-02',
    name: 'East Wash Basin Bowl',
    category: 'furniture',
    type: 'sanitary',
    box: [39.400, 41.150, 21.950, 23.250, 3.500, 4.250],
    material: 'M-SANITARY-WHITE'
  },
  {
    id: 'EW-03',
    name: 'East Basin Pedestal',
    category: 'furniture',
    type: 'sanitary',
    box: [39.900, 40.650, 22.500, 23.000, 1.500, 3.500],
    material: 'M-SANITARY-WHITE'
  },
  {
    id: 'EW-04',
    name: 'East Bathroom Mirror',
    category: 'furniture',
    type: 'sanitary',
    box: [39.500, 41.000, 23.150, 23.250, 5.500, 7.500],
    material: 'M-MIRROR'
  },
  {
    id: 'EW-05',
    name: 'East Electric Geyser 15L',
    category: 'furniture',
    type: 'sanitary',
    box: [40.350, 41.250, 22.200, 23.100, 7.000, 8.400],
    material: 'M-SANITARY-WHITE'
  },
  {
    id: 'EW-06',
    name: 'East Shower Head',
    category: 'furniture',
    type: 'sanitary',
    box: [35.050, 35.550, 22.300, 22.800, 7.850, 7.900],
    material: 'M-CHROME'
  },
  {
    id: 'EW-09',
    name: 'East Bathroom Floor Drain',
    category: 'furniture',
    type: 'sanitary',
    box: [35.100, 35.500, 21.000, 21.400, 1.500, 1.520],
    material: 'M-STEEL-SS'
  },

  // ==========================================
  // 7. KITCHEN CABINETS & APPLIANCES (Category: 'furniture')
  // ==========================================
  {
    id: 'KIT-01',
    name: 'Kitchen Base Cabinet South',
    category: 'furniture',
    type: 'kitchen',
    box: [14.000, 24.000, 4.375, 6.375, 1.500, 4.100],
    material: 'M-LAMINATE-GREY'
  },
  {
    id: 'KIT-02',
    name: 'Kitchen Granite Counter South',
    category: 'furniture',
    type: 'kitchen',
    box: [14.000, 24.000, 4.375, 6.450, 4.100, 4.250],
    material: 'M-GRANITE-BLACK'
  },
  {
    id: 'KIT-03',
    name: 'Kitchen Base Cabinet West',
    category: 'furniture',
    type: 'kitchen',
    box: [14.000, 16.000, 6.375, 11.375, 1.500, 4.100],
    material: 'M-LAMINATE-GREY'
  },
  {
    id: 'KIT-04',
    name: 'Kitchen Granite Counter West',
    category: 'furniture',
    type: 'kitchen',
    box: [14.000, 16.075, 6.375, 11.375, 4.100, 4.250],
    material: 'M-GRANITE-BLACK'
  },
  {
    id: 'KIT-05',
    name: 'Kitchen Stainless Steel Sink',
    category: 'furniture',
    type: 'kitchen',
    box: [16.500, 19.000, 4.600, 6.200, 3.550, 4.250],
    material: 'M-STEEL-SS'
  },
  {
    id: 'KIT-06',
    name: 'Kitchen Sink Tap',
    category: 'furniture',
    type: 'kitchen',
    box: [17.600, 17.900, 4.400, 4.900, 4.250, 5.000],
    material: 'M-CHROME'
  },
  {
    id: 'KIT-07',
    name: 'Kitchen 4-Burner Hob',
    category: 'furniture',
    type: 'kitchen',
    box: [20.250, 22.250, 4.600, 6.200, 4.250, 4.350],
    material: 'M-GLASS-BLACK'
  },
  {
    id: 'KIT-08',
    name: 'Kitchen Wall Cabinet West',
    category: 'furniture',
    type: 'kitchen',
    box: [14.000, 15.000, 6.500, 11.000, 6.250, 8.500],
    material: 'M-LAMINATE-GREY'
  },
  {
    id: 'KIT-09',
    name: 'Kitchen Wall Cabinet South West',
    category: 'furniture',
    type: 'kitchen',
    box: [14.000, 16.250, 4.375, 5.375, 6.250, 8.500],
    material: 'M-LAMINATE-GREY'
  },
  {
    id: 'KIT-10',
    name: 'Kitchen Wall Cabinet South East',
    category: 'furniture',
    type: 'kitchen',
    box: [22.750, 24.000, 4.375, 5.375, 6.250, 8.500],
    material: 'M-LAMINATE-GREY'
  },
  {
    id: 'KIT-11',
    name: 'Refrigerator (Single Door)',
    category: 'furniture',
    type: 'kitchen',
    box: [24.200, 26.000, 4.375, 6.400, 1.500, 7.000],
    material: 'M-STEEL-SS'
  },

  // ==========================================
  // 8. LOBBY LIVING & DINING (Category: 'furniture')
  // ==========================================
  {
    id: 'LOB-01',
    name: 'Living Sofa Base',
    category: 'furniture',
    type: 'furniture',
    box: [16.250, 19.000, 19.000, 23.200, 1.500, 2.000],
    material: 'M-FABRIC-GREY'
  },
  {
    id: 'LOB-02',
    name: 'Living Sofa Cushions',
    category: 'furniture',
    type: 'furniture',
    box: [16.950, 19.000, 19.500, 22.700, 2.000, 2.500],
    material: 'M-FABRIC-GREY'
  },
  {
    id: 'LOB-03',
    name: 'Living Sofa Backrest',
    category: 'furniture',
    type: 'furniture',
    box: [16.250, 17.000, 19.000, 23.200, 2.000, 3.300],
    material: 'M-FABRIC-GREY'
  },
  {
    id: 'LOB-04',
    name: 'Living Sofa Arm South',
    category: 'furniture',
    type: 'furniture',
    box: [16.950, 19.000, 19.000, 19.500, 2.000, 2.700],
    material: 'M-FABRIC-GREY'
  },
  {
    id: 'LOB-05',
    name: 'Living Sofa Arm North',
    category: 'furniture',
    type: 'furniture',
    box: [16.950, 19.000, 22.700, 23.200, 2.000, 2.700],
    material: 'M-FABRIC-GREY'
  },
  {
    id: 'LOB-06',
    name: 'Living Centre Coffee Table',
    category: 'furniture',
    type: 'furniture',
    box: [20.500, 22.500, 20.200, 22.200, 1.500, 2.800],
    material: 'M-WOOD-DARK'
  },
  {
    id: 'LOB-07',
    name: 'TV Console Unit',
    category: 'furniture',
    type: 'furniture',
    box: [24.750, 26.000, 19.100, 23.100, 1.500, 2.800],
    material: 'M-LAMINATE-WALNUT'
  },
  {
    id: 'LOB-08',
    name: '55-inch Wall Mounted TV',
    category: 'furniture',
    type: 'furniture',
    box: [25.850, 26.000, 19.150, 23.050, 3.850, 6.150],
    material: 'M-GLASS-BLACK'
  },
  {
    id: 'LOB-09',
    name: 'Dining Table Top (4x2.5)',
    category: 'furniture',
    type: 'furniture',
    box: [17.500, 21.500, 12.500, 15.000, 3.800, 4.000],
    material: 'M-WOOD-DARK'
  },
  {
    id: 'LOB-10',
    name: 'Dining Table Leg NW',
    category: 'furniture',
    type: 'furniture',
    box: [17.500, 17.700, 12.500, 12.700, 1.500, 3.800],
    material: 'M-WOOD-DARK'
  },
  {
    id: 'LOB-11',
    name: 'Dining Table Leg NE',
    category: 'furniture',
    type: 'furniture',
    box: [21.300, 21.500, 12.500, 12.700, 1.500, 3.800],
    material: 'M-WOOD-DARK'
  },
  {
    id: 'LOB-12',
    name: 'Dining Table Leg SW',
    category: 'furniture',
    type: 'furniture',
    box: [17.500, 17.700, 14.800, 15.000, 1.500, 3.800],
    material: 'M-WOOD-DARK'
  },
  {
    id: 'LOB-13',
    name: 'Dining Table Leg SE',
    category: 'furniture',
    type: 'furniture',
    box: [21.300, 21.500, 14.800, 15.000, 1.500, 3.800],
    material: 'M-WOOD-DARK'
  },
  {
    id: 'LOB-14',
    name: 'Dining Chair North Left',
    category: 'furniture',
    type: 'furniture',
    box: [17.750, 19.250, 14.500, 16.000, 1.500, 3.100],
    material: 'M-WOOD-DARK'
  },
  {
    id: 'LOB-15',
    name: 'Dining Chair North Right',
    category: 'furniture',
    type: 'furniture',
    box: [19.750, 21.250, 14.500, 16.000, 1.500, 3.100],
    material: 'M-WOOD-DARK'
  },
  {
    id: 'LOB-16',
    name: 'Dining Chair South Left',
    category: 'furniture',
    type: 'furniture',
    box: [17.750, 19.250, 11.750, 13.250, 1.500, 3.100],
    material: 'M-WOOD-DARK'
  },
  {
    id: 'LOB-17',
    name: 'Dining Chair South Right',
    category: 'furniture',
    type: 'furniture',
    box: [19.750, 21.250, 11.750, 13.250, 1.500, 3.100],
    material: 'M-WOOD-DARK'
  },

  // ==========================================
  // 9. STOREROOM STORAGE (Category: 'furniture')
  // ==========================================
  {
    id: 'STO-01',
    name: 'Storeroom Steel Rack North (7.25ft)',
    category: 'furniture',
    type: 'furniture',
    box: [42.000, 49.250, 21.750, 23.250, 1.500, 7.000],
    material: 'M-STEEL-GREY'
  },
  {
    id: 'STO-02',
    name: 'Storeroom Steel Rack East (6.375ft)',
    category: 'furniture',
    type: 'furniture',
    box: [47.750, 49.250, 15.375, 21.750, 1.500, 7.000],
    material: 'M-STEEL-GREY'
  },

  // ==========================================
  // 10. ENTRANCE PORCH (Category: 'furniture')
  // ==========================================
  {
    id: 'POR-01',
    name: 'Entrance Porch Shoe Rack',
    category: 'furniture',
    type: 'furniture',
    box: [8.000, 11.000, 0.000, 1.000, 1.500, 4.500],
    material: 'M-WOOD-DARK'
  },

  // ==========================================
  // 11. GARAGE VEHICLES (Category: 'vehicles')
  // ==========================================
  {
    id: 'GAR-01',
    name: 'Hatchback Car Body Lower',
    category: 'vehicles',
    type: 'vehicle',
    box: [40.125, 45.625, 1.000, 13.500, 0.750, 2.700],
    material: 'M-CAR-SILVER'
  },
  {
    id: 'GAR-02',
    name: 'Hatchback Car Cabin',
    category: 'vehicles',
    type: 'vehicle',
    box: [40.600, 45.150, 3.500, 10.000, 2.700, 4.700],
    material: 'M-CAR-SILVER'
  },
  {
    id: 'GAR-04',
    name: 'Car Wheel Front-Left',
    category: 'vehicles',
    type: 'vehicle_wheel',
    box: [40.150, 40.850, 2.000, 4.000, 0.100, 2.100],
    material: 'M-TYRE-BLACK'
  },
  {
    id: 'GAR-05',
    name: 'Car Wheel Front-Right',
    category: 'vehicles',
    type: 'vehicle_wheel',
    box: [44.900, 45.600, 2.000, 4.000, 0.100, 2.100],
    material: 'M-TYRE-BLACK'
  },
  {
    id: 'GAR-06',
    name: 'Car Wheel Rear-Left',
    category: 'vehicles',
    type: 'vehicle_wheel',
    box: [40.150, 40.850, 10.500, 12.500, 0.383, 2.383],
    material: 'M-TYRE-BLACK'
  },
  {
    id: 'GAR-07',
    name: 'Car Wheel Rear-Right',
    category: 'vehicles',
    type: 'vehicle_wheel',
    box: [44.900, 45.600, 10.500, 12.500, 0.383, 2.383],
    material: 'M-TYRE-BLACK'
  },
  {
    id: 'GAR-03',
    name: 'Scooter (Two-Wheeler)',
    category: 'vehicles',
    type: 'vehicle',
    box: [35.000, 37.000, 2.000, 8.000, 0.200, 3.400],
    material: 'M-SCOOTER-RED'
  },

  // ==========================================
  // 12. GARDEN PLANTERS (Category: 'garden')
  // ==========================================
  {
    id: 'GRD-01',
    name: 'Traditional Tulsi Planter',
    category: 'garden',
    type: 'planter',
    box: [0.900, 2.400, 9.600, 11.100, 0.000, 3.500],
    material: 'M-CEMENT-PAINT'
  },
  {
    id: 'GRD-02',
    name: 'Garden Potted Plant 1',
    category: 'garden',
    type: 'pot',
    box: [1.200, 2.000, 16.000, 16.800, 0.000, 2.500],
    material: 'M-TERRACOTTA'
  },
  {
    id: 'GRD-03',
    name: 'Garden Potted Plant 2',
    category: 'garden',
    type: 'pot',
    box: [1.200, 2.000, 18.300, 19.100, 0.000, 2.500],
    material: 'M-TERRACOTTA'
  },
  {
    id: 'GRD-04',
    name: 'Garden Potted Plant 3',
    category: 'garden',
    type: 'pot',
    box: [1.200, 2.000, 20.600, 21.400, 0.000, 2.500],
    material: 'M-TERRACOTTA'
  },

  // ==========================================
  // 13. SWITCHBOARDS & DISTRIBUTION BOARD (Category: 'electrical')
  // ==========================================
  {
    id: 'SB-BED',
    name: 'Bedroom Switchboard',
    category: 'electrical',
    type: 'switchboard',
    box: [9.850, 10.250, 7.875, 7.975, 5.300, 5.700],
    material: 'M-SWITCHBOARD'
  },
  {
    id: 'SB-WW',
    name: 'West Washroom Switchboard',
    category: 'electrical',
    type: 'switchboard',
    box: [13.525, 13.625, 22.000, 22.400, 5.300, 5.700],
    material: 'M-SWITCHBOARD'
  },
  {
    id: 'SB-KIT',
    name: 'Kitchen Switchboard',
    category: 'electrical',
    type: 'switchboard',
    box: [22.400, 22.800, 11.275, 11.375, 5.300, 5.700],
    material: 'M-SWITCHBOARD'
  },
  {
    id: 'SB-LOB',
    name: 'Lobby Switchboard',
    category: 'electrical',
    type: 'switchboard',
    box: [22.400, 22.800, 11.750, 11.850, 5.300, 5.700],
    material: 'M-SWITCHBOARD'
  },
  {
    id: 'SB-EW',
    name: 'East Washroom Switchboard',
    category: 'electrical',
    type: 'switchboard',
    box: [38.000, 38.400, 19.250, 19.350, 5.300, 5.700],
    material: 'M-SWITCHBOARD'
  },
  {
    id: 'SB-STO',
    name: 'Storeroom Switchboard',
    category: 'electrical',
    type: 'switchboard',
    box: [41.625, 41.725, 19.200, 19.600, 5.300, 5.700],
    material: 'M-SWITCHBOARD'
  },
  {
    id: 'SB-GAR',
    name: 'Garage Switchboard',
    category: 'electrical',
    type: 'switchboard',
    box: [34.250, 34.350, 10.000, 10.400, 4.500, 4.900],
    material: 'M-SWITCHBOARD'
  },
  {
    id: 'SB-HALL',
    name: 'South Hallway Switchboard',
    category: 'electrical',
    type: 'switchboard',
    box: [24.000, 24.400, 3.900, 4.000, 5.300, 5.700],
    material: 'M-SWITCHBOARD'
  },
  {
    id: 'MAIN-DB',
    name: 'Main Electrical Distribution Board',
    category: 'electrical',
    type: 'db_box',
    box: [35.000, 35.800, 18.775, 18.875, 5.000, 6.000],
    material: 'M-DB-BOX'
  }
];

// ==========================================
// 14. CEILING FANS SPECIFICATION
// ==========================================
export const FITOUT_FANS = [
  { id: 'FN-1', name: 'Bedroom Ceiling Fan', room: 'Bedroom', cx: 8.625, cy_spec: 13.375 },
  { id: 'FN-2', name: 'Lobby Dining Fan', room: 'Lobby Dining', cx: 19.500, cy_spec: 14.000 },
  { id: 'FN-3', name: 'Lobby Sofa Fan', room: 'Lobby Sofa', cx: 20.500, cy_spec: 21.000 }
];

// ==========================================
// 15. CEILING LIGHTS SPECIFICATION (Z: 11.44 to 11.50)
// ==========================================
export const FITOUT_LIGHTS = [
  { id: 'LT-1', name: 'Bedroom LED Panel', room: 'Bedroom', cx: 8.625, cy_spec: 16.500, sizeX: 2.0, sizeY: 2.0 },
  { id: 'LT-2', name: 'Lobby West LED Panel', room: 'Lobby', cx: 17.000, cy_spec: 17.000, sizeX: 2.0, sizeY: 2.0 },
  { id: 'LT-3', name: 'Lobby East LED Panel', room: 'Lobby', cx: 23.000, cy_spec: 17.000, sizeX: 2.0, sizeY: 2.0 },
  { id: 'LT-4', name: 'Kitchen LED Panel', room: 'Kitchen', cx: 20.000, cy_spec: 7.875, sizeX: 2.0, sizeY: 2.0 },
  { id: 'LT-5', name: 'West Washroom LED Panel', room: 'West WC', cx: 8.625, cy_spec: 21.250, sizeX: 1.0, sizeY: 1.0 },
  { id: 'LT-6', name: 'East Washroom LED Panel', room: 'East WC', cx: 37.750, cy_spec: 21.250, sizeX: 1.0, sizeY: 1.0 },
  { id: 'LT-7', name: 'Storeroom LED Panel', room: 'Storeroom', cx: 45.400, cy_spec: 19.300, sizeX: 2.0, sizeY: 2.0 },
  { id: 'LT-8', name: 'Garage LED Batten', room: 'Garage', cx: 42.000, cy_spec: 7.500, sizeX: 4.0, sizeY: 0.3 },
  { id: 'LT-9', name: 'South Hallway LED Panel', room: 'South Hallway', cx: 20.000, cy_spec: 2.000, sizeX: 2.0, sizeY: 2.0 },
  { id: 'LT-10', name: 'Stairs Foot LED Panel', room: 'Stairs', cx: 30.000, cy_spec: 2.000, sizeX: 2.0, sizeY: 2.0 },
  { id: 'LT-11', name: 'Porch LED Panel', room: 'Porch', cx: 8.000, cy_spec: 3.750, sizeX: 2.0, sizeY: 2.0 },
  { id: 'LT-12', name: 'East Hallway West LED Panel', room: 'East Hallway', cx: 31.000, cy_spec: 16.900, sizeX: 2.0, sizeY: 2.0 },
  { id: 'LT-13', name: 'East Hallway East LED Panel', room: 'East Hallway', cx: 38.000, cy_spec: 16.900, sizeX: 2.0, sizeY: 2.0 }
];
