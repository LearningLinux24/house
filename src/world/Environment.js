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
    this.scene.fog = new THREE.FogExp2(0x9bd2f0, 0.0020);

    // Surrounding terrain (outside plot) - Expansive 800x800 ft landscape
    const groundGeo = new THREE.PlaneGeometry(800 * s, 800 * s);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x607550,
      roughness: 0.95,
      metalness: 0.0
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(50 * s, -0.51 * s, 20 * s);
    ground.receiveShadow = true;
    ground.name = 'SurroundingGround';
    this.scene.add(ground);

    // Front Street (South of plot) - Expansive 450 ft roadway along X, 65 ft wide in Z
    const streetGeo = new THREE.PlaneGeometry(450 * s, 65 * s);
    const streetMat = new THREE.MeshStandardMaterial({
      color: 0x2e3239,
      roughness: 0.88,
      metalness: 0.08
    });
    const street = new THREE.Mesh(streetGeo, streetMat);
    street.rotation.x = -Math.PI / 2;
    street.position.set(50 * s, -0.01 * s, 33.0 * s);
    street.receiveShadow = true;
    street.name = 'FrontStreet';
    this.scene.add(street);

    // Road Markings:
    // 1. Center Yellow Dashed Divider along Z = 33.0s
    const dashLength = 4.0 * s;
    const dashGap = 3.0 * s;
    const yellowMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    for (let x = -160 * s; x <= 250 * s; x += dashLength + dashGap) {
      const dashGeo = new THREE.PlaneGeometry(dashLength, 0.35 * s);
      const dash = new THREE.Mesh(dashGeo, yellowMat);
      dash.rotation.x = -Math.PI / 2;
      dash.position.set(x, 0.01 * s, 33.0 * s);
      this.scene.add(dash);
    }

    // 2. White Road Edge Stripes
    const whiteMat = new THREE.MeshBasicMaterial({ color: 0xeeeeee });
    const edgeGeo = new THREE.PlaneGeometry(440 * s, 0.25 * s);

    // North edge stripe (near house side)
    const northEdge = new THREE.Mesh(edgeGeo, whiteMat);
    northEdge.rotation.x = -Math.PI / 2;
    northEdge.position.set(50 * s, 0.01 * s, 2.0 * s);
    this.scene.add(northEdge);

    // South edge stripe (far side of street)
    const southEdge = new THREE.Mesh(edgeGeo, whiteMat);
    southEdge.rotation.x = -Math.PI / 2;
    southEdge.position.set(50 * s, 0.01 * s, 63.5 * s);
    this.scene.add(southEdge);

    // Curbs along North side of road (with OPEN driveway gap for garage & pedestrian gate)
    const curbMat = new THREE.MeshStandardMaterial({ color: 0x9ca3af, roughness: 0.75 });

    // Curb 1: West of Main Gate (X = -170s to -1.0s)
    const curb1Len = 169 * s;
    const curb1Geo = new THREE.BoxGeometry(curb1Len, 0.20 * s, 0.5 * s);
    const curb1 = new THREE.Mesh(curb1Geo, curbMat);
    curb1.position.set((-170 * s + -1.0 * s) / 2, 0.08 * s, 0.5 * s);
    curb1.receiveShadow = true;
    this.scene.add(curb1);

    // Curb 2: Between Main Gate and Garage Driveway (X = 4.0s to 36.2s)
    const curb2Len = 32.2 * s;
    const curb2Geo = new THREE.BoxGeometry(curb2Len, 0.20 * s, 0.5 * s);
    const curb2 = new THREE.Mesh(curb2Geo, curbMat);
    curb2.position.set((4.0 * s + 36.2 * s) / 2, 0.08 * s, 0.5 * s);
    curb2.receiveShadow = true;
    this.scene.add(curb2);

    // Clear opening for garage driveway: X = 36.2s to 47.2s (Zero curb!)

    // Curb 3: East of Garage Driveway (X = 47.2s to 270s)
    const curb3Len = 222.8 * s;
    const curb3Geo = new THREE.BoxGeometry(curb3Len, 0.20 * s, 0.5 * s);
    const curb3 = new THREE.Mesh(curb3Geo, curbMat);
    curb3.position.set((47.2 * s + 270 * s) / 2, 0.08 * s, 0.5 * s);
    curb3.receiveShadow = true;
    this.scene.add(curb3);

    // South Sidewalk Curb along opposite side of street (Z = 65.5s)
    const southCurbGeo = new THREE.BoxGeometry(440 * s, 0.20 * s, 0.5 * s);
    const southCurb = new THREE.Mesh(southCurbGeo, curbMat);
    southCurb.position.set(50 * s, 0.08 * s, 65.5 * s);
    southCurb.receiveShadow = true;
    this.scene.add(southCurb);
  }
}
