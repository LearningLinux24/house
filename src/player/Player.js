import * as THREE from 'three';
import { PLAYER_CONFIG } from '../config/constants.js';

export class Player {
  constructor(spawnPoint, collisionSystem) {
    this.collision = collisionSystem;
    this.config = PLAYER_CONFIG;

    this.position = new THREE.Vector3(spawnPoint.x, spawnPoint.elev, -spawnPoint.y_spec);
    this.feetElevation = spawnPoint.elev;
    this.velocityY = 0;
    this.isGrounded = true;
  }

  update(delta, input, camera) {
    const dt = Math.min(delta, 0.05);
    const isMoving = input.keys.forward || input.keys.backward || input.keys.left || input.keys.right;
    const speed = input.keys.sprint ? this.config.speed * this.config.sprintMultiplier : this.config.speed;

    // 1. Jump initiation (only when grounded on solid floor)
    if (input.keys.jump && this.isGrounded) {
      this.velocityY = this.config.jumpForce;
      this.isGrounded = false;
    }

    // 2. Vertical air physics (gravity & velocity)
    if (!this.isGrounded) {
      this.velocityY -= this.config.gravity * dt;
      this.feetElevation += this.velocityY * dt;
    }

    // 3. Horizontal movement & wall collisions
    if (isMoving) {
      let moveX = 0;
      let moveZ = 0;

      if (input.keys.forward) moveZ -= 1;
      if (input.keys.backward) moveZ += 1;
      if (input.keys.left) moveX -= 1;
      if (input.keys.right) moveX += 1;

      const len = Math.hypot(moveX, moveZ);
      moveX /= len;
      moveZ /= len;

      // Extract horizontal camera yaw direction
      const euler = new THREE.Euler(0, 0, 0, 'YXZ');
      euler.setFromQuaternion(camera.quaternion);

      const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), euler.y);
      const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), euler.y);

      const moveDir = new THREE.Vector3()
        .addScaledVector(forward, -moveZ)
        .addScaledVector(right, moveX)
        .normalize();

      const totalDist = speed * dt;
      // Substepping: ensure each step moves less than player radius * 0.4 (~0.20 ft)
      // to completely eliminate tunneling through thin closed doors and walls during fast sprint
      const maxSubstepDist = this.config.radius * 0.40;
      const steps = Math.min(6, Math.max(1, Math.ceil(totalDist / maxSubstepDist)));
      const stepDt = dt / steps;

      for (let sIdx = 0; sIdx < steps; sIdx++) {
        const nextX = this.position.x + moveDir.x * speed * stepDt;
        const nextZ = this.position.z + moveDir.z * speed * stepDt;

        // Sample step elevation before confirming move
        const targetFloorElev = this.collision.getFloorElevation(nextX, nextZ, this.feetElevation);
        const elevDiff = targetFloorElev - this.feetElevation;

        // Allow stepping up risers within stepMaxHeight when grounded or jumping
        const canStep = this.isGrounded
          ? (elevDiff <= this.config.stepMaxHeight)
          : (elevDiff <= 0.6 * this.config.stepMaxHeight);

        if (canStep) {
          // Resolve horizontal wall collisions
          const [cleanX, cleanZ] = this.collision.resolveWallCollisions(
            nextX,
            nextZ,
            this.config.radius,
            this.feetElevation
          );

          this.position.x = cleanX;
          this.position.z = cleanZ;
        } else {
          // Stopped by vertical barrier higher than step clearance
          break;
        }
      }
    }

    // 4. Grounding & surface snapping
    const surfaceElev = this.collision.getFloorElevation(this.position.x, this.position.z, this.feetElevation);

    if (!this.isGrounded) {
      // Landing on floor
      if (this.feetElevation <= surfaceElev) {
        this.feetElevation = surfaceElev;
        this.velocityY = 0;
        this.isGrounded = true;
      }
    } else {
      // Smooth elevation tracking on slopes and stairs
      this.feetElevation += (surfaceElev - this.feetElevation) * this.config.groundSnapSpeed * dt;

      // Detect walking off a high ledge
      if (this.feetElevation - surfaceElev > this.config.stepMaxHeight) {
        this.isGrounded = false;
        this.velocityY = 0;
      }
    }

    // 5. Camera height is feet elevation + human eye height
    this.position.y = this.feetElevation + this.config.eyeHeight;
  }

  teleport(x, y_spec, elev) {
    this.position.x = x;
    this.position.z = -y_spec;
    this.feetElevation = elev;
    this.velocityY = 0;
    this.isGrounded = true;
    this.position.y = this.feetElevation + this.config.eyeHeight;
  }
}
