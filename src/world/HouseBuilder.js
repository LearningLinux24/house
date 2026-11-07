import * as THREE from 'three';
import { WORLD_SCALE } from '../config/constants.js';

export class HouseBuilder {
  constructor(materialManager) {
    this.materials = materialManager;
    this.rootGroup = new THREE.Group();
    this.rootGroup.name = 'HouseStructure';

    this.floorGroups = new Map();
    this.slabMeshes = [];
    this.topRoofMeshes = [];
    this.midSlabMeshes = [];
    this.terraceMeshes = [];
    this.wallMeshes = [];
    this.currentFloorFilter = 'all';
  }

  buildFloor(floorData) {
    const floorGroup = new THREE.Group();
    floorGroup.name = `Floor_${floorData.id}`;

    // 1. Build standard box solids
    floorData.solids.forEach(item => {
      // Skip invisible collision-only volumes (e.g. balcony railing colliders)
      if (item.type === 'railing_collider') return;

      const mesh = this.createBoxMesh(item);
      floorGroup.add(mesh);

      if (item.id && item.id.startsWith('TER-')) {
        this.terraceMeshes.push(mesh);
      }

      // Track roof/slab meshes for smart multi-floor visibility
      if (item.type === 'slab') {
        this.slabMeshes.push(mesh);
        const zmax = item.box[5];
        if (zmax > 20.0 * WORLD_SCALE) {
          this.topRoofMeshes.push(mesh); // Top terrace roof slab (RF1-RF4)
        } else {
          this.midSlabMeshes.push(mesh); // Intermediate floor slab (SL1-SL4)
        }
      }
      if (
        item.type.startsWith('wall') ||
        item.type === 'lintel' ||
        item.type === 'duct'
      ) {
        this.wallMeshes.push(mesh);
      }
    });

    // 3. Build stair finishes and stainless steel railing (Ground Floor Spec Section 6)
    if (floorData.id === 'ground_floor') {
      const stairRailingGroup = this.buildStairRailing();
      if (stairRailingGroup) {
        floorGroup.add(stairRailingGroup);
      }
    }

    this.floorGroups.set(floorData.id, floorGroup);
    this.rootGroup.add(floorGroup);
    return floorGroup;
  }

  createBoxMesh(item) {
    const [xmin, xmax, ymin, ymax, zmin, zmax] = item.box;
    const sizeX = xmax - xmin;
    const sizeY = zmax - zmin; // Spec Z is Three.js Y (elevation)
    const sizeZ = ymax - ymin; // Spec Y is Three.js Z (depth)

    const geo = new THREE.BoxGeometry(sizeX, sizeY, sizeZ);
    const mat = this.materials.get(item.type);
    const mesh = new THREE.Mesh(geo, mat);

    const posX = (xmin + xmax) / 2;
    const posY = (zmin + zmax) / 2;
    const posZ = - (ymin + ymax) / 2;

    mesh.position.set(posX, posY, posZ);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = item;

    // Architectural edge outlines
    if (item.type !== 'grass') {
      const edgeGeo = new THREE.EdgesGeometry(geo);
      const edgeMesh = new THREE.LineSegments(edgeGeo, this.materials.getEdgeMaterial());
      mesh.add(edgeMesh);
    }

    return mesh;
  }

