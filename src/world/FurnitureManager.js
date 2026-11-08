import * as THREE from 'three';
import { WORLD_SCALE } from '../config/constants.js';

export const FURNITURE_SPECS = {
  beds: [
    {
      id: 'BED-GF',
      colliderId: 'COL-BED-01',
      name: 'Queen Bed',
      floor: 'ground_floor',
      floorElev: 1.50,
      center: [7.875, 15.625, 2.70],
      pillow: [7.875, 18.25, 3.30],
      foot: [7.875, 12.80, 2.70],
      standPoint: [11.20, 15.625, 1.50],
      box: [5.375, 10.375, 12.375, 18.875, 1.500, 3.200],
      sleepBasis: {
        x: [-1, 0, 0],
        y: [0, 0, -1],
        z: [0, -1, 0]
      },
      yaw: Math.PI
    },
    {
      id: 'BED-1F-MASTER',
      colliderId: 'COL-MB-01',
      name: 'Master King Bed',
      floor: 'first_floor',
      floorElev: 12.00,
      center: [7.00, 20.00, 13.20],
      pillow: [7.00, 22.50, 13.80],
      foot: [7.00, 17.20, 13.20],
      standPoint: [10.80, 19.50, 12.00],
      box: [4.000, 10.000, 16.750, 23.250, 12.000, 13.800],
      sleepBasis: {
        x: [-1, 0, 0],
        y: [0, 0, -1],
        z: [0, -1, 0]
      },
      yaw: Math.PI
    },
    {
      id: 'BED-1F-CHILD',
      colliderId: 'COL-CH-01',
      name: 'Child Bedroom Bed',
      floor: 'first_floor',
      floorElev: 12.00,
      center: [46.00, 15.50, 13.10],
      pillow: [48.00, 15.50, 13.70],
      foot: [43.30, 15.50, 13.10],
      standPoint: [46.00, 12.20, 12.00],
      box: [42.750, 49.250, 13.500, 17.500, 12.000, 13.700],
      sleepBasis: {
        x: [0, 0, -1],
        y: [1, 0, 0],
        z: [0, -1, 0]
      },
      yaw: Math.PI / 2
    }
  ],

  seating: [
    {
      id: 'SOFA-GF-LIVING',
      colliderId: 'COL-LOB-01',
      name: 'Living Room Sofa',
      floor: 'ground_floor',
      floorElev: 1.50,
      seatCenter: [17.90, 21.10, 2.25],
      sitEyeElev: 3.95,
      standPoint: [20.50, 21.10, 1.50],
      box: [16.250, 19.000, 19.000, 23.200, 1.500, 3.400],
      yaw: -Math.PI / 2 // facing East into room
    },
    {
      id: 'SOFA-1F-LOBBY',
      colliderId: 'COL-LB-01',
      name: 'Lobby Sofa',
      floor: 'first_floor',
      floorElev: 12.00,
      seatCenter: [18.55, 6.75, 12.80],
      sitEyeElev: 14.45,
      standPoint: [20.80, 6.75, 12.00],
      box: [16.800, 19.550, 3.500, 10.000, 12.000, 14.800],
      yaw: -Math.PI / 2 // facing East into room
    },
    {
      id: 'CHAIR-GF-DIN-1',
      colliderId: 'COL-LOB-14',
      name: 'Dining Chair',
      floor: 'ground_floor',
      floorElev: 1.50,
      seatCenter: [18.50, 15.25, 2.30],
      sitEyeElev: 3.95,
      standPoint: [18.50, 16.60, 1.50],
      box: [17.750, 19.250, 14.500, 16.000, 1.500, 3.100],
      yaw: Math.PI // facing South
    },
    {
      id: 'CHAIR-GF-DIN-2',
      colliderId: 'COL-LOB-15',
      name: 'Dining Chair',
      floor: 'ground_floor',
      floorElev: 1.50,
      seatCenter: [20.50, 15.25, 2.30],
      sitEyeElev: 3.95,
      standPoint: [20.50, 16.60, 1.50],
      box: [19.750, 21.250, 14.500, 16.000, 1.500, 3.100],
      yaw: Math.PI
    },
    {
      id: 'CHAIR-GF-DIN-3',
      colliderId: 'COL-LOB-16',
      name: 'Dining Chair',
      floor: 'ground_floor',
      floorElev: 1.50,
      seatCenter: [18.50, 12.50, 2.30],
      sitEyeElev: 3.95,
      standPoint: [18.50, 11.20, 1.50],
      box: [17.750, 19.250, 11.750, 13.250, 1.500, 3.100],
      yaw: 0 // facing North
    },
    {
      id: 'CHAIR-GF-DIN-4',
      colliderId: 'COL-LOB-17',
      name: 'Dining Chair',
      floor: 'ground_floor',
      floorElev: 1.50,
      seatCenter: [20.50, 12.50, 2.30],
      sitEyeElev: 3.95,
      standPoint: [20.50, 11.20, 1.50],
      box: [19.750, 21.250, 11.750, 13.250, 1.500, 3.100],
      yaw: 0
    },
    {
      id: 'CHAIR-1F-DIN-WEST',
      colliderId: 'COL-LB-14',
      name: 'Dining Chair',
      floor: 'first_floor',
      floorElev: 12.00,
      seatCenter: [16.85, 13.50, 12.80],
      sitEyeElev: 14.45,
      standPoint: [15.30, 13.50, 12.00],
      box: [16.000, 17.700, 12.750, 14.250, 12.000, 13.600],
      yaw: -Math.PI / 2 // facing East
    },
    {
      id: 'CHAIR-1F-DIN-EAST',
      colliderId: 'COL-LB-15',
      name: 'Dining Chair',
      floor: 'first_floor',
      floorElev: 12.00,
      seatCenter: [23.15, 13.50, 12.80],
      sitEyeElev: 14.45,
      standPoint: [24.70, 13.50, 12.00],
      box: [22.300, 24.000, 12.750, 14.250, 12.000, 13.600],
      yaw: Math.PI / 2 // facing West
    },
    {
      id: 'CHAIR-1F-DIN-SL',
      colliderId: 'COL-LB-16',
      name: 'Dining Chair',
      floor: 'first_floor',
      floorElev: 12.00,
      seatCenter: [18.75, 11.50, 12.80],
      sitEyeElev: 14.45,
      standPoint: [18.75, 10.20, 12.00],
      box: [18.000, 19.500, 10.750, 12.250, 12.000, 13.600],
      yaw: 0 // facing North
    },
    {
      id: 'CHAIR-1F-DIN-SR',
      colliderId: 'COL-LB-17',
      name: 'Dining Chair',
      floor: 'first_floor',
      floorElev: 12.00,
      seatCenter: [21.25, 11.50, 12.80],
      sitEyeElev: 14.45,
      standPoint: [21.25, 10.20, 12.00],
      box: [20.500, 22.000, 10.750, 12.250, 12.000, 13.600],
      yaw: 0
    },
    {
      id: 'CHAIR-1F-DIN-NL',
      colliderId: 'COL-LB-18',
      name: 'Dining Chair',
      floor: 'first_floor',
      floorElev: 12.00,
      seatCenter: [18.75, 15.35, 12.80],
      sitEyeElev: 14.45,
      standPoint: [18.75, 16.60, 12.00],
      box: [18.000, 19.500, 14.750, 16.000, 12.000, 13.600],
      yaw: Math.PI // facing South
    },
    {
      id: 'CHAIR-1F-DIN-NR',
      colliderId: 'COL-LB-19',
      name: 'Dining Chair',
      floor: 'first_floor',
      floorElev: 12.00,
      seatCenter: [21.25, 15.35, 12.80],
      sitEyeElev: 14.45,
      standPoint: [21.25, 16.60, 12.00],
      box: [20.500, 22.000, 14.750, 16.000, 12.000, 13.600],
      yaw: Math.PI
    },
    {
      id: 'CHAIR-1F-STUDY',
      colliderId: 'COL-CH-11',
      name: 'Study Chair',
      floor: 'first_floor',
      floorElev: 12.00,
      seatCenter: [43.00, 20.75, 12.80],
      sitEyeElev: 14.45,
      standPoint: [44.50, 20.75, 12.00],
      box: [42.250, 43.750, 20.000, 21.500, 12.000, 13.600],
      yaw: Math.PI / 2 // facing West towards desk
    }
  ],

  toilets: [
    {
      id: 'TOILET-GF-WEST',
      colliderId: 'COL-WW-01',
      name: 'West Bathroom Toilet',
      floor: 'ground_floor',
      floorElev: 1.50,
      cx: 8.625,
      wallY: 23.25,
      standPoint: [8.625, 20.20, 1.50],
      sitEyeElev: 3.95,
      box: [7.850, 9.400, 21.000, 23.250, 1.500, 3.400],
      yaw: Math.PI
    },
    {
      id: 'TOILET-GF-EAST',
      colliderId: 'COL-EW-01',
      name: 'East Bathroom Toilet',
      floor: 'ground_floor',
      floorElev: 1.50,
      cx: 37.375,
      wallY: 23.25,
      standPoint: [37.375, 20.20, 1.50],
      sitEyeElev: 3.95,
      box: [36.750, 38.000, 21.000, 23.250, 1.500, 3.400],
      yaw: Math.PI
    },
    {
      id: 'TOILET-1F-BATH1',
      colliderId: 'COL-B1-01',
      name: 'Bathroom 1 Toilet',
      floor: 'first_floor',
      floorElev: 12.00,
      cx: 21.625,
      wallY: 23.25,
      standPoint: [21.625, 20.20, 12.00],
      sitEyeElev: 14.45,
      box: [21.000, 22.250, 21.000, 23.250, 12.000, 13.900],
      yaw: Math.PI
    },
    {
      id: 'TOILET-1F-BATH2',
      colliderId: 'COL-B2-01',
      name: 'Bathroom 2 Toilet',
      floor: 'first_floor',
      floorElev: 12.00,
      cx: 36.025,
      wallY: 23.25,
      standPoint: [36.025, 20.20, 12.00],
      sitEyeElev: 14.45,
      box: [35.400, 36.650, 21.000, 23.250, 12.000, 13.900],
      yaw: Math.PI
    }
  ]
};

