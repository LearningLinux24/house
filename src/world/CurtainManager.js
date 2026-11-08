import * as THREE from 'three';
import { WORLD_SCALE } from '../config/constants.js';

export const CURTAIN_SPECS = [
  {
    id: 'CURTAIN-GF-BED',
    name: 'Bedroom Garden Window Curtain',
    floor: 'ground_floor',
    axis: 'Y', // runs along Y (North-South) on West wall
    wallX: 3.75,
    ymin: 10.875,
    ymax: 15.875,
    zmin: 1.600,
    zmax: 8.800
  },
  {
    id: 'CURTAIN-GF-LOBBY',
    name: 'Lobby North Window Curtain',
    floor: 'ground_floor',
    axis: 'X',
    wallY: 23.12,
    xmin: 17.500,
    xmax: 22.500,
    zmin: 1.600,
    zmax: 8.800
  },
  {
    id: 'CURTAIN-1F-MASTER',
    name: 'Master Bedroom West Window Curtain',
    floor: 'first_floor',
    axis: 'Y',
    wallX: 0.15,
    ymin: 15.000,
    ymax: 20.000,
    zmin: 12.100,
    zmax: 19.300
  },
  {
    id: 'CURTAIN-1F-LOBBY-L',
    name: 'Lobby South Window Left Curtain',
    floor: 'first_floor',
    axis: 'X',
    wallY: 0.15,
    xmin: 14.500,
    xmax: 19.500,
    zmin: 12.100,
    zmax: 19.300
  },
  {
    id: 'CURTAIN-1F-LOBBY-R',
    name: 'Lobby South Window Right Curtain',
    floor: 'first_floor',
    axis: 'X',
    wallY: 0.15,
    xmin: 20.500,
    xmax: 25.500,
    zmin: 12.100,
    zmax: 19.300
  },
  {
    id: 'CURTAIN-1F-CHILD',
    name: 'Child Bedroom North Window Curtain',
    floor: 'first_floor',
    axis: 'X',
    wallY: 23.12,
    xmin: 43.000,
    xmax: 48.000,
    zmin: 12.100,
    zmax: 19.300
  }
];

class CurtainAudio {
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

  playCurtainSlide(isOpen) {
    try {
      const ctx = this.ensureContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const duration = 0.55;

      // 1. Soft fabric sliding hiss
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
      filter.frequency.setValueAtTime(isOpen ? 1300 : 900, now);
      filter.frequency.exponentialRampToValueAtTime(isOpen ? 800 : 1200, now + duration);
      filter.Q.setValueAtTime(1.4, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.linearRampToValueAtTime(0.20, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.002, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);

      // 2. Subtle metallic ring slide / chink on curtain rod
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1850, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.25);
      oscGain.gain.setValueAtTime(0.04, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // Audio fallback
    }
  }
}

export class CurtainManager {
  constructor(materialLibrary) {
    this.materials = materialLibrary;
    this.audio = new CurtainAudio();

    this.rootGroup = new THREE.Group();
    this.rootGroup.name = 'InteractiveCurtainsRoot';

    this.curtains = [];
    this.interactiveMeshes = [];
    this.raycaster = new THREE.Raycaster();
    this.raycaster.far = 12 * WORLD_SCALE;

    this.targetedCurtain = null;
    this.isDirectHit = false;
    this.targetedDistance = Infinity;
    this.promptLabel = null;
  }

