import * as THREE from 'three';
import { WORLD_SCALE } from '../config/constants.js';

export const STORAGE_SPECS = {
  wardrobes: [
    {
      id: 'WARDROBE-GF',
      fitoutId: 'BED-08',
      name: 'Master Bedroom Wardrobe',
      floor: 'ground_floor',
      floorElev: 1.50,
      box: [3.750, 9.750, 7.875, 9.875, 1.500, 8.500],
      faceDir: 'North' // back against South wall, doors face North (CAD +Y -> Three.js -Z)
    },
    {
      id: 'WARDROBE-1F-MASTER',
      fitoutId: 'MB-08',
      name: 'Master Bedroom Wardrobe',
      floor: 'first_floor',
      floorElev: 12.00,
      box: [3.350, 10.350, 11.750, 13.750, 12.000, 19.000],
      faceDir: 'North'
    },
    {
      id: 'WARDROBE-1F-CHILD',
      fitoutId: 'CH-07',
      name: 'Child Bedroom Wardrobe',
      floor: 'first_floor',
      floorElev: 12.00,
      box: [44.500, 48.500, 9.375, 11.375, 12.000, 19.000],
      faceDir: 'North'
    }
  ],

  cupboards: [
    // Upper Wall Cupboards (Ground Floor Kitchen)
    {
      id: 'CUPBOARD-GF-KITCHEN-SW',
      fitoutId: 'KIT-09',
      name: 'Kitchen Upper Cupboard SW',
      floor: 'ground_floor',
      floorElev: 1.50,
      box: [14.000, 16.250, 4.375, 5.375, 6.250, 8.500],
      faceDir: 'North',
      isDoubleDoor: false,
      isBase: false
    },
    {
      id: 'CUPBOARD-GF-KITCHEN-SE',
      fitoutId: 'KIT-10',
      name: 'Kitchen Upper Cupboard SE',
      floor: 'ground_floor',
      floorElev: 1.50,
      box: [22.750, 24.000, 4.375, 5.375, 6.250, 8.500],
      faceDir: 'North',
      isDoubleDoor: false,
      isBase: false
    },

    // Base Cupboards Below Platform (Ground Floor Kitchen)
    {
      id: 'CUPBOARD-GF-KIT-SINK',
      name: 'Under-Sink Double Cupboard',
      floor: 'ground_floor',
      floorElev: 1.50,
      box: [16.550, 19.450, 4.400, 6.350, 1.500, 4.080],
      faceDir: 'North',
      isDoubleDoor: true,
      isBase: true
    },
    {
      id: 'CUPBOARD-GF-KIT-PANTRY',
      name: 'Kitchen Base Pantry Cupboard',
      floor: 'ground_floor',
      floorElev: 1.50,
      box: [19.500, 23.950, 4.400, 6.350, 1.500, 4.080],
      faceDir: 'North',
      isDoubleDoor: true,
      isBase: true
    },
    {
      id: 'CUPBOARD-GF-KIT-WEST',
      name: 'Kitchen West Base Cupboard',
      floor: 'ground_floor',
      floorElev: 1.50,
      box: [14.050, 15.950, 6.400, 11.300, 1.500, 4.080],
      faceDir: 'East',
      isDoubleDoor: true,
      isBase: true
    },

    // Base Cupboards Below Platform (First Floor Kitchen)
    {
      id: 'CUPBOARD-1F-KIT-SINK',
      name: '1F Under-Sink Double Cupboard',
      floor: 'first_floor',
      floorElev: 12.00,
      box: [3.650, 5.600, 6.800, 9.700, 12.000, 14.580],
      faceDir: 'East',
      isDoubleDoor: true,
      isBase: true
    },
    {
      id: 'CUPBOARD-1F-KIT-SOUTH',
      name: '1F Kitchen Base Cupboard',
      floor: 'first_floor',
      floorElev: 12.00,
      box: [5.650, 8.450, 4.400, 6.600, 12.000, 14.580],
      faceDir: 'North',
      isDoubleDoor: true,
      isBase: true
    }
  ],

  drawers: [
    {
      id: 'DRAWER-GF-WEST',
      fitoutId: 'BED-06',
      name: 'Bedside Table West Drawer',
      floor: 'ground_floor',
      floorElev: 1.50,
      box: [3.750, 5.250, 17.375, 18.875, 1.500, 3.250],
      slideDir: [0, 0, 1] // slides South into room (+Z in Three.js)
    },
    {
      id: 'DRAWER-GF-EAST',
      fitoutId: 'BED-07',
      name: 'Bedside Table East Drawer',
      floor: 'ground_floor',
      floorElev: 1.50,
      box: [10.500, 12.000, 17.375, 18.875, 1.500, 3.250],
      slideDir: [0, 0, 1]
    },
    {
      id: 'DRAWER-1F-WEST',
      fitoutId: 'MB-06',
      name: 'Master Bedside West Drawer',
      floor: 'first_floor',
      floorElev: 12.00,
      box: [2.500, 4.000, 21.750, 23.250, 12.000, 13.750],
      slideDir: [0, 0, 1]
    },
    {
      id: 'DRAWER-1F-EAST',
      fitoutId: 'MB-07',
      name: 'Master Bedside East Drawer',
      floor: 'first_floor',
      floorElev: 12.00,
      box: [10.000, 11.500, 21.750, 23.250, 12.000, 13.750],
      slideDir: [0, 0, 1]
    },
    {
      id: 'DRAWER-1F-CHILD-S',
      fitoutId: 'CH-05',
      name: 'Child Bedside South Drawer',
      floor: 'first_floor',
      floorElev: 12.00,
      box: [47.750, 49.250, 12.000, 13.500, 12.000, 13.600],
      slideDir: [-1, 0, 0] // slides West into room (-X in Three.js)
    },
    {
      id: 'DRAWER-1F-CHILD-N',
      fitoutId: 'CH-06',
      name: 'Child Bedside North Drawer',
      floor: 'first_floor',
      floorElev: 12.00,
      box: [47.750, 49.250, 17.500, 19.000, 12.000, 13.600],
      slideDir: [-1, 0, 0]
    }
  ],

  almirahs: [
    {
      id: 'ALMIRAH-HALL-01',
      fitoutId: 'POR-01',
      name: 'South Hallway 3-Tier Almirah',
      floor: 'ground_floor',
      floorElev: 1.50,
      material: 'M-LAMINATE-WALNUT',
      box: [8.000, 11.000, 0.000, 1.200, 1.500, 4.500],
      faceDir: 'North'
    }
  ],

  chests: [
    {
      id: 'CHEST-GAR-01',
      fitoutId: 'GAR-03',
      name: 'Garage Tool Chest',
      floor: 'ground_floor',
      floorElev: 0.00,
      material: 'M-STEEL-GREY',
      box: [34.500, 37.000, 3.500, 6.500, 0.000, 3.200],
      slideDir: [1, 0, 0], // slides East into garage (+X in Three.js)
      tiers: [
        { id: 'GAR-03-T1', name: 'Bottom Drawer' },
        { id: 'GAR-03-T2', name: 'Middle Drawer' },
        { id: 'GAR-03-T3', name: 'Top Drawer' }
      ]
    },

    // Ground Floor Kitchen Base 3-Tier Utensil Drawer Chest
    {
      id: 'CHEST-GF-KIT-BASE',
      name: 'Kitchen Drawer Chest',
      floor: 'ground_floor',
      floorElev: 1.50,
      material: 'M-LAMINATE-GREY',
      box: [14.050, 16.500, 4.400, 6.350, 1.500, 4.080],
      slideDir: [0, 0, -1], // slides North into kitchen
      tiers: [
        { id: 'KIT-BASE-T1', name: 'Pot Drawer' },
        { id: 'KIT-BASE-T2', name: 'Utensil Drawer' },
        { id: 'KIT-BASE-T3', name: 'Cutlery Drawer' }
      ]
    },

    // First Floor Kitchen Base 3-Tier Drawer Chest
    {
      id: 'CHEST-1F-KIT-BASE',
      name: '1F Kitchen Drawer Chest',
      floor: 'first_floor',
      floorElev: 12.00,
      material: 'M-LAMINATE-GREY',
      box: [8.500, 10.950, 4.400, 6.600, 12.000, 14.580],
      slideDir: [0, 0, -1], // slides North into kitchen
      tiers: [
        { id: '1F-KIT-BASE-T1', name: 'Bottom Drawer' },
        { id: '1F-KIT-BASE-T2', name: 'Middle Drawer' },
        { id: '1F-KIT-BASE-T3', name: 'Top Drawer' }
      ]
    }
  ]
};

