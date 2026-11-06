import * as THREE from 'three';

export class Lighting {
  constructor(scene) {
    this.scene = scene;
    this.init();
  }

  init() {
    // 1. Ambient Light (warm, natural base)
    this.ambientLight = new THREE.AmbientLight(0xfff5e4, 0.75);
    this.scene.add(this.ambientLight);

    // 2. Warm Sun from North-East
    this.sun = new THREE.DirectionalLight(0xfffaed, 2.3);
    this.sun.position.set(80, 60, -40);
    this.sun.castShadow = true;

    // High fidelity shadow map covering entire plot
    this.sun.shadow.mapSize.width = 4096;
    this.sun.shadow.mapSize.height = 4096;
    this.sun.shadow.camera.near = 1;
    this.sun.shadow.camera.far = 220;
    this.sun.shadow.camera.left = -60;
    this.sun.shadow.camera.right = 60;
    this.sun.shadow.camera.top = 50;
    this.sun.shadow.camera.bottom = -50;
    this.sun.shadow.bias = -0.0008;
    this.sun.shadow.normalBias = 0.02;

    // Direct sun target at center of house plot
    this.sun.target.position.set(25, 4, -12);
    this.scene.add(this.sun.target);
    this.scene.add(this.sun);

    // 3. Fill Light from South (cool sky bounce)
    this.fillLight = new THREE.DirectionalLight(0xddeeff, 0.65);
    this.fillLight.position.set(-20, 30, 60);
    this.scene.add(this.fillLight);

    // 4. Subtle Hemisphere Light for ground/sky transition
    this.hemiLight = new THREE.HemisphereLight(0xfffaed, 0x8f9c88, 0.45);
    this.scene.add(this.hemiLight);
  }
}