function createContouredLidGeo(s) {
  const w = 0.86 * s;
  const L = 1.18 * s;
  const r = w / 2;

  const shape = new THREE.Shape();
  shape.moveTo(-w / 2, 0);
  shape.lineTo(w / 2, 0);
  shape.lineTo(w / 2, L - r);
  shape.absarc(0, L - r, r, 0, Math.PI, false);
  shape.lineTo(-w / 2, 0);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.036 * s,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.018 * s,
    bevelThickness: 0.014 * s
  });
  geo.rotateX(Math.PI / 2);
  return geo;
}

function createContouredSeatGeo(s) {
  const w = 0.84 * s;
  const L = 1.16 * s;
  const r = w / 2;

  const shape = new THREE.Shape();
  shape.moveTo(-w / 2, 0);
  shape.lineTo(w / 2, 0);
  shape.lineTo(w / 2, L - r);
  shape.absarc(0, L - r, r, 0, Math.PI, false);
  shape.lineTo(-w / 2, 0);

  const hw = 0.48 * s;
  const hL = 0.74 * s;
  const hr = hw / 2;
  const holeY = 0.16 * s;

  const hole = new THREE.Path();
  hole.moveTo(-hw / 2, holeY);
  hole.lineTo(hw / 2, holeY);
  hole.lineTo(hw / 2, holeY + hL - hr);
  hole.absarc(0, holeY + hL - hr, hr, 0, Math.PI, false);
  hole.lineTo(-hw / 2, holeY);
  shape.holes.push(hole);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.038 * s,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.018 * s,
    bevelThickness: 0.014 * s
  });
  geo.rotateX(Math.PI / 2);
  return geo;
}