class StorageAudio {
  constructor() {
    this.ctx = null;
  }

  ensureContext() {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playWardrobeDoor(isOpen) {
    try {
      const ctx = this.ensureContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      if (isOpen) {
        // Cabinet wood hinge creak + latch release
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(170, now);
        osc.frequency.exponentialRampToValueAtTime(240, now + 0.18);
        osc.frequency.exponentialRampToValueAtTime(130, now + 0.35);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.36);
      } else {
        // Cabinet closing soft magnetic click / wood thud
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(130, now);
        osc.frequency.exponentialRampToValueAtTime(65, now + 0.14);
        gain.gain.setValueAtTime(0.24, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
      }
    } catch {
      // Audio fallback
    }
  }

  playDrawerSlide(isOpen) {
    try {
      const ctx = this.ensureContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const duration = 0.32;

      // Wooden runner glide friction
      const bufSize = Math.floor(ctx.sampleRate * duration);
      const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufSize) * Math.PI);
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buf;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(isOpen ? 650 : 500, now);
      filter.frequency.exponentialRampToValueAtTime(isOpen ? 450 : 600, now + duration);
      filter.Q.setValueAtTime(2.0, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.10);
      gain.gain.exponentialRampToValueAtTime(0.002, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);
    } catch {
      // Audio fallback
    }
  }
}

export class StorageManager {
  constructor(materialLibrary) {
    this.materials = materialLibrary;
    this.audio = new StorageAudio();

    this.rootGroup = new THREE.Group();
    this.rootGroup.name = 'InteractiveStorageRoot';

    this.items = [];
    this.interactiveMeshes = [];
    this.raycaster = new THREE.Raycaster();
    this.raycaster.far = 12 * WORLD_SCALE;

    this.targetedItem = null;
    this.isDirectHit = false;
    this.targetedDistance = Infinity;
    this.promptLabel = null;
  }

