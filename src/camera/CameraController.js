import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class CameraController {
  constructor(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;

    this.isOrbitMode = false;
    this.modeChangeListeners = [];

    // 1. First-person pointer lock controls
    this.fpControls = new PointerLockControls(this.camera, document.body);

    // 2. Orbit controls for dollhouse architectural overview
    this.orbitControls = new OrbitControls(this.camera, this.domElement);
    this.orbitControls.enableDamping = true;
    this.orbitControls.dampingFactor = 0.06;
    this.orbitControls.minDistance = 5;
    this.orbitControls.maxDistance = 140;

    // Allow polar angle to be 0 (looking straight down from above)
    this.orbitControls.minPolarAngle = 0;
    this.orbitControls.maxPolarAngle = Math.PI / 2 - 0.02;

    this.orbitControls.target.set(25, 10, -12); // Center of 2-storey house plot
    this.orbitControls.enabled = false;
  }

  toggleMode(player) {
    this.setMode(!this.isOrbitMode, player);
  }

  setMode(orbitMode, player) {
    this.isOrbitMode = orbitMode;

    if (this.isOrbitMode) {
      this.fpControls.unlock();
      this.orbitControls.enabled = true;

      // Position camera high above plot for dollhouse / bird's-eye architectural view
      this.camera.position.set(25, 60, 24);
      this.orbitControls.target.set(25, 10, -12);
      this.orbitControls.update();
    } else {
      this.orbitControls.enabled = false;

      // Restore camera to player's eye position
      if (player) {
        this.camera.position.copy(player.position);
        this.camera.lookAt(player.position.x + 6, player.position.y, player.position.z);
      }
      this.fpControls.lock();
    }

    this.modeChangeListeners.forEach(cb => cb(this.isOrbitMode));
  }

  update() {
    if (this.isOrbitMode) {
      this.orbitControls.update();
    }
  }

  onModeChange(callback) {
    this.modeChangeListeners.push(callback);
  }
}
