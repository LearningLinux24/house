import * as THREE from 'three';
import { WORLD_SCALE } from '../config/constants.js';

export class TVManager {
  constructor(materials) {
    this.materials = materials;
    this.tvs = [];
    this.interactiveMeshes = [];
    this.audioListener = null;
    this.targetedTV = null;
    this.targetedDistance = Infinity;
    this.isDirectHit = false;
    this.promptLabel = null;
    this.raycaster = new THREE.Raycaster();
    this.rootGroup = new THREE.Group();
    this.rootGroup.name = 'TVManager_Root';
  }

  ensureAudioListener(camera) {
    if (!this.audioListener && camera) {
      this.audioListener = new THREE.AudioListener();
      camera.add(this.audioListener);
    }
    return this.audioListener;
  }

  createNothingToPlayTexture(floorTitle, folderPath) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 576;
    const ctx = canvas.getContext('2d');

    // Deep obsidian/midnight gradient
    const grad = ctx.createLinearGradient(0, 0, 1024, 576);
    grad.addColorStop(0, '#06080d');
    grad.addColorStop(0.5, '#0b0f17');
    grad.addColorStop(1, '#05070a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 576);

    // Subtle dark scanline overlay
    ctx.fillStyle = 'rgba(255, 255, 255, 0.012)';
    for (let y = 0; y < 576; y += 4) {
      ctx.fillRect(0, y, 1024, 1.5);
    }

    // Top status bar
    ctx.fillStyle = '#141a24';
    ctx.fillRect(40, 36, 944, 44);
    ctx.strokeStyle = '#222d3d';
    ctx.lineWidth = 1;
    ctx.strokeRect(40, 36, 944, 44);

    ctx.fillStyle = '#00e5ff';
    ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('● OLED SMART DISPLAY', 60, 63);

    ctx.fillStyle = '#78889b';
    ctx.font = '14px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`${floorTitle.toUpperCase()} • 4K HDR`, 964, 63);
    ctx.textAlign = 'left';

    // Center icon badge
    ctx.save();
    ctx.translate(512, 210);
    ctx.fillStyle = '#111722';
    ctx.beginPath();
    ctx.arc(0, 0, 52, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#2a3b52';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Video film icon
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 3;
    ctx.strokeRect(-24, -18, 48, 36);
    ctx.fillStyle = '#00e5ff';
    [-14, 0, 14].forEach(px => {
      ctx.fillRect(px - 3, -14, 6, 6);
      ctx.fillRect(px - 3, 8, 6, 6);
    });
    // Slash line indicating empty
    ctx.strokeStyle = '#ff5370';
    ctx.beginPath();
    ctx.moveTo(-28, 22);
    ctx.lineTo(28, -22);
    ctx.stroke();
    ctx.restore();

    // Heading: "Nothing to play"
    ctx.fillStyle = '#f3f6fa';
    ctx.font = 'bold 38px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Nothing to play', 512, 315);

    // Subtitle: Target folder path
    ctx.fillStyle = '#00e5ff';
    ctx.font = '18px monospace';
    ctx.fillText(`No .mp4 video found in /${folderPath}/`, 512, 360);

    // Instructions pill box
    ctx.fillStyle = '#0e141e';
    ctx.fillRect(232, 395, 560, 48);
    ctx.strokeStyle = '#253549';
    ctx.strokeRect(232, 395, 560, 48);

    ctx.fillStyle = '#8e9eb3';
    ctx.font = '15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('Drop any .mp4 video into this folder to play it in seamless loop', 512, 425);

    // Bottom status pill
    ctx.fillStyle = '#223246';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('[ STATUS: STANDBY • FOLDER EMPTY • FILTER: *.MP4 ]', 512, 510);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  async scanTVFolder(tv) {
    try {
      const res = await fetch(`/api/tv-videos?floor=${tv.floorKey}&t=${Date.now()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (data && data.hasVideo && data.latest) {
        tv.hasVideo = true;
        tv.videoUrl = data.latest.url;
        tv.videoFilename = data.latest.filename;
        tv.videoMtime = data.latest.mtimeMs;

        // Initialize or update HTML5 video element
        if (!tv.video) {
          tv.video = document.createElement('video');
          tv.video.crossOrigin = 'anonymous';
          tv.video.loop = true;
          tv.video.playsInline = true;
          tv.video.preload = 'auto';
        }

        const fullSrc = window.location.origin + tv.videoUrl;
        if (tv.video.src !== fullSrc && tv.video.src !== tv.videoUrl) {
          tv.video.src = tv.videoUrl;
          tv.video.load();
        }

        if (!tv.videoTexture) {
          tv.videoTexture = new THREE.VideoTexture(tv.video);
          tv.videoTexture.colorSpace = THREE.SRGBColorSpace;
          tv.videoTexture.minFilter = THREE.LinearFilter;
          tv.videoTexture.magFilter = THREE.LinearFilter;
          tv.videoMaterial = new THREE.MeshBasicMaterial({ map: tv.videoTexture });
        }

        // Initialize 3D positional audio node
        if (!tv.sound && this.audioListener && tv.soundbarMesh) {
          try {
            tv.sound = new THREE.PositionalAudio(this.audioListener);
            tv.sound.setMediaElementSource(tv.video);
            tv.sound.setRefDistance(5.0 * WORLD_SCALE);
            tv.sound.setMaxDistance(35.0 * WORLD_SCALE);
            tv.sound.setRolloffFactor(1.2);
            tv.sound.setDistanceModel('inverse');
            // Sound projects primarily West (-X) into the room
            tv.sound.setDirectionalCone(130, 240, 0.15);
            tv.sound.rotation.y = -Math.PI / 2;
            tv.soundbarMesh.add(tv.sound);
          } catch (audioErr) {
            console.warn('[TVManager] Positional audio setup note:', audioErr.message);
          }
        }
      } else {
        tv.hasVideo = false;
        tv.videoUrl = null;
        tv.videoFilename = null;
      }
    } catch {
      // Offline fallback: keep existing or empty
      if (!tv.videoUrl) {
        tv.hasVideo = false;
      }
    }
  }

  init(televisions, camera, scene) {
    this.ensureAudioListener(camera);

    const s = WORLD_SCALE;

    televisions.forEach(tvGroup => {
      const data = tvGroup.userData || {};
      const tvId = data.tvId;
      const isGF = (tvId === 'LOB-08');
      const floorKey = isGF ? 'gf' : '1f';
      const floorTitle = isGF ? 'Ground Floor TV' : 'First Floor TV';
      const folderPath = `public/videos/${floorKey}-tv`;

      const screenMesh = data.screenMesh;
      const soundbarMesh = data.soundbarMesh;
      const ledMesh = data.ledMesh;

      if (!screenMesh) return;

      const offMaterial = screenMesh.material;
      const standbyLedMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
      const activeLedMat = new THREE.MeshBasicMaterial({ color: 0x00ff88 });

      const nothingToPlayTexture = this.createNothingToPlayTexture(floorTitle, folderPath);
      const nothingToPlayMaterial = new THREE.MeshBasicMaterial({ map: nothingToPlayTexture });

      // Hit collider box covering TV for reticle raycasting
      const hitGeo = new THREE.BoxGeometry(0.35 * s, 2.5 * s, 4.2 * s);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.position.copy(tvGroup.position);
      this.rootGroup.add(hitMesh);

      const tvObj = {
        id: tvId,
        name: floorTitle,
        floor: data.floor || (isGF ? 'ground_floor' : 'first_floor'),
        floorKey,
        folderPath,
        group: tvGroup,
        screenMesh,
        soundbarMesh,
        ledMesh,
        hitMesh,
        offMaterial,
        standbyLedMat,
        activeLedMat,
        nothingToPlayMaterial,
        videoMaterial: null,
        videoTexture: null,
        video: null,
        sound: null,
        hasVideo: false,
        videoUrl: null,
        videoFilename: null,
        isOn: false,
        worldCenter: new THREE.Vector3().copy(tvGroup.position)
      };

      hitMesh.userData = { tv: tvObj };
      screenMesh.userData = { tv: tvObj };

      this.interactiveMeshes.push(hitMesh, screenMesh);
      this.tvs.push(tvObj);

      // Initial asynchronous folder scan
      this.scanTVFolder(tvObj);
    });

    scene.add(this.rootGroup);
    return this.rootGroup;
  }

  async toggleTV(tv, ui) {
    if (!tv) return;

    // Ensure Web Audio context is active on user click / key gesture
    if (this.audioListener && this.audioListener.context && this.audioListener.context.state === 'suspended') {
      try {
        await this.audioListener.context.resume();
      } catch {}
    }

    if (!tv.isOn) {
      // ── Turn TV ON ──
      // Re-scan folder before turning on to always pick up the latest .mp4
      await this.scanTVFolder(tv);

      if (tv.hasVideo && tv.video) {
        tv.isOn = true;
        tv.screenMesh.material = tv.videoMaterial;
        tv.ledMesh.material = tv.activeLedMat;

        try {
          await tv.video.play();
        } catch (playErr) {
          console.warn('[TVManager] Video play exception:', playErr.message);
        }

        if (ui) {
          const isResume = (tv.video.currentTime > 0.5);
          ui.showToast(
            isResume
              ? `[TV] ${tv.name}: Resuming "${tv.videoFilename}"`
              : `[TV] ${tv.name}: Playing "${tv.videoFilename}" in loop`
          );
        }
      } else {
        // No .mp4 video found: show "Nothing to play" screen
        tv.isOn = true;
        tv.screenMesh.material = tv.nothingToPlayMaterial;
        tv.ledMesh.material = tv.standbyLedMat;

        if (ui) {
          ui.showToast(`[TV] ${tv.name}: Nothing to play (Folder empty: /${tv.folderPath}/)`);
        }
      }
    } else {
      // ── Turn TV OFF ──
      tv.isOn = false;
      if (tv.video) {
        try {
          tv.video.pause();
        } catch {}
      }
      tv.screenMesh.material = tv.offMaterial;
      tv.ledMesh.material = tv.standbyLedMat;

      if (ui) {
        ui.showToast(`[TV] ${tv.name} turned off`);
      }
    }
  }

  interact(ui, showPrompt = false) {
    if (!this.targetedTV) return;
    this.toggleTV(this.targetedTV, ui);
  }

  handleOrbitClick(event, camera, ui) {
    const mouse = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );
    this.raycaster.setFromCamera(mouse, camera);

    const activeMeshes = this.interactiveMeshes.filter(m => m.parent && m.parent.visible);
    const intersects = this.raycaster.intersectObjects(activeMeshes, true);

    if (intersects.length > 0) {
      let cur = intersects[0].object;
      while (cur && !cur.userData?.tv) cur = cur.parent;
      if (cur && cur.userData?.tv) {
        this.toggleTV(cur.userData.tv, ui);
      }
    }
  }

  update(delta, camera, playerPosition, isFPActive, ui, showPrompt = false) {
    const s = WORLD_SCALE;

    // 1. Dynamic acoustic distance & floor muffling
    if (playerPosition) {
      const isPlayerOnGF = playerPosition.y < 8.0 * s;

      this.tvs.forEach(tv => {
        if (!tv.sound || !tv.isOn) return;

        const isTvOnGF = (tv.floor === 'ground_floor');
        if (isPlayerOnGF === isTvOnGF) {
          // Same floor: full clear acoustic dynamics
          tv.sound.setVolume(1.0);
        } else {
          // Different floor: volume heavily attenuated by concrete slab
          tv.sound.setVolume(0.12);
        }
      });
    }

    // 2. Reticle raycast targeting
    if (!isFPActive || !camera || !playerPosition) {
      if (this.targetedTV) {
        this.targetedTV = null;
        this.isDirectHit = false;
        this.targetedDistance = Infinity;
        this.promptLabel = null;
        if (ui) ui.hideInteractionPrompt();
      }
      return;
    }

    const reach = 9.5 * s;
    const activeTVs = this.tvs.filter(tv => {
      if (!tv.group.visible) return false;
      const d = playerPosition.distanceTo(tv.worldCenter);
      return d <= reach;
    });

    let bestTV = null;
    let closestDist = Infinity;
    let isDirectHit = false;

    this.raycaster.setFromCamera({ x: 0, y: 0 }, camera);
    const candidateMeshes = [];
    activeTVs.forEach(tv => {
      candidateMeshes.push(tv.hitMesh, tv.screenMesh);
    });

    const intersects = this.raycaster.intersectObjects(candidateMeshes, false);

    if (intersects.length > 0) {
      let cur = intersects[0].object;
      while (cur && !cur.userData?.tv) cur = cur.parent;
      if (cur && cur.userData?.tv && intersects[0].distance <= reach) {
        bestTV = cur.userData.tv;
        closestDist = intersects[0].distance;
        isDirectHit = true;
      }
    }

    // Angle fallback if looking directly at TV from close range
    if (!bestTV && activeTVs.length > 0) {
      const camDir = new THREE.Vector3();
      camera.getWorldDirection(camDir);

      activeTVs.forEach(tv => {
        const toTv = new THREE.Vector3().subVectors(tv.worldCenter, camera.position);
        const dist = toTv.length();
        toTv.normalize();
        const dot = camDir.dot(toTv);
        if (dot > 0.90 && dist <= 7.0 * s && dist < closestDist) {
          closestDist = dist;
          bestTV = tv;
          isDirectHit = false;
        }
      });
    }

    this.targetedTV = bestTV;
    this.isDirectHit = isDirectHit;
    this.targetedDistance = closestDist;
    this.promptLabel = bestTV
      ? `[E] ${bestTV.isOn ? 'Turn Off' : 'Turn On'} ${bestTV.name}`
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
    this.tvs.forEach(tv => {
      const isVisible = (filter === 'all') || (tv.floor === filter);
      tv.group.visible = isVisible;

      if (!isVisible && tv.isOn) {
        // Automatically pause video and mute sound when its floor is hidden
        if (tv.video) {
          try {
            tv.video.pause();
          } catch {}
        }
        if (tv.sound) {
          tv.sound.setVolume(0);
        }
      } else if (isVisible && tv.isOn && tv.hasVideo && tv.video) {
        // Resume playing when floor becomes visible again
        try {
          tv.video.play().catch(() => {});
        } catch {}
      }
    });
  }

  getRoot() {
    return this.rootGroup;
  }
}
