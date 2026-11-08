import * as THREE from 'three';
import { WORLD_SCALE } from '../config/constants.js';

export const SINK_SPECS = [
  // Ground Floor Sinks & Basins
  {
    id: 'SINK-GF-KIT',
    name: 'Kitchen Sink Tap',
    floor: 'ground_floor',
    x: 17.75,
    y_cad: 4.80,
    z_cad: 4.70,
    basinZ: 3.65,
    handleAxis: 'Z'
  },
  {
    id: 'SINK-GF-BATH-W',
    name: 'West Bathroom Basin Tap',
    floor: 'ground_floor',
    x: 10.875,
    y_cad: 22.80,
    z_cad: 4.45,
    basinZ: 3.60,
    handleAxis: 'X'
  },
  {
    id: 'SINK-GF-BATH-E',
    name: 'East Bathroom Basin Tap',
    floor: 'ground_floor',
    x: 40.275,
    y_cad: 22.80,
    z_cad: 4.45,
    basinZ: 3.60,
    handleAxis: 'X'
  },

  // First Floor Sinks & Basins
  {
    id: 'SINK-FF-KIT',
    name: 'First Floor Kitchen Tap',
    floor: 'first_floor',
    x: 4.25,
    y_cad: 8.25,
    z_cad: 15.10,
    basinZ: 14.15,
    handleAxis: 'Z'
  },
  {
    id: 'SINK-FF-NICHE',
    name: 'Basin Niche Tap',
    floor: 'first_floor',
    x: 15.625,
    y_cad: 22.80,
    z_cad: 14.95,
    basinZ: 14.10,
    handleAxis: 'X'
  },
  {
    id: 'SINK-FF-BATH1',
    name: 'Bathroom 1 Basin Tap',
    floor: 'first_floor',
    x: 18.875,
    y_cad: 22.80,
    z_cad: 14.95,
    basinZ: 14.10,
    handleAxis: 'X'
  },
  {
    id: 'SINK-FF-BATH2',
    name: 'Bathroom 2 Basin Tap',
    floor: 'first_floor',
    x: 38.875,
    y_cad: 22.80,
    z_cad: 14.95,
    basinZ: 14.10,
    handleAxis: 'X'
  },
  {
    id: 'SINK-FF-GALLERY',
    name: 'North Gallery Basin Tap',
    floor: 'first_floor',
    x: 34.85,
    y_cad: 4.85,
    z_cad: 15.10,
    basinZ: 14.15,
    handleAxis: 'Z'
  }
];

class SinkAudio {
  constructor() {
    this.ctx = null;
    this.activeNodes = new Map();
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

  playTapClick() {
    try {
      const ctx = this.ensureContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.05);
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch (_) {}
  }

  startWaterStream(sinkId) {
    try {
      const ctx = this.ensureContext();
      if (!ctx) return;
      if (this.activeNodes.has(sinkId)) return;

      const now = ctx.currentTime;

      // 1. White noise buffer (2 seconds loop)
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // 2. Bandpass filter for running water hiss and trickle
      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(1450, now);
      bandpass.Q.setValueAtTime(1.8, now);

      // 3. Lowpass filter to soften harsh treble
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(2800, now);

      // 4. Subtle splash gurgle LFO
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(4.5, now);
      lfoGain.gain.setValueAtTime(120, now);
      lfo.connect(bandpass.frequency);

      // 5. Master stream gain with smooth fade in
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, now);
      masterGain.gain.linearRampToValueAtTime(0.12, now + 0.15);

      whiteNoise.connect(bandpass);
      bandpass.connect(lowpass);
      lowpass.connect(masterGain);
      masterGain.connect(ctx.destination);

      whiteNoise.start(now);
      lfo.start(now);

      this.activeNodes.set(sinkId, {
        whiteNoise,
        lfo,
        masterGain
      });
    } catch (_) {}
  }

  stopWaterStream(sinkId) {
    try {
      const node = this.activeNodes.get(sinkId);
      if (!node || !this.ctx) return;
      const now = this.ctx.currentTime;
      node.masterGain.gain.setValueAtTime(node.masterGain.gain.value, now);
      node.masterGain.gain.linearRampToValueAtTime(0.001, now + 0.18);
      setTimeout(() => {
        try {
          node.whiteNoise.stop();
          node.lfo.stop();
          node.whiteNoise.disconnect();
          node.lfo.disconnect();
          node.masterGain.disconnect();
        } catch (_) {}
      }, 220);
      this.activeNodes.delete(sinkId);
    } catch (_) {}
  }
}

export class SinkManager {
  constructor(materialManager) {
    this.materials = materialManager;
    this.audio = new SinkAudio();

    this.rootGroup = new THREE.Group();
    this.rootGroup.name = 'InteractiveSinksRoot';

    this.sinks = [];
    this.interactiveMeshes = [];
    this.targetedSink = null;
    this.raycaster = new THREE.Raycaster();
    this.raycaster.far = 10 * WORLD_SCALE;

    this.waterTime = 0;
  }