  buildCurtains(scene) {
    const s = WORLD_SCALE;

    const curtainMat = this.materials.get('M-FABRIC-CURTAIN') || new THREE.MeshStandardMaterial({
      color: '#E8DFD8',
      roughness: 0.85,
      metalness: 0.02,
      side: THREE.DoubleSide
    });

    const rodMat = this.materials.get('M-STEEL-SS') || new THREE.MeshStandardMaterial({
      color: '#2C3E50',
      roughness: 0.35,
      metalness: 0.85
    });

    CURTAIN_SPECS.forEach(spec => {
      const group = new THREE.Group();
      group.name = `CurtainGroup_${spec.id}`;

      let totalSpan = 0;
      let height = (spec.zmax - spec.zmin) * s;
      let centerPos = new THREE.Vector3();
      let rodLength = 0;

      // Create curtain rod & left/right drapes
      let leftDrape = null;
      let rightDrape = null;

      if (spec.axis === 'X') {
        totalSpan = (spec.xmax - spec.xmin) * s;
        rodLength = totalSpan + 0.6 * s;
        const cx = ((spec.xmin + spec.xmax) / 2) * s;
        const cy = ((spec.zmin + spec.zmax) / 2) * s;
        const cz = -spec.wallY * s;
        centerPos.set(cx, cy, cz);
        group.position.set(cx, cy, cz);

        // 1. Metal Rod (along X)
        const rodGeo = new THREE.CylinderGeometry(0.028 * s, 0.028 * s, rodLength, 12);
        const rodMesh = new THREE.Mesh(rodGeo, rodMat);
        rodMesh.rotation.z = Math.PI / 2;
        rodMesh.position.set(0, height / 2 + 0.05 * s, 0);
        group.add(rodMesh);

        // Finials on rod ends
        [-rodLength / 2, rodLength / 2].forEach(fx => {
          const finialGeo = new THREE.SphereGeometry(0.045 * s, 10, 10);
          const finial = new THREE.Mesh(finialGeo, rodMat);
          finial.position.set(fx, height / 2 + 0.05 * s, 0);
          group.add(finial);
        });

        // 2. Left & Right Drapes
        const drapeGeo = new THREE.BoxGeometry(1, height, 0.045 * s);
        leftDrape = new THREE.Mesh(drapeGeo, curtainMat);
        rightDrape = new THREE.Mesh(drapeGeo, curtainMat);
        leftDrape.castShadow = true;
        rightDrape.castShadow = true;
        group.add(leftDrape);
        group.add(rightDrape);

      } else {
        // Axis === 'Y' (North-South on West wall)
        totalSpan = (spec.ymax - spec.ymin) * s;
        rodLength = totalSpan + 0.6 * s;
        const cx = spec.wallX * s;
        const cy = ((spec.zmin + spec.zmax) / 2) * s;
        const cz = -((spec.ymin + spec.ymax) / 2) * s;
        centerPos.set(cx, cy, cz);
        group.position.set(cx, cy, cz);

        // 1. Metal Rod (along Z in Three.js world space)
        const rodGeo = new THREE.CylinderGeometry(0.028 * s, 0.028 * s, rodLength, 12);
        const rodMesh = new THREE.Mesh(rodGeo, rodMat);
        rodMesh.rotation.x = Math.PI / 2;
        rodMesh.position.set(0, height / 2 + 0.05 * s, 0);
        group.add(rodMesh);

        // Finials on rod ends
        [-rodLength / 2, rodLength / 2].forEach(fz => {
          const finialGeo = new THREE.SphereGeometry(0.045 * s, 10, 10);
          const finial = new THREE.Mesh(finialGeo, rodMat);
          finial.position.set(0, height / 2 + 0.05 * s, fz);
          group.add(finial);
        });

        // 2. Left & Right Drapes (along Z)
        const drapeGeo = new THREE.BoxGeometry(0.045 * s, height, 1);
        leftDrape = new THREE.Mesh(drapeGeo, curtainMat);
        rightDrape = new THREE.Mesh(drapeGeo, curtainMat);
        leftDrape.castShadow = true;
        rightDrape.castShadow = true;
        group.add(leftDrape);
        group.add(rightDrape);
      }

      // Invisible hit mesh for crosshair targeting
      const hitGeo = spec.axis === 'X'
        ? new THREE.BoxGeometry(totalSpan, height, 0.35 * s)
        : new THREE.BoxGeometry(0.35 * s, height, totalSpan);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      group.add(hitMesh);

      this.rootGroup.add(group);

      const curtainObj = {
        spec,
        id: spec.id,
        name: spec.name,
        floor: spec.floor,
        group,
        leftDrape,
        rightDrape,
        hitMesh,
        axis: spec.axis,
        totalSpan,
        height,
        worldCenter: centerPos,
        isOpen: false,
        openRatio: 0,
        targetOpenRatio: 0
      };

      hitMesh.userData = { curtain: curtainObj };
      leftDrape.userData = { curtain: curtainObj };
      rightDrape.userData = { curtain: curtainObj };

      this.interactiveMeshes.push(hitMesh, leftDrape, rightDrape);
      this.curtains.push(curtainObj);

      // Initial visual position (closed)
      this._updateDrapeGeometry(curtainObj);
    });

    scene.add(this.rootGroup);
    return this.rootGroup;
  }

