/**
 * PlayerAvatar — Block-style 3D character model for 3rd-person / orbit views.
 *
 * Skeleton hierarchy (all positions local to parent):
 *
 *   rootGroup  (world feet position)
 *     ├── bodyGroup  (Y=0 relative to feet; contains full character)
 *     │     ├── pelvisGroup  (Y = HIP_Y)  — sways/bobs
 *     │     │     ├── pelvisMesh
 *     │     │     ├── torsoMesh
 *     │     │     ├── neckMesh
 *     │     │     ├── headGroup
 *     │     │     ├── leftArmGroup  (pivot at left shoulder)
 *     │     │     └── rightArmGroup (pivot at right shoulder)
 *     │     ├── leftLegGroup  (pivot at left hip joint, Y = HIP_Y)
 *     │     └── rightLegGroup (pivot at right hip joint, Y = HIP_Y)
 *
 * This keeps legs firmly anchored at hip-pivot height, so body bobbing
 * never separates torso from legs.
 */

import * as THREE from 'three';
import { WORLD_SCALE } from '../config/constants.js';

const s = WORLD_SCALE;

// ── Proportions (all in ft before WORLD_SCALE) ──────────────────────────────
// Total standing height ≈ 5.8 ft  →  5.8 * s world units
const TOTAL_H  = 5.8 * s;
const HIP_Y    = 2.80 * s;   // Height of hip joint from feet (ground)
const KNEE_H   = 1.40 * s;   // Length from hip to knee
const SHIN_H   = 1.40 * s;   // Length from knee to ankle
const FOOT_L   = 0.55 * s;   // Foot length fore/aft
const FOOT_H   = 0.18 * s;   // Foot thickness
const TORSO_H  = 1.80 * s;   // Height of torso box (hip→shoulder)
const NECK_H   = 0.22 * s;
const HEAD_H   = 0.68 * s;
const ARM_ULEN = 0.80 * s;   // Upper arm length (shoulder→elbow)
const ARM_LLEN = 0.75 * s;   // Forearm length  (elbow→wrist)
const HAND_H   = 0.28 * s;

const LEG_W    = 0.42 * s;
const LEG_D    = 0.42 * s;
const ARM_W    = 0.32 * s;
const ARM_D    = 0.32 * s;
const TORSO_W  = 1.20 * s;
const TORSO_D  = 0.68 * s;
const HEAD_W   = 0.64 * s;

export class PlayerAvatar {
  constructor(scene) {
    this.scene = scene;

    this.rootGroup = new THREE.Group();
    this.rootGroup.name = 'PlayerAvatar';

    this.walkTimer  = 0;
    this.idleTimer  = 0;
    this.pose = 'standing';

    this._buildMaterials();
    this._buildSkeleton();

    this.rootGroup.visible = false;
    scene.add(this.rootGroup);
  }

  // ── Materials ──────────────────────────────────────────────────────────────
  _buildMaterials() {
    this.mat = {
      skin: new THREE.MeshStandardMaterial({ color: '#F2C98A', roughness: 0.65 }),
      hair: new THREE.MeshStandardMaterial({ color: '#1A0F05', roughness: 0.85 }),
      jacket: new THREE.MeshStandardMaterial({ color: '#2C3E50', roughness: 0.70, metalness: 0.05 }),
      pants: new THREE.MeshStandardMaterial({ color: '#1A252F', roughness: 0.80 }),
      shoe: new THREE.MeshStandardMaterial({ color: '#D5D8DC', roughness: 0.45, metalness: 0.05 }),
      shoe_sole: new THREE.MeshStandardMaterial({ color: '#808B96', roughness: 0.6 }),
      accent: new THREE.MeshStandardMaterial({ color: '#E74C3C', roughness: 0.6 }),
      visor: new THREE.MeshStandardMaterial({ color: '#0A0A0A', roughness: 0.05, metalness: 0.95 }),
    };
  }

  _mesh(geo, mat, cast = true) {
    const m = new THREE.Mesh(geo, mat);
    m.castShadow  = cast;
    m.receiveShadow = cast;
    return m;
  }

  // ── Skeleton ──────────────────────────────────────────────────────────────
  _buildSkeleton() {
    // All positioned relative to rootGroup origin (= world feet / ground level)

    this.bodyGroup = new THREE.Group();
    this.bodyGroup.name = 'Body';
    this.rootGroup.add(this.bodyGroup);

    this._buildPelvisAndTorso();
    this._buildLegs();
  }

