/**
 * CameraController — First-Person, Third-Person Back, Third-Person Front, and Orbit Dollhouse.
 *
 * Key design decisions:
 *  - PointerLockControls is attached directly to the REAL camera (not a proxy).
 *    This gives us correct pitch clamping, event handling, and lock/unlock behaviour.
 *  - In first-person: camera IS the view — stays at player's eye position.
 *  - In third-person: we save camera pitch/yaw before repositioning, compute boom
 *    position behind/in front of avatar, and restore the look direction.
 *  - In orbit: OrbitControls takes over entirely.
 *  - Camera boom does soft collision clamping against wall colliders so it never
 *    clips through geometry.
 */

import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { WORLD_SCALE } from '../config/constants.js';

export const POV_MODES = {
  FIRST_PERSON:       'first_person',
  THIRD_PERSON_BACK:  'third_person_back',
  THIRD_PERSON_FRONT: 'third_person_front',
};

export const POV_LABELS = {
  first_person:       '🎮 First-Person',
  third_person_back:  '📷 Third-Person (Back)',
  third_person_front: '🤳 Third-Person (Front)',
};

const BOOM_BACK_DIST  = 5.5 * WORLD_SCALE; // Camera distance behind avatar (3rd-person back)
const BOOM_BACK_HEIGHT = 1.5 * WORLD_SCALE; // Camera height above avatar eyes
const BOOM_FRONT_DIST  = 4.5 * WORLD_SCALE; // Camera distance in front (selfie)
const BOOM_FRONT_HEIGHT = 0.8 * WORLD_SCALE; // Height above eye for front view
const BOOM_MIN_CLEARANCE = 0.4 * WORLD_SCALE; // Minimum gap from walls

export class CameraController {
  constructor(camera, domElement) {
    this.camera     = camera;
    this.domElement = domElement;
    const s = WORLD_SCALE;

    this.isOrbitMode = false;
    this.modeChangeListeners = [];
    this.povChangeListeners  = [];

    this.povModes = [
      POV_MODES.FIRST_PERSON,
      POV_MODES.THIRD_PERSON_BACK,
      POV_MODES.THIRD_PERSON_FRONT,
    ];
    this.currentPOVIndex = 0;

    // ── PointerLockControls on the actual camera ──────────────────────────
    const lockDom = typeof document !== 'undefined' ? document.body : domElement;
    this.fpControls = new PointerLockControls(this.camera, lockDom);

    // ── OrbitControls for dollhouse view ─────────────────────────────────
    this.orbitControls = new OrbitControls(this.camera, this.domElement);
    this.orbitControls.enableDamping    = true;
    this.orbitControls.dampingFactor    = 0.06;
    this.orbitControls.minDistance      = 5  * s;
    this.orbitControls.maxDistance      = 160 * s;
    this.orbitControls.minPolarAngle    = 0;
    this.orbitControls.maxPolarAngle    = Math.PI / 2 - 0.02;
    this.orbitControls.target.set(25 * s, 10 * s, -12 * s);
    this.orbitControls.enabled          = false;

    // ── Reusable scratch objects ─────────────────────────────────────────
    this._fwd   = new THREE.Vector3();
    this._ray   = new THREE.Ray();
    this._box3  = new THREE.Box3();
    this._hit   = new THREE.Vector3();
  }

  // ── POV accessors ─────────────────────────────────────────────────────────
  getPOVMode()  { return this.povModes[this.currentPOVIndex]; }
  getPOVLabel() { return POV_LABELS[this.getPOVMode()]; }

  /**
   * Returns the horizontal (yaw) angle of the camera.
   * Used for minimap direction, avatar orientation, movement direction.
   */
  getYaw() {
    const euler = new THREE.Euler(0, 0, 0, 'YXZ');
    euler.setFromQuaternion(this.camera.quaternion);
    return euler.y;
  }

  /**
   * Cycle through POV modes. Returns human-readable label of new mode.
   */
  cyclePOV() {
    if (this.isOrbitMode) {
      this.setMode(false);
      return this.getPOVLabel();
    }
    this.currentPOVIndex = (this.currentPOVIndex + 1) % this.povModes.length;
    const label = this.getPOVLabel();
    this.povChangeListeners.forEach(cb => cb(this.getPOVMode(), label));
    return label;
  }

