import * as THREE from 'three';
import { WORLD_SCALE } from '../config/constants.js';

export class VehicleManager {
  constructor(materials, collision) {
    this.materials = materials;
    this.collision = collision;

    this.rootGroup = new THREE.Group();
    this.rootGroup.name = 'VehicleManager_Root';

    // Interactive targeting state
    this.targetedCar = null;
    this.targetedDistance = Infinity;
    this.isDirectHit = false;
    this.promptLabel = null;
    this.raycaster = new THREE.Raycaster();

    // Driving state
    this.isDriving = false;
    this.cameraMode = 'cockpit'; // 'cockpit' | 'chase'
    this.headlightsOn = false;

    // Kinematic vehicle dynamics
    this.posX = 42.875 * WORLD_SCALE;
    this.posY = 0.25 * WORLD_SCALE;
    this.posZ = -7.25 * WORLD_SCALE;
    this.yaw = 0; // facing +Z (South toward garage door)

    this.velocity = 0;
    this.steerAngle = 0;
    this.wheelSpinAngle = 0;

    // Tuning constants
    this.maxForwardSpeed = 24.0 * WORLD_SCALE; // ~16 mph (responsive for yard/street)
    this.maxReverseSpeed = 10.0 * WORLD_SCALE;
    this.accelRate = 18.0 * WORLD_SCALE;
    this.brakeRate = 28.0 * WORLD_SCALE;
    this.reverseAccelRate = 12.0 * WORLD_SCALE;
    this.dragRate = 4.5;
    this.steerSpeed = 2.4;
    this.maxSteerAngle = 0.52; // ~30 degrees
    this.wheelbase = 8.2 * WORLD_SCALE;

    // Audio nodes
    this.audioCtx = null;
    this.engineGain = null;
    this.engineOsc1 = null;
    this.engineOsc2 = null;
    this.engineFilter = null;
    this.isEngineRunning = false;

    // Mesh references
    this.carGroup = null;
    this.steeringGroupFL = null;
    this.steeringGroupFR = null;
    this.spinGroupFL = null;
    this.spinGroupFR = null;
    this.spinGroupRL = null;
    this.spinGroupRR = null;
    this.interiorSteeringWheel = null;

    // Lighting meshes & sources
    this.spotLightLeft = null;
    this.spotLightRight = null;
    this.headlightMatOff = null;
    this.headlightMatOn = null;
    this.taillightMatOff = null;
    this.taillightMatOn = null;
    this.headlightMeshes = [];
    this.taillightMeshes = [];

    // Associated collision item
    this.carCollider = null;
  }