  buildStorage(scene) {
    const s = WORLD_SCALE;

    const walnutMat = this.materials.get('M-LAMINATE-WALNUT') || new THREE.MeshStandardMaterial({
      color: '#4A2E1B',
      roughness: 0.65,
      metalness: 0.05
    });

    const interiorMat = new THREE.MeshStandardMaterial({
      color: '#D7CCC8',
      roughness: 0.70,
      metalness: 0.02
    });

    const handleMat = this.materials.get('M-STEEL-SS') || new THREE.MeshStandardMaterial({
      color: '#D5D8DC',
      metalness: 0.90,
      roughness: 0.15
    });

    const nightstandMat = this.materials.get('M-WOOD-DARK') || new THREE.MeshStandardMaterial({
      color: '#3E2723',
      roughness: 0.60
    });

    const greyLaminateMat = this.materials.get('M-LAMINATE-GREY') || new THREE.MeshStandardMaterial({
      color: '#7F8C8D',
      roughness: 0.50
    });

    // 1. Build Interactive Wardrobes / Almirahs
    STORAGE_SPECS.wardrobes.forEach(spec => {
      const [xmin, xmax, ymin, ymax, zmin, zmax] = spec.box;
      const width = (xmax - xmin) * s;
      const depth = (ymax - ymin) * s;
      const height = (zmax - zmin) * s;
      const cx = ((xmin + xmax) / 2) * s;
      const cy = ((zmin + zmax) / 2) * s;
      const cz = -((ymin + ymax) / 2) * s;

      const group = new THREE.Group();
      group.name = `Wardrobe_${spec.id}`;
      group.position.set(cx, cy, cz);

      const wallThick = 0.04 * s;

      // Outer carcass (Back, Top, Bottom, Left wall, Right wall)
      // Back panel (at +depth/2 in Three.js Z, against South wall)
      const backGeo = new THREE.BoxGeometry(width, height, wallThick);
      const backMesh = new THREE.Mesh(backGeo, walnutMat);
      backMesh.position.set(0, 0, depth / 2 - wallThick / 2);
      backMesh.castShadow = true;
      group.add(backMesh);

      // Top & Bottom panels
      [-height / 2 + wallThick / 2, height / 2 - wallThick / 2].forEach(py => {
        const tbGeo = new THREE.BoxGeometry(width, wallThick, depth);
        const tbMesh = new THREE.Mesh(tbGeo, walnutMat);
        tbMesh.position.set(0, py, 0);
        tbMesh.castShadow = true;
        group.add(tbMesh);
      });

      // Left & Right side walls
      [-width / 2 + wallThick / 2, width / 2 - wallThick / 2].forEach(px => {
        const sideGeo = new THREE.BoxGeometry(wallThick, height, depth);
        const sideMesh = new THREE.Mesh(sideGeo, walnutMat);
        sideMesh.position.set(px, 0, 0);
        sideMesh.castShadow = true;
        group.add(sideMesh);
      });

      // Interior Shelves & Hanger Rail
      const shelfGeo = new THREE.BoxGeometry(width - wallThick * 2, wallThick, depth - wallThick * 2);
      // Top shelf (hat shelf)
      const hatShelf = new THREE.Mesh(shelfGeo, interiorMat);
      hatShelf.position.set(0, height * 0.28, 0);
      group.add(hatShelf);

      // Lower shelf
      const lowerShelf = new THREE.Mesh(shelfGeo, interiorMat);
      lowerShelf.position.set(0, -height * 0.25, 0);
      group.add(lowerShelf);

      // Chrome clothing hanger rail
      const railGeo = new THREE.CylinderGeometry(0.02 * s, 0.02 * s, width - wallThick * 2, 12);
      const railMesh = new THREE.Mesh(railGeo, handleMat);
      railMesh.rotation.z = Math.PI / 2;
      railMesh.position.set(0, height * 0.22, 0);
      group.add(railMesh);

      // ── Front Doors (Front face is at -depth/2) ──
      const doorW = (width - wallThick * 2) / 2;
      const doorH = height - wallThick * 2;
      const doorThick = 0.045 * s;
      const frontZ = -depth / 2 + doorThick / 2;

      // Left Door Pivot (hinge at left edge: x = -width/2 + wallThick)
      const leftPivot = new THREE.Group();
      leftPivot.position.set(-width / 2 + wallThick, 0, frontZ);
      group.add(leftPivot);

      const doorGeo = new THREE.BoxGeometry(doorW, doorH, doorThick);
      const leftDoorMesh = new THREE.Mesh(doorGeo, walnutMat);
      leftDoorMesh.position.set(doorW / 2, 0, 0); // leaf extends right from hinge
      leftDoorMesh.castShadow = true;
      leftPivot.add(leftDoorMesh);

      // Left Door Handle (vertical chrome bar with standoffs flush to door face)
      const handleBarGeo = new THREE.BoxGeometry(0.025 * s, 0.65 * s, 0.035 * s);
      const leftHandle = new THREE.Mesh(handleBarGeo, handleMat);
      leftHandle.position.set(doorW / 2 - 0.08 * s, -height * 0.02, -doorThick / 2 - 0.025 * s);
      leftHandle.castShadow = true;
      [-0.26 * s, 0.26 * s].forEach(oy => {
        const standoffGeo = new THREE.BoxGeometry(0.02 * s, 0.02 * s, 0.025 * s);
        const standoff = new THREE.Mesh(standoffGeo, handleMat);
        standoff.position.set(0, oy, 0.025 * s / 2 + 0.035 * s / 2);
        leftHandle.add(standoff);
      });
      leftDoorMesh.add(leftHandle);

      // Right Door Pivot (hinge at right edge: x = width/2 - wallThick)
      const rightPivot = new THREE.Group();
      rightPivot.position.set(width / 2 - wallThick, 0, frontZ);
      group.add(rightPivot);

      const rightDoorMesh = new THREE.Mesh(doorGeo, walnutMat);
      rightDoorMesh.position.set(-doorW / 2, 0, 0); // leaf extends left from hinge
      rightDoorMesh.castShadow = true;
      rightPivot.add(rightDoorMesh);

      // Right Door Handle (vertical chrome bar with standoffs flush to door face)
      const rightHandle = new THREE.Mesh(handleBarGeo, handleMat);
      rightHandle.position.set(-doorW / 2 + 0.08 * s, -height * 0.02, -doorThick / 2 - 0.025 * s);
      rightHandle.castShadow = true;
      [-0.26 * s, 0.26 * s].forEach(oy => {
        const standoffGeo = new THREE.BoxGeometry(0.02 * s, 0.02 * s, 0.025 * s);
        const standoff = new THREE.Mesh(standoffGeo, handleMat);
        standoff.position.set(0, oy, 0.025 * s / 2 + 0.035 * s / 2);
        rightHandle.add(standoff);
      });
      rightDoorMesh.add(rightHandle);

      // Hit mesh for reticle raycast
      const hitGeo = new THREE.BoxGeometry(width * 1.05, height * 1.05, depth * 1.15);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      group.add(hitMesh);

      this.rootGroup.add(group);

      const wardrobeObj = {
        spec,
        id: spec.id,
        name: spec.name,
        type: 'wardrobe',
        floor: spec.floor,
        group,
        leftPivot,
        rightPivot,
        hitMesh,
        leftDoorMesh,
        rightDoorMesh,
        worldCenter: new THREE.Vector3(cx, cy, cz),
        isOpen: false,
        openAngle: 0,
        targetAngle: 0
      };

      hitMesh.userData = { storage: wardrobeObj };
      leftDoorMesh.userData = { storage: wardrobeObj };
      rightDoorMesh.userData = { storage: wardrobeObj };

      this.interactiveMeshes.push(hitMesh, leftDoorMesh, rightDoorMesh);
      this.items.push(wardrobeObj);
    });

    // 2. Build Interactive Kitchen Cupboards
    STORAGE_SPECS.cupboards.forEach(spec => {
      const [xmin, xmax, ymin, ymax, zmin, zmax] = spec.box;
      const isXFacing = (spec.faceDir === 'East' || spec.faceDir === 'West');
      const width = (isXFacing ? (ymax - ymin) : (xmax - xmin)) * s;
      const depth = (isXFacing ? (xmax - xmin) : (ymax - ymin)) * s;
      const height = (zmax - zmin) * s;
      const cx = ((xmin + xmax) / 2) * s;
      const cy = ((zmin + zmax) / 2) * s;
      const cz = -((ymin + ymax) / 2) * s;

      const group = new THREE.Group();
      group.name = `Cupboard_${spec.id}`;
      group.position.set(cx, cy, cz);

      if (spec.faceDir === 'East') {
        group.rotation.y = -Math.PI / 2;
      } else if (spec.faceDir === 'West') {
        group.rotation.y = Math.PI / 2;
      } else if (spec.faceDir === 'South') {
        group.rotation.y = Math.PI;
      }

      const wallThick = 0.03 * s;

      // Outer carcass
      const backGeo = new THREE.BoxGeometry(width, height, wallThick);
      const backMesh = new THREE.Mesh(backGeo, greyLaminateMat);
      backMesh.position.set(0, 0, depth / 2 - wallThick / 2);
      group.add(backMesh);

      [-height / 2 + wallThick / 2, height / 2 - wallThick / 2].forEach(py => {
        const tbGeo = new THREE.BoxGeometry(width, wallThick, depth);
        const tbMesh = new THREE.Mesh(tbGeo, greyLaminateMat);
        tbMesh.position.set(0, py, 0);
        group.add(tbMesh);
      });

      [-width / 2 + wallThick / 2, width / 2 - wallThick / 2].forEach(px => {
        const sideGeo = new THREE.BoxGeometry(wallThick, height, depth);
        const sideMesh = new THREE.Mesh(sideGeo, greyLaminateMat);
        sideMesh.position.set(px, 0, 0);
        group.add(sideMesh);
      });

      // Mid interior shelf
      const shelfGeo = new THREE.BoxGeometry(width - wallThick * 2, wallThick, depth - wallThick * 2);
      const shelfMesh = new THREE.Mesh(shelfGeo, interiorMat);
      shelfMesh.position.set(0, 0, 0);
      group.add(shelfMesh);

      // Hinged cupboard door(s)
      const isDouble = spec.isDoubleDoor || (width > 2.0 * s);
      const totalDoorW = width - wallThick * 2;
      const doorW = isDouble ? totalDoorW / 2 : totalDoorW;
      const doorH = height - wallThick * 2;
      const doorThick = 0.035 * s;
      const frontZ = -depth / 2 + doorThick / 2;
      const handleY = spec.isBase ? (height * 0.22) : (-height * 0.15);

      // Left Door & Pivot
      const leftPivot = new THREE.Group();
      leftPivot.position.set(-width / 2 + wallThick, 0, frontZ);
      group.add(leftPivot);

      const doorGeo = new THREE.BoxGeometry(doorW, doorH, doorThick);
      const leftDoorMesh = new THREE.Mesh(doorGeo, greyLaminateMat);
      leftDoorMesh.position.set(doorW / 2, 0, 0);
      leftDoorMesh.castShadow = true;
      leftPivot.add(leftDoorMesh);

      // Handle on left door near right meeting stile
      const handleBarGeo = new THREE.BoxGeometry(0.02 * s, 0.32 * s, 0.03 * s);
      const leftHandle = new THREE.Mesh(handleBarGeo, handleMat);
      leftHandle.position.set(doorW / 2 - 0.08 * s, handleY, -doorThick / 2 - 0.02 * s);
      leftHandle.castShadow = true;
      [-0.12 * s, 0.12 * s].forEach(oy => {
        const standoffGeo = new THREE.BoxGeometry(0.015 * s, 0.015 * s, 0.02 * s);
        const standoff = new THREE.Mesh(standoffGeo, handleMat);
        standoff.position.set(0, oy, 0.02 * s / 2 + 0.03 * s / 2);
        leftHandle.add(standoff);
      });
      leftDoorMesh.add(leftHandle);

      // Right Door & Pivot (if double door)
      let rightPivot = null;
      let rightDoorMesh = null;
      if (isDouble) {
        rightPivot = new THREE.Group();
        rightPivot.position.set(width / 2 - wallThick, 0, frontZ);
        group.add(rightPivot);

        const rDoorGeo = new THREE.BoxGeometry(doorW, doorH, doorThick);
        rightDoorMesh = new THREE.Mesh(rDoorGeo, greyLaminateMat);
        rightDoorMesh.position.set(-doorW / 2, 0, 0);
        rightDoorMesh.castShadow = true;
        rightPivot.add(rightDoorMesh);

        // Handle on right door near left meeting stile
        const rightHandle = new THREE.Mesh(handleBarGeo, handleMat);
        rightHandle.position.set(-doorW / 2 + 0.08 * s, handleY, -doorThick / 2 - 0.02 * s);
        rightHandle.castShadow = true;
        [-0.12 * s, 0.12 * s].forEach(oy => {
          const standoffGeo = new THREE.BoxGeometry(0.015 * s, 0.015 * s, 0.02 * s);
          const standoff = new THREE.Mesh(standoffGeo, handleMat);
          standoff.position.set(0, oy, 0.02 * s / 2 + 0.03 * s / 2);
          rightHandle.add(standoff);
        });
        rightDoorMesh.add(rightHandle);
      }

      // Hit collider
      const hitGeo = new THREE.BoxGeometry(width * 1.05, height * 1.05, depth * 1.15);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      group.add(hitMesh);

      this.rootGroup.add(group);

      const cupboardObj = {
        spec,
        id: spec.id,
        name: spec.name,
        type: 'cupboard',
        floor: spec.floor,
        group,
        leftPivot,
        rightPivot,
        hitMesh,
        doorMesh: leftDoorMesh,
        rightDoorMesh,
        worldCenter: new THREE.Vector3(cx, cy, cz),
        isOpen: false,
        openAngle: 0,
        targetAngle: 0
      };

      hitMesh.userData = { storage: cupboardObj };
      leftDoorMesh.userData = { storage: cupboardObj };
      this.interactiveMeshes.push(hitMesh, leftDoorMesh);
      if (rightDoorMesh) {
        rightDoorMesh.userData = { storage: cupboardObj };
        this.interactiveMeshes.push(rightDoorMesh);
      }

      this.items.push(cupboardObj);
    });

    // 3. Build Interactive Bedside Table Drawers
    STORAGE_SPECS.drawers.forEach(spec => {
      const [xmin, xmax, ymin, ymax, zmin, zmax] = spec.box;
      const width = (xmax - xmin) * s;
      const depth = (ymax - ymin) * s;
      const height = (zmax - zmin) * s;
      const cx = ((xmin + xmax) / 2) * s;
      const cy = ((zmin + zmax) / 2) * s;
      const cz = -((ymin + ymax) / 2) * s;

      const group = new THREE.Group();
      group.name = `Drawer_${spec.id}`;
      group.position.set(cx, cy, cz);

      const wallThick = 0.035 * s;
      const sDir = spec.slideDir;
      const isXSlide = (sDir[0] !== 0);

      // ── Hollow Nightstand Carcass Frame ──
      // Top panel
      const topGeo = new THREE.BoxGeometry(width, wallThick, depth);
      const topMesh = new THREE.Mesh(topGeo, nightstandMat);
      topMesh.position.set(0, height / 2 - wallThick / 2, 0);
      topMesh.castShadow = true;
      group.add(topMesh);

      // Bottom panel
      const btmGeo = new THREE.BoxGeometry(width, wallThick, depth);
      const btmMesh = new THREE.Mesh(btmGeo, nightstandMat);
      btmMesh.position.set(0, -height / 2 + wallThick / 2, 0);
      btmMesh.castShadow = true;
      group.add(btmMesh);

      // Back panel (opposite to slide direction)
      if (isXSlide) {
        const backGeo = new THREE.BoxGeometry(wallThick, height, depth);
        const backMesh = new THREE.Mesh(backGeo, nightstandMat);
        backMesh.position.set(-sDir[0] * (width / 2 - wallThick / 2), 0, 0);
        group.add(backMesh);

        // Side panels
        [-depth / 2 + wallThick / 2, depth / 2 - wallThick / 2].forEach(pz => {
          const sGeo = new THREE.BoxGeometry(width, height, wallThick);
          const sMesh = new THREE.Mesh(sGeo, nightstandMat);
          sMesh.position.set(0, 0, pz);
          group.add(sMesh);
        });
      } else {
        const backGeo = new THREE.BoxGeometry(width, height, wallThick);
        const backMesh = new THREE.Mesh(backGeo, nightstandMat);
        backMesh.position.set(0, 0, -sDir[2] * (depth / 2 - wallThick / 2));
        group.add(backMesh);

        // Side panels
        [-width / 2 + wallThick / 2, width / 2 - wallThick / 2].forEach(px => {
          const sGeo = new THREE.BoxGeometry(wallThick, height, depth);
          const sMesh = new THREE.Mesh(sGeo, nightstandMat);
          sMesh.position.set(px, 0, 0);
          group.add(sMesh);
        });
      }

      // ── Sliding Drawer Assembly ──
      const drawerW = width - wallThick * 2.4;
      const drawerH = height * 0.50;
      const drawerD = depth - wallThick * 2.4;

      const drawerGroup = new THREE.Group();
      drawerGroup.position.set(0, height * 0.05, 0);

      // Drawer box bottom
      const boxBtmGeo = new THREE.BoxGeometry(drawerW, 0.02 * s, drawerD);
      const boxBtm = new THREE.Mesh(boxBtmGeo, interiorMat);
      boxBtm.position.set(0, -drawerH / 2 + 0.01 * s, 0);
      drawerGroup.add(boxBtm);

      // Drawer side walls (hollow container inside)
      if (isXSlide) {
        [-drawerD / 2 + 0.015 * s, drawerD / 2 - 0.015 * s].forEach(pz => {
          const wGeo = new THREE.BoxGeometry(drawerW, drawerH, 0.02 * s);
          const wMesh = new THREE.Mesh(wGeo, interiorMat);
          wMesh.position.set(0, 0, pz);
          drawerGroup.add(wMesh);
        });
        const backWGeo = new THREE.BoxGeometry(0.02 * s, drawerH, drawerD);
        const backWMesh = new THREE.Mesh(backWGeo, interiorMat);
        backWMesh.position.set(-sDir[0] * (drawerW / 2 - 0.01 * s), 0, 0);
        drawerGroup.add(backWMesh);
      } else {
        [-drawerW / 2 + 0.015 * s, drawerW / 2 - 0.015 * s].forEach(px => {
          const wGeo = new THREE.BoxGeometry(0.02 * s, drawerH, drawerD);
          const wMesh = new THREE.Mesh(wGeo, interiorMat);
          wMesh.position.set(px, 0, 0);
          drawerGroup.add(wMesh);
        });
        const backWGeo = new THREE.BoxGeometry(drawerW, drawerH, 0.02 * s);
        const backWMesh = new THREE.Mesh(backWGeo, interiorMat);
        backWMesh.position.set(0, 0, -sDir[2] * (drawerD / 2 - 0.01 * s));
        drawerGroup.add(backWMesh);
      }

      // Drawer front decorative panel
      const faceGeo = new THREE.BoxGeometry(
        isXSlide ? 0.035 * s : drawerW * 1.04,
        drawerH * 1.04,
        isXSlide ? drawerD * 1.04 : 0.035 * s
      );
      const faceMesh = new THREE.Mesh(faceGeo, nightstandMat);
      faceMesh.position.set(
        isXSlide ? sDir[0] * (drawerW / 2) : 0,
        0,
        isXSlide ? 0 : sDir[2] * (drawerD / 2)
      );
      faceMesh.castShadow = true;
      drawerGroup.add(faceMesh);

      // Sleek metallic drawer pull handle
      const pullGeo = new THREE.BoxGeometry(
        isXSlide ? 0.03 * s : 0.35 * s,
        0.035 * s,
        isXSlide ? 0.35 * s : 0.03 * s
      );
      const pullMesh = new THREE.Mesh(pullGeo, handleMat);
      pullMesh.position.set(
        isXSlide ? sDir[0] * (drawerW / 2 + 0.03 * s) : 0,
        0,
        isXSlide ? 0 : sDir[2] * (drawerD / 2 + 0.03 * s)
      );
      drawerGroup.add(pullMesh);

      group.add(drawerGroup);

      // Hit collider
      const hitGeo = new THREE.BoxGeometry(width * 1.1, height * 1.1, depth * 1.1);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      group.add(hitMesh);

      this.rootGroup.add(group);

      const drawerObj = {
        spec,
        id: spec.id,
        name: spec.name,
        type: 'drawer',
        floor: spec.floor,
        group,
        drawerGroup,
        hitMesh,
        faceMesh,
        slideDir: spec.slideDir,
        maxSlide: 0.70 * s,
        slideDist: 0,
        targetSlide: 0,
        isOpen: false,
        worldCenter: new THREE.Vector3(cx, cy, cz)
      };

      hitMesh.userData = { storage: drawerObj };
      faceMesh.userData = { storage: drawerObj };

      this.interactiveMeshes.push(hitMesh, faceMesh);
      this.items.push(drawerObj);
    });

    // 4. Build Interactive 3-Tier Multi-Floor Drawer Chests (Bottom, Middle, Top)
    if (STORAGE_SPECS.chests) {
      STORAGE_SPECS.chests.forEach(chestSpec => {
        const [xmin, xmax, ymin, ymax, zmin, zmax] = chestSpec.box;
        const width = (xmax - xmin) * s;
        const depth = (ymax - ymin) * s;
        const height = (zmax - zmin) * s;
        const cx = ((xmin + xmax) / 2) * s;
        const cy = ((zmin + zmax) / 2) * s;
        const cz = -((ymin + ymax) / 2) * s;

        const chestGroup = new THREE.Group();
        chestGroup.name = `Chest_${chestSpec.id}`;
        chestGroup.position.set(cx, cy, cz);

        const carcassMat = this.materials.get(chestSpec.material) || (chestSpec.material === 'M-STEEL-GREY' ? greyLaminateMat : walnutMat);
        const wallThick = 0.035 * s;
        const sDir = chestSpec.slideDir;
        const isXSlide = (sDir[0] !== 0);

        // --- Outer Carcass (Top, Bottom, Back, and 2 Sides) ---
        // Top worktop / lid panel
        const topGeo = new THREE.BoxGeometry(width + 0.02 * s, wallThick, depth + 0.02 * s);
        const topMesh = new THREE.Mesh(topGeo, carcassMat);
        topMesh.position.set(0, height / 2 - wallThick / 2, 0);
        topMesh.castShadow = true;
        topMesh.receiveShadow = true;
        chestGroup.add(topMesh);

        // Bottom plinth panel
        const btmGeo = new THREE.BoxGeometry(width, wallThick, depth);
        const btmMesh = new THREE.Mesh(btmGeo, carcassMat);
        btmMesh.position.set(0, -height / 2 + wallThick / 2, 0);
        btmMesh.receiveShadow = true;
        chestGroup.add(btmMesh);

        // Back panel & Side panels
        if (isXSlide) {
          const backGeo = new THREE.BoxGeometry(wallThick, height, depth);
          const backMesh = new THREE.Mesh(backGeo, carcassMat);
          backMesh.position.set(-sDir[0] * (width / 2 - wallThick / 2), 0, 0);
          backMesh.castShadow = true;
          chestGroup.add(backMesh);

          [-depth / 2 + wallThick / 2, depth / 2 - wallThick / 2].forEach(pz => {
            const sGeo = new THREE.BoxGeometry(width, height, wallThick);
            const sMesh = new THREE.Mesh(sGeo, carcassMat);
            sMesh.position.set(0, 0, pz);
            sMesh.castShadow = true;
            chestGroup.add(sMesh);
          });

          // Horizontal interior dividers between drawer tiers
          [-height / 6, height / 6].forEach(py => {
            const divGeo = new THREE.BoxGeometry(width - wallThick * 1.5, wallThick * 0.6, depth - wallThick * 2);
            const divMesh = new THREE.Mesh(divGeo, interiorMat);
            divMesh.position.set(0, py, 0);
            chestGroup.add(divMesh);
          });
        } else {
          const backGeo = new THREE.BoxGeometry(width, height, wallThick);
          const backMesh = new THREE.Mesh(backGeo, carcassMat);
          backMesh.position.set(0, 0, -sDir[2] * (depth / 2 - wallThick / 2));
          backMesh.castShadow = true;
          chestGroup.add(backMesh);

          [-width / 2 + wallThick / 2, width / 2 - wallThick / 2].forEach(px => {
            const sGeo = new THREE.BoxGeometry(wallThick, height, depth);
            const sMesh = new THREE.Mesh(sGeo, carcassMat);
            sMesh.position.set(px, 0, 0);
            sMesh.castShadow = true;
            chestGroup.add(sMesh);
          });

          // Horizontal interior dividers between drawer tiers
          [-height / 6, height / 6].forEach(py => {
            const divGeo = new THREE.BoxGeometry(width - wallThick * 2, wallThick * 0.6, depth - wallThick * 1.5);
            const divMesh = new THREE.Mesh(divGeo, interiorMat);
            divMesh.position.set(0, py, 0);
            chestGroup.add(divMesh);
          });
        }

        this.rootGroup.add(chestGroup);

        // --- 3 Stacked Drawers (Tier 0: Bottom, Tier 1: Middle, Tier 2: Top) ---
        const tierHeight = (height - wallThick * 2) / 3;
        const tierYs = [
          -height / 2 + wallThick + tierHeight * 0.5,
          0,
          height / 2 - wallThick - tierHeight * 0.5
        ];

        chestSpec.tiers.forEach((tier, tierIdx) => {
          const tierY = tierYs[tierIdx];
          const drawerW = isXSlide ? (width - wallThick * 2.2) : (width - wallThick * 2.4);
          const drawerH = tierHeight * 0.88;
          const drawerD = isXSlide ? (depth - wallThick * 2.4) : (depth - wallThick * 2.2);

          const drawerGroup = new THREE.Group();
          drawerGroup.name = `Drawer_${tier.id}`;
          drawerGroup.position.set(0, tierY, 0);

          // Drawer bottom
          const boxBtmGeo = new THREE.BoxGeometry(drawerW, 0.02 * s, drawerD);
          const boxBtm = new THREE.Mesh(boxBtmGeo, interiorMat);
          boxBtm.position.set(0, -drawerH / 2 + 0.01 * s, 0);
          drawerGroup.add(boxBtm);

          // Drawer side walls (hollow container inside)
          if (isXSlide) {
            [-drawerD / 2 + 0.015 * s, drawerD / 2 - 0.015 * s].forEach(pz => {
              const wGeo = new THREE.BoxGeometry(drawerW, drawerH, 0.02 * s);
              const wMesh = new THREE.Mesh(wGeo, interiorMat);
              wMesh.position.set(0, 0, pz);
              drawerGroup.add(wMesh);
            });
            const backWGeo = new THREE.BoxGeometry(0.02 * s, drawerH, drawerD);
            const backWMesh = new THREE.Mesh(backWGeo, interiorMat);
            backWMesh.position.set(-sDir[0] * (drawerW / 2 - 0.01 * s), 0, 0);
            drawerGroup.add(backWMesh);
          } else {
            [-drawerW / 2 + 0.015 * s, drawerW / 2 - 0.015 * s].forEach(px => {
              const wGeo = new THREE.BoxGeometry(0.02 * s, drawerH, drawerD);
              const wMesh = new THREE.Mesh(wGeo, interiorMat);
              wMesh.position.set(px, 0, 0);
              drawerGroup.add(wMesh);
            });
            const backWGeo = new THREE.BoxGeometry(drawerW, drawerH, 0.02 * s);
            const backWMesh = new THREE.Mesh(backWGeo, interiorMat);
            backWMesh.position.set(0, 0, -sDir[2] * (drawerD / 2 - 0.01 * s));
            drawerGroup.add(backWMesh);
          }

          // Drawer front face panel
          const faceGeo = new THREE.BoxGeometry(
            isXSlide ? 0.035 * s : drawerW * 1.04,
            drawerH * 1.02,
            isXSlide ? drawerD * 1.04 : 0.035 * s
          );
          const faceMesh = new THREE.Mesh(faceGeo, carcassMat);
          faceMesh.position.set(
            isXSlide ? sDir[0] * (drawerW / 2) : 0,
            0,
            isXSlide ? 0 : sDir[2] * (drawerD / 2)
          );
          faceMesh.castShadow = true;
          drawerGroup.add(faceMesh);

          // Sleek horizontal drawer pull handle
          const pullGeo = new THREE.BoxGeometry(
            isXSlide ? 0.03 * s : 0.45 * s,
            0.04 * s,
            isXSlide ? 0.45 * s : 0.03 * s
          );
          const pullMesh = new THREE.Mesh(pullGeo, handleMat);
          pullMesh.position.set(
            isXSlide ? sDir[0] * (drawerW / 2 + 0.03 * s) : 0,
            0,
            isXSlide ? 0 : sDir[2] * (drawerD / 2 + 0.03 * s)
          );
          pullMesh.castShadow = true;
          drawerGroup.add(pullMesh);

          chestGroup.add(drawerGroup);

          // Individual hit collider for this specific drawer tier
          const hitGeo = new THREE.BoxGeometry(
            isXSlide ? width * 1.15 : width * 1.05,
            tierHeight * 0.98,
            isXSlide ? depth * 1.05 : depth * 1.15
          );
          const hitMat = new THREE.MeshBasicMaterial({ visible: false });
          const hitMesh = new THREE.Mesh(hitGeo, hitMat);
          hitMesh.position.set(0, tierY, 0);
          chestGroup.add(hitMesh);

          const drawerWorldCenter = new THREE.Vector3(cx, cy + tierY, cz);
          const drawerObj = {
            spec: chestSpec,
            tier,
            id: tier.id,
            name: `${chestSpec.name} ${tier.name}`,
            type: 'drawer',
            floor: chestSpec.floor,
            group: chestGroup,
            drawerGroup,
            hitMesh,
            faceMesh,
            baseY: tierY,
            slideDir: sDir,
            maxSlide: 0.80 * s,
            slideDist: 0,
            targetSlide: 0,
            isOpen: false,
            worldCenter: drawerWorldCenter
          };

          hitMesh.userData = { storage: drawerObj };
          faceMesh.userData = { storage: drawerObj };

          this.interactiveMeshes.push(hitMesh, faceMesh);
          this.items.push(drawerObj);
        });
      });
    }

    // 5. Build Interactive Unified Double-Door Almirahs (3-Tier Interior Shelving)
    if (STORAGE_SPECS.almirahs) {
      STORAGE_SPECS.almirahs.forEach(spec => {
        const [xmin, xmax, ymin, ymax, zmin, zmax] = spec.box;
        const width = (xmax - xmin) * s;
        const depth = (ymax - ymin) * s;
        const height = (zmax - zmin) * s;
        const cx = ((xmin + xmax) / 2) * s;
        const cy = ((zmin + zmax) / 2) * s;
        const cz = -((ymin + ymax) / 2) * s;

        const group = new THREE.Group();
        group.name = `Almirah_${spec.id}`;
        group.position.set(cx, cy, cz);

        const carcassMat = this.materials.get(spec.material) || walnutMat;
        const wallThick = 0.035 * s;

        // Top worktop / cornice panel
        const topGeo = new THREE.BoxGeometry(width + 0.03 * s, wallThick * 1.1, depth + 0.03 * s);
        const topMesh = new THREE.Mesh(topGeo, carcassMat);
        topMesh.position.set(0, height / 2 - wallThick * 0.55, 0);
        topMesh.castShadow = true;
        topMesh.receiveShadow = true;
        group.add(topMesh);

        // Bottom plinth panel
        const btmGeo = new THREE.BoxGeometry(width, wallThick, depth);
        const btmMesh = new THREE.Mesh(btmGeo, carcassMat);
        btmMesh.position.set(0, -height / 2 + wallThick / 2, 0);
        btmMesh.receiveShadow = true;
        group.add(btmMesh);

        // Back panel (faces +Z, against South wall)
        const backGeo = new THREE.BoxGeometry(width, height, wallThick);
        const backMesh = new THREE.Mesh(backGeo, carcassMat);
        backMesh.position.set(0, 0, depth / 2 - wallThick / 2);
        backMesh.castShadow = true;
        group.add(backMesh);

        // Side panels (Left & Right)
        [-width / 2 + wallThick / 2, width / 2 - wallThick / 2].forEach(px => {
          const sGeo = new THREE.BoxGeometry(wallThick, height, depth);
          const sMesh = new THREE.Mesh(sGeo, carcassMat);
          sMesh.position.set(px, 0, 0);
          sMesh.castShadow = true;
          group.add(sMesh);
        });

        // 2 Horizontal interior shelves creating 3 equal interior storage tiers
        [-height / 6, height / 6].forEach(py => {
          const shelfGeo = new THREE.BoxGeometry(width - wallThick * 2, wallThick * 0.7, depth - wallThick * 1.5);
          const shelfMesh = new THREE.Mesh(shelfGeo, interiorMat);
          shelfMesh.position.set(0, py, 0);
          shelfMesh.receiveShadow = true;
          group.add(shelfMesh);
        });

        // ── Unified Full-Height Double Doors (Opens from middle, one on each side) ──
        const doorW = (width - wallThick * 2) / 2;
        const doorH = height - wallThick * 2;
        const doorThick = 0.035 * s;
        const frontZ = -depth / 2 + doorThick / 2;

        const doorGeo = new THREE.BoxGeometry(doorW, doorH, doorThick);
        const trimGeo = new THREE.BoxGeometry(doorW * 0.86, doorH * 0.90, 0.008 * s);
        const handleBarGeo = new THREE.BoxGeometry(0.02 * s, 0.45 * s, 0.03 * s);

        // Left Door & Pivot (hinged on left edge, swings outward to the left)
        const leftPivot = new THREE.Group();
        leftPivot.name = `LeftPivot_${spec.id}`;
        leftPivot.position.set(-width / 2 + wallThick, 0, frontZ);
        group.add(leftPivot);

        const leftDoorMesh = new THREE.Mesh(doorGeo, carcassMat);
        leftDoorMesh.position.set(doorW / 2, 0, 0);
        leftDoorMesh.castShadow = true;
        leftPivot.add(leftDoorMesh);

        const leftTrim = new THREE.Mesh(trimGeo, carcassMat);
        leftTrim.position.set(doorW / 2, 0, -doorThick / 2 - 0.004 * s);
        leftPivot.add(leftTrim);

        const leftHandle = new THREE.Mesh(handleBarGeo, handleMat);
        leftHandle.position.set(doorW - 0.06 * s, 0, -doorThick / 2 - 0.02 * s);
        leftHandle.castShadow = true;
        [-0.15 * s, 0.15 * s].forEach(oy => {
          const standoffGeo = new THREE.BoxGeometry(0.015 * s, 0.015 * s, 0.02 * s);
          const standoff = new THREE.Mesh(standoffGeo, handleMat);
          standoff.position.set(0, oy, 0.02 * s / 2 + 0.03 * s / 2);
          leftHandle.add(standoff);
        });
        leftPivot.add(leftHandle);

        // Right Door & Pivot (hinged on right edge, swings outward to the right)
        const rightPivot = new THREE.Group();
        rightPivot.name = `RightPivot_${spec.id}`;
        rightPivot.position.set(width / 2 - wallThick, 0, frontZ);
        group.add(rightPivot);

        const rightDoorMesh = new THREE.Mesh(doorGeo, carcassMat);
        rightDoorMesh.position.set(-doorW / 2, 0, 0);
        rightDoorMesh.castShadow = true;
        rightPivot.add(rightDoorMesh);

        const rightTrim = new THREE.Mesh(trimGeo, carcassMat);
        rightTrim.position.set(-doorW / 2, 0, -doorThick / 2 - 0.004 * s);
        rightPivot.add(rightTrim);

        const rightHandle = new THREE.Mesh(handleBarGeo, handleMat);
        rightHandle.position.set(-doorW + 0.06 * s, 0, -doorThick / 2 - 0.02 * s);
        rightHandle.castShadow = true;
        [-0.15 * s, 0.15 * s].forEach(oy => {
          const standoffGeo = new THREE.BoxGeometry(0.015 * s, 0.015 * s, 0.02 * s);
          const standoff = new THREE.Mesh(standoffGeo, handleMat);
          standoff.position.set(0, oy, 0.02 * s / 2 + 0.03 * s / 2);
          rightHandle.add(standoff);
        });
        rightPivot.add(rightHandle);

        // Unified Hit Collider
        const hitGeo = new THREE.BoxGeometry(width * 1.05, height * 1.05, depth * 1.15);
        const hitMat = new THREE.MeshBasicMaterial({ visible: false });
        const hitMesh = new THREE.Mesh(hitGeo, hitMat);
        group.add(hitMesh);

        this.rootGroup.add(group);

        const almirahObj = {
          spec,
          id: spec.id,
          name: spec.name,
          type: 'almirah',
          floor: spec.floor,
          group,
          leftPivot,
          rightPivot,
          hitMesh,
          leftDoorMesh,
          rightDoorMesh,
          worldCenter: new THREE.Vector3(cx, cy, cz),
          isOpen: false,
          openAngle: 0,
          targetAngle: 0
        };

        hitMesh.userData = { storage: almirahObj };
        leftDoorMesh.userData = { storage: almirahObj };
        rightDoorMesh.userData = { storage: almirahObj };

        this.interactiveMeshes.push(hitMesh, leftDoorMesh, rightDoorMesh);
        this.items.push(almirahObj);
      });
    }

    scene.add(this.rootGroup);
    return this.rootGroup;
  }