  _buildPelvisAndTorso() {
    // pelvisGroup pivot sits at hip height
    this.pelvisGroup = new THREE.Group();
    this.pelvisGroup.name = 'Pelvis';
    this.pelvisGroup.position.y = HIP_Y;
    this.bodyGroup.add(this.pelvisGroup);

    // ── Pelvis block ──
    const pelvis = this._mesh(new THREE.BoxGeometry(TORSO_W * 0.9, 0.38 * s, TORSO_D * 0.9), this.mat.pants);
    // Centre of pelvis is AT hip-joint Y (pivot), so pelvis straddles pivot:
    pelvis.position.y = 0;
    this.pelvisGroup.add(pelvis);

    // ── Torso ──
    this.torsoGroup = new THREE.Group();
    this.torsoGroup.name = 'Torso';
    this.torsoGroup.position.y = TORSO_H / 2 + 0.19 * s; // bottom of torso at pelvis centre
    this.pelvisGroup.add(this.torsoGroup);

    const torso = this._mesh(new THREE.BoxGeometry(TORSO_W, TORSO_H, TORSO_D), this.mat.jacket);
    this.torsoGroup.add(torso);

    // Zip accent stripe
    const zip = this._mesh(new THREE.BoxGeometry(0.07 * s, TORSO_H, TORSO_D + 0.01), this.mat.accent);
    this.torsoGroup.add(zip);

    // ── Neck ──
    const neckY = TORSO_H / 2 + NECK_H / 2;
    const neck = this._mesh(new THREE.CylinderGeometry(0.15 * s, 0.15 * s, NECK_H, 10), this.mat.skin);
    neck.position.y = neckY;
    this.torsoGroup.add(neck);

    // ── Head ──
    this.headGroup = new THREE.Group();
    this.headGroup.name = 'Head';
    this.headGroup.position.y = neckY + NECK_H / 2 + HEAD_H / 2;
    this.torsoGroup.add(this.headGroup);

    const head = this._mesh(new THREE.BoxGeometry(HEAD_W, HEAD_H, HEAD_W * 0.95), this.mat.skin);
    this.headGroup.add(head);

    // Hair
    const hair = this._mesh(new THREE.BoxGeometry(HEAD_W + 0.04 * s, HEAD_H * 0.38, HEAD_W + 0.04 * s), this.mat.hair);
    hair.position.y = HEAD_H * 0.31;
    hair.position.z = -0.015 * s;
    this.headGroup.add(hair);

    // Ears
    [-1, 1].forEach(side => {
      const ear = this._mesh(new THREE.BoxGeometry(0.08 * s, 0.22 * s, 0.12 * s), this.mat.skin);
      ear.position.set(side * (HEAD_W / 2 + 0.04 * s), 0, 0);
      this.headGroup.add(ear);
    });

    // Visor / sunglasses (facing camera-forward = -Z in model space)
    const visor = this._mesh(new THREE.BoxGeometry(HEAD_W * 0.80, 0.12 * s, 0.10 * s), this.mat.visor);
    visor.position.set(0, HEAD_H * 0.08, -(HEAD_W * 0.95) / 2 - 0.02 * s);
    this.headGroup.add(visor);

    // ── Arms ──
    this._buildArm('left',  -1);
    this._buildArm('right', +1);
  }

  _buildArm(side, sign) {
    const shoulderX = sign * (TORSO_W / 2 + ARM_W * 0.55);
    const shoulderY = TORSO_H / 2 - ARM_ULEN * 0.1; // top of torso

    const armGroup = new THREE.Group();
    armGroup.name = `${side}Arm`;
    armGroup.position.set(shoulderX, shoulderY, 0);
    this.torsoGroup.add(armGroup);

    // Upper arm — hangs down from shoulder pivot
    const uArm = this._mesh(new THREE.BoxGeometry(ARM_W, ARM_ULEN, ARM_D), this.mat.jacket);
    uArm.position.y = -ARM_ULEN / 2;
    armGroup.add(uArm);

    // Elbow pivot
    const elbowGroup = new THREE.Group();
    elbowGroup.name = `${side}Elbow`;
    elbowGroup.position.y = -ARM_ULEN;
    armGroup.add(elbowGroup);

    // Forearm
    const lArm = this._mesh(new THREE.BoxGeometry(ARM_W * 0.90, ARM_LLEN, ARM_D * 0.90), this.mat.jacket);
    lArm.position.y = -ARM_LLEN / 2;
    elbowGroup.add(lArm);

    // Hand
    const hand = this._mesh(new THREE.BoxGeometry(ARM_W * 0.85, HAND_H, ARM_D * 0.85), this.mat.skin);
    hand.position.y = -ARM_LLEN - HAND_H / 2;
    elbowGroup.add(hand);

    if (side === 'left') {
      this.leftArmGroup  = armGroup;
      this.leftElbowGroup = elbowGroup;
    } else {
      this.rightArmGroup  = armGroup;
      this.rightElbowGroup = elbowGroup;
    }
  }

  _buildLegs() {
    this._buildLeg('left',  -1);
    this._buildLeg('right', +1);
  }