  buildSinks(scene) {
    const s = WORLD_SCALE;

    // Materials
    const chromeMat = this.materials.get('M-CHROME') || new THREE.MeshStandardMaterial({
      color: '#E0E5E8',
      metalness: 0.95,
      roughness: 0.15
    });

    const waterMat = new THREE.MeshStandardMaterial({
      color: '#C8EEFA',
      roughness: 0.05,
      metalness: 0.1,
      transparent: true,
      opacity: 0.68,
      depthWrite: false
    });

    const rippleMat = new THREE.MeshBasicMaterial({
      color: '#BEE7F5',
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      side: THREE.DoubleSide
    });

    SINK_SPECS.forEach(spec => {
      const group = new THREE.Group();
      group.name = `Sink_${spec.id}`;

      const worldX = spec.x * s;
      const worldY = spec.z_cad * s;
      const worldZ = -spec.y_cad * s;
      const basinWorldY = spec.basinZ * s;
      const streamHeight = Math.max(0.6 * s, worldY - basinWorldY);

      group.position.set(worldX, worldY, worldZ);

      // 1. Chrome Tap Spout (Curved Gooseneck / Mixer)
      const spoutCurve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0.40 * s, 0),
        new THREE.Vector3(0.08 * s, 0.50 * s, 0.20 * s),
        new THREE.Vector3(0, 0.32 * s, 0.28 * s)
      );
      const spoutGeo = new THREE.TubeGeometry(spoutCurve, 16, 0.038 * s, 8, false);
      const spoutMesh = new THREE.Mesh(spoutGeo, chromeMat);
      spoutMesh.castShadow = true;
      group.add(spoutMesh);

      // Base ring mount
      const baseGeo = new THREE.CylinderGeometry(0.08 * s, 0.09 * s, 0.04 * s, 12);
      const baseMesh = new THREE.Mesh(baseGeo, chromeMat);
      baseMesh.position.set(0, 0.02 * s, 0);
      group.add(baseMesh);

      // 2. Interactive Lever Handle
      const handlePivot = new THREE.Group();
      handlePivot.position.set(0, 0.20 * s, -0.02 * s);

      const leverGeo = new THREE.CylinderGeometry(0.022 * s, 0.022 * s, 0.26 * s, 8);
      const leverMesh = new THREE.Mesh(leverGeo, chromeMat);
      leverMesh.rotation.z = Math.PI / 4;
      leverMesh.position.set(0.09 * s, 0.09 * s, 0);
      leverMesh.castShadow = true;
      handlePivot.add(leverMesh);

      group.add(handlePivot);

      // 3. Animated Running Water Stream
      // Positioned at spout tip (0, 0.32 * s, 0.28 * s) down to basin
      const streamGeo = new THREE.CylinderGeometry(0.024 * s, 0.032 * s, streamHeight, 8, 1, true);
      const streamMesh = new THREE.Mesh(streamGeo, waterMat);
      streamMesh.position.set(0, 0.32 * s - streamHeight / 2, 0.28 * s);
      streamMesh.visible = false;
      group.add(streamMesh);

      // 4. Basin Splash Ripple Rings
      const rippleGeo = new THREE.RingGeometry(0.03 * s, 0.16 * s, 16);
      const rippleMesh = new THREE.Mesh(rippleGeo, rippleMat);
      rippleMesh.rotation.x = -Math.PI / 2;
      rippleMesh.position.set(0, 0.32 * s - streamHeight + 0.01 * s, 0.28 * s);
      rippleMesh.visible = false;
      group.add(rippleMesh);

      // 5. Interactive Hit Box for Raycasting
      const hitGeo = new THREE.BoxGeometry(0.70 * s, 0.85 * s, 0.70 * s);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.position.set(0, 0.30 * s, 0.14 * s);
      group.add(hitMesh);

      this.rootGroup.add(group);

      const sinkObj = {
        spec: spec,
        id: spec.id,
        name: spec.name,
        floor: spec.floor,
        group: group,
        handlePivot: handlePivot,
        streamMesh: streamMesh,
        rippleMesh: rippleMesh,
        hitMesh: hitMesh,
        isOn: false,
        targetAngle: 0,
        currentAngle: 0,
        worldCenter: new THREE.Vector3(worldX, worldY + 0.30 * s, worldZ + 0.14 * s),
        toggle: () => this.toggleSink(sinkObj)
      };

      hitMesh.userData = { sink: sinkObj };
      spoutMesh.userData = { sink: sinkObj };
      leverMesh.userData = { sink: sinkObj };

      this.interactiveMeshes.push(hitMesh);
      this.sinks.push(sinkObj);
    });

    scene.add(this.rootGroup);
    return this.rootGroup;
  }

  toggleSink(sink) {
    sink.isOn = !sink.isOn;
    sink.targetAngle = sink.isOn ? 0.60 : 0;
    sink.streamMesh.visible = sink.isOn;
    sink.rippleMesh.visible = sink.isOn;

    this.audio.playTapClick();

    if (sink.isOn) {
      this.audio.startWaterStream(sink.id);
    } else {
      this.audio.stopWaterStream(sink.id);
    }
  }

  interact(ui, showPrompt = false) {
    if (this.targetedSink) {
      this.targetedSink.toggle();
      if (ui && showPrompt) {
        ui.showInteractionPrompt(`[E] ${this.targetedSink.isOn ? 'Turn Off' : 'Turn On'} ${this.targetedSink.name}`);
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

    const activeMeshes = this.interactiveMeshes.filter(m => m.parent && m.parent.visible);
    const intersects = this.raycaster.intersectObjects(activeMeshes, true);

    if (intersects.length > 0) {
      let cur = intersects[0].object;
      while (cur && !cur.userData?.sink) cur = cur.parent;
      if (cur && cur.userData?.sink) {
        cur.userData.sink.toggle();
      }
    }
  }

  update(delta, camera, playerPosition, isFPActive, ui, showPrompt = false, isDoorTargeted = false) {
    const s = WORLD_SCALE;
    this.waterTime += delta * 12.0;

    // 1. Water stream animation & handle rotation lerp
    this.sinks.forEach(sink => {
      // Smooth handle rotation
      sink.currentAngle = THREE.MathUtils.lerp(sink.currentAngle, sink.targetAngle, delta * 8.0);
      sink.handlePivot.rotation.z = sink.currentAngle;

      if (sink.isOn) {
        // Subtle shimmer / pulsation of water stream
        const pulse = 1.0 + Math.sin(this.waterTime) * 0.08;
        sink.streamMesh.scale.set(pulse, 1.0, pulse);

        // Ripple ring expansion and fading
        const rippleCycle = (this.waterTime * 0.35) % 1.0;
        const rippleScale = 0.5 + rippleCycle * 0.9;
        sink.rippleMesh.scale.set(rippleScale, rippleScale, 1.0);
        sink.rippleMesh.material.opacity = Math.max(0, 0.65 - rippleCycle * 0.60);
      }
    });

    // 2. Targeting detection (First-Person Walkthrough)
    if (!isFPActive || !camera || !playerPosition) {
      if (this.targetedSink) {
        this.targetedSink = null;
        this.isDirectHit = false;
        this.targetedDistance = Infinity;
        this.promptLabel = null;
        if (ui && !isDoorTargeted) ui.hideInteractionPrompt();
      }
      return;
    }

    // Realistic arm-reach to sink basin / tap (~4.8 ft)
    const reach = 3.6 * s;
    const activeSinks = this.sinks.filter(sink => {
      if (!sink.group.visible) return false;
      const dDist = playerPosition.distanceTo(sink.worldCenter);
      return dDist <= reach;
    });

    let bestSink = null;
    let closestDist = Infinity;
    let isDirectHit = false;

    // Center reticle raycast (strict priority)
    this.raycaster.setFromCamera({ x: 0, y: 0 }, camera);
    const candidateMeshes = activeSinks.map(s_item => s_item.hitMesh);
    const intersects = this.raycaster.intersectObjects(candidateMeshes, false);

    if (intersects.length > 0) {
      const hitObj = intersects[0].object;
      if (hitObj && hitObj.userData?.sink) {
        if (intersects[0].distance <= reach) {
          bestSink = hitObj.userData.sink;
          closestDist = intersects[0].distance;
          isDirectHit = true;
        }
      }
    }

    // Very tight look-angle fallback only when directly facing tap (cone < 20°, dist <= 2.6 * s)
    if (!bestSink) {
      const camDir = new THREE.Vector3();
      camera.getWorldDirection(camDir);

      activeSinks.forEach(sink => {
        const toSink = new THREE.Vector3().subVectors(sink.worldCenter, camera.position);
        const dist = toSink.length();
        toSink.normalize();
        const dot = camDir.dot(toSink);
        if (dot > 0.94 && dist <= 2.6 * s && dist < closestDist) {
          closestDist = dist;
          bestSink = sink;
          isDirectHit = false;
        }
      });
    }

    this.targetedSink = bestSink;
    this.isDirectHit = isDirectHit;
    this.targetedDistance = closestDist;
    this.promptLabel = bestSink ? `[E] ${bestSink.isOn ? 'Turn Off' : 'Turn On'} ${bestSink.name}` : null;

    // Show prompt if door manager isn't currently targeting a door
    if (ui && !isDoorTargeted) {
      if (this.targetedSink && showPrompt) {
        ui.showInteractionPrompt(this.promptLabel);
      } else if (!isDoorTargeted) {
        // Only hide if door manager doesn't own the prompt
        ui.hideInteractionPrompt();
      }
    }
  }

  setFloorFilter(filter) {
    this.sinks.forEach(sink => {
      const isVisible = (filter === 'all') || (sink.floor === filter);
      sink.group.visible = isVisible;
      if (!isVisible && sink.isOn) {
        this.toggleSink(sink); // shut off water if floor hidden
      }
    });
  }

  getRoot() {
    return this.rootGroup;
  }
}
