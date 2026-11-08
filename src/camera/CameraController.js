import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { WORLD_SCALE } from '../config/constants.js';

export const POV_MODES = {
  FIRST_PERSON: 'first_person',
  THIRD_PERSON_BACK: 'third_person_back',
  THIRD_PERSON_FRONT: 'third_person_front'
};

export const POV_LABELS = {
  first_person: 'First-Person',
  third_person_back: 'Third-Person (Back)',
  third_person_front: 'Third-Person (Front)'
};

export class CameraController {
  constructor(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;
    const s = WORLD_SCALE;

    this.isOrbitMode = false;
    this.modeChangeListeners = [];
    this.povChangeListeners = [];

    this.povModes = [
      POV_MODES.FIRST_PERSON,
      POV_MODES.THIRD_PERSON_BACK,
      POV_MODES.THIRD_PERSON_FRONT
    ];
    this.currentPOVIndex = 0;

    // Look target Object3D driven by PointerLockControls
    this.lookTarget = new THREE.Object3D();

    // 1. First-person pointer lock controls (controls lookTarget)
    const lockDom = typeof document !== 'undefined' ? document.body : this.domElement;
    this.fpControls = new PointerLockControls(this.lookTarget, lockDom);

    // 2. Orbit controls for dollhouse architectural overview
    this.orbitControls = new OrbitControls(this.camera, this.domElement);
    this.orbitControls.enableDamping = true;
    this.orbitControls.dampingFactor = 0.06;
    this.orbitControls.minDistance = 5 * s;
    this.orbitControls.maxDistance = 160 * s;

    // Allow polar angle to be 0 (looking straight down from above)
    this.orbitControls.minPolarAngle = 0;
    this.orbitControls.maxPolarAngle = Math.PI / 2 - 0.02;

    this.orbitControls.target.set(25 * s, 10 * s, -12 * s); // Center of 2-storey house plot
    this.orbitControls.enabled = false;

    // Reusable ray and vectors for camera boom collision clamping
    this._ray = new THREE.Ray();
    this._box3 = new THREE.Box3();
    this._hitVec = new THREE.Vector3();
  }

  getPOVMode() {
    return this.povModes[this.currentPOVIndex];
  }

  getPOVLabel() {
    return POV_LABELS[this.getPOVMode()];
  }

  cyclePOV() {
    // If in Orbit mode, switch to walk mode first
    if (this.isOrbitMode) {
      this.setMode(false);
      return this.getPOVLabel();
    }

    this.currentPOVIndex = (this.currentPOVIndex + 1) % this.povModes.length;
    const mode = this.getPOVMode();
    const label = this.getPOVLabel();
    this.povChangeListeners.forEach(cb => cb(mode, label));
    return label;
  }

  onPOVChange(callback) {
    this.povChangeListeners.push(callback);
  }

  getLookObject() {
    return this.lookTarget;
  }

  getYaw() {
    const euler = new THREE.Euler(0, 0, 0, 'YXZ');
    euler.setFromQuaternion(this.lookTarget.quaternion);
    return euler.y;
  }

  toggleMode(player) {
    this.setMode(!this.isOrbitMode, player);
  }

  setMode(orbitMode, player) {
    this.isOrbitMode = orbitMode;
    const s = WORLD_SCALE;

    if (this.isOrbitMode) {
      this.fpControls.unlock();
      this.orbitControls.enabled = true;

      // Position camera high above plot for dollhouse / bird's-eye architectural view
      this.camera.position.set(25 * s, 60 * s, 24 * s);
      this.orbitControls.target.set(25 * s, 10 * s, -12 * s);
      this.orbitControls.update();
    } else {
      this.orbitControls.enabled = false;

      // Restore camera & lookTarget to player's eye position
      if (player) {
        this.lookTarget.position.copy(player.position);
        this.camera.position.copy(player.position);
      }
      this.fpControls.lock();
    }

    this.modeChangeListeners.forEach(cb => cb(this.isOrbitMode));
  }

  update(player, delta, collisionSystem) {
    if (this.isOrbitMode) {
      this.orbitControls.update();
      return;
    }

    if (!player) return;
    const s = WORLD_SCALE;

    // Keep lookTarget synced to player's eye position
    this.lookTarget.position.copy(player.position);

    const mode = this.getPOVMode();

    if (mode === POV_MODES.FIRST_PERSON) {
      this.camera.position.copy(player.position);
      this.camera.quaternion.copy(this.lookTarget.quaternion);
    } else if (mode === POV_MODES.THIRD_PERSON_BACK) {
      // Third-person chase camera (behind player looking forward)
      const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(this.lookTarget.quaternion);
      const boomDir = forward.clone().negate();
      const defaultDist = 6.2 * s;
      const heightOffset = 0.40 * s;

      const eyePos = player.position.clone();
      const clampedDist = this.clampCameraBoom(eyePos, boomDir, defaultDist, collisionSystem, s);

      this.camera.position.copy(eyePos)
        .addScaledVector(boomDir, clampedDist)
        .add(new THREE.Vector3(0, heightOffset, 0));

      this.camera.quaternion.copy(this.lookTarget.quaternion);
    } else if (mode === POV_MODES.THIRD_PERSON_FRONT) {
      // Third-person selfie view (in front of player looking back at player)
      const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(this.lookTarget.quaternion);
      const boomDir = forward.clone();
      const defaultDist = 5.2 * s;
      const heightOffset = 0.35 * s;

      const eyePos = player.position.clone();
      const clampedDist = this.clampCameraBoom(eyePos, boomDir, defaultDist, collisionSystem, s);

      this.camera.position.copy(eyePos)
        .addScaledVector(boomDir, clampedDist)
        .add(new THREE.Vector3(0, heightOffset, 0));

      // Look back at player's chest / face
      this.camera.lookAt(player.position.x, player.position.y - 0.20 * s, player.position.z);
    }
  }

  clampCameraBoom(origin, direction, maxDistance, collisionSystem, s) {
    if (!collisionSystem || !collisionSystem.colliders) return maxDistance;

    let closestDist = maxDistance;
    this._ray.origin.copy(origin);
    this._ray.direction.copy(direction).normalize();

    const minClearance = 0.45 * s; // safety margin from walls

    for (const item of collisionSystem.colliders) {
      if (item.disabled) continue;

      const [xmin, xmax, ymin, ymax, zmin, zmax] = item.box;
      // Convert CAD coordinates to Three.js Box3: (xmin, zmin, -ymax) to (xmax, zmax, -ymin)
      this._box3.min.set(xmin, zmin, -ymax);
      this._box3.max.set(xmax, zmax, -ymin);

      const hit = this._ray.intersectBox(this._box3, this._hitVec);
      if (hit) {
        const dist = origin.distanceTo(hit);
        if (dist < closestDist) {
          closestDist = Math.max(minClearance, dist - minClearance);
        }
      }
    }

    return closestDist;
  }

  onModeChange(callback) {
    this.modeChangeListeners.push(callback);
  }
}
