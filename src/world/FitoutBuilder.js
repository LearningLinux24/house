import * as THREE from 'three';
import { WORLD_SCALE } from '../config/constants.js';

export class FitoutBuilder {
  constructor(materialManager) {
    this.materials = materialManager;
    this.rootGroup = new THREE.Group();
    this.rootGroup.name = 'FitoutRoot';

    // Category groups
    this.groups = {
      furniture: new THREE.Group(),
      doors: new THREE.Group(),
      windows: new THREE.Group(),
      gates: new THREE.Group(),
      lighting: new THREE.Group(),
      electrical: new THREE.Group(),
      vehicles: new THREE.Group(),
      garden: new THREE.Group(),
      fans: new THREE.Group()
    };

    // Label and add groups
    for (const [key, grp] of Object.entries(this.groups)) {
      grp.name = `Fitout_${key}`;
      this.rootGroup.add(grp);
    }

    // Fans tracking for rotation animation
    this.fans = [];

    // All objects tracked for floor filtering
    this.allFitoutObjects = [];
    this.currentFloorFilter = 'all';

    // Pooled dynamic point lights (fixed count = 8 to prevent shader recompilation)
    this.maxActiveLights = 8;
    this.lightPool = [];
    this.lightSources = [];
    this.lightUpdateTimer = 0;

    this.furnitureVisible = true;
  }

  buildFitout(fitoutData, fansData = [], lightsData = []) {
    // 1. Build box-based fitout items
    fitoutData.forEach(item => {
      const mesh = this.createFitoutMesh(item);
      if (!mesh) return;
      this.allFitoutObjects.push(mesh);
      const cat = item.category || 'furniture';

      if (this.groups[cat]) {
        this.groups[cat].add(mesh);
      } else {
        this.groups.furniture.add(mesh);
      }
    });

    // 2. Build ceiling fans (detailed 3D assemblies)
    fansData.forEach(fanSpec => {
      const fanObj = this.createCeilingFan(fanSpec);
      this.groups.fans.add(fanObj.root);
      this.fans.push(fanObj);
      this.allFitoutObjects.push(fanObj.root);
    });

    // 3. Build ceiling lights (LED panels + pooled point lights)
    lightsData.forEach(lightSpec => {
      const lightObj = this.createCeilingLight(lightSpec);
      this.groups.lighting.add(lightObj.mesh);
      this.allFitoutObjects.push(lightObj.mesh);
    });

    // Initialize fixed pool of 8 active point lights
    for (let i = 0; i < this.maxActiveLights; i++) {
      const pl = new THREE.PointLight(0xfff3d4, 0, 18 * WORLD_SCALE, 1.2);
      pl.name = `PooledPointLight_${i}`;
      this.groups.lighting.add(pl);
      this.lightPool.push(pl);
    }

    return this.rootGroup;
  }

