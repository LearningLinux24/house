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
  }
];

/**
 * Built-in audio generator for tactile mechanical door latch click
 */
class DoorAudio {
  constructor() {
    this.ctx = null;
  }

  playLatch(isOpen) {
    try {
      if (!this.ctx) {
        const AudioClass = typeof window !== 'undefined' ? (window.AudioContext || window.webkitAudioContext) : null;
        if (AudioClass) this.ctx = new AudioClass();
      }
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(isOpen ? 175 : 125, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.08);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.start(now);
      osc.stop(now + 0.08);
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

      // Modern Stainless Steel Lever Handles (Both Sides)
      this.addDoorHandles(leafMesh, spec, width, thickness, s);

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
    door.isOpen = !door.isOpen;
    door.targetAngle = door.isOpen ? door.openAngle : 0;
    door.isAnimating = true;

    // Immediately toggle physical collider so doorway can be walked through
    if (door.collider) {
      door.collider.disabled = door.isOpen;
    }

    this.audio.playLatch(door.isOpen);
  }

  interact(ui) {
    if (this.targetedDoor) {
      this.targetedDoor.toggle();
      if (ui) {
        ui.showInteractionPrompt(`[E] ${this.targetedDoor.isOpen ? 'Close' : 'Open'} ${this.targetedDoor.name}`);
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
    const intersects = this.raycaster.intersectObjects(activeMeshes, false);

    if (intersects.length > 0) {
      const door = intersects[0].object.userData.door;
      if (door) {
        door.toggle();
      }
    }
  }

  update(delta, camera, playerPosition, isFPActive, ui) {
    const s = WORLD_SCALE;
    const animSpeed = 5.5;

    // 1. Smooth Hinge Swing Animation
    this.doors.forEach(door => {
      if (door.isAnimating) {
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
    });

    // 2. Targeting & Prompt Detection (First Person Walkthrough)
    if (!isFPActive || !camera || !playerPosition) {
      if (this.targetedDoor) {
        this.targetedDoor = null;
        if (ui) ui.hideInteractionPrompt();
      }
      return;
    }

    const reachDistance = 9.0 * s;
    const activeDoors = this.doors.filter(d => {
      if (!d.leafMesh.visible) return false;
      const dDist = playerPosition.distanceTo(d.worldCenter);
      return dDist <= reachDistance;
    });

    let bestDoor = null;
    let closestDist = Infinity;

    // Direct center reticle raycast
    this.raycaster.setFromCamera({ x: 0, y: 0 }, camera);
    const candidateMeshes = activeDoors.map(d => d.leafMesh);
    const intersects = this.raycaster.intersectObjects(candidateMeshes, false);

    if (intersects.length > 0 && intersects[0].distance <= reachDistance) {
      bestDoor = intersects[0].object.userData.door;
    } else {
      // Proximity & look-angle fallback
      const camDir = new THREE.Vector3();
      camera.getWorldDirection(camDir);

      activeDoors.forEach(door => {
        const toDoor = new THREE.Vector3().subVectors(door.worldCenter, camera.position);
        const dist = toDoor.length();
        toDoor.normalize();
        const dot = camDir.dot(toDoor);

        if (dot > 0.45 && dist < closestDist) {
          closestDist = dist;
          bestDoor = door;
        }
      });
    }

    if (bestDoor !== this.targetedDoor) {
      this.targetedDoor = bestDoor;
      if (this.targetedDoor && ui) {
        ui.showInteractionPrompt(`[E] ${this.targetedDoor.isOpen ? 'Close' : 'Open'} ${this.targetedDoor.name}`);
      } else if (ui) {
        ui.hideInteractionPrompt();
      }
    } else if (this.targetedDoor && ui) {
      ui.showInteractionPrompt(`[E] ${this.targetedDoor.isOpen ? 'Close' : 'Open'} ${this.targetedDoor.name}`);
    }
  }

  setFloorFilter(filter) {
    this.currentFloorFilter = filter;
    this.doors.forEach(door => {
      const isVisible = (filter === 'all') || (door.floor === filter);
      door.pivotGroup.visible = isVisible;
      door.leafMesh.visible = isVisible;
    });
  }

  setVisibility(visible) {
    this.rootGroup.visible = visible;
  }

  getRoot() {
    return this.rootGroup;
  }
}
