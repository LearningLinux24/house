import * as THREE from 'three';
import { PLAYER_CONFIG } from '../config/constants.js';

export class Player {
  constructor(spawnPoint, collisionSystem) {
    this.collision = collisionSystem;
    this.config = PLAYER_CONFIG;

    this.position = new THREE.Vector3(spawnPoint.x, spawnPoint.elev, -spawnPoint.y_spec);
    this.feetElevation = spawnPoint.elev;
  }

  update(delta, input, camera) {
    const isMoving = input.keys.forward || input.keys.backward || input.keys.left || input.keys.right;
    const speed = input.keys.sprint ? this.config.speed * this.config.sprintMultiplier : this.config.speed;

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

      const nextX = this.position.x + moveDir.x * speed * delta;
      const nextZ = this.position.z + moveDir.z * speed * delta;

      // Sample step elevation before confirming move (pass current elev for multi-floor)
      const targetElev = this.collision.getFloorElevation(nextX, nextZ, this.feetElevation);
      const elevDiff = targetElev - this.feetElevation;

      // Allow stepping up risers / stairs within stepMaxHeight
      if (elevDiff <= this.config.stepMaxHeight) {
        // Resolve horizontal wall collisions
        const [cleanX, cleanZ] = this.collision.resolveWallCollisions(
          nextX,
          nextZ,
          this.config.radius,
          this.feetElevation
        );

        this.position.x = cleanX;
        this.position.z = cleanZ;

        // Smooth elevation tracking
        const surfaceElev = this.collision.getFloorElevation(this.position.x, this.position.z, this.feetElevation);
        this.feetElevation += (surfaceElev - this.feetElevation) * this.config.groundSnapSpeed * delta;
      }
    } else {
      // Keep grounded when standing
      const surfaceElev = this.collision.getFloorElevation(this.position.x, this.position.z, this.feetElevation);
      this.feetElevation += (surfaceElev - this.feetElevation) * this.config.groundSnapSpeed * delta;
    }

    // Camera height is feet elevation + human eye height
    this.position.y = this.feetElevation + this.config.eyeHeight;
  }

  teleport(x, y_spec, elev) {
    this.position.x = x;
    this.position.z = -y_spec;
    this.feetElevation = elev;
    this.position.y = this.feetElevation + this.config.eyeHeight;
  }
}