  _buildLeg(side, sign) {
    const hipX = sign * (TORSO_W * 0.28);

    // Hip pivot — same height as pelvisGroup pivot in bodyGroup space
    const legGroup = new THREE.Group();
    legGroup.name = `${side}Leg`;
    legGroup.position.set(hipX, HIP_Y, 0);
    this.bodyGroup.add(legGroup);   // child of bodyGroup, NOT pelvisGroup

    // Upper leg (thigh) — hangs from hip pivot
    const thigh = this._mesh(new THREE.BoxGeometry(LEG_W, KNEE_H, LEG_D), this.mat.pants);
    thigh.position.y = -KNEE_H / 2;
    legGroup.add(thigh);

    // Knee pivot
    const kneeGroup = new THREE.Group();
    kneeGroup.name = `${side}Knee`;
    kneeGroup.position.y = -KNEE_H;
    legGroup.add(kneeGroup);

    // Shin
    const shin = this._mesh(new THREE.BoxGeometry(LEG_W * 0.88, SHIN_H, LEG_D * 0.88), this.mat.pants);
    shin.position.y = -SHIN_H / 2;
    kneeGroup.add(shin);

    // Ankle / Foot
    const ankleY = -SHIN_H;
    const foot = this._mesh(new THREE.BoxGeometry(LEG_W * 0.90, FOOT_H, FOOT_L), this.mat.shoe);
    foot.position.set(0, ankleY - FOOT_H / 2, -FOOT_L * 0.15);
    kneeGroup.add(foot);

    // Sole stripe
    const sole = this._mesh(new THREE.BoxGeometry(LEG_W * 0.90, FOOT_H * 0.30, FOOT_L), this.mat.shoe_sole);
    sole.position.set(0, ankleY - FOOT_H * 0.85, -FOOT_L * 0.15);
    kneeGroup.add(sole);

    if (side === 'left') {
      this.leftLegGroup   = legGroup;
      this.leftKneeGroup  = kneeGroup;
    } else {
      this.rightLegGroup  = legGroup;
      this.rightKneeGroup = kneeGroup;
    }
  }