  createFitoutMesh(item) {
    // Skip door leaves, handles, boundary gates, toilets (WCs), curtains, wardrobes, cupboards, and bedside nightstands because they are dynamically built and animated by DoorManager, FurnitureManager, CurtainManager & StorageManager
    if (
      item.type === 'door_leaf' ||
      item.type === 'door-leaf' ||
      item.id === 'D6-HANDLE' ||
      item.category === 'gates' ||
      item.type === 'gate' ||
      item.id === 'WW-01' ||
      item.id === 'EW-01' ||
      item.id === 'B1-01' ||
      item.id === 'B2-01' ||
      item.material === 'M-FABRIC-CURTAIN' ||
      item.id === 'BED-06' ||
      item.id === 'BED-07' ||
      item.id === 'BED-08' ||
      item.id === 'KIT-09' ||
      item.id === 'KIT-10' ||
      item.id === 'MB-06' ||
      item.id === 'MB-07' ||
      item.id === 'MB-08' ||
      item.id === 'CH-05' ||
      item.id === 'CH-06' ||
      item.id === 'CH-07'
    ) {
      return null;
    }

    let [xmin, xmax, ymin, ymax, zmin, zmax] = item.box;
    const s = WORLD_SCALE;

    // For windows/ventilators, expand slightly on the wall-normal axis to prevent z-fighting
    if (item.type === 'window' || item.type === 'ventilator') {
      const dx = xmax - xmin;
      const dy = ymax - ymin;
      if (dx < dy) {
        xmin -= 0.02 * s;
        xmax += 0.02 * s;
      } else {
        ymin -= 0.02 * s;
        ymax += 0.02 * s;
      }
    }

    const sizeX = xmax - xmin;
    const sizeY = zmax - zmin; // Spec Z -> Three.js Y
    const sizeZ = ymax - ymin; // Spec Y -> Three.js Z

    const geo = new THREE.BoxGeometry(sizeX, sizeY, sizeZ);
    const mat = this.materials.get(item.material);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.userData = item;

    const posX = (xmin + xmax) / 2;
    const posY = (zmin + zmax) / 2;
    const posZ = - (ymin + ymax) / 2;

    mesh.position.set(posX, posY, posZ);
    mesh.userData = item;

    // Window special styling: add an aluminium frame border
    if (item.type === 'window' || item.type === 'ventilator') {
      const frameGeo = new THREE.EdgesGeometry(geo);
      const frameMat = new THREE.LineBasicMaterial({
        color: 0x9a9da0,
        linewidth: 2,
        transparent: true,
        opacity: 0.8
      });
      const frame = new THREE.LineSegments(frameGeo, frameMat);
      mesh.add(frame);
    } else if (item.category === 'furniture' || item.category === 'doors' || item.category === 'gates') {
      // Subdued architectural edge for clean delineation (skip tiny bars/balusters where it is invisible and wastes draw calls)
      const isTiny = (sizeX < 0.08 && sizeZ < 0.08) || (sizeX < 0.08 && sizeY < 0.08) || (sizeY < 0.08 && sizeZ < 0.08);
      if (!isTiny) {
        const edgeGeo = new THREE.EdgesGeometry(geo);
        const edgeMat = this.materials.getEdgeMaterial();
        const edge = new THREE.LineSegments(edgeGeo, edgeMat);
        mesh.add(edge);
      }
    }

    // Cast shadows for opaque furniture (exclude glass & lights & tiny items)
    if (item.material !== 'M-GLASS' && item.category !== 'lighting' && item.category !== 'electrical') {
      mesh.receiveShadow = true;
      if (item.category === 'furniture' || item.category === 'doors' || item.category === 'vehicles') {
        const isTiny = (sizeX < 0.08 && sizeZ < 0.08) || (sizeX < 0.08 && sizeY < 0.08) || (sizeY < 0.08 && sizeZ < 0.08);
        if (!isTiny) {
          mesh.castShadow = true;
        }
      }
    }

    return mesh;
  }

  createCeilingFan(spec) {
    const s = WORLD_SCALE;
    const root = new THREE.Group();
    root.name = `Fan_${spec.id}`;
    root.userData = spec;

    const chromeMat = this.materials.get('M-CHROME');
    const bladeMat = this.materials.get('M-WOOD-DARK');

    // Support multi-floor: ceilZ is the unscaled spec Z of the ceiling underside.
    // Ground floor ceiling = 11.50, First floor ceiling = 22.00.
    const ceilZ = (spec.ceilZ !== undefined) ? spec.ceilZ : 11.50;

    // 1. Slab Canopy — centred at ceilZ - 0.125
    const canopyGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.25, 16);
    const canopy = new THREE.Mesh(canopyGeo, chromeMat);
    canopy.position.set(0, ceilZ - 0.125, 0);
    root.add(canopy);

