import * as THREE from 'three';

export class Environment {
  constructor(scene) {
    this.scene = scene;
    this.init();
  }

  init() {
    // Sky color & gentle atmosphere
    const skyColor = new THREE.Color(0x87ceeb);
    this.scene.background = skyColor;
    this.scene.fog = new THREE.FogExp2(0x9bd2f0, 0.0035);

    // Surrounding terrain (outside plot)
    const groundGeo = new THREE.PlaneGeometry(400, 400);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x6b7c5a,
      roughness: 0.95,
      metalness: 0.0
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(25, -0.51, -12);
    ground.receiveShadow = true;
    ground.name = 'SurroundingGround';
    this.scene.add(ground);

    // Street in front (South of plot)
    const streetGeo = new THREE.PlaneGeometry(120, 26);
    const streetMat = new THREE.MeshStandardMaterial({
      color: 0x48484e,
      roughness: 0.90,
      metalness: 0.05
    });
    const street = new THREE.Mesh(streetGeo, streetMat);
    street.rotation.x = -Math.PI / 2;
    street.position.set(25, -0.01, 13); // South of house boundary (Y=0)
    street.receiveShadow = true;
    street.name = 'FrontStreet';
    this.scene.add(street);

    // Street markings / curb line
    const curbGeo = new THREE.BoxGeometry(100, 0.15, 0.6);
    const curbMat = new THREE.MeshStandardMaterial({ color: 0x8a8a8e, roughness: 0.8 });
    const curb = new THREE.Mesh(curbGeo, curbMat);
    curb.position.set(25, 0.05, 0.3);
    curb.receiveShadow = true;
    this.scene.add(curb);
  }
}