  _updateDrapeGeometry(curtain) {
    const r = curtain.openRatio; // 0 = closed, 1 = fully open
    const span = curtain.totalSpan;

    // Panel width: closed = span * 0.51 (slight center overlap); open = span * 0.16 (gathered to sides)
    const panelW = span * (0.51 - 0.35 * r);

    if (curtain.axis === 'X') {
      curtain.leftDrape.scale.x = panelW;
      curtain.rightDrape.scale.x = panelW;

      // Position: closed = meet in center (± panelW/2); open = gathered against wall edges
      const leftCenterX = -span / 2 + panelW / 2;
      const rightCenterX = span / 2 - panelW / 2;
      curtain.leftDrape.position.x = leftCenterX;
      curtain.rightDrape.position.x = rightCenterX;
    } else {
      // Axis === 'Y' (running along Z in Three.js)
      curtain.leftDrape.scale.z = panelW;
      curtain.rightDrape.scale.z = panelW;

      const leftCenterZ = -span / 2 + panelW / 2;
      const rightCenterZ = span / 2 - panelW / 2;
      curtain.leftDrape.position.z = leftCenterZ;
      curtain.rightDrape.position.z = rightCenterZ;
    }
  }

  toggleCurtain(curtain) {
    curtain.isOpen = !curtain.isOpen;
    curtain.targetOpenRatio = curtain.isOpen ? 1.0 : 0.0;
    this.audio.playCurtainSlide(curtain.isOpen);
  }

  interact(ui, showPrompt = false) {
    if (!this.targetedCurtain) return;
    this.toggleCurtain(this.targetedCurtain);
    if (ui) {
      ui.showToast(`${this.targetedCurtain.name} ${this.targetedCurtain.isOpen ? 'opened' : 'closed'}`);
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
      while (cur && !cur.userData?.curtain) cur = cur.parent;
      if (cur && cur.userData?.curtain) {
        this.toggleCurtain(cur.userData.curtain);
      }
    }
  }

  update(delta, camera, playerPosition, isFPActive, ui, showPrompt = false) {
    const s = WORLD_SCALE;

    // 1. Smoothly animate drape gather / spread
    this.curtains.forEach(curtain => {
      if (Math.abs(curtain.openRatio - curtain.targetOpenRatio) > 0.001) {
        const t = Math.min(1.0, delta * 7.5);
        curtain.openRatio = THREE.MathUtils.clamp(
          THREE.MathUtils.lerp(curtain.openRatio, curtain.targetOpenRatio, t),
          0.0,
          1.0
        );
        this._updateDrapeGeometry(curtain);
      }
    });

    // 2. Crosshair raycast targeting
    if (!isFPActive || !camera || !playerPosition) {
      if (this.targetedCurtain) {
        this.targetedCurtain = null;
        this.isDirectHit = false;
        this.targetedDistance = Infinity;
        this.promptLabel = null;
        if (ui) ui.hideInteractionPrompt();
      }
      return;
    }

    const reach = 8.5 * s;
    const activeCurtains = this.curtains.filter(c => {
      if (!c.group.visible) return false;
      const d = playerPosition.distanceTo(c.worldCenter);
      return d <= reach;
    });

    let bestCurtain = null;
    let closestDist = Infinity;
    let isDirectHit = false;

    // Reticle raycast
    this.raycaster.setFromCamera({ x: 0, y: 0 }, camera);
    const candidateMeshes = [];
    activeCurtains.forEach(c => candidateMeshes.push(c.hitMesh, c.leftDrape, c.rightDrape));

    const intersects = this.raycaster.intersectObjects(candidateMeshes, false);

    if (intersects.length > 0) {
      let cur = intersects[0].object;
      while (cur && !cur.userData?.curtain) cur = cur.parent;
      if (cur && cur.userData?.curtain && intersects[0].distance <= reach) {
        bestCurtain = cur.userData.curtain;
        closestDist = intersects[0].distance;
        isDirectHit = true;
      }
    }

    // Look angle fallback only if directly facing the window curtain
    if (!bestCurtain && activeCurtains.length > 0) {
      const camDir = new THREE.Vector3();
      camera.getWorldDirection(camDir);

      activeCurtains.forEach(curtain => {
        const toCurtain = new THREE.Vector3().subVectors(curtain.worldCenter, camera.position);
        const dist = toCurtain.length();
        toCurtain.normalize();
        const dot = camDir.dot(toCurtain);
        if (dot > 0.88 && dist <= 6.0 * s && dist < closestDist) {
          closestDist = dist;
          bestCurtain = curtain;
          isDirectHit = false;
        }
      });
    }

    this.targetedCurtain = bestCurtain;
    this.isDirectHit = isDirectHit;
    this.targetedDistance = closestDist;
    this.promptLabel = bestCurtain
      ? `[E] ${bestCurtain.isOpen ? 'Close' : 'Open'} ${bestCurtain.name}`
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
    this.curtains.forEach(curtain => {
      const isVisible = (filter === 'all') || (curtain.floor === filter);
      curtain.group.visible = isVisible;
    });
  }

  getRoot() {
    return this.rootGroup;
  }
}
