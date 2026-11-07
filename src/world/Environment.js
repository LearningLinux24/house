import * as THREE from 'three';
import { WORLD_SCALE } from '../config/constants.js';

export class Environment {
  constructor(scene) {
    this.scene = scene;
    this.init();
  }

  init() {
    const s = WORLD_SCALE;

    // Sky color & gentle atmosphere
    const skyColor = new THREE.Color(0x87ceeb);
    this.scene.background = skyColor;
    this.scene.fog = new THREE.FogExp2(0x9bd2f0, 0.0025);

    // Surrounding terrain (outside plot)
    const groundGeo = new THREE.PlaneGeometry(500 * s, 500 * s);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x6b7c5a,
      roughness: 0.95,
      metalness: 0.0
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(25 * s, -0.51 * s, -12 * s);
    ground.receiveShadow = true;
    ground.name = 'SurroundingGround';
    this.scene.add(ground);

    // Street in front (South of plot)
    const streetGeo = new THREE.PlaneGeometry(150 * s, 30 * s);
    const streetMat = new THREE.MeshStandardMaterial({
      color: 0x48484e,
      roughness: 0.90,
      metalness: 0.05
    });
    const street = new THREE.Mesh(streetGeo, streetMat);
    street.rotation.x = -Math.PI / 2;
    street.position.set(25 * s, -0.01, 14 * s); // South of house boundary (Y=0)
    street.receiveShadow = true;
    street.name = 'FrontStreet';
    this.scene.add(street);

    // Street markings / curb line
    const curbGeo = new THREE.BoxGeometry(120 * s, 0.15 * s, 0.6 * s);
    const curbMat = new THREE.MeshStandardMaterial({ color: 0x8a8a8e, roughness: 0.8 });
    const curb = new THREE.Mesh(curbGeo, curbMat);
    curb.position.set(25 * s, 0.05 * s, 0.3 * s);
    curb.receiveShadow = true;
    this.scene.add(curb);
  }
}
