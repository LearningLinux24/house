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
      item.id === 'CH-07' ||
      item.id === 'POR-01' ||
      item.id === 'GAR-03'
    ) {
      return null;
    }

    let [xmin, xmax, ymin, ymax, zmin, zmax] = item.box;
    const s = WORLD_SCALE;

    // Specialized Washing Machine 3D Appliance model for First Floor Hallway
    if (item.id === 'HW-06') {
      return this.createWashingMachine(item);
    }

    // Specialized Refrigerator 3D Appliance model for Kitchens
    if (item.id === 'KIT-11' || item.id === 'KF-11') {
      return this.createRefrigerator(item);
    }

    // For windows/ventilators, center a realistic thin glazed pane within the wall depth
    if (item.type === 'window' || item.type === 'ventilator') {
      const dx = xmax - xmin;
      const dy = ymax - ymin;
      const paneThick = 0.08 * s;
      if (dx < dy) {
        // Wall runs along Y; thin along X
        const midX = (xmin + xmax) / 2;
        xmin = midX - paneThick / 2;
        xmax = midX + paneThick / 2;
      } else {
        // Wall runs along X; thin along Y
        const midY = (ymin + ymax) / 2;
        ymin = midY - paneThick / 2;
        ymax = midY + paneThick / 2;
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

  createWashingMachine(item) {
    const [xmin, xmax, ymin, ymax, zmin, zmax] = item.box;
    const sizeX = xmax - xmin;
    const sizeY = zmax - zmin; // Spec Z -> 3js Y
    const sizeZ = ymax - ymin; // Spec Y -> 3js Z

    const posX = (xmin + xmax) / 2;
    const posY = (zmin + zmax) / 2;
    const posZ = -((ymin + ymax) / 2);

    const group = new THREE.Group();
    group.name = 'WashingMachine_HW-06';
    group.position.set(posX, posY, posZ);
    group.userData = item;

    const whiteMat = this.materials.get('M-SANITARY-WHITE') || new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.2 });
    const chromeMat = this.materials.get('M-CHROME') || new THREE.MeshStandardMaterial({ color: 0xd8d8d8, roughness: 0.15, metalness: 0.9 });
    const darkGreyMat = this.materials.get('M-STEEL-GREY') || new THREE.MeshStandardMaterial({ color: 0x2e3236, roughness: 0.4 });
    const ssMat = this.materials.get('M-STEEL-SS') || new THREE.MeshStandardMaterial({ color: 0x9098a0, roughness: 0.25, metalness: 0.85 });

    // 1. Main Casing Body
    const bodyGeo = new THREE.BoxGeometry(sizeX * 0.98, sizeY * 0.88, sizeZ * 0.94);
    const body = new THREE.Mesh(bodyGeo, whiteMat);
    body.position.set(0, -sizeY * 0.03, sizeZ * 0.02);
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // 2. Top Countertop / Lid (crisp top panel with slight bevel appearance)
    const topGeo = new THREE.BoxGeometry(sizeX, sizeY * 0.06, sizeZ);
    const top = new THREE.Mesh(topGeo, whiteMat);
    top.position.set(0, sizeY * 0.47, 0);
    top.castShadow = true;
    top.receiveShadow = true;
    group.add(top);

    // 3. Bottom Recessed Plinth / Kickplate
    const plinthGeo = new THREE.BoxGeometry(sizeX * 0.96, sizeY * 0.08, sizeZ * 0.92);
    const plinth = new THREE.Mesh(plinthGeo, darkGreyMat);
    plinth.position.set(0, -sizeY * 0.45, -sizeZ * 0.02);
    plinth.receiveShadow = true;
    group.add(plinth);

    // Bottom service drain filter hatch (round cap on right bottom)
    const filterGeo = new THREE.CylinderGeometry(sizeX * 0.04, sizeX * 0.04, sizeZ * 0.02, 16);
    filterGeo.rotateX(Math.PI / 2);
    const filterCap = new THREE.Mesh(filterGeo, darkGreyMat);
    filterCap.position.set(sizeX * 0.32, -sizeY * 0.45, -sizeZ * 0.49);
    group.add(filterCap);

    // 4. Upper Control Fascia
    const fasciaGeo = new THREE.BoxGeometry(sizeX * 0.96, sizeY * 0.20, sizeZ * 0.02);
    const fasciaMat = new THREE.MeshStandardMaterial({ color: 0x1c2024, roughness: 0.3, metalness: 0.3 });
    const fascia = new THREE.Mesh(fasciaGeo, fasciaMat);
    fascia.position.set(0, sizeY * 0.33, -sizeZ * 0.485);
    group.add(fascia);

    // Detergent dispenser drawer (left)
    const drawerGeo = new THREE.BoxGeometry(sizeX * 0.30, sizeY * 0.14, sizeZ * 0.02);
    const drawer = new THREE.Mesh(drawerGeo, whiteMat);
    drawer.position.set(-sizeX * 0.30, sizeY * 0.33, -sizeZ * 0.495);
    const drawerHandleGeo = new THREE.BoxGeometry(sizeX * 0.18, sizeY * 0.02, sizeZ * 0.015);
    const drawerHandle = new THREE.Mesh(drawerHandleGeo, darkGreyMat);
    drawerHandle.position.set(0, -sizeY * 0.045, -sizeZ * 0.01);
    drawer.add(drawerHandle);
    group.add(drawer);

    // Rotary cycle selector knob (center)
    const knobGeo = new THREE.CylinderGeometry(sizeX * 0.06, sizeX * 0.06, sizeZ * 0.03, 24);
    knobGeo.rotateX(Math.PI / 2);
    const knob = new THREE.Mesh(knobGeo, chromeMat);
    knob.position.set(0, sizeY * 0.33, -sizeZ * 0.50);
    const pipGeo = new THREE.BoxGeometry(sizeX * 0.008, sizeY * 0.02, sizeZ * 0.01);
    const pipMat = new THREE.MeshBasicMaterial({ color: 0x00d2ff });
    const pip = new THREE.Mesh(pipGeo, pipMat);
    pip.position.set(0, sizeY * 0.02, -sizeZ * 0.015);
    knob.add(pip);
    group.add(knob);

    // Digital LED display screen (right)
    const displayGeo = new THREE.BoxGeometry(sizeX * 0.28, sizeY * 0.12, sizeZ * 0.01);
    const displayMat = new THREE.MeshStandardMaterial({
      color: 0x040e14,
      roughness: 0.1,
      emissive: 0x003b46,
      emissiveIntensity: 0.5
    });
    const display = new THREE.Mesh(displayGeo, displayMat);
    display.position.set(sizeX * 0.30, sizeY * 0.34, -sizeZ * 0.495);

    // Glowing cyan readout segment
    const ledGeo = new THREE.PlaneGeometry(sizeX * 0.18, sizeY * 0.045);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const led = new THREE.Mesh(ledGeo, ledMat);
    led.position.set(0, 0, sizeZ * 0.006);
    display.add(led);
    group.add(display);

    // 5. Front Porthole Door & Drum Assembly
    const doorY = -sizeY * 0.08;
    const doorZ = -sizeZ * 0.485;

    // Recessed drum cavity (interior cylinder visible through glass)
    const drumCavityGeo = new THREE.CylinderGeometry(sizeX * 0.28, sizeX * 0.28, sizeZ * 0.12, 28, 1, true);
    drumCavityGeo.rotateX(Math.PI / 2);
    const drumCavity = new THREE.Mesh(drumCavityGeo, ssMat);
    drumCavity.position.set(0, doorY, doorZ + sizeZ * 0.06);
    group.add(drumCavity);

    // Drum rear backplate
    const drumBackGeo = new THREE.CircleGeometry(sizeX * 0.28, 28);
    const drumBack = new THREE.Mesh(drumBackGeo, ssMat);
    drumBack.position.set(0, doorY, doorZ + sizeZ * 0.12);
    group.add(drumBack);

    // Outer door chrome bezel ring
    const bezelGeo = new THREE.TorusGeometry(sizeX * 0.30, sizeX * 0.035, 16, 36);
    const bezel = new THREE.Mesh(bezelGeo, chromeMat);
    bezel.position.set(0, doorY, doorZ - sizeZ * 0.01);
    bezel.castShadow = true;
    group.add(bezel);

    // Inner dark bezel ring
    const innerBezelGeo = new THREE.TorusGeometry(sizeX * 0.26, sizeX * 0.018, 12, 32);
    const innerBezel = new THREE.Mesh(innerBezelGeo, darkGreyMat);
    innerBezel.position.set(0, doorY, doorZ - sizeZ * 0.008);
    group.add(innerBezel);

    // Smoked dark curved porthole glass window
    const glassGeo = new THREE.CylinderGeometry(sizeX * 0.25, sizeX * 0.23, sizeZ * 0.02, 32);
    glassGeo.rotateX(Math.PI / 2);
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x141e24,
      roughness: 0.08,
      metalness: 0.1,
      transparent: true,
      opacity: 0.78
    });
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.position.set(0, doorY, doorZ - sizeZ * 0.005);
    group.add(glass);

    // Ergonomic door pull handle (on right side of door bezel)
    const handleGeo = new THREE.BoxGeometry(sizeX * 0.02, sizeY * 0.09, sizeZ * 0.03);
    const handle = new THREE.Mesh(handleGeo, darkGreyMat);
    handle.position.set(sizeX * 0.31, doorY, doorZ - sizeZ * 0.025);
    handle.castShadow = true;
    group.add(handle);

    // Door hinge block (on left side)
    const hingeGeo = new THREE.BoxGeometry(sizeX * 0.02, sizeY * 0.06, sizeZ * 0.02);
    const hinge = new THREE.Mesh(hingeGeo, chromeMat);
    hinge.position.set(-sizeX * 0.31, doorY, doorZ - sizeZ * 0.01);
    group.add(hinge);

    return group;
  }

  createRefrigerator(item) {
    const [xmin, xmax, ymin, ymax, zmin, zmax] = item.box;
    const sizeX = xmax - xmin;
    const sizeY = zmax - zmin; // CAD Z -> Three.js Y
    const sizeZ = ymax - ymin; // CAD Y -> Three.js Z

    const posX = (xmin + xmax) / 2;
    const posY = (zmin + zmax) / 2;
    const posZ = -((ymin + ymax) / 2);

    // KF-11 faces South (+Z in Three.js), KIT-11 faces North (-Z in Three.js)
    const frontDirZ = (item.id === 'KF-11') ? 1 : -1;

    const group = new THREE.Group();
    group.name = `Refrigerator_${item.id}`;
    group.position.set(posX, posY, posZ);

    // Premium appliance materials
    const bodyMat = this.materials.get('M-STEEL-SS') || new THREE.MeshStandardMaterial({
      color: 0xc4c7cb,
      metalness: 0.85,
      roughness: 0.22
    });
    const darkAccentMat = new THREE.MeshStandardMaterial({
      color: 0x1a1e22,
      roughness: 0.40,
      metalness: 0.20
    });
    const chromeMat = this.materials.get('M-CHROME') || new THREE.MeshStandardMaterial({
      color: 0xe8e8e8,
      metalness: 0.95,
      roughness: 0.10
    });
    const gasketMat = new THREE.MeshStandardMaterial({
      color: 0x111315,
      roughness: 0.80
    });

    // 1. Recessed Base Plinth with Leveling Feet
    const plinthH = sizeY * 0.04;
    const plinthGeo = new THREE.BoxGeometry(sizeX * 0.96, plinthH, sizeZ * 0.92);
    const plinth = new THREE.Mesh(plinthGeo, darkAccentMat);
    plinth.position.set(0, -sizeY / 2 + plinthH / 2, -frontDirZ * sizeZ * 0.02);
    plinth.receiveShadow = true;
    group.add(plinth);

    // Leveling feet
    [-sizeX * 0.40, sizeX * 0.40].forEach(fx => {
      const footGeo = new THREE.CylinderGeometry(sizeX * 0.035, sizeX * 0.035, plinthH * 0.6, 16);
      const foot = new THREE.Mesh(footGeo, chromeMat);
      foot.position.set(fx, -sizeY / 2 + plinthH * 0.3, frontDirZ * (sizeZ * 0.44));
      group.add(foot);
    });

    // 2. Main Casing Body
    const cabinetH = sizeY - plinthH;
    const cabinetD = sizeZ * 0.94;
    const cabinetY = -sizeY / 2 + plinthH + cabinetH / 2;
    const cabinetZ = -frontDirZ * (sizeZ - cabinetD) / 2;

    const cabinetGeo = new THREE.BoxGeometry(sizeX, cabinetH, cabinetD);
    const cabinet = new THREE.Mesh(cabinetGeo, bodyMat);
    cabinet.position.set(0, cabinetY, cabinetZ);
    cabinet.castShadow = true;
    cabinet.receiveShadow = true;
    group.add(cabinet);

    // 3. Doors & Rubber Gasket
    const doorThick = sizeZ * 0.06;
    const doorW = sizeX * 0.99;
    const freezerH = cabinetH * 0.32;
    const fridgeH = cabinetH * 0.63;
    const gasketGapH = cabinetH * 0.015;

    const doorFrontZ = frontDirZ * (sizeZ / 2 - doorThick / 2);

    // Dark magnetic gasket shadow strip
    const gasketGeo = new THREE.BoxGeometry(doorW * 0.99, gasketGapH, doorThick * 0.9);
    const gasket = new THREE.Mesh(gasketGeo, gasketMat);
    const gasketY = -sizeY / 2 + plinthH + fridgeH + gasketGapH / 2;
    gasket.position.set(0, gasketY, doorFrontZ - frontDirZ * doorThick * 0.1);
    group.add(gasket);

    // Upper Freezer Door
    const freezerY = -sizeY / 2 + plinthH + fridgeH + gasketGapH + freezerH / 2;
    const freezerGeo = new THREE.BoxGeometry(doorW, freezerH, doorThick);
    const freezerDoor = new THREE.Mesh(freezerGeo, bodyMat);
    freezerDoor.position.set(0, freezerY, doorFrontZ);
    freezerDoor.castShadow = true;
    group.add(freezerDoor);

    // Lower Fridge Door
    const fridgeY = -sizeY / 2 + plinthH + fridgeH / 2;
    const fridgeGeo = new THREE.BoxGeometry(doorW, fridgeH, doorThick);
    const fridgeDoor = new THREE.Mesh(fridgeGeo, bodyMat);
    fridgeDoor.position.set(0, fridgeY, doorFrontZ);
    fridgeDoor.castShadow = true;
    group.add(fridgeDoor);

    // 4. Digital LED Control & Status Panel on Freezer Door
    const panelW = sizeX * 0.28;
    const panelH = freezerH * 0.28;
    const panelGeo = new THREE.BoxGeometry(panelW, panelH, doorThick * 0.12);
    const panelMat = new THREE.MeshStandardMaterial({
      color: 0x0a1015,
      roughness: 0.1,
      metalness: 0.6
    });
    const panel = new THREE.Mesh(panelGeo, panelMat);
    panel.position.set(0, freezerY + freezerH * 0.15, doorFrontZ + frontDirZ * (doorThick / 2 + doorThick * 0.04));
    group.add(panel);

    // Cyan LED display segments
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
    const ledGeo1 = new THREE.PlaneGeometry(panelW * 0.35, panelH * 0.12);
    const led1 = new THREE.Mesh(ledGeo1, ledMat);
    if (frontDirZ > 0) led1.rotation.y = 0;
    else led1.rotation.y = Math.PI;
    led1.position.set(-panelW * 0.20, freezerY + freezerH * 0.18, doorFrontZ + frontDirZ * (doorThick / 2 + doorThick * 0.11));
    group.add(led1);

    const ledGeo2 = new THREE.PlaneGeometry(panelW * 0.35, panelH * 0.12);
    const led2 = new THREE.Mesh(ledGeo2, ledMat);
    if (frontDirZ > 0) led2.rotation.y = 0;
    else led2.rotation.y = Math.PI;
    led2.position.set(panelW * 0.20, freezerY + freezerH * 0.18, doorFrontZ + frontDirZ * (doorThick / 2 + doorThick * 0.11));
    group.add(led2);

    // 5. Vertical Tubular Bar Handles with Standoffs
    const handleSideX = sizeX * 0.38; // right side of doors
    const handleRadius = sizeX * 0.015;
    const handleOutZ = doorFrontZ + frontDirZ * (doorThick / 2 + sizeZ * 0.04);
    const standoffD = sizeZ * 0.04;

    const addVerticalHandle = (centerY, barLen) => {
      const barGeo = new THREE.CylinderGeometry(handleRadius, handleRadius, barLen, 16);
      const bar = new THREE.Mesh(barGeo, chromeMat);
      bar.position.set(handleSideX, centerY, handleOutZ);
      bar.castShadow = true;
      group.add(bar);

      [-barLen * 0.42, barLen * 0.42].forEach(offsetY => {
        const postGeo = new THREE.CylinderGeometry(handleRadius * 0.8, handleRadius * 0.8, standoffD, 12);
        postGeo.rotateX(Math.PI / 2);
        const post = new THREE.Mesh(postGeo, chromeMat);
        post.position.set(handleSideX, centerY + offsetY, doorFrontZ + frontDirZ * (doorThick / 2 + standoffD / 2));
        group.add(post);
      });
    };

    addVerticalHandle(freezerY, freezerH * 0.55);
    addVerticalHandle(fridgeY + fridgeH * 0.12, fridgeH * 0.55);

    // Subtle Brand Emblem (metallic badge)
    const badgeGeo = new THREE.BoxGeometry(sizeX * 0.14, sizeY * 0.015, doorThick * 0.08);
    const badge = new THREE.Mesh(badgeGeo, chromeMat);
    badge.position.set(0, freezerY + freezerH * 0.40, doorFrontZ + frontDirZ * (doorThick / 2 + doorThick * 0.04));
    group.add(badge);

    return group;
  }

  getRoot() {
    return this.rootGroup;
  }
}