  buildStairRailing() {
    const s = WORLD_SCALE;
    const group = new THREE.Group();
    group.name = 'StairRailing';
    const ssMat = this.materials.get('M-STEEL-SS');

    // Handrail: 0.13ft * s dia round bar from P1 to P2
    // P1 = (30.20, 4.385, 5.308) * s in spec -> Three: (30.20 * s, 5.308 * s, -4.385 * s)
    // P2 = (30.20, 12.855, 14.192) * s in spec -> Three: (30.20 * s, 14.192 * s, -12.855 * s)
    const p1 = new THREE.Vector3(30.20 * s, 5.308 * s, -4.385 * s);
    const p2 = new THREE.Vector3(30.20 * s, 14.192 * s, -12.855 * s);

    const dir = new THREE.Vector3().subVectors(p2, p1);
    const railLength = dir.length();
    const railGeo = new THREE.CylinderGeometry(0.065 * s, 0.065 * s, railLength, 12);

    const midPoint = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
    const railMesh = new THREE.Mesh(railGeo, ssMat);
    railMesh.position.copy(midPoint);

    // Orient cylinder along dir
    const up = new THREE.Vector3(0, 1, 0);
    railMesh.quaternion.setFromUnitVectors(up, dir.clone().normalize());
    railMesh.castShadow = true;
    group.add(railMesh);

    // 24 Baluster posts (Spec Section 6)
    for (let i = 0; i < 24; i++) {
      const y_spec_unscaled = 4.1925 + 0.385 * i;
      const k = Math.min(12, Math.max(1, Math.floor((y_spec_unscaled - 4.0) / 0.77) + 1));
      const z_bottom = (1.5 + 0.8077 * k) * s;
      const z_top = (5.308 + (y_spec_unscaled - 4.385) * 1.0489 - 0.065) * s;
      const y_spec = y_spec_unscaled * s;

      const postHeight = z_top - z_bottom;
      if (postHeight > 0.1 * s) {
        const postGeo = new THREE.BoxGeometry(0.04 * s, postHeight, 0.04 * s);
        const postMesh = new THREE.Mesh(postGeo, ssMat);
        postMesh.position.set(30.20 * s, (z_bottom + z_top) / 2, -y_spec);
        postMesh.castShadow = true;
        group.add(postMesh);
      }
    }

    return group;
  }

  setRoofVisibility(visible) {
    const ffGroup = this.floorGroups.get('first_floor');
    const isFirstFloorActive = ffGroup ? ffGroup.visible : false;

    if (isFirstFloorActive) {
      // Toggle top roof slab (RF1-RF4) & terrace parapet walls
      this.topRoofMeshes.forEach(mesh => {
        mesh.visible = visible;
      });
      this.terraceMeshes.forEach(mesh => {
        mesh.visible = visible;
      });
      // Keep intermediate slab visible as the floor of the 1st floor
      this.midSlabMeshes.forEach(mesh => {
        mesh.visible = true;
      });
    } else {
      // Ground floor only active — toggle ground ceiling slab
      this.midSlabMeshes.forEach(mesh => {
        mesh.visible = visible;
      });
    }
  }

  setFloorFilter(filter) {
    this.currentFloorFilter = filter;
    const gfGroup = this.floorGroups.get('ground_floor');
    const ffGroup = this.floorGroups.get('first_floor');

    if (filter === 'ground_floor') {
      if (gfGroup) gfGroup.visible = true;
      if (ffGroup) ffGroup.visible = false;
      this.midSlabMeshes.forEach(mesh => {
        mesh.visible = false; // Open look into ground floor rooms
      });
    } else if (filter === 'first_floor') {
      if (gfGroup) gfGroup.visible = false;
      if (ffGroup) ffGroup.visible = true;
      this.midSlabMeshes.forEach(mesh => {
        mesh.visible = true; // 1F floor plate remains solid
      });
      this.topRoofMeshes.forEach(mesh => {
        mesh.visible = false; // Open look into first floor rooms
      });
      this.terraceMeshes.forEach(mesh => {
        mesh.visible = false;
      });
    } else {
      // 'all'
      if (gfGroup) gfGroup.visible = true;
      if (ffGroup) ffGroup.visible = true;
      this.midSlabMeshes.forEach(mesh => {
        mesh.visible = true;
      });
      this.topRoofMeshes.forEach(mesh => {
        mesh.visible = true;
      });
      this.terraceMeshes.forEach(mesh => {
        mesh.visible = true;
      });
    }
  }

  getRoot() {
    return this.rootGroup;
  }
}
