import * as THREE from 'three';
import { WORLD_SCALE } from '../config/constants.js';

export class PlayerAvatar {
  constructor(scene) {
    this.scene = scene;
    const s = WORLD_SCALE;

    this.rootGroup = new THREE.Group();
    this.rootGroup.name = 'PlayerAvatar';

    this.walkTimer = 0;
    this.idleTimer = 0;
    this.pose = 'standing'; // 'standing' | 'sitting' | 'sleeping'
    this.currentYaw = 0;

    // Materials
    this.skinMat = new THREE.MeshStandardMaterial({
      color: '#F0C8A0',
      roughness: 0.6,
      metalness: 0.0
    });
    this.hairMat = new THREE.MeshStandardMaterial({
      color: '#241913',
      roughness: 0.8,
      metalness: 0.0
    });
    this.jacketMat = new THREE.MeshStandardMaterial({
      color: '#283747',
      roughness: 0.65,
      metalness: 0.1
    });
    this.pantsMat = new THREE.MeshStandardMaterial({
      color: '#1B2631',
      roughness: 0.75,
      metalness: 0.05
    });
    this.shoeMat = new THREE.MeshStandardMaterial({
      color: '#EAECEE',
      roughness: 0.4,
      metalness: 0.0
    });
    this.accentMat = new THREE.MeshStandardMaterial({
      color: '#E74C3C',
      roughness: 0.5,
      metalness: 0.0
    });

    this.buildAvatar(s);

    this.rootGroup.visible = false; // hidden in First-Person by default
    this.scene.add(this.rootGroup);
  }

  buildAvatar(s) {
    // Proportions:
    // Human height: ~5.8 ft * s ≈ 7.83 units
    // Feet at Y = 0
    // Hip pivot at Y = 2.85 * s
    // Shoulder pivot at Y = 4.85 * s
    // Head center at Y = 5.50 * s

    // 1. Hips & Torso Parent
    this.hipsGroup = new THREE.Group();
    this.hipsGroup.position.set(0, 2.85 * s, 0);

    // Hips pelvis mesh
    const hipGeo = new THREE.BoxGeometry(1.05 * s, 0.40 * s, 0.65 * s);
    const hipMesh = new THREE.Mesh(hipGeo, this.pantsMat);
    hipMesh.castShadow = true;
    hipMesh.receiveShadow = true;
    this.hipsGroup.add(hipMesh);

    // Torso (Jacket/Hoodie)
    const torsoGeo = new THREE.BoxGeometry(1.25 * s, 1.85 * s, 0.72 * s);
    this.torsoMesh = new THREE.Mesh(torsoGeo, this.jacketMat);
    this.torsoMesh.position.set(0, 1.05 * s, 0);
    this.torsoMesh.castShadow = true;
    this.torsoMesh.receiveShadow = true;
    this.hipsGroup.add(this.torsoMesh);

    // Subtle collar / zipper accent
    const zipGeo = new THREE.BoxGeometry(0.08 * s, 1.80 * s, 0.74 * s);
    const zipMesh = new THREE.Mesh(zipGeo, this.accentMat);
    zipMesh.position.set(0, 1.05 * s, 0);
    this.hipsGroup.add(zipMesh);

    // 2. Neck & Head
    const neckGeo = new THREE.CylinderGeometry(0.16 * s, 0.16 * s, 0.22 * s, 12);
    const neckMesh = new THREE.Mesh(neckGeo, this.skinMat);
    neckMesh.position.set(0, 2.05 * s, 0);
    neckMesh.castShadow = true;
    this.hipsGroup.add(neckMesh);

    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 2.45 * s, 0);

    // Face / Head mesh
    const headGeo = new THREE.BoxGeometry(0.65 * s, 0.75 * s, 0.65 * s);
    const headMesh = new THREE.Mesh(headGeo, this.skinMat);
    headMesh.castShadow = true;
    this.headGroup.add(headMesh);

    // Hair cap
    const hairGeo = new THREE.BoxGeometry(0.70 * s, 0.35 * s, 0.70 * s);
    const hairMesh = new THREE.Mesh(hairGeo, this.hairMat);
    hairMesh.position.set(0, 0.28 * s, -0.02 * s);
    hairMesh.castShadow = true;
    this.headGroup.add(hairMesh);

    // Modern sunglasses / stylized eye visor (facing forward along -Z)
    const visorGeo = new THREE.BoxGeometry(0.55 * s, 0.14 * s, 0.12 * s);
    const visorMat = new THREE.MeshStandardMaterial({ color: '#111111', roughness: 0.1, metalness: 0.9 });
    const visorMesh = new THREE.Mesh(visorGeo, visorMat);
    visorMesh.position.set(0, 0.05 * s, -0.32 * s);
    this.headGroup.add(visorMesh);

    this.hipsGroup.add(this.headGroup);

    // 3. Arms (Pivots at shoulders)
    this.leftArmGroup = new THREE.Group();
    this.leftArmGroup.position.set(-0.76 * s, 1.80 * s, 0);

    const armGeo = new THREE.BoxGeometry(0.32 * s, 1.65 * s, 0.34 * s);
    const leftArmMesh = new THREE.Mesh(armGeo, this.jacketMat);
    leftArmMesh.position.set(0, -0.75 * s, 0);
    leftArmMesh.castShadow = true;
    this.leftArmGroup.add(leftArmMesh);

    // Hand
    const handGeo = new THREE.BoxGeometry(0.26 * s, 0.30 * s, 0.26 * s);
    const leftHandMesh = new THREE.Mesh(handGeo, this.skinMat);
    leftHandMesh.position.set(0, -1.65 * s, 0);
    this.leftArmGroup.add(leftHandMesh);

    this.hipsGroup.add(this.leftArmGroup);