  // ── Pose setters ──────────────────────────────────────────────────────────
  setPose(pose) {
    this.pose = pose;
    this.walkTimer = 0;
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  _lerpRot(group, axis, target, dt, speed = 12) {
    group.rotation[axis] = THREE.MathUtils.lerp(group.rotation[axis], target, Math.min(1, dt * speed));
  }

  _resetStanding(dt) {
    // Smoothly return all limbs to neutral standing pose
    ['x', 'z'].forEach(ax => {
      this._lerpRot(this.leftLegGroup,  ax, 0, dt);
      this._lerpRot(this.rightLegGroup, ax, 0, dt);
      this._lerpRot(this.leftKneeGroup, ax, 0, dt);
      this._lerpRot(this.rightKneeGroup,ax, 0, dt);
      this._lerpRot(this.leftArmGroup,  ax, 0, dt);
      this._lerpRot(this.rightArmGroup, ax, 0, dt);
      this._lerpRot(this.leftElbowGroup, ax, 0, dt);
      this._lerpRot(this.rightElbowGroup,ax, 0, dt);
      this._lerpRot(this.pelvisGroup,   ax, 0, dt);
      this._lerpRot(this.headGroup,     ax, 0, dt);
    });
    // Pelvis Y bob back to HIP_Y
    this.pelvisGroup.position.y = THREE.MathUtils.lerp(
      this.pelvisGroup.position.y, HIP_Y, Math.min(1, dt * 12)
    );
  }

  // ── Main update ───────────────────────────────────────────────────────────
  update(delta, playerPos, feetElev, cameraYaw, isMoving, povMode, isOrbitMode) {
    // Visibility: hidden in first-person walk, visible in 3rd person or orbit
    const shouldBeVisible = isOrbitMode || povMode !== 'first_person';
    this.rootGroup.visible = shouldBeVisible;
    if (!shouldBeVisible) return;

    const dt = Math.min(delta, 0.05);

    // Root at feet / ground level, facing camera yaw
    this.rootGroup.position.set(playerPos.x, feetElev, playerPos.z);
    this.rootGroup.rotation.set(0, cameraYaw, 0);

    if (this.pose === 'sleeping') {
      this._animateSleeping(dt);
    } else if (this.pose === 'sitting') {
      this._animateSitting(dt);
    } else {
      if (isMoving) {
        this._animateWalk(dt);
      } else {
        this._animateIdle(dt);
      }
    }
  }

  _animateWalk(dt) {
    this.idleTimer = 0;
    this.walkTimer += dt * 8.5;  // cadence
    const t = this.walkTimer;

    // Hip bob and lateral sway — applied to bodyGroup (keeps legs+torso together)
    const bob  = Math.abs(Math.sin(t * 2)) * 0.03 * s;
    const sway = Math.sin(t) * 0.015 * s;
    this.bodyGroup.position.y  = bob;
    this.bodyGroup.position.x  = sway;

    // Hips twist (counter-rotation of pelvis vs legs)
    this.pelvisGroup.rotation.y = Math.sin(t) * 0.08;

    // Leg swings — from hip pivot
    const legSwing = Math.sin(t) * 0.60;
    this.leftLegGroup.rotation.x   =  legSwing;
    this.rightLegGroup.rotation.x  = -legSwing;

    // Knee bend on back-swing leg (only bends when swinging backward)
    const lKneeBend = Math.max(0, Math.sin(t + Math.PI * 0.5)) * 0.70;
    const rKneeBend = Math.max(0, Math.sin(t + Math.PI * 1.5)) * 0.70;
    this.leftKneeGroup.rotation.x  = -lKneeBend;
    this.rightKneeGroup.rotation.x = -rKneeBend;

    // Arm swing (opposite to legs, natural gait)
    const armSwing = Math.sin(t) * 0.55;
    this.leftArmGroup.rotation.x   = -armSwing;
    this.rightArmGroup.rotation.x  =  armSwing;

    // Slight elbow bend matching arm swing
    this.leftElbowGroup.rotation.x  = Math.max(0, -armSwing) * 0.4;
    this.rightElbowGroup.rotation.x = Math.max(0, armSwing)  * 0.4;

    // Slight head bob
    this.headGroup.rotation.x = Math.sin(t * 2) * 0.03;
  }

  _animateIdle(dt) {
    this.walkTimer = 0;
    this.idleTimer += dt;
    const t = this.idleTimer;

    // Reset body sway
    this.bodyGroup.position.y = THREE.MathUtils.lerp(this.bodyGroup.position.y, 0, dt * 8);
    this.bodyGroup.position.x = THREE.MathUtils.lerp(this.bodyGroup.position.x, 0, dt * 8);

    // Breathing — slow chest rise/fall via pelvis bob
    const breathe = Math.sin(t * 1.8) * 0.008 * s;
    this.pelvisGroup.position.y = HIP_Y + breathe;

    // Reset all limb rotations smoothly
    this._resetStanding(dt);

    // Very slight idle arm sway
    const idleSway = Math.sin(t * 0.9) * 0.04;
    this.leftArmGroup.rotation.z  =  idleSway;
    this.rightArmGroup.rotation.z = -idleSway;
  }

  _animateSitting(dt) {
    // Hips drop, thighs horizontal, knees bent 90°, arms rest on thighs
    const targetPelvisY = HIP_Y * 0.65;
    this.pelvisGroup.position.y = THREE.MathUtils.lerp(
      this.pelvisGroup.position.y, targetPelvisY, dt * 10
    );
    // Legs: thigh horizontal (90°), knee bent back
    this._lerpRot(this.leftLegGroup,   'x', -Math.PI / 2, dt, 10);
    this._lerpRot(this.rightLegGroup,  'x', -Math.PI / 2, dt, 10);
    this._lerpRot(this.leftKneeGroup,  'x',  Math.PI / 2, dt, 10);
    this._lerpRot(this.rightKneeGroup, 'x',  Math.PI / 2, dt, 10);
    // Arms: rest slightly forward / down
    this._lerpRot(this.leftArmGroup,   'x', -0.30, dt, 10);
    this._lerpRot(this.rightArmGroup,  'x', -0.30, dt, 10);
    this._lerpRot(this.leftElbowGroup, 'x',  0.60, dt, 10);
    this._lerpRot(this.rightElbowGroup,'x',  0.60, dt, 10);
    this.bodyGroup.position.y = THREE.MathUtils.lerp(this.bodyGroup.position.y, 0, dt * 8);
    this.bodyGroup.position.x = THREE.MathUtils.lerp(this.bodyGroup.position.x, 0, dt * 8);
  }

  _animateSleeping(dt) {
    // Rotate the whole body -90° around X (lie flat on back)
    this.rootGroup.rotation.x = THREE.MathUtils.lerp(
      this.rootGroup.rotation.x, -Math.PI / 2, dt * 6
    );
    // Arms spread slightly to sides
    this._lerpRot(this.leftArmGroup,   'z',  0.30, dt, 8);
    this._lerpRot(this.rightArmGroup,  'z', -0.30, dt, 8);
    this._lerpRot(this.leftElbowGroup, 'x',  0.20, dt, 8);
    this._lerpRot(this.rightElbowGroup,'x',  0.20, dt, 8);
    // Reset legs straight
    this._resetStanding(dt);
    this.bodyGroup.position.y = THREE.MathUtils.lerp(this.bodyGroup.position.y, 0, dt * 8);
    this.bodyGroup.position.x = THREE.MathUtils.lerp(this.bodyGroup.position.x, 0, dt * 8);
  }
}