    // 2. Down-rod — from ceilZ - 0.75 to ceilZ - 0.25 (centre ceilZ - 0.50)
    const rodGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.50, 12);
    const rod = new THREE.Mesh(rodGeo, chromeMat);
    rod.position.set(0, ceilZ - 0.50, 0);
    root.add(rod);

    // 3. Central Hub — centre at ceilZ - 0.825
    const hubGeo = new THREE.CylinderGeometry(0.30, 0.30, 0.15, 20);
    const hub = new THREE.Mesh(hubGeo, chromeMat);
    hub.position.set(0, ceilZ - 0.825, 0);
    root.add(hub);

    // 4. Rotating Blade Assembly — at ceilZ - 0.875
    const bladeAssembly = new THREE.Group();
    bladeAssembly.position.set(0, ceilZ - 0.875, 0);

    const bladeLength = 1.67;
    const bladeWidth = 0.40;
    const bladeThickness = 0.03;
    const bladeGeo = new THREE.BoxGeometry(bladeLength, bladeThickness, bladeWidth);

    for (let i = 0; i < 3; i++) {
      const angle = (i * 2 * Math.PI) / 3;
      const bladeMesh = new THREE.Mesh(bladeGeo, bladeMat);

      const r = 0.30 + bladeLength / 2;
      bladeMesh.position.set(r * Math.cos(angle), 0, r * Math.sin(angle));
      bladeMesh.rotation.y = -angle; // align length radially
      bladeMesh.castShadow = true;
      bladeAssembly.add(bladeMesh);
    }

    root.add(bladeAssembly);

    // Uniformly scale the entire assembly to match WORLD_SCALE
    root.scale.set(s, s, s);

    // Position whole fan at (spec X, 0, -spec Y) — spec.cx & cy_spec are already scaled
    root.position.set(spec.cx, 0, -spec.cy_spec);

    return {
      id: spec.id,
      root: root,
      bladeGroup: bladeAssembly
    };
  }

  createCeilingLight(spec) {
    const { cx, cy_spec, sizeX, sizeY, id } = spec;
    const s = WORLD_SCALE;

    // Support multi-floor: ceilZ is the unscaled spec Z of the ceiling underside.
    // Ground floor ceiling = 11.50, First floor ceiling = 22.00.
    const ceilZ = (spec.ceilZ !== undefined) ? spec.ceilZ : 11.50;

    // LED Panel Box: 0.06 ft thick, flush against ceiling underside
    const panelHeight = 0.06 * s;
    const geo = new THREE.BoxGeometry(sizeX, panelHeight, sizeY);
    const mat = this.materials.get('M-LIGHT-PANEL');
    const mesh = new THREE.Mesh(geo, mat);

    const posY = (ceilZ - 0.03) * s;
    mesh.position.set(cx, posY, -cy_spec);
    mesh.name = `LightPanel_${id}`;
    mesh.userData = spec;

    // Frame outline around panel
    const edgeGeo = new THREE.EdgesGeometry(geo);
    const edgeMat = new THREE.LineBasicMaterial({ color: 0xcccccc });
    mesh.add(new THREE.LineSegments(edgeGeo, edgeMat));

    // Indoor warm point light registered for dynamic nearest-assignment
    this.lightSources.push({
      id: id,
      floor: spec.floor,
      position: new THREE.Vector3(cx, (ceilZ - 0.30) * s, -cy_spec),
      color: 0xfff3d4,
      intensity: 0.50,
      distance: 18 * s,
      decay: 1.2
    });

    return { mesh };
  }

  update(delta, cameraPos) {
    // 1. Rotate ceiling fan blades
    if (this.groups.fans.visible) {
      const spinSpeed = 3.2; // radians/sec
      this.fans.forEach(fan => {
        fan.bladeGroup.rotation.y += delta * spinSpeed;
      });
    }

    // 2. Intelligent Point Light Pool Assignment (updates every ~0.08s)
    // Only calculates lights in the camera's vicinity while all panels glow emissively
    if (cameraPos && this.lightSources.length > 0) {
      this.lightUpdateTimer += delta;
      if (this.lightUpdateTimer >= 0.08) {
        this.lightUpdateTimer = 0;

        const candidateSources = (this.currentFloorFilter && this.currentFloorFilter !== 'all')
          ? this.lightSources.filter(s => !s.floor || s.floor === this.currentFloorFilter)
          : this.lightSources;

        for (let i = 0; i < candidateSources.length; i++) {
          const src = candidateSources[i];
          src._distSq = src.position.distanceToSquared(cameraPos);
        }
        candidateSources.sort((a, b) => a._distSq - b._distSq);

        const count = Math.min(this.maxActiveLights, candidateSources.length);
        for (let i = 0; i < count; i++) {
          const src = candidateSources[i];
          const pl = this.lightPool[i];
          pl.position.copy(src.position);
          pl.color.set(src.color);
          pl.distance = src.distance;
          pl.decay = src.decay;
          pl.intensity = src.intensity;
          pl.visible = true;
        }
        for (let i = count; i < this.lightPool.length; i++) {
          this.lightPool[i].intensity = 0;
        }
      }
    }
  }

  setFloorFilter(filter) {
    this.currentFloorFilter = filter;
    this.allFitoutObjects.forEach(obj => {
      const floor = obj.userData?.floor;
      if (!floor) return;
      if (filter === 'all') {
        obj.visible = true;
      } else {
        obj.visible = (floor === filter);
      }
    });
  }

  setFurnitureVisibility(visible) {
    this.furnitureVisible = visible;
    this.groups.furniture.visible = visible;
    this.groups.vehicles.visible = visible;
    this.groups.garden.visible = visible;
    this.groups.fans.visible = visible;
  }

  toggleFurniture() {
    this.setFurnitureVisibility(!this.furnitureVisible);
    return this.furnitureVisible;
  }

  setDoorsVisibility(visible) {
    this.groups.doors.visible = visible;
  }

  setWindowsVisibility(visible) {
    this.groups.windows.visible = visible;
  }

  setGatesVisibility(visible) {
    this.groups.gates.visible = visible;
  }

  setLightingVisibility(visible) {
    this.groups.lighting.visible = visible;
  }

  getRoot() {
    return this.rootGroup;
  }
}
