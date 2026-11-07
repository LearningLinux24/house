import * as THREE from 'three';
import { WORLD_SCALE } from '../config/constants.js';

export class Lighting {
  constructor(scene) {
    this.scene = scene;
    this.init();
  }

  init() {
    const s = WORLD_SCALE;

    // 1. Ambient Light (warm, natural base)
    this.ambientLight = new THREE.AmbientLight(0xfff5e4, 0.75);
    this.scene.add(this.ambientLight);

    // 2. Warm Sun from North-East
    this.sun = new THREE.DirectionalLight(0xfffaed, 2.3);
    this.sun.position.set(80 * s, 60 * s, -40 * s);
    this.sun.castShadow = true;

    // High fidelity shadow map covering entire plot
    this.sun.shadow.mapSize.width = 4096;
    this.sun.shadow.mapSize.height = 4096;
    this.sun.shadow.camera.near = 1;
    this.sun.shadow.camera.far = 250 * s;
    this.sun.shadow.camera.left = -60 * s;
    this.sun.shadow.camera.right = 60 * s;
    this.sun.shadow.camera.top = 50 * s;
    this.sun.shadow.camera.bottom = -50 * s;
    this.sun.shadow.bias = -0.0008;
    this.sun.shadow.normalBias = 0.02;

    // Direct sun target at center of house plot
    this.sun.target.position.set(25 * s, 4 * s, -12 * s);
    this.scene.add(this.sun.target);
    this.scene.add(this.sun);

    // 3. Fill Light from South (cool sky bounce)
    this.fillLight = new THREE.DirectionalLight(0xddeeff, 0.65);
    this.fillLight.position.set(-20 * s, 30 * s, 60 * s);
    this.scene.add(this.fillLight);

    // 4. Subtle Hemisphere Light for ground/sky transition
    this.hemiLight = new THREE.HemisphereLight(0xfffaed, 0x8f9c88, 0.45);
    this.scene.add(this.hemiLight);
  }
}