  toggleStorage(item) {
    item.isOpen = !item.isOpen;
    if (item.type === 'wardrobe' || item.type === 'almirah') {
      item.targetAngle = item.isOpen ? 1.70 : 0.0; // ~98° swing open
      this.audio.playWardrobeDoor(item.isOpen);
    } else if (item.type === 'cupboard') {
      item.targetAngle = item.isOpen ? 1.70 : 0.0;
      this.audio.playWardrobeDoor(item.isOpen);
    } else if (item.type === 'drawer') {
      item.targetSlide = item.isOpen ? item.maxSlide : 0.0;
      this.audio.playDrawerSlide(item.isOpen);
    }
  }

  interact(ui, showPrompt = false) {
    if (!this.targetedItem) return;
    this.toggleStorage(this.targetedItem);
    if (ui) {
      ui.showToast(`${this.targetedItem.name} ${this.targetedItem.isOpen ? 'opened' : 'closed'}`);
    }
  }

  handleOrbitClick(event, camera) {
    const mouse = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );
    this.raycaster.setFromCamera(mouse, camera);

    const activeMeshes = this.interactiveMeshes.filter(m => m.parent && m.parent.visible);
    const intersects = this.raycaster.intersectObjects(activeMeshes, true);

    if (intersects.length > 0) {
      let cur = intersects[0].object;
      while (cur && !cur.userData?.storage) cur = cur.parent;
      if (cur && cur.userData?.storage) {
        this.toggleStorage(cur.userData.storage);
      }
    }
  }

  update(delta, camera, playerPosition, isFPActive, ui, showPrompt = false) {
    const s = WORLD_SCALE;

    // 1. Animate wardrobe doors & sliding drawers
    this.items.forEach(item => {
      if (item.type === 'wardrobe' || item.type === 'almirah') {
        if (Math.abs(item.openAngle - item.targetAngle) > 0.001) {
          const t = Math.min(1.0, delta * 7.0);
          item.openAngle = THREE.MathUtils.lerp(item.openAngle, item.targetAngle, t);
          item.leftPivot.rotation.y = item.openAngle;
          item.rightPivot.rotation.y = -item.openAngle;
        }
      } else if (item.type === 'cupboard') {
        if (Math.abs(item.openAngle - item.targetAngle) > 0.001) {
          const t = Math.min(1.0, delta * 7.0);
          item.openAngle = THREE.MathUtils.lerp(item.openAngle, item.targetAngle, t);
          item.leftPivot.rotation.y = item.openAngle;
          if (item.rightPivot) item.rightPivot.rotation.y = -item.openAngle;
        }
      } else if (item.type === 'drawer') {
        if (Math.abs(item.slideDist - item.targetSlide) > 0.001) {
          const t = Math.min(1.0, delta * 8.0);
          item.slideDist = THREE.MathUtils.lerp(item.slideDist, item.targetSlide, t);
          const dir = item.slideDir;
          const baseY = (item.baseY !== undefined) ? item.baseY : item.drawerGroup.position.y;
          item.drawerGroup.position.set(
            dir[0] * item.slideDist,
            baseY,
            dir[2] * item.slideDist
          );
        }
      }
    });

    // 2. Crosshair raycast targeting
    if (!isFPActive || !camera || !playerPosition) {
      if (this.targetedItem) {
        this.targetedItem = null;
        this.isDirectHit = false;
        this.targetedDistance = Infinity;
        this.promptLabel = null;
        if (ui) ui.hideInteractionPrompt();
      }
      return;
    }

    const reach = 7.0 * s;
    const activeItems = this.items.filter(it => {
      if (!it.group.visible) return false;
      const d = playerPosition.distanceTo(it.worldCenter);
      return d <= reach;
    });

    let bestItem = null;
    let closestDist = Infinity;
    let isDirectHit = false;

    // Reticle raycast
    this.raycaster.setFromCamera({ x: 0, y: 0 }, camera);
    const candidateMeshes = [];
    activeItems.forEach(it => {
      if (it.type === 'wardrobe' || it.type === 'almirah') {
        candidateMeshes.push(it.hitMesh, it.leftDoorMesh, it.rightDoorMesh);
      } else if (it.type === 'cupboard') {
        candidateMeshes.push(it.hitMesh, it.doorMesh);
        if (it.rightDoorMesh) candidateMeshes.push(it.rightDoorMesh);
      } else {
        candidateMeshes.push(it.hitMesh, it.faceMesh);
      }
    });

    const intersects = this.raycaster.intersectObjects(candidateMeshes, false);

    if (intersects.length > 0) {
      let cur = intersects[0].object;
      while (cur && !cur.userData?.storage) cur = cur.parent;
      if (cur && cur.userData?.storage && intersects[0].distance <= reach) {
        bestItem = cur.userData.storage;
        closestDist = intersects[0].distance;
        isDirectHit = true;
      }
    }

    // Look angle fallback only if facing storage unit closely
    if (!bestItem && activeItems.length > 0) {
      const camDir = new THREE.Vector3();
      camera.getWorldDirection(camDir);

      activeItems.forEach(it => {
        const toIt = new THREE.Vector3().subVectors(it.worldCenter, camera.position);
        const dist = toIt.length();
        toIt.normalize();
        const dot = camDir.dot(toIt);
        if (dot > 0.88 && dist <= 5.5 * s && dist < closestDist) {
          closestDist = dist;
          bestItem = it;
          isDirectHit = false;
        }
      });
    }

    this.targetedItem = bestItem;
    this.isDirectHit = isDirectHit;
    this.targetedDistance = closestDist;
    this.promptLabel = bestItem
      ? `[E] ${bestItem.isOpen ? 'Close' : 'Open'} ${bestItem.name}`
      : null;

    if (ui && showPrompt) {
      if (this.promptLabel) {
        ui.showInteractionPrompt(this.promptLabel);
      } else {
        ui.hideInteractionPrompt();
      }
    }
  }

  setFloorFilter(filter) {
    this.items.forEach(it => {
      const isVisible = (filter === 'all') || (it.floor === filter);
      it.group.visible = isVisible;
    });
  }

  getRoot() {
    return this.rootGroup;
  }
}