  ensureAudioContext() {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  startEngineAudio() {
    const ctx = this.ensureAudioContext();
    if (!ctx || this.isEngineRunning) return;

    try {
      this.engineGain = ctx.createGain();
      this.engineGain.gain.setValueAtTime(0.001, ctx.currentTime);
      this.engineGain.gain.exponentialRampToValueAtTime(0.20, ctx.currentTime + 0.35);

      this.engineFilter = ctx.createBiquadFilter();
      this.engineFilter.type = 'lowpass';
      this.engineFilter.frequency.setValueAtTime(260, ctx.currentTime);

      // Low rumble triangle wave (engine firing pulse)
      this.engineOsc1 = ctx.createOscillator();
      this.engineOsc1.type = 'triangle';
      this.engineOsc1.frequency.setValueAtTime(36, ctx.currentTime);

      // Higher harmonic sawtooth wave (mechanical hum)
      this.engineOsc2 = ctx.createOscillator();
      this.engineOsc2.type = 'sawtooth';
      this.engineOsc2.frequency.setValueAtTime(72, ctx.currentTime);

      const oscGain2 = ctx.createGain();
      oscGain2.gain.setValueAtTime(0.35, ctx.currentTime);

      this.engineOsc1.connect(this.engineFilter);
      this.engineOsc2.connect(oscGain2);
      oscGain2.connect(this.engineFilter);

      this.engineFilter.connect(this.engineGain);
      this.engineGain.connect(ctx.destination);

      this.engineOsc1.start();
      this.engineOsc2.start();
      this.isEngineRunning = true;
    } catch (e) {
      console.warn('[VehicleManager] Engine audio start exception:', e.message);
    }
  }

  updateEngineAudio() {
    if (!this.isEngineRunning || !this.audioCtx || !this.engineOsc1) return;
    try {
      const now = this.audioCtx.currentTime;
      const speedRatio = Math.min(1.0, Math.abs(this.velocity) / this.maxForwardSpeed);
      const targetFreq1 = 36 + speedRatio * 82; // 36 Hz idle to 118 Hz high-rev
      const targetFreq2 = targetFreq1 * 2;
      const filterFreq = 260 + speedRatio * 650;
      const targetVol = 0.16 + speedRatio * 0.14;

      this.engineOsc1.frequency.setTargetAtTime(targetFreq1, now, 0.08);
      this.engineOsc2.frequency.setTargetAtTime(targetFreq2, now, 0.08);
      this.engineFilter.frequency.setTargetAtTime(filterFreq, now, 0.08);
      this.engineGain.gain.setTargetAtTime(targetVol, now, 0.08);
    } catch {}
  }

  stopEngineAudio() {
    if (!this.isEngineRunning || !this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      if (this.engineGain) {
        this.engineGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
      }
      setTimeout(() => {
        try {
          if (this.engineOsc1) this.engineOsc1.stop();
          if (this.engineOsc2) this.engineOsc2.stop();
        } catch {}
        this.isEngineRunning = false;
        this.engineOsc1 = null;
        this.engineOsc2 = null;
      }, 260);
    } catch {
      this.isEngineRunning = false;
    }
  }

  playHorn() {
    const ctx = this.ensureAudioContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.0, now);
      masterGain.gain.linearRampToValueAtTime(0.28, now + 0.03);
      masterGain.gain.setValueAtTime(0.28, now + 0.32);
      masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      masterGain.connect(ctx.destination);

      // Authentic automotive dual-tone interval: A4 (440 Hz) + C#5 (554 Hz)
      [440, 554.37].forEach(freq => {
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(freq, now);
        filter.Q.setValueAtTime(4.0, now);

        osc.connect(filter);
        filter.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.45);
      });
    } catch {}
  }

  playDoorAudio() {
    const ctx = this.ensureAudioContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.12);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch {}
  }

  buildCar(scene) {
    const s = WORLD_SCALE;

    // Main physical car coordinate origin sits at center of wheelbase on the ground
    this.carGroup = new THREE.Group();
    this.carGroup.name = 'Luxury_SUV_Car';
    this.carGroup.position.set(this.posX, this.posY, this.posZ);
    this.carGroup.rotation.y = this.yaw;

    // ── Material Palette (Watertight, Premium PBR Materials) ───────────────────
    const bodyPaintMat = new THREE.MeshPhysicalMaterial({
      color: 0x162238, // Midnight Obsidian / Sapphire Metallic
      metalness: 0.85,
      roughness: 0.20,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05
    });

    const darkTrimMat = new THREE.MeshStandardMaterial({
      color: 0x1c1e22, // Architectural matte composite
      roughness: 0.85,
      metalness: 0.10
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      metalness: 0.96,
      roughness: 0.08
    });

    const silverTrimMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.75,
      roughness: 0.25
    });

    const tireRubberMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.90,
      metalness: 0.05
    });

    const alloyRimMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.90,
      roughness: 0.16
    });

    const brakeRotorMat = new THREE.MeshStandardMaterial({
      color: 0x71717a,
      metalness: 0.85,
      roughness: 0.35
    });

    const brakeCaliperMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626, // Red performance brake caliper
      metalness: 0.40,
      roughness: 0.30
    });

    const interiorLeatherMat = new THREE.MeshStandardMaterial({
      color: 0x22262e, // Charcoal premium stitched leather
      roughness: 0.70,
      metalness: 0.10
    });

    this.headlightMatOff = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.6,
      roughness: 0.2
    });
    this.headlightMatOn = new THREE.MeshBasicMaterial({
      color: 0xf8fafc // Bright cool-white LED
    });

    this.taillightMatOff = new THREE.MeshStandardMaterial({
      color: 0x7f1d1d,
      roughness: 0.3
    });
    this.taillightMatOn = new THREE.MeshBasicMaterial({
      color: 0xff1e1e // Vibrant red LED
    });

    // ── 1. Heavy-Duty Ladder Chassis & Side Steps ─────────────────────────────
    const chassisGeo = new THREE.BoxGeometry(4.8 * s, 0.25 * s, 12.6 * s);
    const chassisMesh = new THREE.Mesh(chassisGeo, darkTrimMat);
    chassisMesh.position.set(0, 0.85 * s, 0);
    this.carGroup.add(chassisMesh);

    // Tubular side step running boards with black grip pads
    [-2.85 * s, 2.85 * s].forEach(sx => {
      const stepTubeGeo = new THREE.BoxGeometry(0.35 * s, 0.08 * s, 5.6 * s);
      const stepTube = new THREE.Mesh(stepTubeGeo, chromeMat);
      stepTube.position.set(sx, 0.92 * s, 0);
      this.carGroup.add(stepTube);

      const gripGeo = new THREE.BoxGeometry(0.28 * s, 0.02 * s, 5.2 * s);
      const gripMesh = new THREE.Mesh(gripGeo, darkTrimMat);
      gripMesh.position.set(sx, 0.97 * s, 0);
      this.carGroup.add(gripMesh);
    });

    // ── 2. Muscular Lower Body Shell & Waist Rub-Strip ────────────────────────
    // Main lower body solid (plinth up to window sill level)
    const lowerBodyGeo = new THREE.BoxGeometry(5.4 * s, 1.35 * s, 12.8 * s);
    const lowerBodyMesh = new THREE.Mesh(lowerBodyGeo, bodyPaintMat);
    lowerBodyMesh.position.set(0, 1.62 * s, 0);
    lowerBodyMesh.castShadow = true;
    lowerBodyMesh.receiveShadow = true;
    this.carGroup.add(lowerBodyMesh);

    // Continuous horizontal protective waist rub-strip with chrome insert
    [-2.73 * s, 2.73 * s].forEach(wx => {
      const rubStripGeo = new THREE.BoxGeometry(0.08 * s, 0.12 * s, 12.4 * s);
      const rubStrip = new THREE.Mesh(rubStripGeo, darkTrimMat);
      rubStrip.position.set(wx, 2.30 * s, 0);
      this.carGroup.add(rubStrip);

      const chromeInsertGeo = new THREE.BoxGeometry(0.09 * s, 0.03 * s, 12.2 * s);
      const chromeInsert = new THREE.Mesh(chromeInsertGeo, chromeMat);
      chromeInsert.position.set(wx, 2.30 * s, 0);
      this.carGroup.add(chromeInsert);
    });

    // ── 3. Four Muscular Box Fender Flares ─────────────────────────────────────
    const fenderCoords = [
      [-2.82 * s, 3.8 * s],
      [2.82 * s, 3.8 * s],
      [-2.82 * s, -3.8 * s],
      [2.82 * s, -3.8 * s]
    ];
    fenderCoords.forEach(([fx, fz]) => {
      const flareGeo = new THREE.BoxGeometry(0.28 * s, 1.25 * s, 2.8 * s);
      const flareMesh = new THREE.Mesh(flareGeo, bodyPaintMat);
      flareMesh.position.set(fx, 1.62 * s, fz);
      this.carGroup.add(flareMesh);

      // Black protective wheel arch liner
      const linerGeo = new THREE.BoxGeometry(0.30 * s, 0.15 * s, 2.84 * s);
      const linerMesh = new THREE.Mesh(linerGeo, darkTrimMat);
      linerMesh.position.set(fx, 1.05 * s, fz);
      this.carGroup.add(linerMesh);
    });

    // ── 4. Muscular Flat Hood with Power Bulge & Fender Indicators ────────────
    const hoodGeo = new THREE.BoxGeometry(5.2 * s, 0.16 * s, 4.6 * s);
    const hoodMesh = new THREE.Mesh(hoodGeo, bodyPaintMat);
    hoodMesh.position.set(0, 2.38 * s, 4.1 * s);
    hoodMesh.castShadow = true;
    this.carGroup.add(hoodMesh);

    // Raised center power bulge
    const bulgeGeo = new THREE.BoxGeometry(2.4 * s, 0.10 * s, 4.2 * s);
    const bulgeMesh = new THREE.Mesh(bulgeGeo, bodyPaintMat);
    bulgeMesh.position.set(0, 2.48 * s, 4.1 * s);
    this.carGroup.add(bulgeMesh);

    // Iconic Fender Top Turn Indicators (Amber crystals on front hood corners)
    [-2.42 * s, 2.42 * s].forEach(ix => {
      const indHousingGeo = new THREE.BoxGeometry(0.25 * s, 0.12 * s, 0.48 * s);
      const indHousing = new THREE.Mesh(indHousingGeo, darkTrimMat);
      indHousing.position.set(ix, 2.46 * s, 5.6 * s);
      this.carGroup.add(indHousing);

      const indLensGeo = new THREE.BoxGeometry(0.21 * s, 0.10 * s, 0.44 * s);
      const indLens = new THREE.Mesh(indLensGeo, new THREE.MeshBasicMaterial({ color: 0xf59e0b }));
      indLens.position.set(ix, 2.52 * s, 5.6 * s);
      this.carGroup.add(indLens);
    });

    // ── 5. Upright Radiator Grille & Dual Round LED Headlights ─────────────────
    const grilleBoxGeo = new THREE.BoxGeometry(4.8 * s, 0.95 * s, 0.15 * s);
    const grilleBox = new THREE.Mesh(grilleBoxGeo, darkTrimMat);
    grilleBox.position.set(0, 1.85 * s, 6.42 * s);
    this.carGroup.add(grilleBox);

    // Horizontal Chrome Slats
    [-0.25 * s, 0, 0.25 * s].forEach(sy => {
      const slatGeo = new THREE.BoxGeometry(2.8 * s, 0.05 * s, 0.18 * s);
      const slatMesh = new THREE.Mesh(slatGeo, chromeMat);
      slatMesh.position.set(0, 1.85 * s + sy, 6.44 * s);
      this.carGroup.add(slatMesh);
    });

    // Center Chrome Luxury Emblem
    const emblemGeo = new THREE.CylinderGeometry(0.22 * s, 0.22 * s, 0.08 * s, 20);
    emblemGeo.rotateX(Math.PI / 2);
    const emblemMesh = new THREE.Mesh(emblemGeo, chromeMat);
    emblemMesh.position.set(0, 1.85 * s, 6.52 * s);
    this.carGroup.add(emblemMesh);

    // Dual Round Projector LED Headlights with Glowing Halo DRL Rings
    [-2.15 * s, 2.15 * s].forEach(hx => {
      // Chrome headlight bezel ring
      const bezelGeo = new THREE.TorusGeometry(0.38 * s, 0.05 * s, 12, 24);
      const bezelMesh = new THREE.Mesh(bezelGeo, chromeMat);
      bezelMesh.position.set(hx, 1.85 * s, 6.46 * s);
      this.carGroup.add(bezelMesh);

      // Glowing circular Halo DRL ring
      const haloGeo = new THREE.TorusGeometry(0.32 * s, 0.03 * s, 12, 24);
      const haloMesh = new THREE.Mesh(haloGeo, this.headlightMatOn);
      haloMesh.position.set(hx, 1.85 * s, 6.48 * s);
      this.carGroup.add(haloMesh);

      // Inner Projector LED lens
      const lensGeo = new THREE.CylinderGeometry(0.24 * s, 0.24 * s, 0.08 * s, 20);
      lensGeo.rotateX(Math.PI / 2);
      const lensMesh = new THREE.Mesh(lensGeo, this.headlightMatOff);
      lensMesh.position.set(hx, 1.85 * s, 6.47 * s);
      this.carGroup.add(lensMesh);
      this.headlightMeshes.push(lensMesh);
    });

    // Real dynamic Three.js SpotLights pointing forward from headlights
    this.spotLightLeft = new THREE.SpotLight(0xfff7ed, 0, 80 * s, Math.PI / 6.5, 0.45, 1.4);
    this.spotLightLeft.position.set(-2.15 * s, 1.85 * s, 6.55 * s);
    const targetL = new THREE.Object3D();
    targetL.position.set(-2.2 * s, 0.5 * s, 35.0 * s);
    this.carGroup.add(targetL);
    this.spotLightLeft.target = targetL;
    this.carGroup.add(this.spotLightLeft);

    this.spotLightRight = new THREE.SpotLight(0xfff7ed, 0, 80 * s, Math.PI / 6.5, 0.45, 1.4);
    this.spotLightRight.position.set(2.15 * s, 1.85 * s, 6.55 * s);
    const targetR = new THREE.Object3D();
    targetR.position.set(2.2 * s, 0.5 * s, 35.0 * s);
    this.carGroup.add(targetR);
    this.spotLightRight.target = targetR;
    this.carGroup.add(this.spotLightRight);

    // Front Bumper Bar & Skid Plate
    const frontBumperGeo = new THREE.BoxGeometry(5.4 * s, 0.65 * s, 0.45 * s);
    const frontBumperMesh = new THREE.Mesh(frontBumperGeo, darkTrimMat);
    frontBumperMesh.position.set(0, 1.15 * s, 6.62 * s);
    this.carGroup.add(frontBumperMesh);

    const skidPlateGeo = new THREE.BoxGeometry(3.6 * s, 0.22 * s, 0.48 * s);
    const skidPlate = new THREE.Mesh(skidPlateGeo, silverTrimMat);
    skidPlate.position.set(0, 0.78 * s, 6.65 * s);
    this.carGroup.add(skidPlate);

    // Front License Plate
    const plateGeo = new THREE.BoxGeometry(1.6 * s, 0.45 * s, 0.04 * s);
    const plateMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
    const frontPlate = new THREE.Mesh(plateGeo, plateMat);
    frontPlate.position.set(0, 1.05 * s, 6.86 * s);
    this.carGroup.add(frontPlate);

    // ── 6. Completely Hollow Cabin Structure with Open Window Apertures ───────
    // NO opaque solid boxes inside the cabin!
    // NO dark glasses! The window openings are completely open and crystal clear!

    // A. Front Windshield Opening Frame
    // Front A-Pillars on Left (+X) and Right (-X)
    [-2.55 * s, 2.55 * s].forEach(ax => {
      const aPillarGeo = new THREE.BoxGeometry(0.25 * s, 2.15 * s, 0.25 * s);
      const aPillar = new THREE.Mesh(aPillarGeo, bodyPaintMat);
      aPillar.position.set(ax, 3.45 * s, 1.75 * s);
      this.carGroup.add(aPillar);
    });

    // Front lower cowl bar (below open windshield)
    const frontCowlGeo = new THREE.BoxGeometry(5.2 * s, 0.20 * s, 0.25 * s);
    const frontCowl = new THREE.Mesh(frontCowlGeo, bodyPaintMat);
    frontCowl.position.set(0, 2.45 * s, 1.75 * s);
    this.carGroup.add(frontCowl);

    // Front top windshield header bar
    const frontHeaderGeo = new THREE.BoxGeometry(5.2 * s, 0.20 * s, 0.25 * s);
    const frontHeader = new THREE.Mesh(frontHeaderGeo, bodyPaintMat);
    frontHeader.position.set(0, 4.45 * s, 1.75 * s);
    this.carGroup.add(frontHeader);

    // Dual front wipers sitting at cowl base
    [-0.95 * s, 0.95 * s].forEach(wx => {
      const wiperArmGeo = new THREE.BoxGeometry(0.04 * s, 0.75 * s, 0.04 * s);
      wiperArmGeo.rotateZ(0.25);
      const wiperArm = new THREE.Mesh(wiperArmGeo, darkTrimMat);
      wiperArm.position.set(wx, 2.85 * s, 1.88 * s);
      this.carGroup.add(wiperArm);
    });

    // B. Side Pillars (B, C, D pillars) creating completely OPEN side windows
    [-2.55 * s, 2.55 * s].forEach(sx => {
      // B-Pillar (between front & rear seats)
      const bPillarGeo = new THREE.BoxGeometry(0.25 * s, 2.15 * s, 0.28 * s);
      const bPillar = new THREE.Mesh(bPillarGeo, bodyPaintMat);
      bPillar.position.set(sx, 3.45 * s, -0.40 * s);
      this.carGroup.add(bPillar);

      // C-Pillar (behind rear seats)
      const cPillarGeo = new THREE.BoxGeometry(0.25 * s, 2.15 * s, 0.35 * s);
      const cPillar = new THREE.Mesh(cPillarGeo, bodyPaintMat);
      cPillar.position.set(sx, 3.45 * s, -3.20 * s);
      this.carGroup.add(cPillar);

      // D-Pillar (rear corner pillar)
      const dPillarGeo = new THREE.BoxGeometry(0.25 * s, 2.15 * s, 0.28 * s);
      const dPillar = new THREE.Mesh(dPillarGeo, bodyPaintMat);
      dPillar.position.set(sx, 3.45 * s, -6.35 * s);
      this.carGroup.add(dPillar);

      // Side lower sills and upper roof cantrail beams
      const cantrailGeo = new THREE.BoxGeometry(0.25 * s, 0.18 * s, 8.2 * s);
      const cantrail = new THREE.Mesh(cantrailGeo, bodyPaintMat);
      cantrail.position.set(sx, 4.45 * s, -2.3 * s);
      this.carGroup.add(cantrail);

      // Door handles
      [0.6 * s, -1.8 * s].forEach(hz => {
        const handleGeo = new THREE.BoxGeometry(0.08 * s, 0.10 * s, 0.65 * s);
        const handleMesh = new THREE.Mesh(handleGeo, chromeMat);
        handleMesh.position.set(sx + (sx > 0 ? 0.05 : -0.05) * s, 2.25 * s, hz);
        this.carGroup.add(handleMesh);
      });
    });

    // C. Rear Tailgate Frame with OPEN rear window
    const rearHeaderGeo = new THREE.BoxGeometry(5.2 * s, 0.20 * s, 0.25 * s);
    const rearHeader = new THREE.Mesh(rearHeaderGeo, bodyPaintMat);
    rearHeader.position.set(0, 4.45 * s, -6.35 * s);
    this.carGroup.add(rearHeader);

    // ── 7. Solid Flat Roof with Drip Rails & Expedition Roof Rack ─────────────
    const roofCapGeo = new THREE.BoxGeometry(5.3 * s, 0.15 * s, 8.3 * s);
    const roofCap = new THREE.Mesh(roofCapGeo, bodyPaintMat);
    roofCap.position.set(0, 4.60 * s, -2.3 * s);
    roofCap.castShadow = true;
    this.carGroup.add(roofCap);

    // Longitudinal roof reinforcement ribs
    [-1.5 * s, -0.5 * s, 0.5 * s, 1.5 * s].forEach(rx => {
      const ribGeo = new THREE.BoxGeometry(0.08 * s, 0.05 * s, 7.8 * s);
      const ribMesh = new THREE.Mesh(ribGeo, bodyPaintMat);
      ribMesh.position.set(rx, 4.70 * s, -2.3 * s);
      this.carGroup.add(ribMesh);
    });

    // Low-profile expedition roof rails on left & right
    [-2.35 * s, 2.35 * s].forEach(rx => {
      const railGeo = new THREE.BoxGeometry(0.08 * s, 0.10 * s, 7.6 * s);
      const railMesh = new THREE.Mesh(railGeo, darkTrimMat);
      railMesh.position.set(rx, 4.76 * s, -2.3 * s);
      this.carGroup.add(railMesh);
    });

    // ── 8. Tailgate & Iconic Hard-Shell Mounted Spare Wheel ───────────────────
    const rearHandleGeo = new THREE.BoxGeometry(0.08 * s, 0.55 * s, 0.08 * s);
    const rearHandle = new THREE.Mesh(rearHandleGeo, chromeMat);
    rearHandle.position.set(1.95 * s, 2.35 * s, -6.45 * s);
    this.carGroup.add(rearHandle);

    // Full-size hard-shell mounted spare wheel on tailgate
    const spareGroup = new THREE.Group();
    spareGroup.position.set(0, 2.35 * s, -6.85 * s);

    const spareCoverGeo = new THREE.CylinderGeometry(1.05 * s, 1.05 * s, 0.55 * s, 24);
    spareCoverGeo.rotateX(Math.PI / 2);
    const spareCover = new THREE.Mesh(spareCoverGeo, bodyPaintMat);
    spareGroup.add(spareCover);

    const spareRingGeo = new THREE.TorusGeometry(1.06 * s, 0.04 * s, 12, 28);
    const spareRing = new THREE.Mesh(spareRingGeo, chromeMat);
    spareRing.position.set(0, 0, -0.28 * s);
    spareGroup.add(spareRing);

    const spareBadgeGeo = new THREE.CylinderGeometry(0.32 * s, 0.32 * s, 0.05 * s, 20);
    spareBadgeGeo.rotateX(Math.PI / 2);
    const spareBadge = new THREE.Mesh(spareBadgeGeo, chromeMat);
    spareBadge.position.set(0, 0, -0.29 * s);
    spareGroup.add(spareBadge);

    this.carGroup.add(spareGroup);

    // Vertical rear LED taillight clusters
    [-2.35 * s, 2.35 * s].forEach(tx => {
      const tailHousingGeo = new THREE.BoxGeometry(0.24 * s, 0.75 * s, 0.12 * s);
      const tailHousing = new THREE.Mesh(tailHousingGeo, darkTrimMat);
      tailHousing.position.set(tx, 1.85 * s, -6.44 * s);
      this.carGroup.add(tailHousing);

      const tailLensGeo = new THREE.BoxGeometry(0.20 * s, 0.68 * s, 0.08 * s);
      const tailLens = new THREE.Mesh(tailLensGeo, this.taillightMatOff);
      tailLens.position.set(tx, 1.85 * s, -6.48 * s);
      this.carGroup.add(tailLens);
      this.taillightMeshes.push(tailLens);
    });

    // Rear Bumper Bar & Tow Hitch
    const rearBumperGeo = new THREE.BoxGeometry(5.4 * s, 0.65 * s, 0.45 * s);
    const rearBumperMesh = new THREE.Mesh(rearBumperGeo, darkTrimMat);
    rearBumperMesh.position.set(0, 1.15 * s, -6.60 * s);
    this.carGroup.add(rearBumperMesh);

    // Dual polished chrome exhaust tips
    [-1.75 * s, 1.75 * s].forEach(ex => {
      const tipGeo = new THREE.CylinderGeometry(0.14 * s, 0.16 * s, 0.32 * s, 16);
      tipGeo.rotateX(Math.PI / 2);
      const tipMesh = new THREE.Mesh(tipGeo, chromeMat);
      tipMesh.position.set(ex, 0.85 * s, -6.80 * s);
      this.carGroup.add(tipMesh);
    });

    // Rear License Plate
    const rearPlate = new THREE.Mesh(plateGeo, plateMat);
    rearPlate.position.set(0, 1.15 * s, -6.85 * s);
    this.carGroup.add(rearPlate);

    // ── 9. Rugged Luxury Side Mirrors ─────────────────────────────────────────
    [-2.95 * s, 2.95 * s].forEach((mx, idx) => {
      const mirrorStalkGeo = new THREE.BoxGeometry(0.25 * s, 0.08 * s, 0.12 * s);
      const mirrorStalk = new THREE.Mesh(mirrorStalkGeo, darkTrimMat);
      mirrorStalk.position.set(mx + (idx === 0 ? 0.15 : -0.15) * s, 2.85 * s, 1.45 * s);
      this.carGroup.add(mirrorStalk);

      const mirrorHousingGeo = new THREE.BoxGeometry(0.35 * s, 0.55 * s, 0.22 * s);
      const mirrorHousing = new THREE.Mesh(mirrorHousingGeo, bodyPaintMat);
      mirrorHousing.position.set(mx, 2.85 * s, 1.45 * s);
      this.carGroup.add(mirrorHousing);

      // Mirror reflective glass face (facing -Z toward driver eyes)
      const mirrorGlassGeo = new THREE.PlaneGeometry(0.28 * s, 0.48 * s);
      mirrorGlassGeo.rotateY(Math.PI);
      const mirrorGlass = new THREE.Mesh(mirrorGlassGeo, chromeMat);
      mirrorGlass.position.set(mx + (idx === 0 ? 0.04 : -0.04) * s, 2.85 * s, 1.33 * s);
      this.carGroup.add(mirrorGlass);
    });

    // ── 10. High-Detail Interior Cockpit (RIGHT-HAND DRIVE FOR INDIA) ──────────
    // Dashboard block (positioned directly in front of driver at Z = +1.60)
    const dashGeo = new THREE.BoxGeometry(4.8 * s, 0.65 * s, 0.75 * s);
    const dashMesh = new THREE.Mesh(dashGeo, interiorLeatherMat);
    dashMesh.position.set(0, 2.45 * s, 1.55 * s);
    this.carGroup.add(dashMesh);

    // Driver Instrument Cluster Display (DIRECTLY IN FRONT OF DRIVER ON RIGHT SIDE: X = -1.15)
    const clusterGeo = new THREE.BoxGeometry(1.25 * s, 0.38 * s, 0.04 * s);
    const clusterMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff }); // Glowing digital speedometer/rev display
    const clusterMesh = new THREE.Mesh(clusterGeo, clusterMat);
    clusterMesh.position.set(-1.15 * s, 2.70 * s, 1.50 * s);
    clusterMesh.rotateX(-0.15);
    this.carGroup.add(clusterMesh);

    // Center Infotainment Navigation Screen (at center: X = 0)
    const screenGeo = new THREE.BoxGeometry(1.15 * s, 0.38 * s, 0.04 * s);
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x0284c7 });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(0.10 * s, 2.70 * s, 1.50 * s);
    screenMesh.rotateX(-0.15);
    this.carGroup.add(screenMesh);

    // Passenger front grab handle (ON LEFT SIDE: X = +1.45)
    const grabBarGeo = new THREE.BoxGeometry(1.2 * s, 0.08 * s, 0.08 * s);
    const grabBar = new THREE.Mesh(grabBarGeo, darkTrimMat);
    grabBar.position.set(1.45 * s, 2.65 * s, 1.48 * s);
    this.carGroup.add(grabBar);

    // Floor Center Console & Gear Shift Selector (between the two front seats)
    const floorConsoleGeo = new THREE.BoxGeometry(0.85 * s, 0.55 * s, 3.2 * s);
    const floorConsole = new THREE.Mesh(floorConsoleGeo, interiorLeatherMat);
    floorConsole.position.set(0, 1.30 * s, 0.20 * s);
    this.carGroup.add(floorConsole);

    const shifterGeo = new THREE.CylinderGeometry(0.06 * s, 0.06 * s, 0.28 * s, 8);
    const shifter = new THREE.Mesh(shifterGeo, chromeMat);
    shifter.position.set(0, 1.68 * s, 0.55 * s);
    this.carGroup.add(shifter);

    // 3-Spoke Sport Steering Wheel (MOUNTED ON RIGHT DRIVER SIDE FOR INDIA: X = -1.15)
    const steeringColumnGeo = new THREE.CylinderGeometry(0.08 * s, 0.08 * s, 0.65 * s, 12);
    steeringColumnGeo.rotateX(Math.PI / 4);
    const steeringColumn = new THREE.Mesh(steeringColumnGeo, interiorLeatherMat);
    steeringColumn.position.set(-1.15 * s, 2.38 * s, 1.30 * s);
    this.carGroup.add(steeringColumn);

    this.interiorSteeringWheel = new THREE.Group();
    this.interiorSteeringWheel.position.set(-1.15 * s, 2.60 * s, 1.05 * s);
    this.interiorSteeringWheel.rotation.x = -Math.PI / 5;

    const steeringRimGeo = new THREE.TorusGeometry(0.48 * s, 0.055 * s, 12, 24);
    const steeringRim = new THREE.Mesh(steeringRimGeo, interiorLeatherMat);
    this.interiorSteeringWheel.add(steeringRim);

    const hornPadGeo = new THREE.CylinderGeometry(0.15 * s, 0.15 * s, 0.05 * s, 16);
    const hornPad = new THREE.Mesh(hornPadGeo, chromeMat);
    this.interiorSteeringWheel.add(hornPad);

    [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].forEach(ang => {
      const spokeGeo = new THREE.BoxGeometry(0.08 * s, 0.45 * s, 0.03 * s);
      const spokeMesh = new THREE.Mesh(spokeGeo, silverTrimMat);
      spokeMesh.position.set(Math.sin(ang) * 0.22 * s, Math.cos(ang) * 0.22 * s, 0);
      spokeMesh.rotation.z = -ang;
      this.interiorSteeringWheel.add(spokeMesh);
    });
    this.carGroup.add(this.interiorSteeringWheel);

    // Front Driving Seats (RIGHT SIDE = DRIVER AT X = -1.15, LEFT SIDE = PASSENGER AT X = +1.15)
    // FRONT ROW POSITIONED ERGONOMICALLY RIGHT BEHIND STEERING WHEEL (Z = +0.25 to -0.45)
    [-1.15 * s, 1.15 * s].forEach(sx => {
      // Seat cushion
      const seatBaseGeo = new THREE.BoxGeometry(1.55 * s, 0.38 * s, 1.55 * s);
      const seatBase = new THREE.Mesh(seatBaseGeo, interiorLeatherMat);
      seatBase.position.set(sx, 1.35 * s, 0.25 * s);
      this.carGroup.add(seatBase);

      // Ergonomic recline backrest
      const seatBackGeo = new THREE.BoxGeometry(1.45 * s, 1.65 * s, 0.28 * s);
      seatBackGeo.rotateX(0.12);
      const seatBack = new THREE.Mesh(seatBackGeo, interiorLeatherMat);
      seatBack.position.set(sx, 2.15 * s, -0.45 * s);
      this.carGroup.add(seatBack);

      // Headrest
      const headrestGeo = new THREE.BoxGeometry(0.85 * s, 0.42 * s, 0.22 * s);
      const headrest = new THREE.Mesh(headrestGeo, interiorLeatherMat);
      headrest.position.set(sx, 3.12 * s, -0.55 * s);
      this.carGroup.add(headrest);
    });

    // Rear Bench Seat (POSITIONED WELL BEHIND AT Z = -2.2 to -2.9)
    const rearBenchGeo = new THREE.BoxGeometry(4.6 * s, 0.38 * s, 1.45 * s);
    const rearBench = new THREE.Mesh(rearBenchGeo, interiorLeatherMat);
    rearBench.position.set(0, 1.35 * s, -2.20 * s);
    this.carGroup.add(rearBench);

    const rearBackGeo = new THREE.BoxGeometry(4.5 * s, 1.55 * s, 0.28 * s);
    rearBackGeo.rotateX(0.12);
    const rearBack = new THREE.Mesh(rearBackGeo, interiorLeatherMat);
    rearBack.position.set(0, 2.15 * s, -2.90 * s);
    this.carGroup.add(rearBack);

    // ── 11. Four Bold Off-Road Luxury Wheels & Brakes ─────────────────────────
    const buildWheelAssembly = () => {
      const wheelAssembly = new THREE.Group();

      // Deep radial-grooved rubber tire
      const tireGeo = new THREE.CylinderGeometry(1.10 * s, 1.10 * s, 0.78 * s, 24);
      tireGeo.rotateZ(Math.PI / 2);
      const tireMesh = new THREE.Mesh(tireGeo, tireRubberMat);
      tireMesh.castShadow = true;
      wheelAssembly.add(tireMesh);

      // Machine-finished alloy rim
      const rimGeo = new THREE.CylinderGeometry(0.82 * s, 0.82 * s, 0.80 * s, 20);
      rimGeo.rotateZ(Math.PI / 2);
      const rimMesh = new THREE.Mesh(rimGeo, alloyRimMat);
      wheelAssembly.add(rimMesh);

      // 5 Double-Spoke Star Design
      for (let sp = 0; sp < 5; sp++) {
        const spokeAng = (sp * 2 * Math.PI) / 5;
        [-0.05 * s, 0.05 * s].forEach(offset => {
          const spokeBarGeo = new THREE.BoxGeometry(0.06 * s, 0.70 * s, 0.08 * s);
          const spokeBar = new THREE.Mesh(spokeBarGeo, chromeMat);
          spokeBar.position.set(
            0.38 * s,
            Math.cos(spokeAng) * 0.38 * s + offset,
            Math.sin(spokeAng) * 0.38 * s
          );
          spokeBar.rotation.x = -spokeAng;
          wheelAssembly.add(spokeBar);
        });
      }

      // Center Hub Cap with Luxury Emblem
      const hubGeo = new THREE.CylinderGeometry(0.25 * s, 0.25 * s, 0.82 * s, 16);
      hubGeo.rotateZ(Math.PI / 2);
      const hubMesh = new THREE.Mesh(hubGeo, chromeMat);
      wheelAssembly.add(hubMesh);

      // Ventilated Brake Disc Rotor
      const discGeo = new THREE.CylinderGeometry(0.70 * s, 0.70 * s, 0.05 * s, 20);
      discGeo.rotateZ(Math.PI / 2);
      const discMesh = new THREE.Mesh(discGeo, brakeRotorMat);
      discMesh.position.set(-0.16 * s, 0, 0);
      wheelAssembly.add(discMesh);

      // Red Sport Brake Caliper
      const caliperGeo = new THREE.BoxGeometry(0.20 * s, 0.45 * s, 0.35 * s);
      const caliperMesh = new THREE.Mesh(caliperGeo, brakeCaliperMat);
      caliperMesh.position.set(-0.16 * s, 0.48 * s, 0);
      wheelAssembly.add(caliperMesh);

      return wheelAssembly;
    };

    // Front-Left Wheel (Steering + Spin)
    this.steeringGroupFL = new THREE.Group();
    this.steeringGroupFL.position.set(-2.45 * s, 1.10 * s, 3.8 * s);
    this.spinGroupFL = new THREE.Group();
    this.spinGroupFL.add(buildWheelAssembly());
    this.steeringGroupFL.add(this.spinGroupFL);
    this.carGroup.add(this.steeringGroupFL);

    // Front-Right Wheel (Steering + Spin)
    this.steeringGroupFR = new THREE.Group();
    this.steeringGroupFR.position.set(2.45 * s, 1.10 * s, 3.8 * s);
    this.spinGroupFR = new THREE.Group();
    const rightAssembly = buildWheelAssembly();
    rightAssembly.rotation.y = Math.PI; // Invert for right side
    this.spinGroupFR.add(rightAssembly);
    this.steeringGroupFR.add(this.spinGroupFR);
    this.carGroup.add(this.steeringGroupFR);

    // Rear-Left Wheel (Spin only)
    const rearPosRL = new THREE.Group();
    rearPosRL.position.set(-2.45 * s, 1.10 * s, -3.8 * s);
    this.spinGroupRL = new THREE.Group();
    this.spinGroupRL.add(buildWheelAssembly());
    rearPosRL.add(this.spinGroupRL);
    this.carGroup.add(rearPosRL);

    // Rear-Right Wheel (Spin only)
    const rearPosRR = new THREE.Group();
    rearPosRR.position.set(2.45 * s, 1.10 * s, -3.8 * s);
    this.spinGroupRR = new THREE.Group();
    const rearRightAssembly = buildWheelAssembly();
    rearRightAssembly.rotation.y = Math.PI;
    this.spinGroupRR.add(rearRightAssembly);
    rearPosRR.add(this.spinGroupRR);
    this.carGroup.add(rearPosRR);

    // ── 12. Interactive Hit Collider Mesh (for raycast / click) ───────────────
    const hitBoxGeo = new THREE.BoxGeometry(6.2 * s, 5.2 * s, 14.2 * s);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });
    const hitMesh = new THREE.Mesh(hitBoxGeo, hitMat);
    hitMesh.position.set(0, 2.6 * s, 0);
    hitMesh.userData = { isVehicle: true, vehicle: this };
    this.carGroup.add(hitMesh);
    this.interactiveHitMesh = hitMesh;

    this.carGroup.userData = { isVehicle: true, vehicle: this };

    this.rootGroup.add(this.carGroup);
    scene.add(this.rootGroup);

    // Link with interior collider
    if (this.collision && this.collision.colliders) {
      this.carCollider = this.collision.colliders.find(c => c.id === 'COL-GAR-01');
    }

    return this.rootGroup;
  }

  toggleHeadlights(ui) {
    this.headlightsOn = !this.headlightsOn;
    const targetMat = this.headlightsOn ? this.headlightMatOn : this.headlightMatOff;
    const targetTailMat = this.headlightsOn ? this.taillightMatOn : this.taillightMatOff;

    this.headlightMeshes.forEach(m => { m.material = targetMat; });
    this.taillightMeshes.forEach(m => { m.material = targetTailMat; });

    const intensity = this.headlightsOn ? 4.8 : 0;
    if (this.spotLightLeft) this.spotLightLeft.intensity = intensity;
    if (this.spotLightRight) this.spotLightRight.intensity = intensity;

    if (ui) {
      ui.showToast(`💡 Car Headlights ${this.headlightsOn ? 'ON' : 'OFF'}`);
    }
  }

  toggleGarageDoor(doorManager, ui) {
    if (!doorManager || !doorManager.doors) return;
    const garageDoor = doorManager.doors.find(d => d.id === 'G2');
    if (garageDoor) {
      doorManager.toggleDoor(garageDoor);
      if (ui) {
        ui.showToast(`🚪 Garage Remote: ${garageDoor.isOpen ? 'Opening' : 'Closing'} Overhead Door...`);
      }
    }
  }

  toggleCameraPOV(ui) {
    this.cameraMode = (this.cameraMode === 'cockpit') ? 'chase' : 'cockpit';
    if (this.cameraMode === 'cockpit' && this.cameraCtrl && this.cameraCtrl.camera) {
      const s = WORLD_SCALE;
      const eyeWorldPos = this.carGroup.localToWorld(new THREE.Vector3(-1.15 * s, 3.05 * s, 0.35 * s));
      this.cameraCtrl.camera.position.copy(eyeWorldPos);
      const forwardTarget = this.carGroup.localToWorld(new THREE.Vector3(-1.15 * s, 3.05 * s, 30.0 * s));
      this.cameraCtrl.camera.lookAt(forwardTarget);
    }
    if (ui) {
      ui.showToast(`🎥 Camera: ${this.cameraMode === 'cockpit' ? 'Cockpit Driver View (India RHD)' : 'Third-Person Chase Cam'}`);
    }
  }

  enterCar(player, avatar, cameraCtrl, ui) {
    if (this.isDriving) return;
    this.isDriving = true;

    const s = WORLD_SCALE;

    // Disable static obstacle collision so player doesn't push against car
    if (this.carCollider) {
      this.carCollider.disabled = true;
    }

    this.playDoorAudio();
    this.startEngineAudio();

    // Position player avatar in the FRONT DRIVER'S SEAT (India Right-Hand Drive: X = -1.15s, Z = +0.25s)
    const driverSeatPos = this.carGroup.localToWorld(new THREE.Vector3(-1.15 * s, 1.35 * s, 0.25 * s));
    if (avatar) {
      avatar.setSitting(driverSeatPos, this.yaw);
    }

    // Ensure First-Person mode is active if player entered from Orbit mode
    if (cameraCtrl) {
      this.cameraCtrl = cameraCtrl;
      if (cameraCtrl.isOrbitMode) {
        cameraCtrl.setMode(false, player);
      }
    }

    // Default to Cockpit view upon entering
    this.cameraMode = 'cockpit';

    // Position camera directly at FRONT DRIVER'S EYE LEVEL (India RHD: X = -1.15s, Y = 3.05s, Z = +0.35s)
    const eyeWorldPos = this.carGroup.localToWorld(new THREE.Vector3(-1.15 * s, 3.05 * s, 0.35 * s));
    if (cameraCtrl && cameraCtrl.camera) {
      cameraCtrl.camera.position.copy(eyeWorldPos);
      // Point camera straight FORWARD along car heading (+Z local) looking past steering wheel over hood
      const forwardTarget = this.carGroup.localToWorld(new THREE.Vector3(-1.15 * s, 3.05 * s, 30.0 * s));
      cameraCtrl.camera.lookAt(forwardTarget);
    }

    if (ui) {
      ui.showToast('🚗 Driving (India RHD) • W/S: Drive/Brake • A/D: Steer • H: Horn • L: Lights • G: Garage Door • C: Camera • E: Exit', 4500);
      ui.hideInteractionPrompt();
    }
  }

  exitCar(player, avatar, cameraCtrl, ui) {
    if (!this.isDriving) return;
    this.isDriving = false;
    this.velocity = 0;
    this.stopEngineAudio();
    this.playDoorAudio();

    const s = WORLD_SCALE;

    // Safely teleport player standing outside driver's side door (India RHD: exit on right side X = -3.4s)
    const exitWorldPos = this.carGroup.localToWorld(new THREE.Vector3(-3.4 * s, 0, 0.25 * s));
    let spawnX = exitWorldPos.x;
    let spawnZ = exitWorldPos.z;
    if (this.collision) {
      const [cleanX, cleanZ] = this.collision.resolveWallCollisions(spawnX, spawnZ, player.config.radius, this.posY);
      spawnX = cleanX;
      spawnZ = cleanZ;
    }
    player.position.set(spawnX, this.posY + player.config.eyeHeight, spawnZ);
    player.feetElevation = this.posY;

    // Restore standing avatar pose
    if (avatar) {
      avatar.setStanding();
    }

    // Re-enable static collider updated to car's new parked position
    if (this.carCollider) {
      this.carCollider.disabled = false;
      const curX = this.posX / s;
      const curZ = -this.posZ / s; // CAD Y
      this.carCollider.box = [
        curX - 2.8,
        curX + 2.8,
        curZ - 6.6,
        curZ + 6.6,
        this.posY / s,
        this.posY / s + 4.8
      ];
    }

    if (ui) {
      ui.showToast('🚗 Exited Car • Parked');
    }
  }

  interact(ui) {
    // Interacted via Engine dispatch
  }

  handleOrbitClick(event, camera, player, avatar, cameraCtrl, ui) {
    const mouse = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );
    this.raycaster.setFromCamera(mouse, camera);
    const intersects = this.raycaster.intersectObject(this.interactiveHitMesh, false);

    if (intersects.length > 0) {
      if (!this.isDriving) {
        this.enterCar(player, avatar, cameraCtrl, ui);
      } else {
        this.exitCar(player, avatar, cameraCtrl, ui);
      }
    }
  }

  update(delta, input, cameraCtrl, player, avatar, ui, doorManager) {
    const s = WORLD_SCALE;
    const dt = Math.min(delta, 0.05);

    // ── 1. Active Driving Physics Simulation ──────────────────────────────────
    if (this.isDriving) {
      const keys = input ? input.keys : {};

      // Acceleration / Braking
      if (keys.forward) {
        if (this.velocity < 0) {
          this.velocity = Math.min(0, this.velocity + this.brakeRate * dt);
        } else {
          this.velocity = Math.min(this.maxForwardSpeed, this.velocity + this.accelRate * dt);
        }
      } else if (keys.backward) {
        if (this.velocity > 0) {
          this.velocity = Math.max(0, this.velocity - this.brakeRate * dt);
        } else {
          this.velocity = Math.max(-this.maxReverseSpeed, this.velocity - this.reverseAccelRate * dt);
        }
      } else if (keys.jump) {
        // Spacebar Handbrake
        if (this.velocity > 0) {
          this.velocity = Math.max(0, this.velocity - this.brakeRate * 1.8 * dt);
        } else if (this.velocity < 0) {
          this.velocity = Math.min(0, this.velocity + this.brakeRate * 1.8 * dt);
        }
      } else {
        // Natural rolling friction / drag
        this.velocity = THREE.MathUtils.lerp(this.velocity, 0, dt * this.dragRate);
        if (Math.abs(this.velocity) < 0.05) this.velocity = 0;
      }

      // Steering
      if (keys.left) {
        this.steerAngle = Math.min(this.maxSteerAngle, this.steerAngle + this.steerSpeed * dt);
      } else if (keys.right) {
        this.steerAngle = Math.max(-this.maxSteerAngle, this.steerAngle - this.steerSpeed * dt);
      } else {
        this.steerAngle = THREE.MathUtils.lerp(this.steerAngle, 0, dt * 7.5);
      }

      // Kinematic bicycle turning model
      const angularVelocity = (Math.abs(this.velocity) > 0.08)
        ? (this.velocity / this.wheelbase) * Math.tan(this.steerAngle)
        : 0;

      if (angularVelocity !== 0) {
        this.yaw += angularVelocity * dt;
      }

      // Calculate next intended position
      let nextX = this.posX + Math.sin(this.yaw) * this.velocity * dt;
      let nextZ = this.posZ + Math.cos(this.yaw) * this.velocity * dt;

      // ── Collision Constraints ───────────────────────────────────────────────
      let isGarageDoorOpen = false;
      if (doorManager && doorManager.doors) {
        const gDoor = doorManager.doors.find(d => d.id === 'G2');
        if (gDoor && (gDoor.isOpen || (gDoor.currentOffsetY && gDoor.currentOffsetY > 4.5 * s))) {
          isGarageDoorOpen = true;
        }
      }

      // If car is inside garage (Z < 0.2 * s and inside garage bay X bounds):
      if (this.posZ < 0.2 * s && this.posX >= 36.5 * s && this.posX <= 47.0 * s) {
        // Lateral garage walls
        if (nextX < 37.0 * s) nextX = 37.0 * s;
        if (nextX > 46.5 * s) nextX = 46.5 * s;
        // Rear garage wall
        if (nextZ < -11.5 * s) nextZ = -11.5 * s;

        // Front garage door threshold
        if (!isGarageDoorOpen && nextZ > -0.6 * s) {
          nextZ = -0.6 * s;
          this.velocity = 0;
          if (ui) ui.showToast('🛑 Garage Door is Closed! Press [G] to Open', 1200);
        }
      } else {
        // Outside drive area — Expansive colony road network till world borders!
        if (nextX < -430.0 * s) nextX = -430.0 * s;
        if (nextX > +480.0 * s) nextX = +480.0 * s;
        if (nextZ > 275.0 * s) nextZ = 275.0 * s;
        if (nextZ < -140.0 * s) nextZ = -140.0 * s;

        // Approaching house plot boundary from outside (house footprint: X in [-1.0s, 51.0s], Z in [-25.0s, 0.5s])
        const inHouseX = (nextX >= -1.0 * s && nextX <= 51.0 * s);
        const inHouseZ = (nextZ >= -25.0 * s && nextZ <= 0.5 * s);

        if (inHouseX && inHouseZ) {
          const isEnteringGarage = (nextX >= 37.0 * s && nextX <= 46.5 * s && nextZ <= 0.2 * s && this.posZ >= 0.0);
          if (isEnteringGarage) {
            if (!isGarageDoorOpen) {
              nextZ = 0.5 * s;
              this.velocity = 0;
              if (ui) ui.showToast('🛑 Garage Door is Closed! Press [G] to Open', 1200);
            }
          } else {
            // Push out along nearest exterior boundary so car slides smoothly around house
            const dFront = Math.abs(nextZ - 0.5 * s);
            const dRear  = Math.abs(nextZ - (-25.0 * s));
            const dWest  = Math.abs(nextX - (-1.0 * s));
            const dEast  = Math.abs(nextX - 51.0 * s);
            const minD = Math.min(dFront, dRear, dWest, dEast);

            if (minD === dFront) nextZ = 0.5 * s;
            else if (minD === dRear) nextZ = -25.0 * s;
            else if (minD === dWest) nextX = -1.0 * s;
            else nextX = 51.0 * s;
          }
        }
      }

      // Ground Elevation Sampling
      let groundY = 0.0;
      if (this.posZ <= 0 && this.posX >= 36.5 * s && this.posX <= 47.0 * s) {
        groundY = 0.25 * s; // Inside garage plinth
      } else if (this.posZ > 0 && this.posZ <= 3.5 * s && this.posX >= 36.5 * s && this.posX <= 47.0 * s) {
        groundY = (1.0 - (this.posZ / (3.5 * s))) * 0.25 * s; // Driveway ramp
      } else {
        groundY = 0.0; // Street & colony level
      }

      this.posX = nextX;
      this.posY = groundY;
      this.posZ = nextZ;

      // Update 3D car group position & heading
      this.carGroup.position.set(this.posX, this.posY, this.posZ);
      this.carGroup.rotation.y = this.yaw;

      // Animate wheel steering & spin
      if (this.steeringGroupFL) this.steeringGroupFL.rotation.y = this.steerAngle;
      if (this.steeringGroupFR) this.steeringGroupFR.rotation.y = this.steerAngle;

      const wheelRadius = 1.10 * s;
      const spinDelta = (this.velocity * dt) / wheelRadius;
      this.wheelSpinAngle += spinDelta;

      if (this.spinGroupFL) this.spinGroupFL.rotation.x = this.wheelSpinAngle;
      if (this.spinGroupFR) this.spinGroupFR.rotation.x = this.wheelSpinAngle;
      if (this.spinGroupRL) this.spinGroupRL.rotation.x = this.wheelSpinAngle;
      if (this.spinGroupRR) this.spinGroupRR.rotation.x = this.wheelSpinAngle;

      // Animate cockpit steering wheel
      if (this.interiorSteeringWheel) {
        this.interiorSteeringWheel.rotation.z = -this.steerAngle * 2.2;
      }

      // Update engine audio pitch & volume
      this.updateEngineAudio();

      // Keep player position synchronized with FRONT DRIVER SEAT (India Right-Hand Drive: X = -1.15s, Z = +0.25s)
      const driverSeatPos = this.carGroup.localToWorld(new THREE.Vector3(-1.15 * s, 1.35 * s, 0.25 * s));
      player.position.copy(driverSeatPos);
      player.feetElevation = this.posY;

      // Keep avatar sitting in driver seat
      if (avatar) {
        avatar.setSitting(driverSeatPos, this.yaw);
      }

      // Camera Positioning (Cockpit Driver View vs Chase Cam)
      if (cameraCtrl && cameraCtrl.camera) {
        this.cameraCtrl = cameraCtrl;
        if (this.cameraMode === 'cockpit') {
          // Camera placed directly at FRONT DRIVER'S EYE LEVEL (India RHD: X = -1.15s, Z = +0.35s, Y = 3.05s)
          // Looking directly through the OPEN front windshield with ZERO glass occlusion!
          const eyeWorldPos = this.carGroup.localToWorld(new THREE.Vector3(-1.15 * s, 3.05 * s, 0.35 * s));
          cameraCtrl.camera.position.copy(eyeWorldPos);

          // Rotate camera yaw with car turn while preserving mouse pitch/yaw freelook
          if (angularVelocity !== 0) {
            cameraCtrl.camera.rotation.y += angularVelocity * dt;
          }
        } else {
          // Third-Person Chase Cam behind & above car
          const chaseCamPos = this.carGroup.localToWorld(new THREE.Vector3(0, 5.4 * s, -15.5 * s));
          cameraCtrl.camera.position.lerp(chaseCamPos, Math.min(1.0, dt * 8));

          const lookTarget = this.carGroup.localToWorld(new THREE.Vector3(0, 2.4 * s, 2.0 * s));
          cameraCtrl.camera.lookAt(lookTarget);
        }
      }

      return;
    }

    // ── 2. On-Foot Proximity Reticle Raycast Targeting ────────────────────────
    if (!player || !cameraCtrl || cameraCtrl.isOrbitMode) {
      this.targetedCar = null;
      this.isDirectHit = false;
      this.targetedDistance = Infinity;
      this.promptLabel = null;
      return;
    }

    const reach = 8.5 * s;
    const playerPos = player.position;
    const carCenter = new THREE.Vector3(this.posX, this.posY + 2.0 * s, this.posZ);
    const distToCar = playerPos.distanceTo(carCenter);

    if (distToCar > reach) {
      this.targetedCar = null;
      this.isDirectHit = false;
      this.targetedDistance = Infinity;
      this.promptLabel = null;
      return;
    }

    this.raycaster.setFromCamera({ x: 0, y: 0 }, cameraCtrl.camera);
    const intersects = this.raycaster.intersectObject(this.interactiveHitMesh, false);

    if (intersects.length > 0 && intersects[0].distance <= reach) {
      this.targetedCar = this;
      this.isDirectHit = true;
      this.targetedDistance = intersects[0].distance;
      this.promptLabel = '[E] Enter Car';
    } else {
      // Look direction fallback if facing car closely
      const camDir = new THREE.Vector3();
      cameraCtrl.camera.getWorldDirection(camDir);
      const toCar = new THREE.Vector3().subVectors(carCenter, cameraCtrl.camera.position);
      const d = toCar.length();
      toCar.normalize();
      const dot = camDir.dot(toCar);

      if (dot > 0.85 && d <= 7.0 * s) {
        this.targetedCar = this;
        this.isDirectHit = false;
        this.targetedDistance = d;
        this.promptLabel = '[E] Enter Car';
      } else {
        this.targetedCar = null;
        this.isDirectHit = false;
        this.targetedDistance = Infinity;
        this.promptLabel = null;
      }
    }
  }

  setFloorFilter(filter) {
    const isVisible = (filter === 'all' || filter === 'ground_floor');
    this.rootGroup.visible = isVisible;
    if (!isVisible && this.isDriving) {
      this.stopEngineAudio();
    }
  }

  getRoot() {
    return this.rootGroup;
  }
}