class FurnitureAudio {
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

  playBedRustle() {
    try {
      const ctx = this.ensureContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const bufSize = Math.floor(ctx.sampleRate * 0.45);
      const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.16));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buf;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1100, now);
      filter.Q.setValueAtTime(1.8, now);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);
    } catch {
      // Audio fallback
    }
  }

  playCushionSit() {
    try {
      const ctx = this.ensureContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const bufSize = Math.floor(ctx.sampleRate * 0.35);
      const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.10));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buf;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(260, now);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);
    } catch {
      // Audio fallback
    }
  }

  playToiletLid(isOpen) {
    try {
      const ctx = this.ensureContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (isOpen) {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.exponentialRampToValueAtTime(160, now + 0.22);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      } else {
        // Ceramic lid closing clack
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(70, now + 0.12);
        gain.gain.setValueAtTime(0.28, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // Audio fallback
    }
  }

  playToiletFlush() {
    try {
      const ctx = this.ensureContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const duration = 3.4;

      // 1. Dual white noise swirl (whoosh of rushing water)
      const bufSize = Math.floor(ctx.sampleRate * duration);
      const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buf;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(450, now);
      filter.frequency.exponentialRampToValueAtTime(950, now + 0.8);
      filter.frequency.exponentialRampToValueAtTime(280, now + duration);
      filter.Q.setValueAtTime(1.5, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0.32, now + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.005, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);

      // 2. Tank refill hiss
      const refillOsc = ctx.createOscillator();
      const refillGain = ctx.createGain();
      refillOsc.type = 'triangle';
      refillOsc.frequency.setValueAtTime(190, now + 1.2);
      refillOsc.frequency.linearRampToValueAtTime(320, now + duration);
      refillGain.gain.setValueAtTime(0, now);
      refillGain.gain.setValueAtTime(0.04, now + 1.2);
      refillGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      refillOsc.connect(refillGain);
      refillGain.connect(ctx.destination);
      refillOsc.start(now + 1.2);
      refillOsc.stop(now + duration);
    } catch {
      // Audio fallback
    }
  }
}

export class FurnitureManager {
  constructor(materialLibrary, collisionSystem = null) {
    this.materials = materialLibrary;
    this.collision = collisionSystem;
    this.audio = new FurnitureAudio();

    this.rootGroup = new THREE.Group();
    this.rootGroup.name = 'InteractiveFurnitureRoot';

    this.items = [];
    this.interactiveMeshes = [];
    this.raycaster = new THREE.Raycaster();
    this.raycaster.far = 12 * WORLD_SCALE;

    this.targetedItem = null;
    this.targetedAction = null;
    this.isDirectHit = false;
    this.targetedDistance = Infinity;
    this.promptLabel = null;

    this.activeState = 'none'; // 'none' | 'sitting' | 'sleeping'
    this.activeItem = null;

    this.sleepFade = 0;
    this.sleepTargetFade = 0;
  }

  buildFurniture(scene) {
    const s = WORLD_SCALE;

    const sanitaryMat = this.materials.get('M-SANITARY-WHITE') || new THREE.MeshStandardMaterial({
      color: '#FFFFFF',
      roughness: 0.18,
      metalness: 0.05
    });

    const chromeMat = this.materials.get('M-CHROME') || new THREE.MeshStandardMaterial({
      color: '#F4F6F6',
      metalness: 0.98,
      roughness: 0.08
    });

    const waterMat = new THREE.MeshStandardMaterial({
      color: '#5DADE2',
      roughness: 0.05,
      metalness: 0.10,
      transparent: true,
      opacity: 0.75,
      depthWrite: false
    });

    // 1. Build Interactive Beds
    FURNITURE_SPECS.beds.forEach(spec => {
      const [xmin, xmax, ymin, ymax, zmin, zmax] = spec.box;
      const width = (xmax - xmin) * s;
      const depth = (ymax - ymin) * s;
      const height = (zmax - zmin) * s;
      const cx = ((xmin + xmax) / 2) * s;
      const cy = ((zmin + zmax) / 2) * s;
      const cz = -((ymin + ymax) / 2) * s;

      const box3 = new THREE.Box3(
        new THREE.Vector3(xmin * s, zmin * s, -ymax * s),
        new THREE.Vector3(xmax * s, zmax * s, -ymin * s)
      );

      const hitGeo = new THREE.BoxGeometry(width, height * 1.3, depth);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.position.set(cx, cy, cz);
      this.rootGroup.add(hitMesh);

      // Precomputed basis matrix and quaternion for lying down horizontally flat
      const basis = spec.sleepBasis;
      const sleepMat = new THREE.Matrix4().makeBasis(
        new THREE.Vector3(...basis.x),
        new THREE.Vector3(...basis.y),
        new THREE.Vector3(...basis.z)
      );
      const sleepQuat = new THREE.Quaternion().setFromRotationMatrix(sleepMat);

      const footWorldPos = new THREE.Vector3(
        spec.foot[0] * s,
        (spec.foot[2] + 0.35) * s,
        -spec.foot[1] * s
      );

      const pillowWorldPos = new THREE.Vector3(
        spec.pillow[0] * s,
        (spec.pillow[2] + 0.45) * s,
        -spec.pillow[1] * s
      );

      const centerWorldPos = new THREE.Vector3(
        spec.center[0] * s,
        (spec.center[2] + 0.60) * s,
        -spec.center[1] * s
      );

      const standFloorElev = spec.floorElev * s;
      const standPosition = new THREE.Vector3(
        spec.standPoint[0] * s,
        standFloorElev + 4.9 * s,
        -spec.standPoint[1] * s
      );

      const bedObj = {
        spec,
        id: spec.id,
        colliderId: spec.colliderId || null,
        name: spec.name,
        type: 'bed',
        floor: spec.floor,
        hitMesh,
        box3,
        worldCenter: new THREE.Vector3(cx, cy, cz),
        footWorldPos,
        pillowWorldPos,
        centerWorldPos,
        standPosition,
        standFloorElev,
        sleepQuat,
        yaw: spec.yaw
      };

      hitMesh.userData = { furniture: bedObj, type: 'bed' };
      this.interactiveMeshes.push(hitMesh);
      this.items.push(bedObj);
    });

    // 2. Build Interactive Seating (Sofas & Chairs)
    FURNITURE_SPECS.seating.forEach(spec => {
      const [xmin, xmax, ymin, ymax, zmin, zmax] = spec.box;
      const width = (xmax - xmin) * s;
      const depth = (ymax - ymin) * s;
      const height = (zmax - zmin) * s;
      const cx = ((xmin + xmax) / 2) * s;
      const cy = ((zmin + zmax) / 2) * s;
      const cz = -((ymin + ymax) / 2) * s;

      const box3 = new THREE.Box3(
        new THREE.Vector3(xmin * s, zmin * s, -ymax * s),
        new THREE.Vector3(xmax * s, zmax * s, -ymin * s)
      );

      const hitGeo = new THREE.BoxGeometry(width * 1.15, height * 1.3, depth * 1.15);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.position.set(cx, cy, cz);
      this.rootGroup.add(hitMesh);

      const standFloorElev = spec.floorElev * s;
      const seatWorldPos = new THREE.Vector3(
        spec.seatCenter[0] * s,
        standFloorElev,
        -spec.seatCenter[1] * s
      );
      const sitPosition = new THREE.Vector3(
        spec.seatCenter[0] * s,
        spec.sitEyeElev * s,
        -spec.seatCenter[1] * s
      );
      const standPosition = new THREE.Vector3(
        spec.standPoint[0] * s,
        standFloorElev + 4.9 * s,
        -spec.standPoint[1] * s
      );

      const seatObj = {
        spec,
        id: spec.id,
        colliderId: spec.colliderId || null,
        name: spec.name,
        type: 'chair',
        floor: spec.floor,
        hitMesh,
        box3,
        worldCenter: new THREE.Vector3(cx, cy, cz),
        seatWorldPos,
        sitPosition,
        standPosition,
        standFloorElev,
        yaw: spec.yaw
      };

      hitMesh.userData = { furniture: seatObj, type: 'chair' };
      this.interactiveMeshes.push(hitMesh);
      this.items.push(seatObj);
    });

    // 3. Build Realistic Interactive Toilets with Contoured Lid, Seat & Prominent Flush
    FURNITURE_SPECS.toilets.forEach(spec => {
      const group = new THREE.Group();
      group.name = `ToiletGroup_${spec.id}`;

      const standFloorElev = spec.floorElev * s;
      const originX = spec.cx * s;
      const originY = standFloorElev;
      const originZ = -spec.wallY * s;
      group.position.set(originX, originY, originZ);

      // In group local coords:
      // Z=0 is back against North bathroom wall; +Z extends forward into room (South).
      // Y=0 is bathroom floor level; +Y is UP.

      // ── A. Cistern Tank & Cistern Lid ──
      const cisternGeo = new THREE.BoxGeometry(1.35 * s, 1.45 * s, 0.52 * s);
      const cisternMesh = new THREE.Mesh(cisternGeo, sanitaryMat);
      cisternMesh.position.set(0, 1.45 * s, 0.30 * s);
      cisternMesh.castShadow = true;
      cisternMesh.receiveShadow = true;
      group.add(cisternMesh);

      const cisternLidGeo = new THREE.BoxGeometry(1.42 * s, 0.09 * s, 0.58 * s);
      const cisternLidMesh = new THREE.Mesh(cisternLidGeo, sanitaryMat);
      cisternLidMesh.position.set(0, 2.22 * s, 0.30 * s);
      cisternLidMesh.castShadow = true;
      group.add(cisternLidMesh);

      // ── B. Prominent Chrome Dual Flush Button (Top of Cistern) ──
      const btnBezelGeo = new THREE.CylinderGeometry(0.11 * s, 0.12 * s, 0.03 * s, 24);
      const btnBezelMesh = new THREE.Mesh(btnBezelGeo, chromeMat);
      btnBezelMesh.position.set(0, 2.28 * s, 0.32 * s);
      group.add(btnBezelMesh);

      // Dual push buttons (left half-flush, right full-flush)
      const btnGeo = new THREE.CylinderGeometry(0.095 * s, 0.095 * s, 0.045 * s, 24);
      const btnMesh = new THREE.Mesh(btnGeo, chromeMat);
      btnMesh.position.set(0, 2.30 * s, 0.32 * s);
      btnMesh.name = `ToiletFlushBtn_${spec.id}`;
      group.add(btnMesh);

      // Center divider groove line on button
      const dividerGeo = new THREE.BoxGeometry(0.012 * s, 0.05 * s, 0.19 * s);
      const dividerMat = new THREE.MeshBasicMaterial({ color: '#2C3E50' });
      const dividerMesh = new THREE.Mesh(dividerGeo, dividerMat);
      dividerMesh.position.set(0, 2.305 * s, 0.32 * s);
      group.add(dividerMesh);

      // Generous hit collider for the flush button
      const btnHitGeo = new THREE.CylinderGeometry(0.20 * s, 0.20 * s, 0.30 * s, 16);
      const btnHitMat = new THREE.MeshBasicMaterial({ visible: false });
      const btnHitMesh = new THREE.Mesh(btnHitGeo, btnHitMat);
      btnHitMesh.position.set(0, 2.31 * s, 0.32 * s);
      group.add(btnHitMesh);

      // ── C. Bowl Pedestal & Contoured Ceramic Body ──
      const baseGeo = new THREE.BoxGeometry(0.85 * s, 0.50 * s, 1.35 * s);
      const baseMesh = new THREE.Mesh(baseGeo, sanitaryMat);
      baseMesh.position.set(0, 0.25 * s, 1.25 * s);
      baseMesh.castShadow = true;
      group.add(baseMesh);

      const bowlGeo = new THREE.CylinderGeometry(0.55 * s, 0.42 * s, 0.90 * s, 24);
      const bowlMesh = new THREE.Mesh(bowlGeo, sanitaryMat);
      bowlMesh.scale.set(1.0, 1.0, 1.35); // oval bowl
      bowlMesh.position.set(0, 0.90 * s, 1.35 * s);
      bowlMesh.castShadow = true;
      bowlMesh.receiveShadow = true;
      group.add(bowlMesh);

      // ── D. Inner Bowl Cavity & Swirling Flush Water Disc ──
      const bowlWellGeo = new THREE.CylinderGeometry(0.42 * s, 0.26 * s, 0.60 * s, 20);
      const bowlWellMat = new THREE.MeshStandardMaterial({
        color: '#EBF5FB',
        roughness: 0.15,
        metalness: 0.05
      });
      const bowlWellMesh = new THREE.Mesh(bowlWellGeo, bowlWellMat);
      bowlWellMesh.scale.set(1.0, 1.0, 1.30);
      bowlWellMesh.position.set(0, 1.08 * s, 1.35 * s);
      group.add(bowlWellMesh);

      const waterDiscGeo = new THREE.CircleGeometry(0.26 * s, 20);
      const bowlWaterMesh = new THREE.Mesh(waterDiscGeo, waterMat);
      bowlWaterMesh.rotation.x = -Math.PI / 2;
      bowlWaterMesh.position.set(0, 0.82 * s, 1.35 * s);
      group.add(bowlWaterMesh);

      // ── E. Chrome Hinge Pivot & Contoured Circular/D-Shaped Seat Ring ──
      const hingePivot = new THREE.Group();
      hingePivot.name = `ToiletHinge_${spec.id}`;
      hingePivot.position.set(0, 1.40 * s, 0.65 * s);
      group.add(hingePivot);

      // Chrome hinge bracket pin
      const hingeBarGeo = new THREE.CylinderGeometry(0.025 * s, 0.025 * s, 0.45 * s, 16);
      const hingeBarMesh = new THREE.Mesh(hingeBarGeo, chromeMat);
      hingeBarMesh.rotation.z = Math.PI / 2;
      hingePivot.add(hingeBarMesh);

      // Contoured Seat Ring: smooth rounded porcelain with central oval hole
      const seatGeo = createContouredSeatGeo(s);
      const seatMesh = new THREE.Mesh(seatGeo, sanitaryMat);
      seatMesh.position.set(0, 1.38 * s, 0.65 * s);
      seatMesh.castShadow = true;
      group.add(seatMesh);

      // ── F. Contoured Circular/D-Shaped Toilet Lid Cover (Matches Seat) ──
      const lidGeo = createContouredLidGeo(s);
      const lidMesh = new THREE.Mesh(lidGeo, sanitaryMat);
      // In hinge local space, sits above seat ring and tilts back with hinge
      lidMesh.position.set(0, 0.038 * s, 0);
      lidMesh.castShadow = true;
      hingePivot.add(lidMesh);

      // Bounding box for proximity distance checking
      const [xmin, xmax, ymin, ymax, zmin, zmax] = spec.box;
      const box3 = new THREE.Box3(
        new THREE.Vector3(xmin * s, zmin * s, -ymax * s),
        new THREE.Vector3(xmax * s, zmax * s, -ymin * s)
      );

      this.rootGroup.add(group);

      const toiletObj = {
        spec,
        id: spec.id,
        colliderId: spec.colliderId || null,
        name: spec.name,
        type: 'toilet',
        floor: spec.floor,
        group,
        lidPivot: hingePivot,
        lidMesh,
        seatMesh,
        bowlMesh,
        btnMesh,
        btnHitMesh,
        cisternMesh,
        cisternLidMesh,
        bowlWaterMesh,
        box3,
        isLidOpen: false,
        targetAngle: 0,
        currentAngle: 0,
        isFlushing: false,
        flushTime: 0,
        worldCenter: new THREE.Vector3(originX, originY + 1.2 * s, originZ + 1.2 * s),
        seatWorldPos: new THREE.Vector3(originX, standFloorElev, originZ + 1.35 * s),
        sitPosition: new THREE.Vector3(originX, spec.sitEyeElev * s, originZ + 1.35 * s),
        standPosition: new THREE.Vector3(
          spec.standPoint[0] * s,
          standFloorElev + 4.9 * s,
          -spec.standPoint[1] * s
        ),
        standFloorElev,
        yaw: spec.yaw
      };

      // Set explicit interactive metadata on individual toilet meshes
      btnHitMesh.userData = { furniture: toiletObj, targetType: 'toilet_flush' };
      btnMesh.userData = { furniture: toiletObj, targetType: 'toilet_flush' };
      cisternLidMesh.userData = { furniture: toiletObj, targetType: 'toilet_flush' };
      cisternMesh.userData = { furniture: toiletObj, targetType: 'toilet_tank' };
      lidMesh.userData = { furniture: toiletObj, targetType: 'toilet_lid' };
      seatMesh.userData = { furniture: toiletObj, targetType: 'toilet_seat' };
      bowlMesh.userData = { furniture: toiletObj, targetType: 'toilet_bowl' };

      // Push only direct visual sub-meshes for raycast (NO enclosing box!)
      this.interactiveMeshes.push(btnHitMesh, btnMesh, cisternLidMesh, lidMesh, seatMesh, bowlMesh);
      this.items.push(toiletObj);
    });

    scene.add(this.rootGroup);
    return this.rootGroup;
  }

  openToiletLid(toilet) {
    if (toilet.isLidOpen) return;
    toilet.isLidOpen = true;
    toilet.targetAngle = -Math.PI * 0.58; // tilted ~104° back against cistern
    this.audio.playToiletLid(true);
  }

  closeToiletLid(toilet) {
    if (!toilet.isLidOpen) return;
    toilet.isLidOpen = false;
    toilet.targetAngle = 0;
    this.audio.playToiletLid(false);
  }

  toggleToiletLid(toilet) {
    if (toilet.isLidOpen) {
      this.closeToiletLid(toilet);
    } else {
      this.openToiletLid(toilet);
    }
  }

  flushToilet(toilet) {
    if (toilet.isFlushing) return;
    toilet.isFlushing = true;
    toilet.flushTime = 0;
    this.audio.playToiletFlush();
  }

  occupyItem(item, player, avatar, cameraCtrl, ui) {
    if (this.collision && item.colliderId) {
      this.collision.setColliderDisabled(item.colliderId, true);
    }

    if (item.type === 'bed') {
      this.activeState = 'sleeping';
      this.activeItem = item;
      this.sleepTargetFade = 1.0;
      this.audio.playBedRustle();

      if (avatar) {
        avatar.setSleeping(item.footWorldPos, item.sleepQuat);
      }

      player.position.copy(item.centerWorldPos);
      player.feetElevation = item.standFloorElev;
      player.velocityY = 0;
      player.isGrounded = true;

      if (ui) ui.showToast('Resting in bed... Press [E] or [Space] to wake up');
    } else if (item.type === 'chair' || item.type === 'toilet') {
      this.activeState = 'sitting';
      this.activeItem = item;
      this.audio.playCushionSit();

      if (avatar) {
        avatar.setSitting(item.seatWorldPos, item.yaw);
      }

      player.position.copy(item.sitPosition);
      player.feetElevation = item.standFloorElev;
      player.velocityY = 0;
      player.isGrounded = true;

      if (ui) ui.showToast(`Seated on ${item.name}. Press [E] or [Space] to stand up`);
    }
  }

  leaveItem(player, avatar, cameraCtrl, ui) {
    if (this.activeState === 'none' || !this.activeItem) return;

    const item = this.activeItem;
    if (this.collision && item.colliderId) {
      this.collision.setColliderDisabled(item.colliderId, false);
    }

    this.activeState = 'none';
    this.activeItem = null;
    this.sleepTargetFade = 0;

    if (avatar) {
      avatar.setStanding();
    }

    player.position.copy(item.standPosition);
    player.feetElevation = item.standFloorElev;
    player.velocityY = 0;
    player.isGrounded = true;

    if (ui) {
      ui.hideInteractionPrompt();
      ui.showToast('Standing up');
    }
  }

  interact(player, avatar, cameraCtrl, ui, showPrompt = false) {
    if (this.activeState !== 'none') {
      // If seated on toilet and looking at the flush button, allow flushing while seated!
      if (this.activeState === 'sitting' && this.activeItem?.type === 'toilet' && this.targetedAction === 'flush') {
        this.flushToilet(this.activeItem);
        return;
      }
      this.leaveItem(player, avatar, cameraCtrl, ui);
      return;
    }

    if (!this.targetedItem) return;

    const item = this.targetedItem;

    if (item.type === 'bed') {
      this.occupyItem(item, player, avatar, cameraCtrl, ui);
    } else if (item.type === 'chair') {
      this.occupyItem(item, player, avatar, cameraCtrl, ui);
    } else if (item.type === 'toilet') {
      const action = this.targetedAction;
      if (action === 'flush') {
        this.flushToilet(item);
      } else if (action === 'close_lid') {
        this.closeToiletLid(item);
      } else if (action === 'open_lid') {
        this.openToiletLid(item);
      } else if (action === 'sit') {
        if (!item.isLidOpen) {
          this.openToiletLid(item);
        } else {
          this.occupyItem(item, player, avatar, cameraCtrl, ui);
        }
      } else {
        this.toggleToiletLid(item);
      }
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
      while (cur && !cur.userData?.furniture) cur = cur.parent;
      if (cur && cur.userData?.furniture) {
        const item = cur.userData.furniture;
        if (item.type === 'toilet') {
          this.toggleToiletLid(item);
        }
      }
    }
  }

  update(delta, camera, playerPosition, isFPActive, player, avatar, cameraCtrl, ui, showPrompt = false, isOtherTargeted = false) {
    const s = WORLD_SCALE;

    // 1. Animate toilet lids & swirling flush water disc
    this.items.forEach(item => {
      if (item.type === 'toilet') {
        item.currentAngle = THREE.MathUtils.lerp(item.currentAngle, item.targetAngle, delta * 9.0);
        item.lidPivot.rotation.x = item.currentAngle;

        if (item.isFlushing) {
          item.flushTime += delta;
          item.bowlWaterMesh.rotation.z += delta * 14.0;
          const swirlDip = Math.sin(item.flushTime * 2.2) * 0.05 * s;
          item.bowlWaterMesh.position.y = 0.82 * s - swirlDip;

          if (item.flushTime > 3.4) {
            item.isFlushing = false;
            item.bowlWaterMesh.position.y = 0.82 * s;
          }
        }
      }
    });

    // 2. Occupied state updates (Sitting or Sleeping)
    if (this.activeState !== 'none' && this.activeItem) {
      if (this.activeState === 'sitting') {
        player.position.copy(this.activeItem.sitPosition);
      } else if (this.activeState === 'sleeping') {
        player.position.copy(this.activeItem.centerWorldPos);
      }

      // Check if player is seated on toilet and looking at the flush button / cistern
      if (this.activeState === 'sitting' && this.activeItem.type === 'toilet' && camera) {
        this.raycaster.setFromCamera({ x: 0, y: 0 }, camera);
        const flushMeshes = [
          this.activeItem.btnHitMesh,
          this.activeItem.btnMesh,
          this.activeItem.cisternLidMesh
        ];
        const hit = this.raycaster.intersectObjects(flushMeshes, false);
        if (hit.length > 0 && hit[0].distance <= 5.0 * s) {
          this.targetedItem = this.activeItem;
          this.targetedAction = 'flush';
          this.isDirectHit = true;
          this.targetedDistance = hit[0].distance;
          this.promptLabel = `[E] Flush ${this.activeItem.name} | [Space] Stand Up`;
          if (ui && showPrompt) {
            ui.showInteractionPrompt(this.promptLabel);
          }
          return;
        }
      }

      this.targetedAction = null;
      this.isDirectHit = true;
      this.targetedDistance = 0;
      this.promptLabel = `[E / Space] ${this.activeState === 'sleeping' ? 'Wake Up' : 'Stand Up'}`;
      if (ui && showPrompt) {
        ui.showInteractionPrompt(this.promptLabel);
      }
      return;
    }

    // 3. Proximity targeting (when standing)
    if (!isFPActive || !camera || !playerPosition) {
      if (this.targetedItem) {
        this.targetedItem = null;
        this.targetedAction = null;
        this.isDirectHit = false;
        this.targetedDistance = Infinity;
        this.promptLabel = null;
        if (ui && !isOtherTargeted) ui.hideInteractionPrompt();
      }
      return;
    }

    const reach = 7.5 * s;
    const activeItems = this.items.filter(item => {
      const distToBox = item.box3.distanceToPoint(playerPosition);
      return distToBox <= reach;
    });

    let bestItem = null;
    let bestAction = null;
    let closestDist = Infinity;
    let isDirectHit = false;

    // Reticle raycast against all sub-meshes
    this.raycaster.setFromCamera({ x: 0, y: 0 }, camera);
    const candidateMeshes = [];
    activeItems.forEach(item => {
      if (item.type === 'toilet') {
        // Individual visual meshes only (NO giant enclosing hit box!)
        candidateMeshes.push(
          item.btnHitMesh,
          item.btnMesh,
          item.cisternLidMesh,
          item.lidMesh,
          item.seatMesh,
          item.bowlMesh
        );
      } else {
        candidateMeshes.push(item.hitMesh);
      }
    });

    const intersects = this.raycaster.intersectObjects(candidateMeshes, false);

    if (intersects.length > 0) {
      const hit = intersects[0];
      const hitObj = hit.object;
      const fData = hitObj.userData;
      if (fData && fData.furniture && hit.distance <= reach) {
        const item = fData.furniture;
        bestItem = item;
        closestDist = hit.distance;
        isDirectHit = true;

        if (item.type === 'toilet') {
          const tType = fData.targetType;
          if (tType === 'toilet_flush') {
            bestAction = 'flush';
          } else if (tType === 'toilet_lid') {
            bestAction = item.isLidOpen ? 'close_lid' : 'open_lid';
          } else if (tType === 'toilet_seat' || tType === 'toilet_bowl') {
            bestAction = item.isLidOpen ? 'sit' : 'open_lid';
          } else {
            bestAction = item.isLidOpen ? 'close_lid' : 'open_lid';
          }
        } else if (item.type === 'bed') {
          bestAction = 'sleep';
        } else if (item.type === 'chair') {
          bestAction = 'sit';
        }
      }
    }

    // Look angle fallback only if raycast didn't hit any candidate directly
    if (!bestItem && activeItems.length > 0) {
      const camDir = new THREE.Vector3();
      camera.getWorldDirection(camDir);

      activeItems.forEach(item => {
        const toItem = new THREE.Vector3().subVectors(item.worldCenter, camera.position);
        const dist = toItem.length();
        toItem.normalize();
        const dot = camDir.dot(toItem);
        if (dot > 0.82 && dist <= 5.5 * s && dist < closestDist) {
          closestDist = dist;
          bestItem = item;
          isDirectHit = false;
          if (item.type === 'toilet') {
            bestAction = item.isLidOpen ? 'sit' : 'open_lid';
          } else if (item.type === 'bed') {
            bestAction = 'sleep';
          } else if (item.type === 'chair') {
            bestAction = 'sit';
          }
        }
      });
    }

    this.targetedItem = bestItem;
    this.targetedAction = bestAction;
    this.isDirectHit = isDirectHit;
    this.targetedDistance = closestDist;

    let label = null;
    if (this.targetedItem) {
      if (this.targetedItem.type === 'bed') {
        label = `[E] Sleep on ${this.targetedItem.name}`;
      } else if (this.targetedItem.type === 'chair') {
        label = `[E] Sit on ${this.targetedItem.name}`;
      } else if (this.targetedItem.type === 'toilet') {
        if (this.targetedAction === 'flush') {
          label = `[E] Flush ${this.targetedItem.name}`;
        } else if (this.targetedAction === 'close_lid') {
          label = `[E] Close ${this.targetedItem.name} Lid`;
        } else if (this.targetedAction === 'open_lid') {
          label = `[E] Open ${this.targetedItem.name} Lid`;
        } else if (this.targetedAction === 'sit') {
          label = `[E] Sit on ${this.targetedItem.name}`;
        } else {
          label = this.targetedItem.isLidOpen
            ? `[E] Close ${this.targetedItem.name} Lid`
            : `[E] Open ${this.targetedItem.name} Lid`;
        }
      }
    }
    this.promptLabel = label;

    if (ui && !isOtherTargeted) {
      if (this.promptLabel && showPrompt) {
        ui.showInteractionPrompt(this.promptLabel);
      } else if (!isOtherTargeted) {
        ui.hideInteractionPrompt();
      }
    }
  }

  setFloorFilter(filter) {
    this.items.forEach(item => {
      const isVisible = (filter === 'all') || (item.floor === filter);
      if (item.group) {
        item.group.visible = isVisible;
      }
      if (item.hitMesh) {
        item.hitMesh.visible = isVisible;
      }
    });
  }

  getRoot() {
    return this.rootGroup;
  }
}