  onPOVChange(cb)   { this.povChangeListeners.push(cb); }
  onModeChange(cb)  { this.modeChangeListeners.push(cb); }

  // ── Mode switching ────────────────────────────────────────────────────────
  toggleMode(player) { this.setMode(!this.isOrbitMode, player); }

  setMode(orbitMode, player) {
    this.isOrbitMode = orbitMode;
    const s = WORLD_SCALE;

    if (this.isOrbitMode) {
      this.fpControls.unlock();
      this.orbitControls.enabled = true;
      this.camera.position.set(25 * s, 60 * s, 24 * s);
      this.orbitControls.target.set(25 * s, 10 * s, -12 * s);
      this.orbitControls.update();
    } else {
      this.orbitControls.enabled = false;
      if (player) {
        this.camera.position.copy(player.position);
      }
      this.fpControls.lock();
    }
    this.modeChangeListeners.forEach(cb => cb(this.isOrbitMode));
  }

  // ── Per-frame update ──────────────────────────────────────────────────────
  /**
   * @param {Player}          player           — current player state
   * @param {number}          delta            — frame delta (seconds)
   * @param {CollisionSystem} collisionSystem  — for boom wall clamping
   */
  update(player, delta, collisionSystem) {
    if (this.isOrbitMode) {
      this.orbitControls.update();
      return;
    }
    if (!player) return;

    const mode   = this.getPOVMode();
    const eyePos = player.position; // y = feetElev + eyeHeight

    if (mode === POV_MODES.FIRST_PERSON) {
      // Camera sits exactly at player's eye. PointerLockControls already
      // handles rotation — just keep position in sync.
      this.camera.position.copy(eyePos);

    } else if (mode === POV_MODES.THIRD_PERSON_BACK) {
      // ── Chase cam (behind + above) ──────────────────────────────────────
      // Boom vector: start from eye, go backwards along camera's -forward (= camera's +Z)
      this._fwd.set(0, 0, 1).applyQuaternion(this.camera.quaternion); // camera's backward
      this._fwd.y = 0;
      this._fwd.normalize();

      const dist = this._clampBoom(
        eyePos, this._fwd, BOOM_BACK_DIST, collisionSystem
      );

      this.camera.position.set(
        eyePos.x + this._fwd.x * dist,
        eyePos.y + BOOM_BACK_HEIGHT,
        eyePos.z + this._fwd.z * dist
      );
      // Look at the avatar's upper body / head level
      this.camera.lookAt(eyePos.x, eyePos.y - 0.3 * WORLD_SCALE, eyePos.z);

    } else if (mode === POV_MODES.THIRD_PERSON_FRONT) {
      // ── Selfie / face cam (in front of player) ───────────────────────────
      this._fwd.set(0, 0, -1).applyQuaternion(this.camera.quaternion); // camera's forward
      this._fwd.y = 0;
      this._fwd.normalize();

      const dist = this._clampBoom(
        eyePos, this._fwd, BOOM_FRONT_DIST, collisionSystem
      );

      this.camera.position.set(
        eyePos.x + this._fwd.x * dist,
        eyePos.y + BOOM_FRONT_HEIGHT,
        eyePos.z + this._fwd.z * dist
      );
      // Look back toward player face
      this.camera.lookAt(eyePos.x, eyePos.y + 0.1 * WORLD_SCALE, eyePos.z);
    }
  }

  // ── Boom wall-clamp ───────────────────────────────────────────────────────
  _clampBoom(origin, direction, maxDist, collisionSystem) {
    if (!collisionSystem?.colliders) return maxDist;

    let best = maxDist;

    this._ray.origin.copy(origin);
    this._ray.direction.copy(direction).normalize();

    for (const item of collisionSystem.colliders) {
      if (item.disabled) continue;
      const [xmin, xmax, ymin, ymax, zmin, zmax] = item.box;
      this._box3.min.set(xmin, zmin, -ymax);
      this._box3.max.set(xmax, zmax, -ymin);

      if (this._ray.intersectBox(this._box3, this._hit)) {
        const d = origin.distanceTo(this._hit);
        if (d < best) {
          best = Math.max(BOOM_MIN_CLEARANCE, d - BOOM_MIN_CLEARANCE);
        }
      }
    }
    return best;
  }
}
