/**
 * Architectural Materials & Color Palette
 * Sources:
 * - ground_floor_3d_simulation_specification.md (Section 13.10)
 * - ground_floor_3d_fitout_and_interior_specification.md (Section 7.2)
 */

export const PALETTE = {
  // --- Structural & Architectural Finishes ---
  wall_ext: {
    color: '#E6DCC6',
    roughness: 0.90,
    metalness: 0.0
  },
  wall_int: {
    color: '#F1E9D8',
    roughness: 0.85,
    metalness: 0.0
  },
  lintel: {
    color: '#F1E9D8',
    roughness: 0.85,
    metalness: 0.0
  },
  plinth: {
    color: '#BDB5A6',
    roughness: 0.65,
    metalness: 0.0
  },
  step: {
    color: '#262626',
    roughness: 0.35,
    metalness: 0.0
  },
  tread: {
    color: '#262626',
    roughness: 0.35,
    metalness: 0.0
  },
  ground: {
    color: '#7D8574',
    roughness: 0.60,
    metalness: 0.0
  },
  garage: {
    color: '#7D8574',
    roughness: 0.60,
    metalness: 0.0
  },
  slab: {
    color: '#FBFAF6',
    roughness: 0.90,
    metalness: 0.0
  },
  duct: {
    color: '#F1E9D8',
    roughness: 0.85,
    metalness: 0.0
  },
  duct_cap: {
    color: '#222222',
    roughness: 0.45,
    metalness: 0.6
  },
  grass: {
    color: '#4F7A32',
    roughness: 0.95,
    metalness: 0.0
  },

  // --- Doors & Woodwork ---
  'M-DOOR-TEAK': {
    color: '#8B5A2B',
    roughness: 0.55,
    metalness: 0.0
  },
  'M-DOOR-PVC': {
    color: '#ECE9DF',
    roughness: 0.40,
    metalness: 0.0
  },
  'M-FRAME-WOOD': {
    color: '#5A3A1E',
    roughness: 0.60,
    metalness: 0.0
  },

  // --- Windows, Glazing & Openings ---
  'M-ALU-FRAME': {
    color: '#9A9DA0',
    roughness: 0.35,
    metalness: 0.8
  },
  'M-GLASS': {
    color: '#E8F4F8',
    roughness: 0.02,
    metalness: 0.1,
    transparent: true,
    opacity: 0.18
  },
  'M-GLASS-CLEAR': {
    color: '#F4FAFC',
    roughness: 0.01,
    metalness: 0.05,
    transparent: true,
    opacity: 0.12
  },
  'M-GRILL-MS': {
    color: '#222222',
    roughness: 0.45,
    metalness: 0.6
  },

  // --- Gates ---
  'M-GATE-MS': {
    color: '#1F1F1F',
    roughness: 0.45,
    metalness: 0.6
  },

  // --- Furniture & Millwork ---
  'M-WOOD-DARK': {
    color: '#5C3B22',
    roughness: 0.50,
    metalness: 0.0
  },
  'M-LAMINATE-WALNUT': {
    color: '#6B4A32',
    roughness: 0.40,
    metalness: 0.0
  },
  'M-LAMINATE-GREY': {
    color: '#8C8F92',
    roughness: 0.40,
    metalness: 0.0
  },
  'M-FABRIC-GREY': {
    color: '#8A8C8E',
    roughness: 0.95,
    metalness: 0.0
  },
  'M-FABRIC-BEIGE': {
    color: '#D8CDB4',
    roughness: 0.95,
    metalness: 0.0
  },
  'M-FABRIC-WHITE': {
    color: '#F4F2EC',
    roughness: 0.95,
    metalness: 0.0
  },
  'M-FABRIC-CURTAIN': {
    color: '#7C8E73',
    roughness: 0.95,
    metalness: 0.0
  },

  // --- Sanitaryware & Metals ---
  'M-SANITARY-WHITE': {
    color: '#F7F7F5',
    roughness: 0.10,
    metalness: 0.0
  },
  'M-MIRROR': {
    color: '#D8E2E6',
    roughness: 0.02,
    metalness: 1.0
  },
  'M-CHROME': {
    color: '#C9CCCF',
    roughness: 0.15,
    metalness: 1.0
  },
  'M-STEEL-SS': {
    color: '#B8BCC0',
    roughness: 0.30,
    metalness: 0.9
  },
  'M-STEEL-GREY': {
    color: '#7B8084',
    roughness: 0.50,
    metalness: 0.5
  },
  'M-GLASS-BLACK': {
    color: '#101214',
    roughness: 0.08,
    metalness: 0.0,
    emissive: '#081220',
    emissiveIntensity: 0.3
  },
  'M-GRANITE-BLACK': {
    color: '#1B1B1B',
    roughness: 0.15,
    metalness: 0.0
  },
  'M-GRANITE-STEP': {
    color: '#262626',
    roughness: 0.35,
    metalness: 0.0
  },

  // --- Vehicles ---
  'M-CAR-SILVER': {
    color: '#B9BDC2',
    roughness: 0.25,
    metalness: 0.6
  },
  'M-SCOOTER-RED': {
    color: '#A42A24',
    roughness: 0.35,
    metalness: 0.3
  },
  'M-TYRE-BLACK': {
    color: '#1A1A1A',
    roughness: 0.85,
    metalness: 0.0
  },

  // --- Garden ---
  'M-CEMENT-PAINT': {
    color: '#E8E4DA',
    roughness: 0.85,
    metalness: 0.0
  },
  'M-TERRACOTTA': {
    color: '#B5683E',
    roughness: 0.80,
    metalness: 0.0
  },

  // --- Electrical & Lighting ---
  'M-LIGHT-PANEL': {
    color: '#FFFFFF',
    roughness: 0.20,
    metalness: 0.0,
    emissive: '#FFF5E4',
    emissiveIntensity: 0.95
  },
  'M-SWITCHBOARD': {
    color: '#F4F4F6',
    roughness: 0.30,
    metalness: 0.05
  },
  'M-DB-BOX': {
    color: '#4A5056',
    roughness: 0.40,
    metalness: 0.6
  },

  // --- First Floor Structural ---
  floor_plate: {
    color: '#C9C4B8',  // Same warm tone as ground slab
    roughness: 0.88,
    metalness: 0.0
  },
  fixture: {
    color: '#8C8F92',  // Mid grey — bare platform/counter block
    roughness: 0.55,
    metalness: 0.0
  },
  shaft: {
    color: '#c0392b',  // Red border marker (matches ground floor shaft)
    roughness: 0.70,
    metalness: 0.05
  },

  // --- Flooring & Tiles ---
  'M-VIT-FLOOR': {
    color: '#D9D2C5',
    roughness: 0.25,
    metalness: 0.0
  },
  'M-ANTISKID': {
    color: '#BDB5A6',
    roughness: 0.65,
    metalness: 0.0
  },
  'M-DADO-CERAMIC': {
    color: '#EEECE6',
    roughness: 0.15,
    metalness: 0.0
  },
  'M-KOTA': {
    color: '#7D8574',
    roughness: 0.60,
    metalness: 0.0
  },

  // --- First floor additional materials (spec section 7.2) ---
  'M-MARBLE-WHITE': {
    color: '#F2EFE8',
    roughness: 0.20,
    metalness: 0.0
  },
  'M-CARPET-RED': {
    color: '#8E2A2A',
    roughness: 0.95,
    metalness: 0.0
  },
  'M-BRASS': {
    color: '#B5902F',
    roughness: 0.30,
    metalness: 1.0
  },
  'M-EXT-PLASTER': {
    color: '#E6DCC6',
    roughness: 0.90,
    metalness: 0.0
  },
  'M-PAINT-INT': {
    color: '#F1E9D8',
    roughness: 0.85,
    metalness: 0.0
  },
  'M-GYM-RUBBER': {
    color: '#1C1D1F',
    roughness: 0.85,
    metalness: 0.05
  },
  'M-YOGA-MAT-PURPLE': {
    color: '#5C3877',
    roughness: 0.90,
    metalness: 0.0
  },
  'M-YOGA-MAT-TEAL': {
    color: '#2A7B88',
    roughness: 0.90,
    metalness: 0.0
  },
  'M-WATER-TANK': {
    color: '#1A1C1E',
    roughness: 0.40,
    metalness: 0.15
  },
  'M-PVC-PIPE': {
    color: '#E0E2E5',
    roughness: 0.35,
    metalness: 0.05
  },
  'M-POT-CERAMIC-WHITE': {
    color: '#F8F9FA',
    roughness: 0.25,
    metalness: 0.0
  },
  'M-POT-TERRACOTTA': {
    color: '#C86432',
    roughness: 0.75,
    metalness: 0.0
  },
  'M-POT-CERAMIC-TEAL': {
    color: '#1D7874',
    roughness: 0.20,
    metalness: 0.05
  },
  'M-POT-GREY-STONE': {
    color: '#5C5F64',
    roughness: 0.85,
    metalness: 0.0
  },
  'M-POT-GOLD-TRIM': {
    color: '#D4AF37',
    roughness: 0.30,
    metalness: 0.85
  },
  'M-POT-SOIL': {
    color: '#38281B',
    roughness: 0.95,
    metalness: 0.0
  },
  'M-PLANT-LUSH': {
    color: '#2D6A28',
    roughness: 0.65,
    metalness: 0.0
  },
  'M-PLANT-OLIVE': {
    color: '#4B5E2F',
    roughness: 0.70,
    metalness: 0.0
  },
  'M-FLOWER-ROSE': {
    color: '#E63946',
    roughness: 0.50,
    metalness: 0.0
  },
  'M-FLOWER-YELLOW': {
    color: '#FFB703',
    roughness: 0.45,
    metalness: 0.0
  },
  'M-FLOWER-VIOLET': {
    color: '#8338EC',
    roughness: 0.50,
    metalness: 0.0
  },
  'M-FLOWER-WHITE': {
    color: '#FDFBF7',
    roughness: 0.40,
    metalness: 0.0
  },

  // --- Edge Outlines ---
  edge_outline: {
    color: '#383632',
    opacity: 0.20
  }
};
