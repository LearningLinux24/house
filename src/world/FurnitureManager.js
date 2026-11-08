import * as THREE from 'three';
import { WORLD_SCALE } from '../config/constants.js';

export const FURNITURE_SPECS = {
  beds: [
    {
      id: 'BED-GF',
      name: 'Queen Bed',
      floor: 'ground_floor',
      center: [7.875, 15.625, 2.70],
      pillow: [7.875, 18.25, 3.40],
      standPoint: [11.20, 15.625, 1.50],
      box: [5.375, 10.375, 12.375, 18.875, 1.500, 3.200],
      yaw: Math.PI // facing South (feet point along -Y in CAD)
    },
    {
      id: 'BED-1F-MASTER',
      name: 'Master King Bed',
      floor: 'first_floor',
      center: [7.00, 20.00, 13.20],
      pillow: [7.00, 22.50, 13.90],
      standPoint: [10.80, 19.50, 12.00],
      box: [4.000, 10.000, 16.750, 23.250, 12.000, 13.800],
      yaw: Math.PI
    },
    {
      id: 'BED-1F-CHILD',
      name: 'Child Bedroom Bed',
      floor: 'first_floor',
      center: [46.00, 15.50, 13.10],
      pillow: [48.00, 15.50, 13.80],
      standPoint: [46.00, 12.20, 12.00],
      box: [42.750, 49.250, 13.500, 17.500, 12.000, 13.700],
      yaw: -Math.PI / 2 // head East, feet West
    }
  ],

  seating: [
    {
      id: 'SOFA-GF-LIVING',
      name: 'Living Room Sofa',
      floor: 'ground_floor',
      seatCenter: [18.55, 6.75, 2.30],
      sitEyeElev: 4.00,
      standPoint: [20.80, 6.75, 1.50],
      box: [16.800, 19.550, 3.500, 10.000, 1.500, 3.500],
      yaw: -Math.PI / 2 // facing East into room
    },
    {
      id: 'SOFA-1F-LOBBY',
      name: 'Lobby Sofa',
      floor: 'first_floor',
      seatCenter: [18.55, 6.75, 12.80],
      sitEyeElev: 14.50,
      standPoint: [20.80, 6.75, 12.00],
      box: [16.800, 19.550, 3.500, 10.000, 12.000, 14.000],
      yaw: -Math.PI / 2
    },
    {
      id: 'CHAIR-GF-DIN-1',
      name: 'Dining Chair',
      floor: 'ground_floor',
      seatCenter: [18.75, 11.50, 2.35],
      sitEyeElev: 4.05,
      standPoint: [18.75, 10.20, 1.50],
      box: [18.000, 19.500, 10.750, 12.250, 1.500, 3.500],
      yaw: 0 // facing North
    },
    {
      id: 'CHAIR-GF-DIN-2',
      name: 'Dining Chair',
      floor: 'ground_floor',
      seatCenter: [21.25, 11.50, 2.35],
      sitEyeElev: 4.05,
      standPoint: [21.25, 10.20, 1.50],
      box: [20.500, 22.000, 10.750, 12.250, 1.500, 3.500],
      yaw: 0
    },
    {
      id: 'CHAIR-GF-DIN-3',
      name: 'Dining Chair',
      floor: 'ground_floor',
      seatCenter: [18.75, 15.35, 2.35],
      sitEyeElev: 4.05,
      standPoint: [18.75, 16.60, 1.50],
      box: [18.000, 19.500, 14.750, 16.000, 1.500, 3.500],
      yaw: Math.PI // facing South
    },
    {
      id: 'CHAIR-GF-DIN-4',
      name: 'Dining Chair',
      floor: 'ground_floor',
      seatCenter: [21.25, 15.35, 2.35],
      sitEyeElev: 4.05,
      standPoint: [21.25, 16.60, 1.50],
      box: [20.500, 22.000, 14.750, 16.000, 1.500, 3.500],
      yaw: Math.PI
    },
    {
      id: 'CHAIR-1F-STUDY',
      name: 'Study Chair',
      floor: 'first_floor',
      seatCenter: [43.00, 20.75, 12.85],
      sitEyeElev: 14.55,
      standPoint: [41.50, 20.75, 12.00],
      box: [42.250, 43.750, 20.000, 21.500, 12.000, 13.800],
      yaw: -Math.PI / 2 // facing West towards desk
    }
  ],

  toilets: [
    {
      id: 'TOILET-GF-WEST',
      name: 'West Bathroom Toilet',
      floor: 'ground_floor',
      bowlCenter: [8.625, 21.80, 2.15],
      cisternPos: [8.625, 22.90, 3.20],
      standPoint: [8.625, 20.20, 1.50],
      sitEyeElev: 3.85,
      box: [7.850, 9.400, 21.000, 23.250, 1.500, 3.400],
      yaw: Math.PI // facing South
    },
    {
      id: 'TOILET-GF-EAST',
      name: 'East Bathroom Toilet',
      floor: 'ground_floor',
      bowlCenter: [37.375, 21.80, 2.15],
      cisternPos: [37.375, 22.90, 3.20],
      standPoint: [37.375, 20.20, 1.50],
      sitEyeElev: 3.85,
      box: [36.750, 38.000, 21.000, 23.250, 1.500, 3.400],
      yaw: Math.PI
    },
    {
      id: 'TOILET-1F-BATH1',
      name: 'Bathroom 1 Toilet',
      floor: 'first_floor',
      bowlCenter: [21.625, 21.80, 12.65],
      cisternPos: [21.625, 22.90, 13.70],
      standPoint: [21.625, 20.20, 12.00],
      sitEyeElev: 14.35,
      box: [21.000, 22.250, 21.000, 23.250, 12.000, 13.900],
      yaw: Math.PI
    },
    {
      id: 'TOILET-1F-BATH2',
      name: 'Bathroom 2 Toilet',
      floor: 'first_floor',
      bowlCenter: [36.025, 21.80, 12.65],
      cisternPos: [36.025, 22.90, 13.70],
      standPoint: [36.025, 20.20, 12.00],
      sitEyeElev: 14.35,
      box: [35.400, 36.650, 21.000, 23.250, 12.000, 13.900],
      yaw: Math.PI
    }
  ]
};

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

      // Soft fabric / mattress rustle
      const bufferSize = ctx.sampleRate * 0.6;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(550, now);
      bandpass.Q.setValueAtTime(2.2, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.09, now + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.58);

      noise.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 0.6);
    } catch (_) {}
  }

  playCushionSit() {
    try {
      const ctx = this.ensureContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Low frequency compression thump
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(75, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + 0.22);
      oscGain.gain.setValueAtTime(0.18, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      // Soft cushion air puff
      const bufferSize = ctx.sampleRate * 0.3;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(380, now);
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.08, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      osc.start(now);
      noise.start(now);
      osc.stop(now + 0.25);
      noise.stop(now + 0.30);
    } catch (_) {}
  }

  playToiletLid(isOpen) {
    try {
      const ctx = this.ensureContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Ceramic / plastic lid clack
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(isOpen ? 780 : 640, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.07);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch (_) {}
  }

  playToiletFlush() {
    try {
      const ctx = this.ensureContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // 1. Initial flush trigger handle click
      const clickOsc = ctx.createOscillator();
      const clickGain = ctx.createGain();
      clickOsc.frequency.setValueAtTime(1200, now);
      clickOsc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
      clickGain.gain.setValueAtTime(0.12, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      clickOsc.connect(clickGain);
      clickGain.connect(ctx.destination);
      clickOsc.start(now);
      clickOsc.stop(now + 0.05);

      // 2. High-energy swirling water rush
      const duration = 3.6;
      const bufferSize = ctx.sampleRate * duration;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(450, now);
      bandpass.frequency.linearRampToValueAtTime(1250, now + 0.6);
      bandpass.frequency.linearRampToValueAtTime(350, now + 2.2);
      bandpass.Q.setValueAtTime(2.2, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.35);
      gain.gain.linearRampToValueAtTime(0.18, now + 2.0);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + duration);
    } catch (_) {}
  }
}

export class FurnitureManager {
  constructor(materialManager) {
    this.materials = materialManager;
    this.audio = new FurnitureAudio();

    this.rootGroup = new THREE.Group();
    this.rootGroup.name = 'InteractiveFurnitureRoot';

    this.items = [];
    this.interactiveMeshes = [];
    this.targetedItem = null;
    this.raycaster = new THREE.Raycaster();
    this.raycaster.far = 10 * WORLD_SCALE;

    // Player occupation state
    this.activeState = 'none'; // 'none' | 'sitting' | 'sleeping'
    this.activeItem = null;

    // Sleep vignette transition
    this.sleepFade = 0;
    this.sleepTargetFade = 0;

    this.flushTimer = 0;
  }

  buildFurniture(scene) {
    const s = WORLD_SCALE;

    const sanitaryMat = this.materials.get('M-SANITARY-WHITE') || new THREE.MeshStandardMaterial({
      color: '#F4F6F6',
      roughness: 0.25,
      metalness: 0.05
    });

    const chromeMat = this.materials.get('M-CHROME') || new THREE.MeshStandardMaterial({
      color: '#E0E5E8',
      metalness: 0.9,
      roughness: 0.15
    });

    const waterMat = new THREE.MeshStandardMaterial({
      color: '#C8EEFA',
      roughness: 0.05,
      transparent: true,
      opacity: 0.70,
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

      const hitGeo = new THREE.BoxGeometry(width, height * 1.2, depth);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.position.set(cx, cy, cz);
      this.rootGroup.add(hitMesh);

      const bedObj = {
        spec: spec,
        id: spec.id,
        name: spec.name,
        type: 'bed',
        floor: spec.floor,
        hitMesh: hitMesh,
        worldCenter: new THREE.Vector3(cx, cy, cz),
        liePosition: new THREE.Vector3(spec.pillow[0] * s, (spec.pillow[2] + 0.20) * s, -spec.pillow[1] * s),
        standPosition: new THREE.Vector3(spec.standPoint[0] * s, spec.standPoint[2] * s, -spec.standPoint[1] * s),
        yaw: spec.yaw
      };

      hitMesh.userData = { furniture: bedObj };
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

      const hitGeo = new THREE.BoxGeometry(width, height * 1.3, depth);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.position.set(cx, cy, cz);
      this.rootGroup.add(hitMesh);

      const seatObj = {
        spec: spec,
        id: spec.id,
        name: spec.name,
        type: 'chair',
        floor: spec.floor,
        hitMesh: hitMesh,
        worldCenter: new THREE.Vector3(cx, cy, cz),
        sitPosition: new THREE.Vector3(spec.seatCenter[0] * s, spec.sitEyeElev * s, -spec.seatCenter[1] * s),
        feetPosition: new THREE.Vector3(spec.seatCenter[0] * s, (spec.seatCenter[2] - 0.90) * s, -spec.seatCenter[1] * s),
        standPosition: new THREE.Vector3(spec.standPoint[0] * s, spec.standPoint[2] * s, -spec.standPoint[1] * s),
        yaw: spec.yaw
      };

      hitMesh.userData = { furniture: seatObj };
      this.interactiveMeshes.push(hitMesh);
      this.items.push(seatObj);
    });

    // 3. Build Interactive Toilets (WC with Animated Lid & Flush)
    FURNITURE_SPECS.toilets.forEach(spec => {
      const group = new THREE.Group();
      group.name = `ToiletGroup_${spec.id}`;

      const bx = spec.bowlCenter[0] * s;
      const by = spec.bowlCenter[2] * s;
      const bz = -spec.bowlCenter[1] * s;
      group.position.set(bx, by, bz);

      // Hinged toilet seat and lid
      const lidPivot = new THREE.Group();
      lidPivot.position.set(0, 0.28 * s, 0.40 * s); // hinge at back of bowl

      // Seat ring
      const seatGeo = new THREE.TorusGeometry(0.28 * s, 0.05 * s, 8, 16);
      const seatMesh = new THREE.Mesh(seatGeo, sanitaryMat);
      seatMesh.rotation.x = Math.PI / 2;
      seatMesh.scale.set(1.0, 1.25, 1.0);
      seatMesh.position.set(0, 0, -0.32 * s);
      lidPivot.add(seatMesh);

      // Top cover lid
      const lidGeo = new THREE.CylinderGeometry(0.32 * s, 0.32 * s, 0.035 * s, 16);
      const lidMesh = new THREE.Mesh(lidGeo, sanitaryMat);
      lidMesh.position.set(0, 0.03 * s, -0.32 * s);
      lidMesh.scale.set(1.0, 1.0, 1.25);
      lidPivot.add(lidMesh);

      group.add(lidPivot);

      // Chrome cistern flush button
      const btnGeo = new THREE.CylinderGeometry(0.045 * s, 0.045 * s, 0.02 * s, 12);
      const btnMesh = new THREE.Mesh(btnGeo, chromeMat);
      btnMesh.position.set(0, (spec.cisternPos[2] - spec.bowlCenter[2]) * s + 0.50 * s, (spec.cisternPos[1] - spec.bowlCenter[1]) * -s);
      group.add(btnMesh);

      // Swirling flush water mesh inside bowl
      const bowlWaterGeo = new THREE.CircleGeometry(0.24 * s, 16);
      const bowlWaterMesh = new THREE.Mesh(bowlWaterGeo, waterMat);
      bowlWaterMesh.rotation.x = -Math.PI / 2;
      bowlWaterMesh.position.set(0, 0.05 * s, -0.32 * s);
      group.add(bowlWaterMesh);

      // Interactive Hit Mesh
      const hitGeo = new THREE.BoxGeometry(1.2 * s, 1.6 * s, 1.6 * s);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.position.set(0, 0.4 * s, 0);
      group.add(hitMesh);

      this.rootGroup.add(group);

      const toiletObj = {
        spec: spec,
        id: spec.id,
        name: spec.name,
        type: 'toilet',
        floor: spec.floor,
        group: group,
        lidPivot: lidPivot,
        btnMesh: btnMesh,
        bowlWaterMesh: bowlWaterMesh,
        hitMesh: hitMesh,
        isLidOpen: false,
        targetAngle: 0,
        currentAngle: 0,
        isFlushing: false,
        flushTime: 0,
        worldCenter: new THREE.Vector3(bx, by + 0.4 * s, bz),
        sitPosition: new THREE.Vector3(bx, spec.sitEyeElev * s, bz),
        standPosition: new THREE.Vector3(spec.standPoint[0] * s, spec.standPoint[2] * s, -spec.standPoint[1] * s),
        yaw: spec.yaw
      };

      hitMesh.userData = { furniture: toiletObj };
      lidMesh.userData = { furniture: toiletObj };
      btnMesh.userData = { furniture: toiletObj, isFlushBtn: true };

      this.interactiveMeshes.push(hitMesh);
      this.items.push(toiletObj);
    });

    scene.add(this.rootGroup);
    return this.rootGroup;
  }

  toggleToiletLid(toilet) {
    toilet.isLidOpen = !toilet.isLidOpen;
    toilet.targetAngle = toilet.isLidOpen ? -Math.PI * 0.58 : 0;
    this.audio.playToiletLid(toilet.isLidOpen);
  }

  flushToilet(toilet) {
    if (toilet.isFlushing) return;
    toilet.isFlushing = true;
    toilet.flushTime = 0;
    this.audio.playToiletFlush();
  }

  occupyItem(item, player, avatar, cameraCtrl, ui) {
    if (item.type === 'bed') {
      this.activeState = 'sleeping';
      this.activeItem = item;
      this.sleepTargetFade = 1.0;
      this.audio.playBedRustle();

      if (avatar) avatar.setPose('sleeping');

      // Place player at bed pillow
      player.position.copy(item.liePosition);
      player.feetElevation = item.spec.center[2];
      player.velocityY = 0;
      player.isGrounded = true;

      if (ui) ui.showToast('Resting in bed... Press [E] or [Space] to get up');
    } else if (item.type === 'chair' || item.type === 'toilet') {
      this.activeState = 'sitting';
      this.activeItem = item;
      this.audio.playCushionSit();

      if (avatar) avatar.setPose('sitting');

      // Place player seated on chair
      player.position.copy(item.sitPosition);
      player.feetElevation = item.spec.standPoint[2];
      player.velocityY = 0;
      player.isGrounded = true;

      if (ui) ui.showToast(`Seated on ${item.name}. Press [E] or [Space] to stand up`);
    }
  }

  leaveItem(player, avatar, cameraCtrl, ui) {
    if (this.activeState === 'none' || !this.activeItem) return;

    const item = this.activeItem;
    this.activeState = 'none';
    this.activeItem = null;
    this.sleepTargetFade = 0;

    if (avatar) avatar.setPose('standing');

    // Restore player to standing point
    player.position.copy(item.standPosition);
    player.feetElevation = item.spec.standPoint[2];
    player.position.y = player.feetElevation + player.config.eyeHeight;
    player.velocityY = 0;
    player.isGrounded = true;

    if (ui) {
      ui.hideInteractionPrompt();
      ui.showToast('Standing up');
    }
  }

  interact(player, avatar, cameraCtrl, ui, showPrompt = false) {
    // If currently occupied, any interact key leaves item
    if (this.activeState !== 'none') {
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
      if (!item.isLidOpen) {
        this.toggleToiletLid(item);
      } else {
        // Lid open: flush or sit
        this.flushToilet(item);
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

    // 1. Animate toilet lids & swirling flush water
    this.items.forEach(item => {
      if (item.type === 'toilet') {
        item.currentAngle = THREE.MathUtils.lerp(item.currentAngle, item.targetAngle, delta * 9.0);
        item.lidPivot.rotation.x = item.currentAngle;

        if (item.isFlushing) {
          item.flushTime += delta;
          // Swirling water rotation & dip
          item.bowlWaterMesh.rotation.z += delta * 12.0;
          const swirlDip = Math.sin(item.flushTime * 2.0) * 0.04 * s;
          item.bowlWaterMesh.position.y = 0.05 * s - swirlDip;

          if (item.flushTime > 3.6) {
            item.isFlushing = false;
            item.bowlWaterMesh.position.y = 0.05 * s;
          }
        }
      }
    });

    // 2. Occupied state updates (Sitting or Sleeping)
    if (this.activeState !== 'none' && this.activeItem) {
      // In first-person or third-person, keep camera at occupied position
      if (this.activeState === 'sitting') {
        player.position.copy(this.activeItem.sitPosition);
      } else if (this.activeState === 'sleeping') {
        player.position.copy(this.activeItem.liePosition);
      }

      if (ui && showPrompt) {
        ui.showInteractionPrompt(`[E / Space] ${this.activeState === 'sleeping' ? 'Wake Up' : 'Stand Up'}`);
      }
      return;
    }

    // 3. Proximity targeting (when standing)
    if (!isFPActive || !camera || !playerPosition) {
      if (this.targetedItem) {
        this.targetedItem = null;
        if (ui && !isOtherTargeted) ui.hideInteractionPrompt();
      }
      return;
    }

    const reach = 6.8 * s;
    const activeItems = this.items.filter(item => {
      const dDist = playerPosition.distanceTo(item.worldCenter);
      return dDist <= reach;
    });

    let bestItem = null;
    let closestDist = Infinity;

    // Reticle raycast
    this.raycaster.setFromCamera({ x: 0, y: 0 }, camera);
    const candidateMeshes = activeItems.map(it => it.hitMesh);
    const intersects = this.raycaster.intersectObjects(candidateMeshes, false);

    if (intersects.length > 0) {
      const hitObj = intersects[0].object;
      if (hitObj && hitObj.userData?.furniture) {
        if (intersects[0].distance <= reach) {
          bestItem = hitObj.userData.furniture;
        }
      }
    }

    // Look angle fallback
    if (!bestItem) {
      const camDir = new THREE.Vector3();
      camera.getWorldDirection(camDir);

      activeItems.forEach(item => {
        const toItem = new THREE.Vector3().subVectors(item.worldCenter, camera.position);
        const dist = toItem.length();
        toItem.normalize();
        const dot = camDir.dot(toItem);
        if (dot > 0.72 && dist <= 5.8 * s && dist < closestDist) {
          closestDist = dist;
          bestItem = item;
        }
      });
    }

    this.targetedItem = bestItem;

    if (ui && !isOtherTargeted) {
      if (this.targetedItem && showPrompt) {
        let label = `[E] Interact with ${this.targetedItem.name}`;
        if (this.targetedItem.type === 'bed') {
          label = `[E] Sleep on ${this.targetedItem.name}`;
        } else if (this.targetedItem.type === 'chair') {
          label = `[E] Sit on ${this.targetedItem.name}`;
        } else if (this.targetedItem.type === 'toilet') {
          label = this.targetedItem.isLidOpen
            ? `[E] Flush ${this.targetedItem.name}`
            : `[E] Open ${this.targetedItem.name} Lid`;
        }
        ui.showInteractionPrompt(label);
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
