import * as THREE from 'three';
import { WORLD_SCALE } from '../config/constants.js';

/**
 * 12 CAD-Accurate Interactive Residential Doors:
 * 6 Ground Floor Doors + 6 First Floor Doors
 * Each door defines its exact CAD coordinates, hinge position, swing direction, and floor.
 */
export const DOOR_SPECS = [
  // ── GROUND FLOOR DOORS ──────────────────────────────────────────────────
  {
    id: 'D1',
    name: 'Bedroom Door',
    floor: 'ground_floor',
    material: 'M-DOOR-TEAK',
    box: [10.815, 13.435, 7.630, 7.745, 1.540, 8.310],
    axis: 'X',
    hinge: [10.815, 7.688], // West edge
    dir: '+X',
    openAngle: Math.PI / 2   // Swings north into Bedroom along west wall
  },
  {
    id: 'D2',
    name: 'West Washroom Door',
    floor: 'ground_floor',
    material: 'M-DOOR-PVC',
    box: [13.755, 13.870, 19.440, 21.560, 1.540, 8.310],
    axis: 'Y',
    hinge: [13.812, 21.560], // North edge
    dir: '-Y',
    openAngle: -Math.PI / 2  // Swings west into West Washroom along north wall
  },
  {
    id: 'D3',
    name: 'Kitchen Door',
    floor: 'ground_floor',
    material: 'M-DOOR-TEAK',
    box: [23.190, 25.810, 11.505, 11.620, 1.540, 8.310],
    axis: 'X',
    hinge: [25.810, 11.562], // East edge
    dir: '-X',
    openAngle: Math.PI / 2   // Swings south into Kitchen along east wall
  },
  {
    id: 'D4',
    name: 'East Washroom Door',
    floor: 'ground_floor',
    material: 'M-DOOR-PVC',
    box: [38.940, 41.060, 19.005, 19.120, 1.540, 8.310],
    axis: 'X',
    hinge: [41.060, 19.062], // East edge
    dir: '-X',
    openAngle: -Math.PI / 2  // Swings north into East WC along east wall
  },
  {
    id: 'D5',
    name: 'Storeroom Door',
    floor: 'ground_floor',
    material: 'M-DOOR-TEAK',
    box: [41.380, 41.495, 15.565, 18.685, 1.540, 8.310],
    axis: 'Y',
    hinge: [41.438, 15.565], // South edge
    dir: '+Y',
    openAngle: -Math.PI / 2  // Swings east into Storeroom along south wall
  },
  {
    id: 'D6',
    name: 'Lobby East Door',
    floor: 'ground_floor',
    material: 'M-DOOR-TEAK',
    box: [26.125, 26.240, 15.170, 18.705, 1.540, 8.310],
    axis: 'Y',
    hinge: [26.182, 18.705], // North edge
    dir: '-Y',
    openAngle: -Math.PI / 2  // Swings west into Lobby along north wall
  },

  // ── FIRST FLOOR DOORS ───────────────────────────────────────────────────
  {
    id: 'DF1',
    name: 'Master Bedroom Door',
    floor: 'first_floor',
    material: 'M-DOOR-TEAK',
    box: [13.755, 13.870, 11.940, 14.810, 12.040, 18.810],
    axis: 'Y',
    hinge: [13.812, 11.940], // South edge
    dir: '+Y',
    openAngle: Math.PI / 2   // Swings west into Master Bedroom along south wall
  },
  {
    id: 'DF2',
    name: '1F Kitchen Door',
    floor: 'first_floor',
    material: 'M-DOOR-TEAK',
    box: [13.755, 13.870, 8.565, 11.185, 12.040, 18.810],
    axis: 'Y',
    hinge: [13.812, 11.185], // North edge
    dir: '-Y',
    openAngle: -Math.PI / 2  // Swings west into Kitchen along north wall
  },
  {
    id: 'DF3',
    name: 'Kitchen Balcony Door',
    floor: 'first_floor',
    material: 'M-ALU-FRAME',
    isGlazed: true,
    box: [11.170, 13.455, 4.140, 4.255, 12.040, 18.810],
    axis: 'X',
    hinge: [11.170, 4.198], // West edge
    dir: '+X',
    openAngle: Math.PI / 2   // Swings north into Kitchen along west wall
  },
  {
    id: 'DF4',
    name: 'Bathroom 1 Door',
    floor: 'first_floor',
    material: 'M-DOOR-PVC',
    box: [17.815, 19.935, 19.005, 19.120, 12.040, 18.810],
    axis: 'X',
    hinge: [17.815, 19.062], // West edge
    dir: '+X',
    openAngle: Math.PI / 2   // Swings north into Bathroom 1 along west wall
  },
  {
    id: 'DF5',
    name: 'Bathroom 2 Door',
    floor: 'first_floor',
    material: 'M-DOOR-PVC',
    box: [37.315, 39.685, 19.005, 19.120, 12.040, 18.810],
    axis: 'X',
    hinge: [39.685, 19.062], // East edge
    dir: '-X',
    openAngle: -Math.PI / 2  // Swings north into Bathroom 2 along east wall
  },
  {
    id: 'DF6',
    name: 'Child Bedroom Door',
    floor: 'first_floor',
    material: 'M-DOOR-TEAK',
    box: [40.005, 40.120, 9.565, 12.685, 12.040, 18.810],
    axis: 'Y',
    hinge: [40.062, 9.565], // South edge
    dir: '+Y',
    openAngle: -Math.PI / 2  // Swings east into Child Bedroom along south wall
  },
  {
    id: 'DF7',
    name: 'Mandir Door',
    floor: 'first_floor',
    material: 'M-DOOR-TEAK',
    box: [40.005, 40.120, 6.690, 8.810, 12.040, 18.810],
    axis: 'Y',
    hinge: [40.062, 8.810], // North edge
    dir: '-Y',
    openAngle: Math.PI / 2   // Swings east into Mandir along north wall
  },
  {
    id: 'DF8',
    name: 'Master Bedroom Balcony Door',
    floor: 'first_floor',
    material: 'M-ALU-FRAME',
    isGlazed: true,
    box: [0.670, 3.080, 11.515, 11.630, 12.040, 18.810],
    axis: 'X',
    hinge: [3.080, 11.572], // East edge
    dir: '-X',
    openAngle: -Math.PI / 2  // Swings north into Master Bedroom along east wall
  },

  // ── EXTERIOR BOUNDARY GATES (HIGH REALISM) ──────────────────────────────
  // Main Pedestrian Entrance Gate (Dual Leaves)
  {
    id: 'G1-L1',
    pairId: 'G1',
    name: 'Main Entrance Gate',
    floor: 'ground_floor',
    material: 'M-GATE-MS',
    isGate: true,
    box: [-0.435, -0.315, 0.020, 3.730, 0.150, 5.650],
    axis: 'Y',
    hinge: [-0.375, 0.020], // South post
    dir: '+Y',
    openAngle: -Math.PI / 2  // Swings east into Gate Landing
  },
  {
    id: 'G1-L2',
    pairId: 'G1',
    name: 'Main Entrance Gate',
    floor: 'ground_floor',
    material: 'M-GATE-MS',
    isGate: true,
    box: [-0.435, -0.315, 3.770, 7.480, 0.150, 5.650],
    axis: 'Y',
    hinge: [-0.375, 7.480], // North post
    dir: '-Y',
    openAngle: Math.PI / 2   // Swings east into Gate Landing
  },

  // Motorized Overhead Sectional Garage Door (Rolls Vertically UP to Ceiling)
  {
    id: 'G2',
    name: 'Garage Overhead Door',
    floor: 'ground_floor',
    material: 'M-GATE-MS',
    isGarageOverhead: true,
    box: [36.520, 49.230, -0.435, -0.315, 0.050, 7.950],
    axis: 'X',
    openHeight: 7.60 // Lifts vertically UP into ceiling tracks
  }
];