    // Right Arm
    this.rightArmGroup = new THREE.Group();
    this.rightArmGroup.position.set(0.76 * s, 1.80 * s, 0);

    const rightArmMesh = new THREE.Mesh(armGeo, this.jacketMat);
    rightArmMesh.position.set(0, -0.75 * s, 0);
    rightArmMesh.castShadow = true;
    this.rightArmGroup.add(rightArmMesh);

    const rightHandMesh = new THREE.Mesh(handGeo, this.skinMat);
    rightHandMesh.position.set(0, -1.65 * s, 0);
    this.rightArmGroup.add(rightHandMesh);

    this.hipsGroup.add(this.rightArmGroup);

    this.rootGroup.add(this.hipsGroup);

    // 4. Legs (Pivots at hip bottom)
    const legGeo = new THREE.BoxGeometry(0.42 * s, 2.65 * s, 0.44 * s);
    const footGeo = new THREE.BoxGeometry(0.40 * s, 0.22 * s, 0.65 * s);

    // Left Leg
    this.leftLegGroup = new THREE.Group();
    this.leftLegGroup.position.set(-0.32 * s, 2.75 * s, 0);

    const leftLegMesh = new THREE.Mesh(legGeo, this.pantsMat);
    leftLegMesh.position.set(0, -1.30 * s, 0);
    leftLegMesh.castShadow = true;
    this.leftLegGroup.add(leftLegMesh);

    const leftFootMesh = new THREE.Mesh(footGeo, this.shoeMat);
    leftFootMesh.position.set(0, -2.62 * s, -0.10 * s);
    leftFootMesh.castShadow = true;
    this.leftLegGroup.add(leftFootMesh);

    this.rootGroup.add(this.leftLegGroup);

    // Right Leg
    this.rightLegGroup = new THREE.Group();
    this.rightLegGroup.position.set(0.32 * s, 2.75 * s, 0);

    const rightLegMesh = new THREE.Mesh(legGeo, this.pantsMat);
    rightLegMesh.position.set(0, -1.30 * s, 0);
    rightLegMesh.castShadow = true;
    this.rightLegGroup.add(rightLegMesh);

    const rightFootMesh = new THREE.Mesh(footGeo, this.shoeMat);
    rightFootMesh.position.set(0, -2.62 * s, -0.10 * s);
    rightFootMesh.castShadow = true;
    this.rightLegGroup.add(rightFootMesh);

    this.rootGroup.add(this.rightLegGroup);
  }

  setPose(pose) {
    this.pose = pose;
  }

  update(delta, playerPos, feetElev, cameraYaw, isMoving, povMode, isOrbitMode) {
    const s = WORLD_SCALE;

    // Visibility management:
    // Avatar is visible in Third-Person Back, Third-Person Front, and in Dollhouse Orbit View
    const shouldBeVisible = isOrbitMode || povMode !== 'first_person';
    this.rootGroup.visible = shouldBeVisible;

    if (!shouldBeVisible) return;

    // Update position
    this.rootGroup.position.set(playerPos.x, feetElev, playerPos.z);

    // Orientation:
    // Forward direction in Three.js is -Z; avatar faces cameraYaw
    this.currentYaw = cameraYaw;
    this.rootGroup.rotation.y = this.currentYaw;

    // Walking / Idle / Sitting / Sleeping Animations
    if (this.pose === 'sitting') {
      this.hipsGroup.position.y = 1.90 * s;
      this.leftLegGroup.position.y = 1.85 * s;
      this.rightLegGroup.position.y = 1.85 * s;
      this.leftLegGroup.rotation.x = -Math.PI / 2;
      this.rightLegGroup.rotation.x = -Math.PI / 2;
      this.leftArmGroup.rotation.x = -Math.PI / 3;
      this.rightArmGroup.rotation.x = -Math.PI / 3;
    } else if (this.pose === 'sleeping') {
      this.rootGroup.rotation.x = -Math.PI / 2;
      this.leftLegGroup.rotation.x = 0;
      this.rightLegGroup.rotation.x = 0;
      this.leftArmGroup.rotation.x = 0;
      this.rightArmGroup.rotation.x = 0;
    } else {
      this.rootGroup.rotation.x = 0;
      this.hipsGroup.position.y = 2.85 * s;
      this.leftLegGroup.position.y = 2.75 * s;
      this.rightLegGroup.position.y = 2.75 * s;

      if (isMoving) {
        this.walkTimer += delta * 9.5;
        const swing = Math.sin(this.walkTimer) * 0.65;
        this.leftLegGroup.rotation.x = swing;
        this.rightLegGroup.rotation.x = -swing;
        this.leftArmGroup.rotation.x = -swing * 0.75;
        this.rightArmGroup.rotation.x = swing * 0.75;

        // Slight natural bobbing while walking
        this.hipsGroup.position.y = 2.85 * s + Math.abs(Math.sin(this.walkTimer * 2)) * 0.04 * s;
      } else {
        this.idleTimer += delta;
        // Smooth return to resting stance
        this.leftLegGroup.rotation.x = THREE.MathUtils.lerp(this.leftLegGroup.rotation.x, 0, delta * 10);
        this.rightLegGroup.rotation.x = THREE.MathUtils.lerp(this.rightLegGroup.rotation.x, 0, delta * 10);
        this.leftArmGroup.rotation.x = THREE.MathUtils.lerp(this.leftArmGroup.rotation.x, 0, delta * 10);
        this.rightArmGroup.rotation.x = THREE.MathUtils.lerp(this.rightArmGroup.rotation.x, 0, delta * 10);

        // Breathing animation
        this.hipsGroup.position.y = 2.85 * s + Math.sin(this.idleTimer * 2.2) * 0.015 * s;
      }
    }
  }
}
