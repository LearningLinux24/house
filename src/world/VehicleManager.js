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
    this.driverDoorGroup = null;
    this.isDriverDoorOpen = false;

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

    // ── Material Palette ──────────────────────────────────────────────────────
    const paintMat = new THREE.MeshPhysicalMaterial({
      color: 0x143454, // Deep Sapphire Metallic
      metalness: 0.82,
      roughness: 0.18,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06
    });

    const darkTrimMat = new THREE.MeshStandardMaterial({
      color: 0x181a1f, // Matte composite lower cladding
      roughness: 0.85,
      metalness: 0.10
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.95,
      roughness: 0.08
    });

    const silverTrimMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.70,
      roughness: 0.30
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x090d14,
      metalness: 0.15,
      roughness: 0.04,
      transmission: 0.65,
      transparent: true,
      opacity: 0.82
    });

    const tireRubberMat = new THREE.MeshStandardMaterial({
      color: 0x17171a,
      roughness: 0.90,
      metalness: 0.05
    });

    const alloyRimMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.88,
      roughness: 0.18
    });

    const brakeRotorMat = new THREE.MeshStandardMaterial({
      color: 0x71717a,
      metalness: 0.85,
      roughness: 0.35
    });

    const brakeCaliperMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626, // Red Brembo sports caliper
      metalness: 0.40,
      roughness: 0.30
    });

    const interiorLeatherMat = new THREE.MeshStandardMaterial({
      color: 0x22262e, // Charcoal premium stitched leather
      roughness: 0.65,
      metalness: 0.10
    });

    this.headlightMatOff = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.5,
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
      color: 0xff1e1e // Vibrant red LED lightbar
    });

    // ── 1. Chassis Underbody Tray ─────────────────────────────────────────────
    const underbodyGeo = new THREE.BoxGeometry(5.1 * s, 0.22 * s, 12.8 * s);
    const underbodyMesh = new THREE.Mesh(underbodyGeo, darkTrimMat);
    underbodyMesh.position.set(0, 0.75 * s, 0);
    this.carGroup.add(underbodyMesh);

    // ── 2. Lower Body Cladding & Wheel Arches ──────────────────────────────────
    // Left & Right composite rocker sills
    [-2.65 * s, 2.65 * s].forEach(rx => {
      const sillGeo = new THREE.BoxGeometry(0.32 * s, 0.42 * s, 13.0 * s);
      const sillMesh = new THREE.Mesh(sillGeo, darkTrimMat);
      sillMesh.position.set(rx, 0.95 * s, 0);
      this.carGroup.add(sillMesh);
    });

    // 4 Protective black wheel arch fender flares
    const archCoords = [
      [-2.68 * s, 4.1 * s],
      [2.68 * s, 4.1 * s],
      [-2.68 * s, -4.1 * s],
      [2.68 * s, -4.1 * s]
    ];
    archCoords.forEach(([ax, az]) => {
      const archGeo = new THREE.CylinderGeometry(1.22 * s, 1.22 * s, 0.26 * s, 18, 1, false, 0, Math.PI);
      archGeo.rotateZ(Math.PI / 2);
      const archMesh = new THREE.Mesh(archGeo, darkTrimMat);
      archMesh.position.set(ax, 1.05 * s, az);
      this.carGroup.add(archMesh);
    });

    // ── 3. Main Sculpted Hull (Waistline & Fenders) ───────────────────────────
    const mainHullGeo = new THREE.BoxGeometry(5.4 * s, 1.35 * s, 13.2 * s);
    const mainHullMesh = new THREE.Mesh(mainHullGeo, paintMat);
    mainHullMesh.position.set(0, 1.68 * s, 0);
    mainHullMesh.castShadow = true;
    mainHullMesh.receiveShadow = true;
    this.carGroup.add(mainHullMesh);

    // Side waistline crease accents (aerodynamic sculpted styling)
    [-2.72 * s, 2.72 * s].forEach(cx => {
      const creaseGeo = new THREE.BoxGeometry(0.08 * s, 0.12 * s, 12.0 * s);
      const creaseMesh = new THREE.Mesh(creaseGeo, paintMat);
      creaseMesh.position.set(cx, 1.95 * s, 0);
      this.carGroup.add(creaseMesh);
    });

    // ── 4. Aerodynamic Sloped Hood / Bonnet ────────────────────────────────────
    const hoodGeo = new THREE.BoxGeometry(5.1 * s, 0.18 * s, 4.6 * s);
    hoodGeo.rotateX(0.12); // Slopes down toward front
    const hoodMesh = new THREE.Mesh(hoodGeo, paintMat);
    hoodMesh.position.set(0, 2.32 * s, 4.35 * s);
    hoodMesh.castShadow = true;
    this.carGroup.add(hoodMesh);

    // Dual hood power bulges
    [-1.4 * s, 1.4 * s].forEach(hx => {
      const bulgeGeo = new THREE.BoxGeometry(0.24 * s, 0.08 * s, 4.2 * s);
      bulgeGeo.rotateX(0.12);
      const bulgeMesh = new THREE.Mesh(bulgeGeo, paintMat);
      bulgeMesh.position.set(hx, 2.38 * s, 4.35 * s);
      this.carGroup.add(bulgeMesh);
    });

    // Front Cowl air intake vent below windshield
    const cowlVentGeo = new THREE.BoxGeometry(4.2 * s, 0.05 * s, 0.35 * s);
    const cowlVentMesh = new THREE.Mesh(cowlVentGeo, darkTrimMat);
    cowlVentMesh.position.set(0, 2.50 * s, 2.2 * s);
    this.carGroup.add(cowlVentMesh);

    // ── 5. Front Bumper Fascia, Grille & Splitter ─────────────────────────────
    const frontBumperGeo = new THREE.BoxGeometry(5.3 * s, 1.25 * s, 0.65 * s);
    const frontBumperMesh = new THREE.Mesh(frontBumperGeo, paintMat);
    frontBumperMesh.position.set(0, 1.40 * s, 6.75 * s);
    this.carGroup.add(frontBumperMesh);

    // Front Silver Skid Plate / Splitter
    const splitterGeo = new THREE.BoxGeometry(3.6 * s, 0.18 * s, 0.55 * s);
    const splitterMesh = new THREE.Mesh(splitterGeo, silverTrimMat);
    splitterMesh.position.set(0, 0.72 * s, 6.82 * s);
    this.carGroup.add(splitterMesh);

    // Radiator Grille (Honeycomb 3D pattern + Chrome border)
    const grilleGeo = new THREE.BoxGeometry(3.2 * s, 0.75 * s, 0.10 * s);
    const grilleMesh = new THREE.Mesh(grilleGeo, darkTrimMat);
    grilleMesh.position.set(0, 1.75 * s, 7.05 * s);
    this.carGroup.add(grilleMesh);

    const grilleSurroundGeo = new THREE.BoxGeometry(3.3 * s, 0.82 * s, 0.05 * s);
    const grilleSurround = new THREE.Mesh(grilleSurroundGeo, chromeMat);
    grilleSurround.position.set(0, 1.75 * s, 7.02 * s);
    this.carGroup.add(grilleSurround);

    // Front Brand Emblem
    const emblemGeo = new THREE.CylinderGeometry(0.18 * s, 0.18 * s, 0.06 * s, 16);
    emblemGeo.rotateX(Math.PI / 2);
    const emblemMesh = new THREE.Mesh(emblemGeo, chromeMat);
    emblemMesh.position.set(0, 1.85 * s, 7.12 * s);
    this.carGroup.add(emblemMesh);

    // Front License Plate ("KA-01-HG-2026")
    const plateGeo = new THREE.BoxGeometry(1.6 * s, 0.45 * s, 0.04 * s);
    const plateMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
    const plateMesh = new THREE.Mesh(plateGeo, plateMat);
    plateMesh.position.set(0, 1.05 * s, 7.10 * s);
    this.carGroup.add(plateMesh);

    // ── 6. LED Headlight Assemblies & Functional Spotlights ───────────────────
    [-2.05 * s, 2.05 * s].forEach((hx, idx) => {
      // Headlight glass housing
      const hlHousingGeo = new THREE.BoxGeometry(0.85 * s, 0.38 * s, 0.32 * s);
      const hlMesh = new THREE.Mesh(hlHousingGeo, this.headlightMatOff);
      hlMesh.position.set(hx, 2.05 * s, 6.85 * s);
      this.carGroup.add(hlMesh);
      this.headlightMeshes.push(hlMesh);

      // Daytime Running Light (DRL) L-shape accent
      const drlGeo = new THREE.BoxGeometry(0.78 * s, 0.08 * s, 0.05 * s);
      const drlMesh = new THREE.Mesh(drlGeo, this.headlightMatOn);
      drlMesh.position.set(hx, 2.18 * s, 6.98 * s);
      this.carGroup.add(drlMesh);

      // Projector eye lens
      const lensGeo = new THREE.CylinderGeometry(0.12 * s, 0.12 * s, 0.08 * s, 16);
      lensGeo.rotateX(Math.PI / 2);
      const lensMesh = new THREE.Mesh(lensGeo, chromeMat);
      lensMesh.position.set(hx + (idx === 0 ? 0.15 : -0.15) * s, 2.05 * s, 6.96 * s);
      this.carGroup.add(lensMesh);
    });

    // Real dynamic Three.js SpotLights pointing forward from headlights
    this.spotLightLeft = new THREE.SpotLight(0xfff7ed, 0, 80 * s, Math.PI / 6.5, 0.45, 1.4);
    this.spotLightLeft.position.set(-2.05 * s, 2.05 * s, 6.95 * s);
    const targetL = new THREE.Object3D();
    targetL.position.set(-2.2 * s, 0.5 * s, 35.0 * s);
    this.carGroup.add(targetL);
    this.spotLightLeft.target = targetL;
    this.carGroup.add(this.spotLightLeft);

    this.spotLightRight = new THREE.SpotLight(0xfff7ed, 0, 80 * s, Math.PI / 6.5, 0.45, 1.4);
    this.spotLightRight.position.set(2.05 * s, 2.05 * s, 6.95 * s);
    const targetR = new THREE.Object3D();
    targetR.position.set(2.2 * s, 0.5 * s, 35.0 * s);
    this.carGroup.add(targetR);
    this.spotLightRight.target = targetR;
    this.carGroup.add(this.spotLightRight);

    // ── 7. Passenger Greenhouse Cabin & Floating Roof ────────────────────────
    // Roof slab
    const roofGeo = new THREE.BoxGeometry(4.5 * s, 0.15 * s, 6.8 * s);
    const roofMesh = new THREE.Mesh(roofGeo, paintMat);
    roofMesh.position.set(0, 4.45 * s, -0.6 * s);
    roofMesh.castShadow = true;
    this.carGroup.add(roofMesh);

    // Silver low-profile roof rails
    [-2.15 * s, 2.15 * s].forEach(rx => {
      const railGeo = new THREE.BoxGeometry(0.08 * s, 0.10 * s, 6.2 * s);
      const railMesh = new THREE.Mesh(railGeo, silverTrimMat);
      railMesh.position.set(rx, 4.58 * s, -0.6 * s);
      this.carGroup.add(railMesh);
    });

    // Shark-fin roof antenna
    const finGeo = new THREE.ConeGeometry(0.14 * s, 0.35 * s, 4);
    finGeo.rotateY(Math.PI / 4);
    finGeo.rotateX(-0.35);
    const finMesh = new THREE.Mesh(finGeo, paintMat);
    finMesh.position.set(0, 4.65 * s, -3.2 * s);
    this.carGroup.add(finMesh);

    // Rear Roof Spoiler
    const spoilerGeo = new THREE.BoxGeometry(4.7 * s, 0.16 * s, 0.95 * s);
    const spoilerMesh = new THREE.Mesh(spoilerGeo, darkTrimMat);
    spoilerMesh.position.set(0, 4.48 * s, -4.2 * s);
    this.carGroup.add(spoilerMesh);

    // High-mount center LED stop lamp on spoiler
    const stopLampGeo = new THREE.BoxGeometry(1.2 * s, 0.08 * s, 0.05 * s);
    const stopLampMesh = new THREE.Mesh(stopLampGeo, this.taillightMatOff);
    stopLampMesh.position.set(0, 4.46 * s, -4.68 * s);
    this.carGroup.add(stopLampMesh);
    this.taillightMeshes.push(stopLampMesh);

    // Gloss Black B-Pillars & C-Pillars (Giving modern floating-roof look)
    [-2.28 * s, 2.28 * s].forEach(px => {
      const bPillarGeo = new THREE.BoxGeometry(0.12 * s, 1.85 * s, 0.32 * s);
      const bPillar = new THREE.Mesh(bPillarGeo, darkTrimMat);
      bPillar.position.set(px, 3.45 * s, -0.4 * s);
      this.carGroup.add(bPillar);

      const cPillarGeo = new THREE.BoxGeometry(0.12 * s, 1.85 * s, 0.55 * s);
      const cPillar = new THREE.Mesh(cPillarGeo, darkTrimMat);
      cPillar.position.set(px, 3.45 * s, -2.9 * s);
      this.carGroup.add(cPillar);
    });

    // ── 8. Windows & Windshields (Tinted Safety Glazing) ─────────────────────
    // Front Raked Windshield
    const frontWindshieldGeo = new THREE.PlaneGeometry(4.3 * s, 2.6 * s);
    frontWindshieldGeo.rotateX(-0.78); // Raked back
    const frontWindshield = new THREE.Mesh(frontWindshieldGeo, glassMat);
    frontWindshield.position.set(0, 3.52 * s, 1.85 * s);
    this.carGroup.add(frontWindshield);

    // Rear Raked Windshield
    const rearWindshieldGeo = new THREE.PlaneGeometry(4.2 * s, 2.3 * s);
    rearWindshieldGeo.rotateX(0.74);
    const rearWindshield = new THREE.Mesh(rearWindshieldGeo, glassMat);
    rearWindshield.position.set(0, 3.65 * s, -4.05 * s);
    this.carGroup.add(rearWindshield);

    // Left & Right Side Glazing Panes
    [-2.26 * s, 2.26 * s].forEach(sx => {
      const sideWindowGeo = new THREE.PlaneGeometry(5.2 * s, 1.6 * s);
      sideWindowGeo.rotateY(sx > 0 ? -Math.PI / 2 : Math.PI / 2);
      const sideWindow = new THREE.Mesh(sideWindowGeo, glassMat);
      sideWindow.position.set(sx, 3.50 * s, -0.6 * s);
      this.carGroup.add(sideWindow);

      // Chrome lower window beltline trim
      const beltGeo = new THREE.BoxGeometry(0.06 * s, 0.05 * s, 5.6 * s);
      const beltMesh = new THREE.Mesh(beltGeo, chromeMat);
      beltMesh.position.set(sx, 2.48 * s, -0.6 * s);
      this.carGroup.add(beltMesh);
    });

    // ── 9. Rear Fascia, Diffuser & Taillights ─────────────────────────────────
    // Rear bumper
    const rearBumperGeo = new THREE.BoxGeometry(5.3 * s, 1.35 * s, 0.65 * s);
    const rearBumperMesh = new THREE.Mesh(rearBumperGeo, paintMat);
    rearBumperMesh.position.set(0, 1.45 * s, -6.65 * s);
    this.carGroup.add(rearBumperMesh);

    // Rear composite diffuser with dual exhaust cutouts
    const diffuserGeo = new THREE.BoxGeometry(4.6 * s, 0.55 * s, 0.40 * s);
    const diffuserMesh = new THREE.Mesh(diffuserGeo, darkTrimMat);
    diffuserMesh.position.set(0, 0.85 * s, -6.78 * s);
    this.carGroup.add(diffuserMesh);

    // Dual polished chrome exhaust tips
    [-1.75 * s, 1.75 * s].forEach(ex => {
      const tipGeo = new THREE.CylinderGeometry(0.14 * s, 0.16 * s, 0.35 * s, 16);
      tipGeo.rotateX(Math.PI / 2);
      const tipMesh = new THREE.Mesh(tipGeo, chromeMat);
      tipMesh.position.set(ex, 0.82 * s, -6.92 * s);
      this.carGroup.add(tipMesh);
    });

    // Full-width continuous modern LED taillight bar
    const tailBarGeo = new THREE.BoxGeometry(4.6 * s, 0.22 * s, 0.12 * s);
    const tailBarMesh = new THREE.Mesh(tailBarGeo, this.taillightMatOff);
    tailBarMesh.position.set(0, 2.45 * s, -6.68 * s);
    this.carGroup.add(tailBarMesh);
    this.taillightMeshes.push(tailBarMesh);

    // Rear License Plate
    const rearPlateGeo = new THREE.BoxGeometry(1.6 * s, 0.45 * s, 0.04 * s);
    const rearPlate = new THREE.Mesh(rearPlateGeo, plateMat);
    rearPlate.position.set(0, 1.65 * s, -6.98 * s);
    this.carGroup.add(rearPlate);

    // ── 10. Side Mirrors & Flush Door Handles ────────────────────────────────
    [-2.75 * s, 2.75 * s].forEach((mx, idx) => {
      // Mirror housing
      const mirrorGeo = new THREE.BoxGeometry(0.35 * s, 0.24 * s, 0.55 * s);
      const mirrorMesh = new THREE.Mesh(mirrorGeo, paintMat);
      mirrorMesh.position.set(mx, 2.85 * s, 1.65 * s);
      this.carGroup.add(mirrorMesh);

      // Mirror glass face (facing -Z toward driver eyes)
      const mGlassGeo = new THREE.PlaneGeometry(0.32 * s, 0.20 * s);
      const mGlass = new THREE.Mesh(mGlassGeo, chromeMat);
      mGlass.position.set(mx + (idx === 0 ? 0.08 : -0.08) * s, 2.85 * s, 1.48 * s);
      this.carGroup.add(mGlass);

      // Amber LED turn signal strip on mirror
      const amberGeo = new THREE.BoxGeometry(0.06 * s, 0.05 * s, 0.42 * s);
      const amberMesh = new THREE.Mesh(amberGeo, new THREE.MeshBasicMaterial({ color: 0xf59e0b }));
      amberMesh.position.set(mx + (idx === 0 ? -0.16 : 0.16) * s, 2.85 * s, 1.68 * s);
      this.carGroup.add(amberMesh);

      // Flush door handles (front & rear doors)
      [0.6 * s, -1.8 * s].forEach(dz => {
        const handleGeo = new THREE.BoxGeometry(0.08 * s, 0.10 * s, 0.65 * s);
        const handleMesh = new THREE.Mesh(handleGeo, chromeMat);
        handleMesh.position.set(mx + (idx === 0 ? -0.05 : 0.05) * s, 2.25 * s, dz);
        this.carGroup.add(handleMesh);
      });
    });

    // ── 11. Full Interior Cockpit ─────────────────────────────────────────────
    // Sculpted dashboard
    const dashGeo = new THREE.BoxGeometry(4.6 * s, 0.75 * s, 1.6 * s);
    const dashMesh = new THREE.Mesh(dashGeo, interiorLeatherMat);
    dashMesh.position.set(0, 2.50 * s, 1.15 * s);
    this.carGroup.add(dashMesh);

    // 12-inch Center Infotainment Touchscreen
    const screenGeo = new THREE.BoxGeometry(0.95 * s, 0.55 * s, 0.06 * s);
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x0284c7 }); // Glowing cyan-blue navigation UI
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(0, 2.75 * s, 1.05 * s);
    screenMesh.rotateX(-0.15);
    this.carGroup.add(screenMesh);

    // Digital Instrument Cluster (Driver display behind steering wheel)
    const clusterGeo = new THREE.BoxGeometry(0.85 * s, 0.45 * s, 0.05 * s);
    const clusterMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
    const clusterMesh = new THREE.Mesh(clusterGeo, clusterMat);
    clusterMesh.position.set(1.15 * s, 2.78 * s, 1.08 * s);
    clusterMesh.rotateX(-0.25);
    this.carGroup.add(clusterMesh);

    // Center floor console & armrest
    const consoleGeo = new THREE.BoxGeometry(0.95 * s, 0.65 * s, 4.2 * s);
    const consoleMesh = new THREE.Mesh(consoleGeo, interiorLeatherMat);
    consoleMesh.position.set(0, 1.35 * s, -0.6 * s);
    this.carGroup.add(consoleMesh);

    // Automatic Gear Shifter
    const shifterGeo = new THREE.CylinderGeometry(0.06 * s, 0.06 * s, 0.28 * s, 8);
    const shifterMesh = new THREE.Mesh(shifterGeo, chromeMat);
    shifterMesh.position.set(0, 1.75 * s, 0.4 * s);
    this.carGroup.add(shifterMesh);

    // 3-Spoke Sport Steering Wheel (Mounted on right-hand driver side)
    const wheelColumnGeo = new THREE.CylinderGeometry(0.08 * s, 0.08 * s, 0.65 * s, 12);
    wheelColumnGeo.rotateX(Math.PI / 4);
    const wheelColumn = new THREE.Mesh(wheelColumnGeo, interiorLeatherMat);
    wheelColumn.position.set(1.15 * s, 2.45 * s, 0.72 * s);
    this.carGroup.add(wheelColumn);

    this.interiorSteeringWheel = new THREE.Group();
    this.interiorSteeringWheel.position.set(1.15 * s, 2.68 * s, 0.50 * s);
    this.interiorSteeringWheel.rotation.x = -Math.PI / 5; // Tilted toward driver

    const rimTorusGeo = new THREE.TorusGeometry(0.48 * s, 0.055 * s, 12, 24);
    const rimTorus = new THREE.Mesh(rimTorusGeo, interiorLeatherMat);
    this.interiorSteeringWheel.add(rimTorus);

    // 3 Spokes + Center horn pad
    const hornPadGeo = new THREE.CylinderGeometry(0.14 * s, 0.14 * s, 0.05 * s, 16);
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

    // Front Sport Bucket Seats (Driver at +1.15s, Passenger at -1.15s)
    [-1.15 * s, 1.15 * s].forEach(sx => {
      // Seat cushion base
      const seatBaseGeo = new THREE.BoxGeometry(1.55 * s, 0.38 * s, 1.65 * s);
      const seatBase = new THREE.Mesh(seatBaseGeo, interiorLeatherMat);
      seatBase.position.set(sx, 1.35 * s, -0.5 * s);
      this.carGroup.add(seatBase);

      // Ergonomic seat backrest
      const backGeo = new THREE.BoxGeometry(1.45 * s, 1.65 * s, 0.28 * s);
      backGeo.rotateX(0.15); // Reclined slightly back
      const backMesh = new THREE.Mesh(backGeo, interiorLeatherMat);
      backMesh.position.set(sx, 2.15 * s, -1.25 * s);
      this.carGroup.add(backMesh);

      // Headrest
      const hrGeo = new THREE.BoxGeometry(0.85 * s, 0.42 * s, 0.22 * s);
      const hrMesh = new THREE.Mesh(hrGeo, interiorLeatherMat);
      hrMesh.position.set(sx, 3.12 * s, -1.45 * s);
      this.carGroup.add(hrMesh);
    });

    // Rear Bench Seat
    const rearBenchGeo = new THREE.BoxGeometry(4.4 * s, 0.42 * s, 1.5 * s);
    const rearBench = new THREE.Mesh(rearBenchGeo, interiorLeatherMat);
    rearBench.position.set(0, 1.40 * s, -2.4 * s);
    this.carGroup.add(rearBench);

    const rearBackGeo = new THREE.BoxGeometry(4.3 * s, 1.55 * s, 0.30 * s);
    rearBackGeo.rotateX(0.15);
    const rearBack = new THREE.Mesh(rearBackGeo, interiorLeatherMat);
    rearBack.position.set(0, 2.15 * s, -3.1 * s);
    this.carGroup.add(rearBack);

    // ── 12. Four High-Performance Alloy Wheels & Brakes ───────────────────────
    const buildWheelAssembly = () => {
      const wheelAssembly = new THREE.Group();

      // Radial treaded rubber tire
      const tireGeo = new THREE.CylinderGeometry(1.05 * s, 1.05 * s, 0.72 * s, 24);
      tireGeo.rotateZ(Math.PI / 2);
      const tireMesh = new THREE.Mesh(tireGeo, tireRubberMat);
      tireMesh.castShadow = true;
      wheelAssembly.add(tireMesh);

      // Alloy Wheel Rim
      const rimGeo = new THREE.CylinderGeometry(0.78 * s, 0.78 * s, 0.74 * s, 20);
      rimGeo.rotateZ(Math.PI / 2);
      const rimMesh = new THREE.Mesh(rimGeo, alloyRimMat);
      wheelAssembly.add(rimMesh);

      // 5-Split-Spoke Star Design
      for (let sp = 0; sp < 5; sp++) {
        const spokeAng = (sp * 2 * Math.PI) / 5;
        const spokeBarGeo = new THREE.BoxGeometry(0.06 * s, 0.65 * s, 0.12 * s);
        const spokeBar = new THREE.Mesh(spokeBarGeo, chromeMat);
        spokeBar.position.set(0.36 * s, Math.cos(spokeAng) * 0.35 * s, Math.sin(spokeAng) * 0.35 * s);
        spokeBar.rotation.x = -spokeAng;
        wheelAssembly.add(spokeBar);
      }

      // Center Chrome Hub Cap with Emblem
      const hubGeo = new THREE.CylinderGeometry(0.22 * s, 0.22 * s, 0.76 * s, 16);
      hubGeo.rotateZ(Math.PI / 2);
      const hubMesh = new THREE.Mesh(hubGeo, chromeMat);
      wheelAssembly.add(hubMesh);

      // Ventilated Brake Disc Rotor
      const discGeo = new THREE.CylinderGeometry(0.65 * s, 0.65 * s, 0.05 * s, 20);
      discGeo.rotateZ(Math.PI / 2);
      const discMesh = new THREE.Mesh(discGeo, brakeRotorMat);
      discMesh.position.set(-0.15 * s, 0, 0);
      wheelAssembly.add(discMesh);

      // Red Sport Brake Caliper
      const caliperGeo = new THREE.BoxGeometry(0.18 * s, 0.42 * s, 0.32 * s);
      const caliperMesh = new THREE.Mesh(caliperGeo, brakeCaliperMat);
      caliperMesh.position.set(-0.15 * s, 0.45 * s, 0);
      wheelAssembly.add(caliperMesh);

      return wheelAssembly;
    };

    // Front-Left Wheel (Steering + Spin)
    this.steeringGroupFL = new THREE.Group();
    this.steeringGroupFL.position.set(-2.42 * s, 1.05 * s, 4.1 * s);
    this.spinGroupFL = new THREE.Group();
    this.spinGroupFL.add(buildWheelAssembly());
    this.steeringGroupFL.add(this.spinGroupFL);
    this.carGroup.add(this.steeringGroupFL);

    // Front-Right Wheel (Steering + Spin)
    this.steeringGroupFR = new THREE.Group();
    this.steeringGroupFR.position.set(2.42 * s, 1.05 * s, 4.1 * s);
    this.spinGroupFR = new THREE.Group();
    const rightAssembly = buildWheelAssembly();
    rightAssembly.rotation.y = Math.PI; // Invert for right side
    this.spinGroupFR.add(rightAssembly);
    this.steeringGroupFR.add(this.spinGroupFR);
    this.carGroup.add(this.steeringGroupFR);

    // Rear-Left Wheel (Spin only)
    const rearPosRL = new THREE.Group();
    rearPosRL.position.set(-2.42 * s, 1.05 * s, -4.1 * s);
    this.spinGroupRL = new THREE.Group();
    this.spinGroupRL.add(buildWheelAssembly());
    rearPosRL.add(this.spinGroupRL);
    this.carGroup.add(rearPosRL);

    // Rear-Right Wheel (Spin only)
    const rearPosRR = new THREE.Group();
    rearPosRR.position.set(2.42 * s, 1.05 * s, -4.1 * s);
    this.spinGroupRR = new THREE.Group();
    const rearRightAssembly = buildWheelAssembly();
    rearRightAssembly.rotation.y = Math.PI;
    this.spinGroupRR.add(rearRightAssembly);
    rearPosRR.add(this.spinGroupRR);
    this.carGroup.add(rearPosRR);

    // ── 13. Interactive Hit Collider Mesh (for raycast / click) ───────────────
    const hitBoxGeo = new THREE.BoxGeometry(6.0 * s, 4.8 * s, 14.0 * s);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });
    const hitMesh = new THREE.Mesh(hitBoxGeo, hitMat);
    hitMesh.position.set(0, 2.4 * s, 0);
    hitMesh.userData = { isVehicle: true, vehicle: this };
    this.carGroup.add(hitMesh);
    this.interactiveHitMesh = hitMesh;

    // Attach user data to main car body
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

    const intensity = this.headlightsOn ? 4.5 : 0;
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
    if (ui) {
      ui.showToast(`🎥 Camera: ${this.cameraMode === 'cockpit' ? 'Cockpit Driver View' : 'Third-Person Chase Cam'}`);
    }
  }

  enterCar(player, avatar, cameraCtrl, ui) {
    if (this.isDriving) return;
    this.isDriving = true;

    // Disable static obstacle collision so player doesn't push against car
    if (this.carCollider) {
      this.carCollider.disabled = true;
    }

    this.playDoorAudio();
    this.startEngineAudio();

    // Position player avatar in the driver's seat
    if (avatar) {
      const driverWorldPos = this.carGroup.localToWorld(new THREE.Vector3(1.15 * WORLD_SCALE, 1.45 * WORLD_SCALE, -0.5 * WORLD_SCALE));
      avatar.setSitting(driverWorldPos, this.yaw);
    }

    // Default to Cockpit view upon entering
    this.cameraMode = 'cockpit';
    if (cameraCtrl && cameraCtrl.camera) {
      cameraCtrl.camera.rotation.set(0, this.yaw, 0);
    }

    if (ui) {
      ui.showToast('🚗 Entered Car • W/S: Accelerate/Reverse • A/D: Steer • H: Horn • L: Lights • G: Garage Door • C: Camera • E: Exit', 4500);
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

    // Safely teleport player standing outside driver's side door
    const exitWorldPos = this.carGroup.localToWorld(new THREE.Vector3(3.6 * s, 0, 0));
    player.position.set(exitWorldPos.x, this.posY + player.config.eyeHeight, exitWorldPos.z);
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
    // Called when player presses [E] while targeting the car
    if (!this.isDriving) {
      // Need engine reference or caller to pass player & avatar
      // Handled via engine dispatch
    }
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
          // Braking while in reverse
          this.velocity = Math.min(0, this.velocity + this.brakeRate * dt);
        } else {
          this.velocity = Math.min(this.maxForwardSpeed, this.velocity + this.accelRate * dt);
        }
      } else if (keys.backward) {
        if (this.velocity > 0) {
          // Braking while moving forward
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
      if (Math.abs(this.velocity) > 0.08) {
        const angularVelocity = (this.velocity / this.wheelbase) * Math.tan(this.steerAngle);
        this.yaw += angularVelocity * dt;
      }

      // Calculate next intended position
      let nextX = this.posX + Math.sin(this.yaw) * this.velocity * dt;
      let nextZ = this.posZ + Math.cos(this.yaw) * this.velocity * dt;

      // ── Collision Constraints ───────────────────────────────────────────────
      // Check garage overhead door G2 status
      let isGarageDoorOpen = false;
      if (doorManager && doorManager.doors) {
        const gDoor = doorManager.doors.find(d => d.id === 'G2');
        if (gDoor && (gDoor.isOpen || (gDoor.currentOffsetY && gDoor.currentOffsetY > 4.5 * s))) {
          isGarageDoorOpen = true;
        }
      }

      // If car is inside garage (Z < 0):
      if (this.posZ < 0.2 * s) {
        // Left/West garage wall
        if (nextX < 36.6 * s) nextX = 36.6 * s;
        // Right/East garage wall
        if (nextX > 47.0 * s) nextX = 47.0 * s;
        // Rear/North garage wall
        if (nextZ < -11.5 * s) nextZ = -11.5 * s;

        // Front garage door threshold
        if (!isGarageDoorOpen && nextZ > -0.8 * s) {
          nextZ = -0.8 * s;
          this.velocity = 0;
          if (ui) ui.showToast('🛑 Garage Door is Closed! Press [G] to Open', 1200);
        }
      } else {
        // Outside drive area (driveway, ramp, front street)
        // Compound / Street boundaries
        if (nextX < 0.0 * s) nextX = 0.0 * s;
        if (nextX > 70.0 * s) nextX = 70.0 * s;
        if (nextZ > 45.0 * s) nextZ = 45.0 * s;

        // Re-entering garage through doorway
        if (nextZ < 0.2 * s) {
          if (!isGarageDoorOpen) {
            nextZ = 0.2 * s;
            this.velocity = 0;
            if (ui) ui.showToast('🛑 Garage Door is Closed! Press [G] to Open', 1200);
          } else if (nextX < 37.0 * s || nextX > 46.5 * s) {
            // Must enter through garage door opening
            nextZ = 0.2 * s;
            this.velocity = 0;
          }
        }
      }

      // Ground Elevation Sampling
      let groundY = 0.25 * s; // Garage plinth level
      if (nextZ > 0 && nextZ <= 4.0 * s) {
        // Ramp slope from 0.25 down to 0.0
        groundY = (1.0 - (nextZ / (4.0 * s))) * 0.25 * s;
      } else if (nextZ > 4.0 * s) {
        // Street level
        groundY = 0.0;
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

      const wheelRadius = 1.05 * s;
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

      // Keep player position synchronized with car driver seat
      const driverSeatPos = this.carGroup.localToWorld(new THREE.Vector3(1.15 * s, 1.45 * s, -0.5 * s));
      player.position.copy(driverSeatPos);
      player.feetElevation = this.posY;

      // Keep avatar sitting in driver seat
      if (avatar) {
        avatar.setSitting(driverSeatPos, this.yaw);
      }

      // Camera Positioning (Cockpit Driver View vs Chase Cam)
      if (cameraCtrl && cameraCtrl.camera) {
        if (this.cameraMode === 'cockpit') {
          // Camera placed directly at driver's eye level
          const eyeWorldPos = this.carGroup.localToWorld(new THREE.Vector3(1.15 * s, 3.10 * s, -0.45 * s));
          cameraCtrl.camera.position.copy(eyeWorldPos);

          // Rotate camera yaw with car turn while preserving mouse pitch/yaw freelook
          if (Math.abs(this.velocity) > 0.08) {
            const angularVelocity = (this.velocity / this.wheelbase) * Math.tan(this.steerAngle);
            cameraCtrl.camera.rotation.y += angularVelocity * dt;
          }
        } else {
          // Third-Person Chase Cam behind & above car
          const chaseCamPos = this.carGroup.localToWorld(new THREE.Vector3(0, 5.2 * s, -15.5 * s));
          cameraCtrl.camera.position.lerp(chaseCamPos, Math.min(1.0, dt * 8));

          const lookTarget = this.carGroup.localToWorld(new THREE.Vector3(0, 2.2 * s, 2.0 * s));
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