/**
 * Built-in audio generator for tactile mechanical door latch click
 */
class DoorAudio {
  constructor() {
    this.ctx = null;
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioClass = typeof window !== 'undefined' ? (window.AudioContext || window.webkitAudioContext) : null;
      if (AudioClass) this.ctx = new AudioClass();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playLatch(isOpen) {
    try {
      const ctx = this.ensureContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(isOpen ? 175 : 125, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.08);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch (_) {}
  }

  playGate(isOpen) {
    try {
      const ctx = this.ensureContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Heavy low-frequency metallic clank
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(isOpen ? 95 : 75, now);
      osc1.frequency.exponentialRampToValueAtTime(25, now + 0.18);
      gain1.gain.setValueAtTime(0.28, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      // Metallic high ring
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(isOpen ? 380 : 290, now);
      osc2.frequency.exponentialRampToValueAtTime(80, now + 0.12);
      gain2.gain.setValueAtTime(0.14, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.18);
      osc2.stop(now + 0.12);
    } catch (_) {}
  }

  playGarageMotor(isOpen) {
    try {
      const ctx = this.ensureContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Motorized drive hum
      const motorOsc = ctx.createOscillator();
      const motorGain = ctx.createGain();
      motorOsc.type = 'sawtooth';
      motorOsc.frequency.setValueAtTime(isOpen ? 115 : 95, now);
      motorOsc.frequency.linearRampToValueAtTime(isOpen ? 125 : 105, now + 0.3);
      motorOsc.frequency.linearRampToValueAtTime(isOpen ? 105 : 90, now + 1.2);

      motorGain.gain.setValueAtTime(0.12, now);
      motorGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      // Mechanical chain & roller track rumble
      const rumbleOsc = ctx.createOscillator();
      const rumbleGain = ctx.createGain();
      rumbleOsc.type = 'triangle';
      rumbleOsc.frequency.setValueAtTime(58, now);
      rumbleGain.gain.setValueAtTime(0.18, now);
      rumbleGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      motorOsc.connect(motorGain);
      rumbleOsc.connect(rumbleGain);
      motorGain.connect(ctx.destination);
      rumbleGain.connect(ctx.destination);

      motorOsc.start(now);
      rumbleOsc.start(now);
      motorOsc.stop(now + 1.2);
      rumbleOsc.stop(now + 1.2);
    } catch (_) {}
  }
}

export class DoorManager {
  constructor(materialManager, collisionSystem) {
    this.materials = materialManager;
    this.collision = collisionSystem;
    this.audio = new DoorAudio();

    this.rootGroup = new THREE.Group();
    this.rootGroup.name = 'InteractiveDoorsRoot';

    this.doors = [];
    this.interactiveMeshes = [];
    this.targetedDoor = null;
    this.raycaster = new THREE.Raycaster();
    this.raycaster.far = 12 * WORLD_SCALE;

    this.currentFloorFilter = 'all';
  }

  buildDoors(scene) {
    const s = WORLD_SCALE;

    DOOR_SPECS.forEach(spec => {
      // 1. Motorized Overhead Sectional Garage Door
      if (spec.isGarageOverhead) {
        this.buildOverheadGarageDoor(spec, s);
        return;
      }

      const [xmin, xmax, ymin, ymax, zmin, zmax] = spec.box;
      const width = (spec.axis === 'X' ? (xmax - xmin) : (ymax - ymin)) * s;
      const height = (zmax - zmin) * s;
      const thickness = 0.115 * s; // 1.35 inches scaled

      const hx = spec.hinge[0] * s;
      const hy = ((zmin + zmax) / 2) * s;
      const hz = -spec.hinge[1] * s;

      // Hinge Pivot Group
      const pivotGroup = new THREE.Group();
      pivotGroup.name = `DoorHinge_${spec.id}`;
      pivotGroup.position.set(hx, hy, hz);

      // Door Leaf Geometry
      let geo;
      let meshOffset;
      if (spec.axis === 'X') {
        geo = new THREE.BoxGeometry(width, height, thickness);
        meshOffset = (spec.dir === '+X')
          ? new THREE.Vector3(+width / 2, 0, 0)
          : new THREE.Vector3(-width / 2, 0, 0);
      } else {
        geo = new THREE.BoxGeometry(thickness, height, width);
        // In Three.js: -Y in spec is +Z, +Y in spec is -Z
        meshOffset = (spec.dir === '+Y')
          ? new THREE.Vector3(0, 0, -width / 2)
          : new THREE.Vector3(0, 0, +width / 2);
      }

      const mat = this.materials.get(spec.material);
      const leafMesh = new THREE.Mesh(geo, mat);
      leafMesh.position.copy(meshOffset);
      leafMesh.castShadow = true;
      leafMesh.receiveShadow = true;

      // Architectural edge outline
      const edgeGeo = new THREE.EdgesGeometry(geo);
      const edgeMat = this.materials.getEdgeMaterial();
      const edgeOutline = new THREE.LineSegments(edgeGeo, edgeMat);
      leafMesh.add(edgeOutline);

      // Modern Door Details (Gate vs Glazed Balcony vs Solid Flush Door)
      if (spec.isGate) {
        this.addGateDetails(leafMesh, spec, width, height, thickness, s);
      } else if (spec.isGlazed) {
        this.addGlazedBalconyDetails(leafMesh, spec, width, height, thickness, s);
      } else {
        this.addDoorHandles(leafMesh, spec, width, thickness, s);
      }

      pivotGroup.add(leafMesh);
      this.rootGroup.add(pivotGroup);

      // Register collision box in CollisionSystem
      const colliderItem = {
        id: `${spec.id}-COL`,
        box: [xmin * s, xmax * s, ymin * s, ymax * s, zmin * s, zmax * s],
        disabled: false // closed by default
      };
      if (this.collision && this.collision.colliders) {
        this.collision.colliders.push(colliderItem);
      }

      const doorObj = {
        spec: spec,
        id: spec.id,
        name: spec.name,
        floor: spec.floor,
        pivotGroup: pivotGroup,
        leafMesh: leafMesh,
        collider: colliderItem,
        isOpen: false,
        currentAngle: 0,
        targetAngle: 0,
        openAngle: spec.openAngle,
        isAnimating: false,
        worldCenter: new THREE.Vector3(
          ((xmin + xmax) / 2) * s,
          hy,
          -((ymin + ymax) / 2) * s
        ),
        toggle: () => this.toggleDoor(doorObj)
      };

      leafMesh.userData = { door: doorObj };
      this.interactiveMeshes.push(leafMesh);
      this.doors.push(doorObj);
    });

    scene.add(this.rootGroup);
    return this.rootGroup;
  }

  buildOverheadGarageDoor(spec, s) {
    const [xmin, xmax, ymin, ymax, zmin, zmax] = spec.box;
    const width = (xmax - xmin) * s;
    const height = (zmax - zmin) * s;
    const thickness = 0.12 * s; // 1.6 inches insulated panel
    const cx = ((xmin + xmax) / 2) * s;
    const baseY = ((zmin + zmax) / 2) * s;
    const cz = -((ymin + ymax) / 2) * s;
    const openOffsetY = (spec.openHeight || 7.60) * s;

    const msMat = this.materials.get('M-GATE-MS'); // Architectural dark charcoal steel
    const frameMat = this.materials.get('M-ALU-FRAME');
    const steelMat = this.materials.get('M-STEEL-SS');
    const glassMat = this.materials.get('M-GLASS');
    const edgeMat = this.materials.getEdgeMaterial();

    // 1. Static Door Assembly (Vertical C-tracks, Wall Mounts, Ceiling Runners, Torsion Drum & Motor)
    const staticGroup = new THREE.Group();
    staticGroup.name = `GarageStaticFrame_${spec.id}`;

    const trackWidth = 0.14 * s;
    const trackDepth = 0.18 * s;
    const trackHeight = height + 0.35 * s;
    const trackY = baseY + 0.175 * s;

    // Left and right vertical C-channel guide tracks on jambs
    const leftTrackX = xmin * s + trackWidth / 2;
    const rightTrackX = xmax * s - trackWidth / 2;

    [leftTrackX, rightTrackX].forEach((tx, idx) => {
      const trackGeo = new THREE.BoxGeometry(trackWidth, trackHeight, trackDepth);
      const trackMesh = new THREE.Mesh(trackGeo, frameMat);
      trackMesh.position.set(tx, trackY, cz);
      trackMesh.castShadow = true;
      trackMesh.receiveShadow = true;
      staticGroup.add(trackMesh);

      const trackEdge = new THREE.LineSegments(new THREE.EdgesGeometry(trackGeo), edgeMat);
      trackMesh.add(trackEdge);

      // Heavy wall anchor brackets (3 per side)
      for (let b = 0; b < 3; b++) {
        const by = zmin * s + 0.8 * s + b * (height * 0.4);
        const bGeo = new THREE.BoxGeometry(trackWidth * 1.4, 0.08 * s, 0.08 * s);
        const bMesh = new THREE.Mesh(bGeo, msMat);
        const bOffset = idx === 0 ? -trackWidth * 0.2 : trackWidth * 0.2;
        bMesh.position.set(tx + bOffset, by, cz);
        staticGroup.add(bMesh);
      }
    });

    // Horizontal ceiling guide rails extending into the garage (along -Z in Three.js)
    const ceilingTrackLen = 8.5 * s;
    const ceilingTrackY = zmax * s + 0.08 * s;
    const ceilingTrackZ = cz - ceilingTrackLen / 2;
    [leftTrackX, rightTrackX].forEach(tx => {
      const ceilGeo = new THREE.BoxGeometry(trackWidth * 0.7, 0.08 * s, ceilingTrackLen);
      const ceilMesh = new THREE.Mesh(ceilGeo, frameMat);
      ceilMesh.position.set(tx, ceilingTrackY, ceilingTrackZ);
      ceilMesh.castShadow = true;
      staticGroup.add(ceilMesh);

      const ceilEdge = new THREE.LineSegments(new THREE.EdgesGeometry(ceilGeo), edgeMat);
      ceilMesh.add(ceilEdge);
    });

    // Top Header Torsion Shaft & Spring Barrel
    const barrelRadius = 0.08 * s;
    const barrelLen = width + 0.15 * s;
    const barrelY = zmax * s + 0.18 * s;
    const barrelGeo = new THREE.CylinderGeometry(barrelRadius, barrelRadius, barrelLen, 16);
    const barrelMesh = new THREE.Mesh(barrelGeo, steelMat);
    barrelMesh.rotation.z = Math.PI / 2;
    barrelMesh.position.set(cx, barrelY, cz - 0.06 * s);
    barrelMesh.castShadow = true;
    staticGroup.add(barrelMesh);

    // Motorized Opener Unit mounted at header center
    const motorGeo = new THREE.BoxGeometry(1.2 * s, 0.35 * s, 0.5 * s);
    const motorMesh = new THREE.Mesh(motorGeo, msMat);
    motorMesh.position.set(cx, barrelY, cz - 0.32 * s);
    motorMesh.castShadow = true;
    staticGroup.add(motorMesh);
    const motorEdge = new THREE.LineSegments(new THREE.EdgesGeometry(motorGeo), edgeMat);
    motorMesh.add(motorEdge);

    // 2. Vertically Moving Sectional Door Panels Group
    const movingGroup = new THREE.Group();
    movingGroup.name = `GarageMovingPanels_${spec.id}`;
    movingGroup.position.set(cx, baseY, cz);

    const numPanels = 5;
    const panelSpacing = 0.015 * s; // subtle joint groove between articulated panels
    const panelHeight = (height - (numPanels - 1) * panelSpacing) / numPanels;
    const panelWidth = width - 0.22 * s; // snug clearance between guide tracks

    // Construct each horizontal articulating panel
    for (let i = 0; i < numPanels; i++) {
      const py = -height / 2 + i * (panelHeight + panelSpacing) + panelHeight / 2;

      // Base panel slab
      const pGeo = new THREE.BoxGeometry(panelWidth, panelHeight, thickness);
      const pMesh = new THREE.Mesh(pGeo, msMat);
      pMesh.position.set(0, py, 0);
      pMesh.castShadow = true;
      pMesh.receiveShadow = true;
      movingGroup.add(pMesh);

      const pEdge = new THREE.LineSegments(new THREE.EdgesGeometry(pGeo), edgeMat);
      pMesh.add(pEdge);

      // Contemporary horizontal embossed grooves (2 per panel)
      [-panelHeight * 0.22, panelHeight * 0.22].forEach(grooveY => {
        const grooveGeo = new THREE.BoxGeometry(panelWidth * 0.96, 0.03 * s, thickness * 1.05);
        const grooveMesh = new THREE.Mesh(grooveGeo, frameMat);
        grooveMesh.position.set(0, grooveY, 0);
        grooveMesh.castShadow = true;
        pMesh.add(grooveMesh);
      });

      // Panel 3 (4th panel from bottom - eye level): 4 architectural frosted window lites
      if (i === 3) {
        const numWindows = 4;
        const winW = (panelWidth / numWindows) * 0.65;
        const winH = panelHeight * 0.52;
        const winSpacing = panelWidth / numWindows;

        for (let w = 0; w < numWindows; w++) {
          const wx = -panelWidth / 2 + (w + 0.5) * winSpacing;

          // Glass insert
          const winGeo = new THREE.BoxGeometry(winW, winH, thickness * 0.4);
          const winMesh = new THREE.Mesh(winGeo, glassMat);
          winMesh.position.set(wx, 0, 0);
          winMesh.castShadow = false;
          winMesh.receiveShadow = true;
          pMesh.add(winMesh);

          // Aluminum window bezel
          const frameGeo = new THREE.BoxGeometry(winW + 0.05 * s, winH + 0.05 * s, thickness * 1.08);
          const frameMesh = new THREE.LineSegments(new THREE.EdgesGeometry(frameGeo), edgeMat);
          frameMesh.position.set(wx, 0, 0);
          pMesh.add(frameMesh);
        }
      }

      // Bottom panel (i = 0): Heavy-duty rubber weather seal extrusion at ground contact
      if (i === 0) {
        const sealGeo = new THREE.BoxGeometry(panelWidth * 1.01, 0.10 * s, thickness * 1.2);
        const sealMesh = new THREE.Mesh(sealGeo, msMat);
        sealMesh.position.set(0, -panelHeight / 2 - 0.03 * s, 0);
        pMesh.add(sealMesh);
      }

      // Panel 1 (second from bottom): Sleek flush lift handle
      if (i === 1) {
        [-1, 1].forEach(side => {
          const handleGeo = new THREE.BoxGeometry(0.70 * s, 0.12 * s, 0.03 * s);
          const handleMesh = new THREE.Mesh(handleGeo, steelMat);
          handleMesh.position.set(0, 0, (thickness / 2 + 0.015 * s) * side);
          pMesh.add(handleMesh);
        });
      }

      // Panel side roller hinges connecting to vertical tracks
      [-panelWidth / 2, panelWidth / 2].forEach(hx => {
        const rollerGeo = new THREE.CylinderGeometry(0.03 * s, 0.03 * s, 0.08 * s, 8);
        const rollerMesh = new THREE.Mesh(rollerGeo, steelMat);
        rollerMesh.rotation.z = Math.PI / 2;
        rollerMesh.position.set(hx, 0, 0);
        pMesh.add(rollerMesh);
      });
    }

    this.rootGroup.add(staticGroup);
    this.rootGroup.add(movingGroup);

    // Dynamic collision barrier
    const colliderItem = {
      id: `${spec.id}-COL`,
      box: [xmin * s, xmax * s, ymin * s, ymax * s, zmin * s, zmax * s],
      disabled: false
    };
    if (this.collision && this.collision.colliders) {
      this.collision.colliders.push(colliderItem);
    }

    const doorObj = {
      spec: spec,
      id: spec.id,
      name: spec.name,
      floor: spec.floor,
      isGarageOverhead: true,
      staticGroup: staticGroup,
      movingGroup: movingGroup,
      leafMesh: movingGroup,
      collider: colliderItem,
      isOpen: false,
      baseY: baseY,
      currentOffsetY: 0,
      targetOffsetY: 0,
      openOffsetY: openOffsetY,
      isAnimating: false,
      worldCenter: new THREE.Vector3(cx, baseY, cz),
      toggle: () => this.toggleDoor(doorObj)
    };

    // Attach door reference recursively to movingGroup and all children
    movingGroup.userData = { door: doorObj };
    movingGroup.traverse(child => {
      child.userData = { door: doorObj };
    });

    this.interactiveMeshes.push(movingGroup);
    this.doors.push(doorObj);
  }

  addGateDetails(leafMesh, spec, width, height, thickness, s) {
    const msMat = this.materials.get('M-GATE-MS');
    const ssMat = this.materials.get('M-STEEL-SS');

    const group = new THREE.Group();
    group.name = `GateDetails_${spec.id}`;

    const isAxisX = spec.axis === 'X';
    const frameTubeSize = 0.16 * s; // 2.2 inches RHS square tube
    const kickHeight = Math.min(1.8 * s, height * 0.28);
    const kickY = -height / 2 + kickHeight / 2;

    // 1. Solid lower kick-plate (bottom section of gate)
    const kickWidth = width - frameTubeSize;
    const kickGeo = isAxisX
      ? new THREE.BoxGeometry(kickWidth, kickHeight, thickness * 0.7)
      : new THREE.BoxGeometry(thickness * 0.7, kickHeight, kickWidth);
    const kickMesh = new THREE.Mesh(kickGeo, msMat);
    kickMesh.position.set(0, kickY, 0);
    kickMesh.castShadow = true;
    group.add(kickMesh);

    // Kick-plate architectural edge/trim
    const kickEdge = new THREE.LineSegments(
      new THREE.EdgesGeometry(kickGeo),
      this.materials.getEdgeMaterial()
    );
    kickMesh.add(kickEdge);

    // 2. Horizontal architectural slats / privacy louvers (middle to top section)
    const numSlats = spec.isGate && width > 4.5 * s ? 9 : 7;
    const slatStartY = kickY + kickHeight / 2 + 0.16 * s;
    const slatEndY = height / 2 - 0.22 * s;
    const slatSpacing = (slatEndY - slatStartY) / numSlats;
    const slatHeight = 0.14 * s;
    const slatThick = thickness * 0.6;
    const slatWidth = width - frameTubeSize * 1.5;

    for (let i = 0; i < numSlats; i++) {
      const curY = slatStartY + i * slatSpacing;
      const slatGeo = isAxisX
        ? new THREE.BoxGeometry(slatWidth, slatHeight, slatThick)
        : new THREE.BoxGeometry(slatThick, slatHeight, slatWidth);
      const slatMesh = new THREE.Mesh(slatGeo, msMat);
      slatMesh.position.set(0, curY, 0);
      slatMesh.castShadow = true;
      group.add(slatMesh);

      const slatEdge = new THREE.LineSegments(
        new THREE.EdgesGeometry(slatGeo),
        this.materials.getEdgeMaterial()
      );
      slatMesh.add(slatEdge);
    }

    // 3. Contemporary Vertical Stainless Steel Pull Handle Bar (on meeting stile)
    const handleBarHeight = Math.min(3.2 * s, height * 0.55);
    const handleY = 0; // centered at mid-height
    const handleOffset = (width / 2) - frameTubeSize * 1.2;
    const barRadius = 0.038 * s;

    [-1, 1].forEach(side => {
      const barZ = (thickness / 2 + 0.06 * s) * side;
      const barGeo = new THREE.CylinderGeometry(barRadius, barRadius, handleBarHeight, 12);
      const barMesh = new THREE.Mesh(barGeo, ssMat);

      // Standoff mount posts
      const mountGeo = new THREE.CylinderGeometry(0.025 * s, 0.025 * s, 0.07 * s, 8);
      const mountTop = new THREE.Mesh(mountGeo, ssMat);
      const mountBot = new THREE.Mesh(mountGeo, ssMat);
      mountTop.rotation.x = Math.PI / 2;
      mountBot.rotation.x = Math.PI / 2;
      mountTop.position.set(0, handleBarHeight * 0.38, (0.035 * s) * -side);
      mountBot.position.set(0, -handleBarHeight * 0.38, (0.035 * s) * -side);

      const barAssembly = new THREE.Group();
      barAssembly.add(barMesh);
      barAssembly.add(mountTop);
      barAssembly.add(mountBot);

      if (isAxisX) {
        const xPos = (spec.dir === '+X') ? handleOffset : -handleOffset;
        barAssembly.position.set(xPos, handleY, barZ);
      } else {
        const zPos = (spec.dir === '+Y') ? -handleOffset : handleOffset;
        barAssembly.rotation.y = Math.PI / 2;
        barAssembly.position.set(barZ, handleY, zPos);
      }
      group.add(barAssembly);
    });

    leafMesh.add(group);
  }

  addGlazedBalconyDetails(leafMesh, spec, width, height, thickness, s) {
    const glassMat = this.materials.get('M-GLASS');
    const aluMat = this.materials.get('M-ALU-FRAME');

    const group = new THREE.Group();
    group.name = `GlazedDetails_${spec.id}`;

    const isAxisX = spec.axis === 'X';
    const glassWidth = width - 0.34 * s;
    const glassHeight = height - 0.40 * s;

    // Large safety glass panel inset
    const glassGeo = isAxisX
      ? new THREE.BoxGeometry(glassWidth, glassHeight, thickness * 0.35)
      : new THREE.BoxGeometry(thickness * 0.35, glassHeight, glassWidth);
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    glassMesh.castShadow = false;
    glassMesh.receiveShadow = true;
    group.add(glassMesh);

    // Horizontal aluminium mid-rail (at handle level, Y = -0.35 * s)
    const railGeo = isAxisX
      ? new THREE.BoxGeometry(glassWidth, 0.18 * s, thickness * 1.05)
      : new THREE.BoxGeometry(thickness * 1.05, 0.18 * s, glassWidth);
    const railMesh = new THREE.Mesh(railGeo, aluMat);
    railMesh.position.set(0, -0.35 * s, 0);
    railMesh.castShadow = true;
    group.add(railMesh);

    leafMesh.add(group);

    // Also add sleek lever handles
    this.addDoorHandles(leafMesh, spec, width, thickness, s);
  }

  addDoorHandles(leafMesh, spec, width, thickness, s) {
    const handleMat = this.materials.get('M-STEEL-SS');
    const handleY = -0.35 * s; // ~3.3 ft elevation from floor
    const latchOffset = 0.82 * (width / 2);

    const handleGroup = new THREE.Group();
    handleGroup.name = `Handles_${spec.id}`;

    // Create front and back lever handles
    [-1, 1].forEach(side => {
      const zOffset = (thickness / 2 + 0.02 * s) * side;

      // Base backplate
      const plateGeo = new THREE.BoxGeometry(0.12 * s, 0.40 * s, 0.02 * s);
      const plateMesh = new THREE.Mesh(plateGeo, handleMat);

      // Post stem
      const stemGeo = new THREE.CylinderGeometry(0.025 * s, 0.025 * s, 0.08 * s, 8);
      const stemMesh = new THREE.Mesh(stemGeo, handleMat);
      stemMesh.rotation.x = Math.PI / 2;
      stemMesh.position.set(0, 0, (0.04 * s) * side);

      // Horizontal lever grip pointing back inward toward door leaf center
      const gripDir = (spec.dir === '+X' || spec.dir === '+Y') ? -1 : 1;
      const gripGeo = new THREE.BoxGeometry(0.32 * s, 0.04 * s, 0.04 * s);
      const gripMesh = new THREE.Mesh(gripGeo, handleMat);
      gripMesh.position.set(gripDir * 0.10 * s, 0, (0.08 * s) * side);

      const sideGroup = new THREE.Group();
      sideGroup.add(plateMesh);
      sideGroup.add(stemMesh);
      sideGroup.add(gripMesh);

      if (spec.axis === 'X') {
        const xPos = (spec.dir === '+X') ? latchOffset : -latchOffset;
        sideGroup.position.set(xPos, handleY, zOffset);
      } else {
        const zPos = (spec.dir === '+Y') ? -latchOffset : latchOffset;
        sideGroup.rotation.y = Math.PI / 2;
        sideGroup.position.set(zOffset, handleY, zPos);
      }

      handleGroup.add(sideGroup);
    });

    leafMesh.add(handleGroup);
  }

  toggleDoor(door) {
    const newOpenState = !door.isOpen;

    // Support paired leaves (e.g. double gate leaves G1)
    const targets = door.spec.pairId
      ? this.doors.filter(d => d.spec.pairId === door.spec.pairId)
      : [door];

    targets.forEach(d => {
      d.isOpen = newOpenState;
      if (d.isGarageOverhead) {
        d.targetOffsetY = d.isOpen ? d.openOffsetY : 0;
        d.isAnimating = true;
      } else {
        d.targetAngle = d.isOpen ? d.openAngle : 0;
        d.isAnimating = true;
      }

      // Immediately toggle physical collider so opening can be walked/driven through
      if (d.collider) {
        d.collider.disabled = d.isOpen;
      }
    });

    if (door.isGarageOverhead) {
      this.audio.playGarageMotor(newOpenState);
    } else if (door.spec.isGate) {
      this.audio.playGate(newOpenState);
    } else {
      this.audio.playLatch(newOpenState);
    }
  }

  interact(ui, showPrompt = false) {
    if (this.targetedDoor) {
      this.targetedDoor.toggle();
      if (ui && showPrompt) {
        ui.showInteractionPrompt(`[E] ${this.targetedDoor.isOpen ? 'Close' : 'Open'} ${this.targetedDoor.name}`);
      } else if (ui) {
        ui.hideInteractionPrompt();
      }
    }
  }

  handleOrbitClick(event, camera) {
    const mouse = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );
    this.raycaster.setFromCamera(mouse, camera);

    const activeMeshes = this.interactiveMeshes.filter(m => m.visible);
    const intersects = this.raycaster.intersectObjects(activeMeshes, true);

    if (intersects.length > 0) {
      let cur = intersects[0].object;
      while (cur && !cur.userData?.door) cur = cur.parent;
      if (cur && cur.userData?.door) {
        cur.userData.door.toggle();
      }
    }
  }

  update(delta, camera, playerPosition, isFPActive, ui, showPrompt = false) {
    const s = WORLD_SCALE;
    const animSpeed = 5.5;

    // 1. Smooth Animation (Hinge swing or Overhead lift)
    this.doors.forEach(door => {
      if (door.isAnimating) {
        if (door.isGarageOverhead) {
          door.currentOffsetY = THREE.MathUtils.lerp(
            door.currentOffsetY,
            door.targetOffsetY,
            Math.min(1.0, delta * 3.2)
          );
          door.movingGroup.position.y = door.baseY + door.currentOffsetY;

          if (Math.abs(door.currentOffsetY - door.targetOffsetY) < 0.01) {
            door.currentOffsetY = door.targetOffsetY;
            door.movingGroup.position.y = door.baseY + door.targetOffsetY;
            door.isAnimating = false;
          }
        } else {
          door.currentAngle = THREE.MathUtils.lerp(
            door.currentAngle,
            door.targetAngle,
            Math.min(1.0, delta * animSpeed)
          );
          door.pivotGroup.rotation.y = door.currentAngle;

          if (Math.abs(door.currentAngle - door.targetAngle) < 0.005) {
            door.currentAngle = door.targetAngle;
            door.pivotGroup.rotation.y = door.targetAngle;
            door.isAnimating = false;
          }
        }
      }
    });

    // 2. Targeting & Prompt Detection (First Person Walkthrough)
    if (!isFPActive || !camera || !playerPosition) {
      if (this.targetedDoor) {
        this.targetedDoor = null;
        if (ui) ui.hideInteractionPrompt();
      }
      return;
    }

    const activeDoors = this.doors.filter(d => {
      if (!d.leafMesh.visible) return false;
      const dDist = playerPosition.distanceTo(d.worldCenter);
      const reach = (d.spec.isGate || d.spec.isGarageOverhead) ? (11.0 * s) : (6.5 * s);
      return dDist <= reach;
    });

    let bestDoor = null;
    let closestDist = Infinity;

    // Direct center reticle raycast (deep check through gate slats/frame/garage panels)
    this.raycaster.setFromCamera({ x: 0, y: 0 }, camera);
    const candidateMeshes = activeDoors.map(d => d.leafMesh);
    const intersects = this.raycaster.intersectObjects(candidateMeshes, true);

    if (intersects.length > 0) {
      let cur = intersects[0].object;
      while (cur && !cur.userData?.door) cur = cur.parent;
      if (cur && cur.userData?.door) {
        const hitDoor = cur.userData.door;
        const reach = (hitDoor.spec.isGate || hitDoor.spec.isGarageOverhead) ? (11.0 * s) : (6.5 * s);
        if (intersects[0].distance <= reach) {
          bestDoor = hitDoor;
        }
      }
    }

    if (!bestDoor) {
      // Proximity & look-angle fallback
      const camDir = new THREE.Vector3();
      camera.getWorldDirection(camDir);

      activeDoors.forEach(door => {
        const toDoor = new THREE.Vector3().subVectors(door.worldCenter, camera.position);
        const dist = toDoor.length();
        toDoor.normalize();
        const dot = camDir.dot(toDoor);
        const maxDist = (door.spec.isGate || door.spec.isGarageOverhead) ? (8.5 * s) : (4.5 * s);
        const minDot = (door.spec.isGate || door.spec.isGarageOverhead) ? 0.65 : 0.82;

        if (dot > minDot && dist <= maxDist && dist < closestDist) {
          closestDist = dist;
          bestDoor = door;
        }
      });
    }

    this.targetedDoor = bestDoor;

    if (ui) {
      if (this.targetedDoor && showPrompt) {
        ui.showInteractionPrompt(`[E] ${this.targetedDoor.isOpen ? 'Close' : 'Open'} ${this.targetedDoor.name}`);
      } else {
        ui.hideInteractionPrompt();
      }
    }
  }

  setFloorFilter(filter) {
    this.currentFloorFilter = filter;
    this.doors.forEach(door => {
      const isVisible = (filter === 'all') || (door.floor === filter);
      if (door.pivotGroup) door.pivotGroup.visible = isVisible;
      if (door.staticGroup) door.staticGroup.visible = isVisible;
      if (door.movingGroup) door.movingGroup.visible = isVisible;
      if (door.leafMesh) door.leafMesh.visible = isVisible;
    });
  }

  setVisibility(visible) {
    this.rootGroup.visible = visible;
  }

  getRoot() {
    return this.rootGroup;
  }
}
