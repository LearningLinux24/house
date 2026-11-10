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
    this.televisions = [];
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
      item.id === 'GAR-01' ||
      item.id === 'GAR-02' ||
      item.id === 'GAR-03' ||
      item.id === 'GAR-04' ||
      item.id === 'GAR-05' ||
      item.id === 'GAR-06' ||
      item.id === 'GAR-07' ||
      item.id === 'KIT-06' ||
      item.id === 'KF-06' ||
      item.id === 'HW-04' ||
      item.id === 'KIT-01' ||
      item.id === 'KIT-03' ||
      item.id === 'KF-01' ||
      item.id === 'KF-03' ||
      item.id === 'DIN-02' ||
      item.id === 'DIN-03' ||
      item.id === 'DIN-04' ||
      item.id === 'DIN-05' ||
      item.id === 'LOB-10' ||
      item.id === 'LOB-11' ||
      item.id === 'LOB-12' ||
      item.id === 'LOB-13' ||
      item.id === 'LB-10' ||
      item.id === 'LB-11' ||
      item.id === 'LB-12' ||
      item.id === 'LB-13' ||
      item.id === 'CH-12'
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

    // Specialized 55-inch Ultra-Slim Smart TVs (OLED Panel, Bezel, Soundbar, Wall Mount)
    if (item.id === 'LOB-08' || item.id === 'LB-08') {
      return this.createTelevision(item);
    }

    // Specialized Modern TV Media Consoles (Elevated Tapered Legs, Open AV Cubby, Brass Pulls)
    if (item.id === 'LOB-07' || item.id === 'LB-07') {
      return this.createTVCabinet(item);
    }

    // Specialized Modern Dining Tables
    if (item.id === 'DIN-01' || item.id === 'LOB-09' || item.id === 'LB-09') {
      return this.createDiningTable(item);
    }

    // Specialized Modern Dining Chairs
    if (
      item.id === 'DIN-06' ||
      item.id === 'DIN-07' ||
      item.id === 'DIN-08' ||
      item.id === 'DIN-09' ||
      item.id === 'LOB-14' ||
      item.id === 'LOB-15' ||
      item.id === 'LOB-16' ||
      item.id === 'LOB-17' ||
      item.id === 'LB-14' ||
      item.id === 'LB-15' ||
      item.id === 'LB-16' ||
      item.id === 'LB-17' ||
      item.id === 'LB-18' ||
      item.id === 'LB-19'
    ) {
      return this.createDiningChair(item);
    }

    // Specialized Modern Coffee Tables
    if (item.id === 'LOB-06' || item.id === 'LB-06') {
      return this.createCoffeeTable(item);
    }

    // Specialized Study Desk Chair
    if (item.id === 'CH-11') {
      return this.createStudyChair(item);
    }

    // Specialized Stainless Steel Kitchen Sinks (Double Hollow Basins & Strainers)
    if (item.id === 'KIT-05' || item.id === 'KF-05') {
      return this.createKitchenSink(item);
    }

    // Specialized Ceramic Washbasins (Hollow Contoured Bowl, Pop-Up Stopper & Overflow)
    if (
      item.id === 'WW-02' ||
      item.id === 'EW-02' ||
      item.id === 'NB-01' ||
      item.id === 'B1-02' ||
      item.id === 'B2-02' ||
      item.id === 'HW-03'
    ) {
      return this.createBathroomBasin(item);
    }

    // Specialized Ceramic Basin Pedestals (Tapered Fluted Column Shaft)
    if (
      item.id === 'WW-03' ||
      item.id === 'EW-03' ||
      item.id === 'NB-02' ||
      item.id === 'B1-03' ||
      item.id === 'B2-03'
    ) {
      return this.createBasinPedestal(item);
    }

    // Specialized Mandir Shrine with holy mandir.jpg photo (exact 4166:2136 aspect ratio)
    if (item.id === 'MD-02') {
      return this.createMandirShrine(item);
    }

    // Specialized Mandir Marble Altar Platform
    if (item.id === 'MD-01') {
      return this.createMandirPlatform(item);
    }

    // Specialized Mandir Traditional Brass Oil Lamps (Diyas / Samai)
    if (item.id === 'MD-03' || item.id === 'MD-04') {
      return this.createBrassDiya(item);
    }

    // Specialized Rooftop Water Tank (Sintex Cylindrical Ribbed Tank + Lid)
    if (item.id === 'TER-WATER-TANK') {
      return this.createWaterTank(item);
    }

    // Specialized Gym Treadmill
    if (item.id === 'TER-GYM-TREADMILL') {
      return this.createGymTreadmill(item);
    }

    // Specialized Gym Weight Bench
    if (item.id === 'TER-GYM-BENCH') {
      return this.createGymBench(item);
    }

    // Specialized Gym Dumbbell Rack & Dumbbells
    if (item.id === 'TER-GYM-DBRACK') {
      return this.createDumbbellRack(item);
    }

    // Specialized Yoga Mats
    if (item.type === 'yoga_mat') {
      return this.createYogaMat(item);
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

  createKitchenSink(item) {
    const [xmin, xmax, ymin, ymax, zmin, zmax] = item.box;
    const sizeX = xmax - xmin;
    const sizeY = zmax - zmin; // CAD Z -> Three.js Y
    const sizeZ = ymax - ymin; // CAD Y -> Three.js Z

    const posX = (xmin + xmax) / 2;
    const posY = (zmin + zmax) / 2;
    const posZ = -((ymin + ymax) / 2);

    const group = new THREE.Group();
    group.name = `KitchenSink_${item.id}`;
    group.position.set(posX, posY, posZ);

    const ssMat = this.materials.get('M-STEEL-SS') || new THREE.MeshStandardMaterial({
      color: 0xc8cbcf,
      metalness: 0.88,
      roughness: 0.22
    });
    const chromeMat = this.materials.get('M-CHROME') || new THREE.MeshStandardMaterial({
      color: 0xe8eaed,
      metalness: 0.95,
      roughness: 0.10
    });
    const darkHoleMat = new THREE.MeshStandardMaterial({
      color: 0x141618,
      roughness: 0.70
    });

    const isAlongX = (sizeX >= sizeZ);
    const bowlLength = isAlongX ? sizeX : sizeZ;
    const bowlWidth = isAlongX ? sizeZ : sizeX;

    // 1. Countertop Outer Flange / Rim (open hollow frame resting on granite)
    const rimH = sizeY * 0.08;
    const lipW = Math.min(sizeX, sizeZ) * 0.08;

    // North lip & South lip
    [-sizeZ / 2 + lipW / 2, sizeZ / 2 - lipW / 2].forEach(pz => {
      const lipGeo = new THREE.BoxGeometry(sizeX, rimH, lipW);
      const lipMesh = new THREE.Mesh(lipGeo, ssMat);
      lipMesh.position.set(0, sizeY / 2 - rimH / 2, pz);
      lipMesh.castShadow = true;
      group.add(lipMesh);
    });

    // West lip & East lip
    [-sizeX / 2 + lipW / 2, sizeX / 2 - lipW / 2].forEach(px => {
      const lipGeo = new THREE.BoxGeometry(lipW, rimH, sizeZ - lipW * 2);
      const lipMesh = new THREE.Mesh(lipGeo, ssMat);
      lipMesh.position.set(px, sizeY / 2 - rimH / 2, 0);
      lipMesh.castShadow = true;
      group.add(lipMesh);
    });

    // Center dividing bridge/saddle between the two bowls
    const saddleGeo = new THREE.BoxGeometry(
      isAlongX ? lipW : sizeX - lipW * 2,
      rimH * 0.9,
      isAlongX ? sizeZ - lipW * 2 : lipW
    );
    const saddleMesh = new THREE.Mesh(saddleGeo, ssMat);
    saddleMesh.position.set(0, sizeY / 2 - rimH / 2, 0);
    saddleMesh.castShadow = true;
    group.add(saddleMesh);

    // 2. Double Basins with Center Saddle / Divider
    const basinDepth = sizeY * 0.90;
    const halfLen = bowlLength * 0.42;
    const basinW = bowlWidth * 0.82;
    const wallT = 0.03 * bowlWidth;

    const createSingleBasin = (offsetX, offsetZ) => {
      const bGroup = new THREE.Group();
      bGroup.position.set(offsetX, 0, offsetZ);

      const bW = isAlongX ? halfLen : basinW;
      const bD = isAlongX ? basinW : halfLen;

      // Basin Floor
      const bFloorGeo = new THREE.BoxGeometry(bW - wallT * 2, wallT, bD - wallT * 2);
      const bFloor = new THREE.Mesh(bFloorGeo, ssMat);
      bFloor.position.set(0, -sizeY / 2 + wallT / 2, 0);
      bFloor.receiveShadow = true;
      bGroup.add(bFloor);

      // Basin 4 Side Walls
      [-bD / 2 + wallT / 2, bD / 2 - wallT / 2].forEach(wz => {
        const wallGeo = new THREE.BoxGeometry(bW, basinDepth, wallT);
        const wallMesh = new THREE.Mesh(wallGeo, ssMat);
        wallMesh.position.set(0, sizeY / 2 - rimH - basinDepth / 2, wz);
        bGroup.add(wallMesh);
      });
      [-bW / 2 + wallT / 2, bW / 2 - wallT / 2].forEach(wx => {
        const wallGeo = new THREE.BoxGeometry(wallT, basinDepth, bD - wallT * 2);
        const wallMesh = new THREE.Mesh(wallGeo, ssMat);
        wallMesh.position.set(wx, sizeY / 2 - rimH - basinDepth / 2, 0);
        bGroup.add(wallMesh);
      });

      // Chrome Drain Basket Strainer in center
      const drainR = Math.min(bW, bD) * 0.16;
      const drainBezelGeo = new THREE.CylinderGeometry(drainR * 1.15, drainR * 1.15, wallT * 1.4, 20);
      const drainBezel = new THREE.Mesh(drainBezelGeo, chromeMat);
      drainBezel.position.set(0, -sizeY / 2 + wallT * 1.2, 0);
      bGroup.add(drainBezel);

      // Drain hole inside strainer
      const drainHoleGeo = new THREE.CylinderGeometry(drainR * 0.85, drainR * 0.75, wallT * 1.6, 20);
      const drainHole = new THREE.Mesh(drainHoleGeo, darkHoleMat);
      drainHole.position.set(0, -sizeY / 2 + wallT * 1.25, 0);
      bGroup.add(drainHole);

      // Center chrome strainer post / plug
      const postGeo = new THREE.CylinderGeometry(drainR * 0.15, drainR * 0.15, wallT * 2.2, 12);
      const post = new THREE.Mesh(postGeo, chromeMat);
      post.position.set(0, -sizeY / 2 + wallT * 1.8, 0);
      bGroup.add(post);

      return bGroup;
    };

    if (isAlongX) {
      const sepX = bowlLength * 0.24;
      group.add(createSingleBasin(-sepX, 0));
      group.add(createSingleBasin(sepX, 0));

      // Fluted Drainer Ridges on deck
      [-halfLen * 0.25, 0, halfLen * 0.25].forEach(rx => {
        const ridgeGeo = new THREE.BoxGeometry(0.015 * sizeX, rimH * 0.4, bowlWidth * 0.70);
        const ridge = new THREE.Mesh(ridgeGeo, chromeMat);
        ridge.position.set(rx, sizeY / 2 + rimH * 0.1, 0);
        group.add(ridge);
      });
    } else {
      const sepZ = bowlLength * 0.24;
      group.add(createSingleBasin(0, -sepZ));
      group.add(createSingleBasin(0, sepZ));
    }

    return group;
  }

  createBathroomBasin(item) {
    const [xmin, xmax, ymin, ymax, zmin, zmax] = item.box;
    const sizeX = xmax - xmin;
    const sizeY = zmax - zmin; // CAD Z -> Three.js Y
    const sizeZ = ymax - ymin; // CAD Y -> Three.js Z

    const posX = (xmin + xmax) / 2;
    const posY = (zmin + zmax) / 2;
    const posZ = -((ymin + ymax) / 2);

    const group = new THREE.Group();
    group.name = `BathroomBasin_${item.id}`;
    group.position.set(posX, posY, posZ);

    const ceramicMat = this.materials.get('M-SANITARY-WHITE') || new THREE.MeshStandardMaterial({
      color: 0xf5f7fb,
      roughness: 0.12,
      metalness: 0.05
    });
    const chromeMat = this.materials.get('M-CHROME') || new THREE.MeshStandardMaterial({
      color: 0xe8eaed,
      metalness: 0.95,
      roughness: 0.10
    });

    // 1. Ceramic Basin Outer Shell
    const bowlH = sizeY * 0.95;
    const rimH = bowlH * 0.12;

    // Rear faucet mounting deck
    const rearDeckD = sizeZ * 0.26;
    const rearDeckGeo = new THREE.BoxGeometry(sizeX, rimH, rearDeckD);
    const rearDeck = new THREE.Mesh(rearDeckGeo, ceramicMat);
    rearDeck.position.set(0, sizeY / 2 - rimH / 2, -sizeZ / 2 + rearDeckD / 2);
    rearDeck.castShadow = true;
    group.add(rearDeck);

    // Left and Right rim strips
    const sideRimW = sizeX * 0.08;
    const sideRimD = sizeZ - rearDeckD;
    [-sizeX / 2 + sideRimW / 2, sizeX / 2 - sideRimW / 2].forEach(px => {
      const sideGeo = new THREE.BoxGeometry(sideRimW, rimH, sideRimD);
      const sideMesh = new THREE.Mesh(sideGeo, ceramicMat);
      sideMesh.position.set(px, sizeY / 2 - rimH / 2, -sizeZ / 2 + rearDeckD + sideRimD / 2);
      sideMesh.castShadow = true;
      group.add(sideMesh);
    });

    // Front curved rim lip
    const frontRimD = sizeZ * 0.08;
    const frontRimGeo = new THREE.BoxGeometry(sizeX, rimH, frontRimD);
    const frontRim = new THREE.Mesh(frontRimGeo, ceramicMat);
    frontRim.position.set(0, sizeY / 2 - rimH / 2, sizeZ / 2 - frontRimD / 2);
    frontRim.castShadow = true;
    group.add(frontRim);

    // Contoured outer tapered body
    const bodyGeo = new THREE.CylinderGeometry(sizeX * 0.47, sizeX * 0.38, bowlH - rimH, 24);
    bodyGeo.scale(1.0, 1.0, sizeZ / sizeX);
    const bodyMesh = new THREE.Mesh(bodyGeo, ceramicMat);
    bodyMesh.position.set(0, -rimH / 2, 0);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    group.add(bodyMesh);

    // 2. Hollow Inner Bowl Cavity
    const innerDepth = bowlH * 0.75;
    const innerR_top = sizeX * 0.40;
    const innerR_btm = sizeX * 0.28;
    const cavityGeo = new THREE.CylinderGeometry(innerR_top, innerR_btm, innerDepth, 24, 1, false);
    cavityGeo.scale(1.0, 1.0, (sizeZ * 0.85) / sizeX);
    const cavityMat = new THREE.MeshStandardMaterial({
      color: 0xf2f4f8,
      roughness: 0.15,
      metalness: 0.04
    });
    const cavityMesh = new THREE.Mesh(cavityGeo, cavityMat);
    cavityMesh.position.set(0, sizeY / 2 - rimH - innerDepth / 2, sizeZ * 0.04);
    group.add(cavityMesh);

    // 3. Chrome Pop-Up Drain Plug Stopper
    const drainR = sizeX * 0.07;
    const drainBezelGeo = new THREE.CylinderGeometry(drainR * 1.25, drainR * 1.25, bowlH * 0.03, 16);
    const drainBezel = new THREE.Mesh(drainBezelGeo, chromeMat);
    const drainY = sizeY / 2 - rimH - innerDepth + bowlH * 0.015;
    drainBezel.position.set(0, drainY, sizeZ * 0.04);
    group.add(drainBezel);

    const plugGeo = new THREE.CylinderGeometry(drainR * 0.9, drainR * 0.9, bowlH * 0.03, 16);
    const plug = new THREE.Mesh(plugGeo, chromeMat);
    plug.position.set(0, drainY + bowlH * 0.015, sizeZ * 0.04);
    group.add(plug);

    // 4. Chrome Overflow Hole (on upper rear wall)
    const overflowGeo = new THREE.CylinderGeometry(drainR * 0.35, drainR * 0.35, sizeZ * 0.08, 12);
    overflowGeo.rotateX(Math.PI / 2);
    const overflow = new THREE.Mesh(overflowGeo, chromeMat);
    overflow.position.set(0, sizeY / 2 - rimH * 2.2, -sizeZ * 0.35);
    group.add(overflow);

    // 5. Rear Faucet Deck with Soap Indent
    [-sizeX * 0.32, sizeX * 0.32].forEach(sx => {
      const soapGeo = new THREE.BoxGeometry(sizeX * 0.16, rimH * 0.25, sizeZ * 0.18);
      const soapMesh = new THREE.Mesh(soapGeo, ceramicMat);
      soapMesh.position.set(sx, sizeY / 2 - rimH * 0.2, -sizeZ * 0.32);
      group.add(soapMesh);
    });

    return group;
  }

  createBasinPedestal(item) {
    const [xmin, xmax, ymin, ymax, zmin, zmax] = item.box;
    const sizeX = xmax - xmin;
    const sizeY = zmax - zmin; // CAD Z -> Three.js Y
    const sizeZ = ymax - ymin; // CAD Y -> Three.js Z

    const posX = (xmin + xmax) / 2;
    const posY = (zmin + zmax) / 2;
    const posZ = -((ymin + ymax) / 2);

    const group = new THREE.Group();
    group.name = `BasinPedestal_${item.id}`;
    group.position.set(posX, posY, posZ);

    const ceramicMat = this.materials.get('M-SANITARY-WHITE') || new THREE.MeshStandardMaterial({
      color: 0xf5f7fb,
      roughness: 0.14,
      metalness: 0.04
    });

    // 1. Flared Plinth Base Footing
    const baseH = sizeY * 0.14;
    const baseGeo = new THREE.BoxGeometry(sizeX, baseH, sizeZ);
    const baseMesh = new THREE.Mesh(baseGeo, ceramicMat);
    baseMesh.position.set(0, -sizeY / 2 + baseH / 2, 0);
    baseMesh.receiveShadow = true;
    group.add(baseMesh);

    // 2. Elegant Tapered Column Shaft
    const shaftH = sizeY - baseH * 2;
    const shaftGeo = new THREE.CylinderGeometry(sizeX * 0.38, sizeX * 0.44, shaftH, 16);
    shaftGeo.scale(1.0, 1.0, sizeZ / sizeX);
    const shaftMesh = new THREE.Mesh(shaftGeo, ceramicMat);
    shaftMesh.position.set(0, 0, 0);
    shaftMesh.castShadow = true;
    shaftMesh.receiveShadow = true;
    group.add(shaftMesh);

    // 3. Fluted Flange Collar (Top Cradle)
    const topH = baseH;
    const topGeo = new THREE.BoxGeometry(sizeX * 0.92, topH, sizeZ * 0.92);
    const topMesh = new THREE.Mesh(topGeo, ceramicMat);
    topMesh.position.set(0, sizeY / 2 - topH / 2, 0);
    topMesh.castShadow = true;
    group.add(topMesh);

    return group;
  }

  createDiningTable(item) {
    const [xmin, xmax, ymin, ymax, zmin, zmax] = item.box;
    const sizeX = xmax - xmin;
    const sizeZ = ymax - ymin; // CAD Y -> Three.js Z

    const posX = (xmin + xmax) / 2;
    const isGF = item.id === 'DIN-01' || item.id === 'LOB-09';
    const floorY = (isGF ? 1.50 : 12.00) * WORLD_SCALE;
    const tableTopY = isGF ? (4.00 * WORLD_SCALE) : (14.50 * WORLD_SCALE);
    const totalH = tableTopY - floorY;
    const posY = floorY + totalH / 2;
    const posZ = -((ymin + ymax) / 2);

    const group = new THREE.Group();
    group.name = `DiningTable_${item.id}`;
    group.position.set(posX, posY, posZ);

    const woodMat = this.materials.get('M-WOOD-DARK') || new THREE.MeshStandardMaterial({
      color: 0x2b1d14,
      roughness: 0.35,
      metalness: 0.05
    });
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.20
    });

    // 1. Polished Tabletop Slab with Beveled Underside Chamfer
    const topThick = totalH * 0.08;
    const topGeo = new THREE.BoxGeometry(sizeX, topThick, sizeZ);
    const topMesh = new THREE.Mesh(topGeo, woodMat);
    topMesh.position.set(0, totalH / 2 - topThick / 2, 0);
    topMesh.castShadow = true;
    topMesh.receiveShadow = true;
    group.add(topMesh);

    // 2. Recessed Perimeter Apron Sub-Frame
    const apronInset = sizeX * 0.06;
    const apronH = totalH * 0.16;
    const apronW = sizeX - apronInset * 2;
    const apronD = sizeZ - apronInset * 2;
    const apronThick = sizeX * 0.025;

    [-apronD / 2 + apronThick / 2, apronD / 2 - apronThick / 2].forEach(pz => {
      const railGeo = new THREE.BoxGeometry(apronW, apronH, apronThick);
      const railMesh = new THREE.Mesh(railGeo, woodMat);
      railMesh.position.set(0, totalH / 2 - topThick - apronH / 2, pz);
      railMesh.castShadow = true;
      group.add(railMesh);
    });
    [-apronW / 2 + apronThick / 2, apronW / 2 - apronThick / 2].forEach(px => {
      const railGeo = new THREE.BoxGeometry(apronThick, apronH, apronD - apronThick * 2);
      const railMesh = new THREE.Mesh(railGeo, woodMat);
      railMesh.position.set(px, totalH / 2 - topThick - apronH / 2, 0);
      railMesh.castShadow = true;
      group.add(railMesh);
    });

    // 3. Four Elegant Tapered Square Legs with Brass Ferrules
    const legTopW = sizeX * 0.055;
    const legBtmW = sizeX * 0.035;
    const legH = totalH - topThick;
    const legPosX = apronW / 2 - legTopW / 2;
    const legPosZ = apronD / 2 - legTopW / 2;

    [[-legPosX, -legPosZ], [legPosX, -legPosZ], [-legPosX, legPosZ], [legPosX, legPosZ]].forEach(([lx, lz]) => {
      const legGeo = new THREE.CylinderGeometry(legTopW * 0.6, legBtmW * 0.6, legH, 4);
      legGeo.rotateY(Math.PI / 4);
      const legMesh = new THREE.Mesh(legGeo, woodMat);
      legMesh.position.set(lx, totalH / 2 - topThick - legH / 2, lz);
      legMesh.castShadow = true;
      group.add(legMesh);

      const ferruleH = legH * 0.08;
      const ferruleGeo = new THREE.CylinderGeometry(legBtmW * 0.65, legBtmW * 0.62, ferruleH, 16);
      const ferruleMesh = new THREE.Mesh(ferruleGeo, brassMat);
      ferruleMesh.position.set(lx, -totalH / 2 + ferruleH / 2, lz);
      group.add(ferruleMesh);
    });

    return group;
  }

  createDiningChair(item) {
    const [xmin, xmax, ymin, ymax, zmin, zmax] = item.box;
    const sizeX = xmax - xmin;
    const sizeZ = ymax - ymin; // CAD Y -> Three.js Z

    const s = WORLD_SCALE;
    const floorY = zmin; // Floor elevation (1.50*s on GF, 12.00*s on 1F)

    // Standard ergonomic dining chair dimensions:
    // Seat cushion height: 1.45 ft (17.4 inches) above floor
    // Total chair height: 2.90 ft (34.8 inches) to top of backrest crest
    const totalH = 2.90 * s;
    const seatElev = 1.45 * s;
    const posX = (xmin + xmax) / 2;
    const posY = floorY + totalH / 2;
    const posZ = -((ymin + ymax) / 2);

    const group = new THREE.Group();
    group.name = `DiningChair_${item.id}`;
    group.position.set(posX, posY, posZ);

    const woodMat = this.materials.get('M-WOOD-DARK') || new THREE.MeshStandardMaterial({
      color: 0x2b1d14,
      roughness: 0.38,
      metalness: 0.05
    });
    const cushionMat = new THREE.MeshStandardMaterial({
      color: 0xefeae1,
      roughness: 0.75,
      metalness: 0.02
    });
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.20
    });

    let backrestSide = '-Z';
    if (
      item.id === 'LOB-14' ||
      item.id === 'LOB-15' ||
      item.id === 'DIN-06' ||
      item.id === 'DIN-07' ||
      item.id === 'LB-18' ||
      item.id === 'LB-19'
    ) {
      backrestSide = '-Z'; // North chairs face South (+Z)
    } else if (
      item.id === 'LOB-16' ||
      item.id === 'LOB-17' ||
      item.id === 'DIN-08' ||
      item.id === 'DIN-09' ||
      item.id === 'LB-16' ||
      item.id === 'LB-17'
    ) {
      backrestSide = '+Z'; // South chairs face North (-Z)
    } else if (item.id === 'LB-14') {
      backrestSide = '-X'; // West chair faces East (+X)
    } else if (item.id === 'LB-15') {
      backrestSide = '+X'; // East chair faces West (-X)
    }

    const cushionH = 0.09 * s;
    const seatFrameH = 0.07 * s;
    const legH = seatElev - cushionH;
    const legW = sizeX * 0.08;

    // 1. Four Tapered Wooden Legs with Brass Glides
    const lx = sizeX / 2 - legW;
    const lz = sizeZ / 2 - legW;
    [[-lx, -lz], [lx, -lz], [-lx, lz], [lx, lz]].forEach(([px, pz]) => {
      const legGeo = new THREE.CylinderGeometry(legW * 0.45, legW * 0.30, legH, 8);
      const legMesh = new THREE.Mesh(legGeo, woodMat);
      legMesh.position.set(px, -totalH / 2 + legH / 2, pz);
      legMesh.castShadow = true;
      group.add(legMesh);

      const glideGeo = new THREE.CylinderGeometry(legW * 0.32, legW * 0.32, legH * 0.06, 12);
      const glideMesh = new THREE.Mesh(glideGeo, brassMat);
      glideMesh.position.set(px, -totalH / 2 + legH * 0.03, pz);
      group.add(glideMesh);
    });

    // Leg Stretchers
    [-lz, lz].forEach(pz => {
      const rGeo = new THREE.BoxGeometry(sizeX * 0.70, legW * 0.5, legW * 0.4);
      const rMesh = new THREE.Mesh(rGeo, woodMat);
      rMesh.position.set(0, -totalH / 2 + legH * 0.40, pz);
      group.add(rMesh);
    });

    // 2. Seat Frame & Padded Cushion (Top surface sits at seatElev = 1.45*s above floor)
    const seatGeo = new THREE.BoxGeometry(sizeX * 0.94, seatFrameH, sizeZ * 0.94);
    const seatMesh = new THREE.Mesh(seatGeo, woodMat);
    seatMesh.position.set(0, -totalH / 2 + legH - seatFrameH / 2, 0);
    seatMesh.castShadow = true;
    group.add(seatMesh);

    const cushionGeo = new THREE.BoxGeometry(sizeX * 0.92, cushionH, sizeZ * 0.92);
    const cushionMesh = new THREE.Mesh(cushionGeo, cushionMat);
    cushionMesh.position.set(0, -totalH / 2 + legH + cushionH / 2, 0);
    cushionMesh.castShadow = true;
    cushionMesh.receiveShadow = true;
    group.add(cushionMesh);

    // 3. Ergonomic Backrest
    const backH = totalH - seatElev;
    const backThick = sizeX * 0.08;
    const backY = -totalH / 2 + seatElev + backH / 2;

    if (backrestSide === '-Z' || backrestSide === '+Z') {
      const bz = (backrestSide === '-Z') ? (-sizeZ / 2 + backThick / 2) : (sizeZ / 2 - backThick / 2);

      [-sizeX / 2 + backThick / 2, sizeX / 2 - backThick / 2].forEach(bx => {
        const stileGeo = new THREE.BoxGeometry(backThick, backH, backThick);
        const stileMesh = new THREE.Mesh(stileGeo, woodMat);
        stileMesh.position.set(bx, backY, bz);
        stileMesh.castShadow = true;
        group.add(stileMesh);
      });

      const crestGeo = new THREE.BoxGeometry(sizeX * 0.94, backH * 0.22, backThick * 1.1);
      const crestMesh = new THREE.Mesh(crestGeo, woodMat);
      crestMesh.position.set(0, -totalH / 2 + seatElev + backH - backH * 0.11, bz);
      crestMesh.castShadow = true;
      group.add(crestMesh);

      [-sizeX * 0.20, 0, sizeX * 0.20].forEach(sx => {
        const slatGeo = new THREE.BoxGeometry(sizeX * 0.05, backH * 0.65, backThick * 0.5);
        const slatMesh = new THREE.Mesh(slatGeo, woodMat);
        slatMesh.position.set(sx, backY - backH * 0.06, bz);
        group.add(slatMesh);
      });
    } else {
      const bx = (backrestSide === '-X') ? (-sizeX / 2 + backThick / 2) : (sizeX / 2 - backThick / 2);

      [-sizeZ / 2 + backThick / 2, sizeZ / 2 - backThick / 2].forEach(bz => {
        const stileGeo = new THREE.BoxGeometry(backThick, backH, backThick);
        const stileMesh = new THREE.Mesh(stileGeo, woodMat);
        stileMesh.position.set(bx, backY, bz);
        stileMesh.castShadow = true;
        group.add(stileMesh);
      });

      const crestGeo = new THREE.BoxGeometry(backThick * 1.1, backH * 0.22, sizeZ * 0.94);
      const crestMesh = new THREE.Mesh(crestGeo, woodMat);
      crestMesh.position.set(bx, -totalH / 2 + seatElev + backH - backH * 0.11, 0);
      crestMesh.castShadow = true;
      group.add(crestMesh);

      [-sizeZ * 0.20, 0, sizeZ * 0.20].forEach(sz => {
        const slatGeo = new THREE.BoxGeometry(backThick * 0.5, backH * 0.65, sizeZ * 0.05);
        const slatMesh = new THREE.Mesh(slatGeo, woodMat);
        slatMesh.position.set(bx, backY - backH * 0.06, sz);
        group.add(slatMesh);
      });
    }

    return group;
  }

  createCoffeeTable(item) {
    const [xmin, xmax, ymin, ymax, zmin, zmax] = item.box;
    const sizeX = xmax - xmin;
    const sizeY = zmax - zmin; // CAD Z -> Three.js Y
    const sizeZ = ymax - ymin; // CAD Y -> Three.js Z

    const posX = (xmin + xmax) / 2;
    const posY = (zmin + zmax) / 2;
    const posZ = -((ymin + ymax) / 2);

    const group = new THREE.Group();
    group.name = `CoffeeTable_${item.id}`;
    group.position.set(posX, posY, posZ);

    const woodMat = this.materials.get('M-WOOD-DARK') || new THREE.MeshStandardMaterial({
      color: 0x24180f,
      roughness: 0.35,
      metalness: 0.05
    });
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x1a2630,
      roughness: 0.05,
      metalness: 0.15,
      transparent: true,
      opacity: 0.65
    });
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.90,
      roughness: 0.15
    });

    // 1. Upper Tabletop with Inset Glass Panel
    const topThick = sizeY * 0.07;
    const frameW = sizeX * 0.08;
    [-sizeZ / 2 + frameW / 2, sizeZ / 2 - frameW / 2].forEach(pz => {
      const fGeo = new THREE.BoxGeometry(sizeX, topThick, frameW);
      const fMesh = new THREE.Mesh(fGeo, woodMat);
      fMesh.position.set(0, sizeY / 2 - topThick / 2, pz);
      fMesh.castShadow = true;
      group.add(fMesh);
    });
    [-sizeX / 2 + frameW / 2, sizeX / 2 - frameW / 2].forEach(px => {
      const fGeo = new THREE.BoxGeometry(frameW, topThick, sizeZ - frameW * 2);
      const fMesh = new THREE.Mesh(fGeo, woodMat);
      fMesh.position.set(px, sizeY / 2 - topThick / 2, 0);
      fMesh.castShadow = true;
      group.add(fMesh);
    });

    const glassGeo = new THREE.BoxGeometry(sizeX - frameW * 1.9, topThick * 0.7, sizeZ - frameW * 1.9);
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    glassMesh.position.set(0, sizeY / 2 - topThick / 2, 0);
    group.add(glassMesh);

    // 2. Lower Open Magazine / Storage Shelf Tier
    const shelfY = -sizeY * 0.15;
    const shelfGeo = new THREE.BoxGeometry(sizeX * 0.88, topThick * 0.8, sizeZ * 0.88);
    const shelfMesh = new THREE.Mesh(shelfGeo, woodMat);
    shelfMesh.position.set(0, shelfY, 0);
    shelfMesh.receiveShadow = true;
    group.add(shelfMesh);

    // 3. Four Tapered Legs with Brass Feet
    const legTopW = sizeX * 0.045;
    const legBtmW = sizeX * 0.025;
    const legH = sizeY - topThick;
    const lx = sizeX / 2 - frameW * 1.1;
    const lz = sizeZ / 2 - frameW * 1.1;

    [[-lx, -lz], [lx, -lz], [-lx, lz], [lx, lz]].forEach(([px, pz]) => {
      const legGeo = new THREE.CylinderGeometry(legTopW * 0.5, legBtmW * 0.5, legH, 12);
      const legMesh = new THREE.Mesh(legGeo, woodMat);
      legMesh.position.set(px, -topThick / 2, pz);
      legMesh.castShadow = true;
      group.add(legMesh);

      const footGeo = new THREE.CylinderGeometry(legBtmW * 0.6, legBtmW * 0.6, legH * 0.10, 12);
      const footMesh = new THREE.Mesh(footGeo, brassMat);
      footMesh.position.set(px, -sizeY / 2 + legH * 0.05, pz);
      group.add(footMesh);
    });

    return group;
  }

  createStudyChair(item) {
    const [xmin, xmax, ymin, ymax, zmin, zmax] = item.box;
    const sizeX = xmax - xmin;
    const sizeY = (15.200 - 12.000) * WORLD_SCALE;
    const sizeZ = ymax - ymin;

    const posX = (xmin + xmax) / 2;
    const posY = (12.000 * WORLD_SCALE) + sizeY / 2;
    const posZ = -((ymin + ymax) / 2);

    const group = new THREE.Group();
    group.name = `StudyChair_${item.id}`;
    group.position.set(posX, posY, posZ);

    const chromeMat = this.materials.get('M-CHROME') || new THREE.MeshStandardMaterial({
      color: 0xdde0e3,
      metalness: 0.92,
      roughness: 0.15
    });
    const cushionMat = new THREE.MeshStandardMaterial({
      color: 0x263238,
      roughness: 0.60
    });

    const seatRelY = (1.60 * WORLD_SCALE) - sizeY / 2;

    // 1. Chrome Star Base
    const legRadius = Math.min(sizeX, sizeZ) * 0.44;
    [0, (Math.PI * 2) / 4, (Math.PI * 2) / 2, (Math.PI * 3) / 2].forEach(angle => {
      const legGeo = new THREE.BoxGeometry(legRadius, sizeX * 0.03, sizeX * 0.04);
      const legMesh = new THREE.Mesh(legGeo, chromeMat);
      legMesh.position.set(Math.cos(angle) * (legRadius / 2), -sizeY / 2 + sizeX * 0.03, Math.sin(angle) * (legRadius / 2));
      legMesh.rotation.y = -angle;
      group.add(legMesh);
    });

    const colGeo = new THREE.CylinderGeometry(sizeX * 0.04, sizeX * 0.05, 1.40 * WORLD_SCALE, 16);
    const colMesh = new THREE.Mesh(colGeo, chromeMat);
    colMesh.position.set(0, -sizeY / 2 + (1.40 * WORLD_SCALE) / 2, 0);
    group.add(colMesh);

    // 2. Sculpted Bucket Seat Cushion
    const seatGeo = new THREE.BoxGeometry(sizeX * 0.88, sizeX * 0.09, sizeZ * 0.88);
    const seatMesh = new THREE.Mesh(seatGeo, cushionMat);
    seatMesh.position.set(0, seatRelY, 0);
    seatMesh.castShadow = true;
    group.add(seatMesh);

    // 3. Ergonomic Contoured Backrest
    const backH = sizeY - (seatRelY + sizeY / 2);
    const backThick = sizeX * 0.06;
    const backGeo = new THREE.BoxGeometry(backThick, backH * 0.85, sizeZ * 0.82);
    const backMesh = new THREE.Mesh(backGeo, cushionMat);
    backMesh.position.set(-sizeX * 0.38, seatRelY + backH * 0.50, 0);
    backMesh.castShadow = true;
    group.add(backMesh);

    const spineGeo = new THREE.CylinderGeometry(sizeX * 0.025, sizeX * 0.025, backH * 0.90, 12);
    const spineMesh = new THREE.Mesh(spineGeo, chromeMat);
    spineMesh.position.set(-sizeX * 0.42, seatRelY + backH * 0.45, 0);
    group.add(spineMesh);

    return group;
  }

  createTelevision(item) {
    const [xmin, xmax, ymin, ymax, zmin, zmax] = item.box;
    const sizeX = xmax - xmin;
    const sizeY = zmax - zmin; // CAD Z -> Three.js Y
    const sizeZ = ymax - ymin; // CAD Y -> Three.js Z

    const posX = (xmin + xmax) / 2;
    const posY = (zmin + zmax) / 2;
    const posZ = -((ymin + ymax) / 2);

    const s = WORLD_SCALE;
    const group = new THREE.Group();
    group.name = `Television_${item.id}`;
    group.position.set(posX, posY, posZ);

    const metalFrameMat = new THREE.MeshStandardMaterial({
      color: 0x141416,
      metalness: 0.85,
      roughness: 0.25
    });
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x1c1c1f,
      metalness: 0.30,
      roughness: 0.65
    });
    const oledGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x07090d,
      roughness: 0.04,
      metalness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04
    });
    const speakerMat = new THREE.MeshStandardMaterial({
      color: 0x18181c,
      roughness: 0.70
    });
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xdedede,
      metalness: 0.95,
      roughness: 0.10
    });
    const ledMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff
    });

    // 1. Heavy-duty Dual-Arm Articulating Wall Mount (Back at +sizeX / 2 against East wall)
    const wallPlateGeo = new THREE.BoxGeometry(0.015 * s, sizeY * 0.40, sizeZ * 0.35);
    const wallPlate = new THREE.Mesh(wallPlateGeo, chassisMat);
    wallPlate.position.set(sizeX / 2 - 0.01 * s, 0, 0);
    group.add(wallPlate);

    const armGeo = new THREE.BoxGeometry(sizeX * 0.50, 0.035 * s, 0.035 * s);
    [-sizeZ * 0.10, sizeZ * 0.10].forEach(az => {
      const armMesh = new THREE.Mesh(armGeo, chassisMat);
      armMesh.position.set(sizeX * 0.20, 0, az);
      group.add(armMesh);
    });

    // 2. Tapered Rear Electronics Pack (Chassis)
    const rearChassisGeo = new THREE.BoxGeometry(sizeX * 0.45, sizeY * 0.60, sizeZ * 0.65);
    const rearChassis = new THREE.Mesh(rearChassisGeo, chassisMat);
    rearChassis.position.set(sizeX * 0.05, -sizeY * 0.05, 0);
    group.add(rearChassis);

    // 3. Ultra-Slim Bezel Display Panel
    const panelThick = 0.025 * s;
    const panelPosX = -sizeX / 2 + panelThick / 2;

    const bezelGeo = new THREE.BoxGeometry(panelThick, sizeY, sizeZ);
    const bezelMesh = new THREE.Mesh(bezelGeo, metalFrameMat);
    bezelMesh.position.set(panelPosX, 0, 0);
    bezelMesh.castShadow = true;
    group.add(bezelMesh);

    // 4. Glossy Deep OLED Screen (Facing West into the room, -X)
    const screenBorder = 0.02 * s;
    const screenH = sizeY - screenBorder * 2;
    const screenW = sizeZ - screenBorder * 2;
    const screenGeo = new THREE.PlaneGeometry(screenW, screenH);
    screenGeo.rotateY(-Math.PI / 2);
    const screenMesh = new THREE.Mesh(screenGeo, oledGlassMat);
    screenMesh.name = `TVScreen_${item.id}`;
    screenMesh.position.set(panelPosX - panelThick / 2 - 0.003 * s, 0, 0);
    group.add(screenMesh);

    // 5. Integrated Bottom Soundbar / Speaker Grille
    const barH = 0.035 * s;
    const soundbarGeo = new THREE.BoxGeometry(panelThick * 1.1, barH, sizeZ * 0.98);
    const soundbarMesh = new THREE.Mesh(soundbarGeo, speakerMat);
    soundbarMesh.name = `TVSoundbar_${item.id}`;
    soundbarMesh.position.set(panelPosX, -sizeY / 2 + barH / 2, 0);
    group.add(soundbarMesh);

    // 6. Chrome Brand Badge
    const badgeGeo = new THREE.BoxGeometry(0.004 * s, 0.012 * s, 0.07 * s);
    const badgeMesh = new THREE.Mesh(badgeGeo, chromeMat);
    badgeMesh.position.set(panelPosX - panelThick / 2 - 0.003 * s, -sizeY / 2 + barH / 2, 0);
    group.add(badgeMesh);

    // 7. Glowing Standby LED Pip (Cyan)
    const ledGeo = new THREE.SphereGeometry(0.006 * s, 8, 8);
    const ledMesh = new THREE.Mesh(ledGeo, ledMat);
    ledMesh.name = `TVLED_${item.id}`;
    ledMesh.position.set(panelPosX - panelThick / 2 - 0.003 * s, -sizeY / 2 + barH / 2, sizeZ / 2 - 0.06 * s);
    group.add(ledMesh);

    group.userData = {
      isTV: true,
      tvId: item.id,
      floor: item.floor || (item.id === 'LOB-08' ? 'ground_floor' : 'first_floor'),
      screenMesh,
      soundbarMesh,
      ledMesh
    };
    if (!this.televisions) this.televisions = [];
    this.televisions.push(group);

    return group;
  }

  createTVCabinet(item) {
    const [xmin, xmax, ymin, ymax, zmin, zmax] = item.box;
    const sizeX = xmax - xmin; // Depth across room (X: ~1.25 ft)
    const sizeY = zmax - zmin; // Height (Y: ~1.30 ft)
    const sizeZ = ymax - ymin; // Width along wall (Z: ~4.00 ft)

    const posX = (xmin + xmax) / 2;
    const posY = (zmin + zmax) / 2;
    const posZ = -((ymin + ymax) / 2);

    const s = WORLD_SCALE;
    const group = new THREE.Group();
    group.name = `TVCabinet_${item.id}`;
    group.position.set(posX, posY, posZ);

    const woodMat = this.materials.get('M-LAMINATE-WALNUT') || new THREE.MeshStandardMaterial({
      color: 0x3d281a,
      roughness: 0.40,
      metalness: 0.05
    });
    const darkWoodMat = new THREE.MeshStandardMaterial({
      color: 0x22160e,
      roughness: 0.50,
      metalness: 0.05
    });
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.20
    });
    const consoleAccMat = new THREE.MeshStandardMaterial({
      color: 0x161618,
      roughness: 0.35,
      metalness: 0.40
    });
    const ledMat = new THREE.MeshBasicMaterial({
      color: 0x00ff88
    });

    const legH = sizeY * 0.24;
    const bodyH = sizeY - legH;
    const bodyY = -sizeY / 2 + legH + bodyH / 2;
    const wallThick = 0.035 * s;

    // 1. Four Tapered Mid-Century Legs with Brass Ferrules
    const legTopW = 0.05 * s;
    const legBtmW = 0.03 * s;
    const legPosX = sizeX / 2 - legTopW * 1.5;
    const legPosZ = sizeZ / 2 - legTopW * 1.5;

    [[-legPosX, -legPosZ], [legPosX, -legPosZ], [-legPosX, legPosZ], [legPosX, legPosZ]].forEach(([lx, lz]) => {
      const legGeo = new THREE.CylinderGeometry(legTopW * 0.5, legBtmW * 0.5, legH, 8);
      const legMesh = new THREE.Mesh(legGeo, darkWoodMat);
      legMesh.position.set(lx, -sizeY / 2 + legH / 2, lz);
      legMesh.castShadow = true;
      group.add(legMesh);

      const ferruleH = legH * 0.25;
      const ferruleGeo = new THREE.CylinderGeometry(legBtmW * 0.55, legBtmW * 0.52, ferruleH, 16);
      const ferruleMesh = new THREE.Mesh(ferruleGeo, brassMat);
      ferruleMesh.position.set(lx, -sizeY / 2 + ferruleH / 2, lz);
      group.add(ferruleMesh);
    });

    // Lower Leg Cross-Stretchers
    [-legPosZ, legPosZ].forEach(lz => {
      const railGeo = new THREE.BoxGeometry(sizeX * 0.65, 0.025 * s, 0.025 * s);
      const railMesh = new THREE.Mesh(railGeo, darkWoodMat);
      railMesh.position.set(0, -sizeY / 2 + legH * 0.55, lz);
      group.add(railMesh);
    });

    // 2. Beveled Top Worktop Slab with Front Overhang
    const topOverhang = 0.025 * s;
    const topThick = 0.04 * s;
    const topGeo = new THREE.BoxGeometry(sizeX + topOverhang, topThick, sizeZ + 0.02 * s);
    const topMesh = new THREE.Mesh(topGeo, woodMat);
    topMesh.position.set(-topOverhang / 2, sizeY / 2 - topThick / 2, 0);
    topMesh.castShadow = true;
    topMesh.receiveShadow = true;
    group.add(topMesh);

    // 3. Bottom Base Panel
    const btmGeo = new THREE.BoxGeometry(sizeX, wallThick, sizeZ);
    const btmMesh = new THREE.Mesh(btmGeo, woodMat);
    btmMesh.position.set(0, -sizeY / 2 + legH + wallThick / 2, 0);
    btmMesh.receiveShadow = true;
    group.add(btmMesh);

    // 4. Back Panel (East wall, +sizeX / 2)
    const backGeo = new THREE.BoxGeometry(wallThick, bodyH - topThick - wallThick, sizeZ);
    const backMesh = new THREE.Mesh(backGeo, darkWoodMat);
    backMesh.position.set(sizeX / 2 - wallThick / 2, bodyY, 0);
    group.add(backMesh);

    // 5. Left & Right Exterior End Panels (along Z)
    [-sizeZ / 2 + wallThick / 2, sizeZ / 2 - wallThick / 2].forEach(pz => {
      const sideGeo = new THREE.BoxGeometry(sizeX, bodyH - topThick - wallThick, wallThick);
      const sideMesh = new THREE.Mesh(sideGeo, woodMat);
      sideMesh.position.set(0, bodyY, pz);
      sideMesh.castShadow = true;
      group.add(sideMesh);
    });

    // 6. Partition Layout (Left & Right Drawer Bays + Center Open AV Cubby)
    const centerW = sizeZ * 0.40;
    const sideW = (sizeZ - centerW - wallThick * 4) / 2;

    // Vertical Bay Dividers
    [-centerW / 2 - wallThick / 2, centerW / 2 + wallThick / 2].forEach(divZ => {
      const divGeo = new THREE.BoxGeometry(sizeX - wallThick, bodyH - topThick - wallThick, wallThick);
      const divMesh = new THREE.Mesh(divGeo, woodMat);
      divMesh.position.set(-wallThick / 2, bodyY, divZ);
      group.add(divMesh);
    });

    // Center Open AV Component Divider Shelf
    const shelfGeo = new THREE.BoxGeometry(sizeX - wallThick * 1.5, wallThick * 0.7, centerW);
    const shelfMesh = new THREE.Mesh(shelfGeo, darkWoodMat);
    shelfMesh.position.set(-wallThick / 2, bodyY, 0);
    group.add(shelfMesh);

    // Center Back Cable Pass-Through Port
    const portGeo = new THREE.CylinderGeometry(0.04 * s, 0.04 * s, wallThick * 1.2, 16);
    portGeo.rotateZ(Math.PI / 2);
    const portMesh = new THREE.Mesh(portGeo, consoleAccMat);
    portMesh.position.set(sizeX / 2 - wallThick / 2, bodyY + bodyH * 0.16, 0);
    group.add(portMesh);

    // Sleek 4K Media Streaming Console Box on lower shelf
    const mediaBoxGeo = new THREE.BoxGeometry(sizeX * 0.35, 0.035 * s, 0.32 * s);
    const mediaBox = new THREE.Mesh(mediaBoxGeo, consoleAccMat);
    mediaBox.position.set(-sizeX * 0.15, bodyY + wallThick * 0.5 + 0.0175 * s, 0);
    group.add(mediaBox);

    const boxLedGeo = new THREE.SphereGeometry(0.005 * s, 8, 8);
    const boxLed = new THREE.Mesh(boxLedGeo, ledMat);
    boxLed.position.set(-sizeX * 0.15 - (sizeX * 0.35) / 2, bodyY + wallThick * 0.5 + 0.0175 * s, 0.12 * s);
    group.add(boxLed);

    // Left & Right Drawer Fronts with Horizontal Brushed Brass Handles
    [-centerW / 2 - wallThick - sideW / 2, centerW / 2 + wallThick + sideW / 2].forEach(pz => {
      const drawerGeo = new THREE.BoxGeometry(wallThick, bodyH - topThick - wallThick * 1.4, sideW * 0.96);
      const drawerMesh = new THREE.Mesh(drawerGeo, woodMat);
      drawerMesh.position.set(-sizeX / 2 + wallThick / 2, bodyY, pz);
      drawerMesh.castShadow = true;
      group.add(drawerMesh);

      // Fluted accent trim on drawer face
      const trimGeo = new THREE.BoxGeometry(0.008 * s, (bodyH - topThick) * 0.85, sideW * 0.88);
      const trimMesh = new THREE.Mesh(trimGeo, darkWoodMat);
      trimMesh.position.set(-sizeX / 2 - 0.004 * s, bodyY, pz);
      group.add(trimMesh);

      // Horizontal brushed brass pull bar
      const handleBarGeo = new THREE.BoxGeometry(0.02 * s, 0.02 * s, sideW * 0.45);
      const handleMesh = new THREE.Mesh(handleBarGeo, brassMat);
      handleMesh.position.set(-sizeX / 2 - 0.025 * s, bodyY, pz);
      handleMesh.castShadow = true;
      [-sideW * 0.16, sideW * 0.16].forEach(oz => {
        const standoffGeo = new THREE.BoxGeometry(0.02 * s, 0.015 * s, 0.015 * s);
        const standoff = new THREE.Mesh(standoffGeo, brassMat);
        standoff.position.set(0.01 * s, 0, oz);
        handleMesh.add(standoff);
      });
      group.add(handleMesh);
    });

    return group;
  }

  createMandirShrine(item) {
    const [xmin, xmax, ymin, ymax, zmin, zmax] = item.box;
    const sizeX = xmax - xmin;
    const sizeY = zmax - zmin; // CAD Z -> Three.js Y
    const sizeZ = ymax - ymin; // CAD Y -> Three.js Z

    const posX = (xmin + xmax) / 2;
    const posY = (zmin + zmax) / 2;
    const posZ = -((ymin + ymax) / 2);

    const s = WORLD_SCALE;
    const group = new THREE.Group();
    group.name = `MandirShrine_${item.id}`;
    group.position.set(posX, posY, posZ);
    group.userData = item;

    // Materials: Traditional Rich Teak Wood, Dark Rosewood & Polished Temple Brass
    const teakMat = new THREE.MeshStandardMaterial({
      color: 0x482410,
      roughness: 0.52,
      metalness: 0.04
    });
    const darkTeakMat = new THREE.MeshStandardMaterial({
      color: 0x2e1407,
      roughness: 0.62,
      metalness: 0.03
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xdfaa33,
      roughness: 0.22,
      metalness: 0.88
    });
    const brassMat = this.materials.get('M-BRASS') || goldMat;

    // Load Holy Mandir Image Texture (/images/mandir.jpg)
    const textureLoader = new THREE.TextureLoader();
    const photoTexture = textureLoader.load('/images/mandir.jpg?v=2', () => {
      photoMat.needsUpdate = true;
    });
    photoTexture.colorSpace = THREE.SRGBColorSpace;

    const photoMat = new THREE.MeshStandardMaterial({
      map: photoTexture,
      roughness: 0.28,
      metalness: 0.04,
      side: THREE.DoubleSide
    });

    // 1. Holy Photo with exact aspect ratio (4166 : 2136 = 1.9503745)
    // Width = 4.40 ft * s. Height = (4.40 / (4166 / 2136)) * s = 2.256001 * s.
    const photoAspectRatio = 4166 / 2136;
    const photoWidth = 4.40 * s;
    const photoHeight = photoWidth / photoAspectRatio;

    // Base of the shrine rests on marble platform at local Y = -sizeY / 2
    const baseBottomY = -sizeY / 2;

    // Main carved wooden plinth (Chowki)
    const plinthHeight = 0.24 * s;
    const plinthGeo = new THREE.BoxGeometry(sizeX * 0.98, plinthHeight, sizeZ * 0.96);
    const plinthMesh = new THREE.Mesh(plinthGeo, teakMat);
    plinthMesh.position.set(0, baseBottomY + plinthHeight / 2, 0);
    plinthMesh.castShadow = true;
    plinthMesh.receiveShadow = true;
    group.add(plinthMesh);

    // Gold molding trim around plinth
    const plinthTrimGeo = new THREE.BoxGeometry(sizeX * 0.99, 0.035 * s, sizeZ * 0.97);
    const plinthTrim = new THREE.Mesh(plinthTrimGeo, goldMat);
    plinthTrim.position.set(0, baseBottomY + plinthHeight - 0.0175 * s, 0);
    group.add(plinthTrim);

    // Inner sanctum step (Asana / pedestal step for photo)
    const stepHeight = 0.09 * s;
    const stepGeo = new THREE.BoxGeometry(photoWidth + 0.20 * s, stepHeight, sizeZ * 0.50);
    const stepMesh = new THREE.Mesh(stepGeo, darkTeakMat);
    const stepTopY = baseBottomY + plinthHeight + stepHeight;
    stepMesh.position.set(0, baseBottomY + plinthHeight + stepHeight / 2, 0);
    stepMesh.castShadow = true;
    stepMesh.receiveShadow = true;
    group.add(stepMesh);

    // Backboard panel (Prabhavali backing board against East wall)
    const backZ = sizeZ / 2 - 0.04 * s;
    const backHeight = photoHeight + 0.65 * s;
    const backGeo = new THREE.BoxGeometry(sizeX * 0.96, backHeight, 0.06 * s);
    const backMesh = new THREE.Mesh(backGeo, teakMat);
    const backCenterY = stepTopY + backHeight / 2 - 0.05 * s;
    backMesh.position.set(0, backCenterY, backZ);
    backMesh.castShadow = true;
    group.add(backMesh);

    // Position of the photo:
    // Sits upright directly on the step (bottom at stepTopY)
    const photoCenterY = stepTopY + photoHeight / 2;
    const photoZ = backZ - 0.04 * s; // Mounted just in front of backboard

    // Custom BufferGeometry with normal (0, 0, -1) facing devotee looking towards East wall
    const hw = photoWidth / 2;
    const hh = photoHeight / 2;
    const photoGeo = new THREE.BufferGeometry();
    const positions = new Float32Array([
      -hw,  hh, 0, // 0: Top-Left
       hw,  hh, 0, // 1: Top-Right
      -hw, -hh, 0, // 2: Bottom-Left
       hw, -hh, 0  // 3: Bottom-Right
    ]);
    const uvs = new Float32Array([
      0, 1, // 0: TL
      1, 1, // 1: TR
      0, 0, // 2: BL
      1, 0  // 3: BR
    ]);
    const indices = [0, 1, 2, 1, 3, 2];
    photoGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    photoGeo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    photoGeo.setIndex(indices);
    photoGeo.computeVertexNormals();

    const photoMesh = new THREE.Mesh(photoGeo, photoMat);
    photoMesh.position.set(0, photoCenterY, photoZ);
    group.add(photoMesh);

    // Ornate Gold Beveled Picture Frame around Photo
    const frameThick = 0.055 * s;
    const frameDepth = 0.045 * s;
    const framePosZ = photoZ - frameDepth / 2;

    // Top Frame Rail
    const topRailGeo = new THREE.BoxGeometry(photoWidth + frameThick * 2, frameThick, frameDepth);
    const topRail = new THREE.Mesh(topRailGeo, goldMat);
    topRail.position.set(0, photoCenterY + hh + frameThick / 2, framePosZ);
    topRail.castShadow = true;
    group.add(topRail);

    // Bottom Frame Rail
    const botRailGeo = new THREE.BoxGeometry(photoWidth + frameThick * 2, frameThick, frameDepth);
    const botRail = new THREE.Mesh(botRailGeo, goldMat);
    botRail.position.set(0, photoCenterY - hh - frameThick / 2, framePosZ);
    botRail.castShadow = true;
    group.add(botRail);

    // Left Frame Stile
    const leftStileGeo = new THREE.BoxGeometry(frameThick, photoHeight, frameDepth);
    const leftStile = new THREE.Mesh(leftStileGeo, goldMat);
    leftStile.position.set(-hw - frameThick / 2, photoCenterY, framePosZ);
    leftStile.castShadow = true;
    group.add(leftStile);

    // Right Frame Stile
    const rightStileGeo = new THREE.BoxGeometry(frameThick, photoHeight, frameDepth);
    const rightStile = new THREE.Mesh(rightStileGeo, goldMat);
    rightStile.position.set(hw + frameThick / 2, photoCenterY, framePosZ);
    rightStile.castShadow = true;
    group.add(rightStile);

    // Fluted Carved Wooden Side Pillars (Left and Right)
    const pillarXOffset = hw + frameThick + 0.11 * s;
    const pillarZ = photoZ - 0.08 * s;
    const pillarHeight = photoHeight + frameThick * 2 + 0.10 * s;
    [-pillarXOffset, pillarXOffset].forEach(px => {
      // Square Plinth Base
      const colBaseGeo = new THREE.BoxGeometry(0.18 * s, 0.12 * s, 0.18 * s);
      const colBase = new THREE.Mesh(colBaseGeo, teakMat);
      colBase.position.set(px, stepTopY + 0.06 * s, pillarZ);
      colBase.castShadow = true;
      group.add(colBase);

      const colBaseTrimGeo = new THREE.BoxGeometry(0.19 * s, 0.02 * s, 0.19 * s);
      const colBaseTrim = new THREE.Mesh(colBaseTrimGeo, goldMat);
      colBaseTrim.position.set(px, stepTopY + 0.12 * s, pillarZ);
      group.add(colBaseTrim);

      // Fluted Cylindrical Shaft
      const shaftHeight = pillarHeight - 0.28 * s;
      const shaftGeo = new THREE.CylinderGeometry(0.055 * s, 0.065 * s, shaftHeight, 16);
      const shaft = new THREE.Mesh(shaftGeo, teakMat);
      shaft.position.set(px, stepTopY + 0.13 * s + shaftHeight / 2, pillarZ);
      shaft.castShadow = true;
      group.add(shaft);

      // Bell Capital & Abacus
      const capGeo = new THREE.CylinderGeometry(0.085 * s, 0.055 * s, 0.09 * s, 16);
      const cap = new THREE.Mesh(capGeo, goldMat);
      cap.position.set(px, stepTopY + 0.13 * s + shaftHeight + 0.045 * s, pillarZ);
      cap.castShadow = true;
      group.add(cap);

      // Corner Kalash finial above pillar
      const cornerKalashGeo = new THREE.ConeGeometry(0.045 * s, 0.16 * s, 12);
      const cornerKalash = new THREE.Mesh(cornerKalashGeo, goldMat);
      cornerKalash.position.set(px, stepTopY + pillarHeight + 0.18 * s, pillarZ);
      group.add(cornerKalash);
    });

    // Temple Architrave / Torana Beam across the top
    const beamY = photoCenterY + hh + frameThick + 0.09 * s;
    const beamGeo = new THREE.BoxGeometry(sizeX * 0.98, 0.14 * s, 0.28 * s);
    const beamMesh = new THREE.Mesh(beamGeo, teakMat);
    beamMesh.position.set(0, beamY, pillarZ);
    beamMesh.castShadow = true;
    group.add(beamMesh);

    // Decorative Gold Inlay Band across Architrave
    const beamBandGeo = new THREE.BoxGeometry(sizeX * 0.99, 0.03 * s, 0.29 * s);
    const beamBand = new THREE.Mesh(beamBandGeo, goldMat);
    beamBand.position.set(0, beamY, pillarZ);
    group.add(beamBand);

    // Tiered Temple Shikhara (Gopuram / Crown)
    // Tier 1: Lower Cornice
    const tier1H = 0.16 * s;
    const tier1Y = beamY + 0.07 * s + tier1H / 2;
    const tier1Geo = new THREE.BoxGeometry(sizeX * 0.86, tier1H, 0.32 * s);
    const tier1Mesh = new THREE.Mesh(tier1Geo, darkTeakMat);
    tier1Mesh.position.set(0, tier1Y, pillarZ);
    tier1Mesh.castShadow = true;
    group.add(tier1Mesh);

    // Tier 2: Middle Pyramid Canopy
    const tier2H = 0.16 * s;
    const tier2Y = tier1Y + tier1H / 2 + tier2H / 2;
    const tier2Geo = new THREE.BoxGeometry(sizeX * 0.62, tier2H, 0.26 * s);
    const tier2Mesh = new THREE.Mesh(tier2Geo, teakMat);
    tier2Mesh.position.set(0, tier2Y, pillarZ);
    tier2Mesh.castShadow = true;
    group.add(tier2Mesh);

    // Tier 3: Upper Crest
    const tier3H = 0.12 * s;
    const tier3Y = tier2Y + tier2H / 2 + tier3H / 2;
    const tier3Geo = new THREE.BoxGeometry(sizeX * 0.38, tier3H, 0.20 * s);
    const tier3Mesh = new THREE.Mesh(tier3Geo, darkTeakMat);
    tier3Mesh.position.set(0, tier3Y, pillarZ);
    tier3Mesh.castShadow = true;
    group.add(tier3Mesh);

    // Central Sacred Golden Kalash Finial (Pot + Spire)
    const kalashBaseY = tier3Y + tier3H / 2;
    const kalashPotGeo = new THREE.SphereGeometry(0.09 * s, 16, 12);
    const kalashPot = new THREE.Mesh(kalashPotGeo, goldMat);
    kalashPot.position.set(0, kalashBaseY + 0.09 * s, pillarZ);
    group.add(kalashPot);

    const kalashSpireGeo = new THREE.ConeGeometry(0.05 * s, 0.22 * s, 16);
    const kalashSpire = new THREE.Mesh(kalashSpireGeo, goldMat);
    kalashSpire.position.set(0, kalashBaseY + 0.18 * s + 0.11 * s, pillarZ);
    group.add(kalashSpire);

    // Sanctum Devotional Accessories on the Altar Step (in front of the photo)
    const accZ = photoZ - 0.22 * s;

    // 1. Brass Puja Bell (Ghanti)
    const bellDomeGeo = new THREE.CylinderGeometry(0.015 * s, 0.05 * s, 0.06 * s, 12);
    const bellDome = new THREE.Mesh(bellDomeGeo, brassMat);
    const bellY = stepTopY + 0.03 * s;
    bellDome.position.set(-photoWidth * 0.28, bellY, accZ);
    group.add(bellDome);

    const bellHandleGeo = new THREE.CylinderGeometry(0.01 * s, 0.01 * s, 0.07 * s, 8);
    const bellHandle = new THREE.Mesh(bellHandleGeo, brassMat);
    bellHandle.position.set(-photoWidth * 0.28, bellY + 0.06 * s, accZ);
    group.add(bellHandle);

    // 2. Brass Incense Burner (Agarbatti stand)
    const incenseBaseGeo = new THREE.CylinderGeometry(0.04 * s, 0.05 * s, 0.025 * s, 12);
    const incenseBase = new THREE.Mesh(incenseBaseGeo, brassMat);
    incenseBase.position.set(-photoWidth * 0.15, stepTopY + 0.0125 * s, accZ);
    group.add(incenseBase);

    // Incense sticks
    [-0.015 * s, 0, 0.015 * s].forEach((ox, idx) => {
      const stickGeo = new THREE.CylinderGeometry(0.003 * s, 0.003 * s, 0.12 * s, 6);
      const stickMat = new THREE.MeshStandardMaterial({ color: 0x3d2b1f, roughness: 0.9 });
      const stick = new THREE.Mesh(stickGeo, stickMat);
      stick.position.set(-photoWidth * 0.15 + ox, stepTopY + 0.07 * s, accZ);
      stick.rotation.z = (idx - 1) * 0.12;
      group.add(stick);

      // Glowing tip
      const tipGeo = new THREE.SphereGeometry(0.004 * s, 6, 6);
      const tipMat = new THREE.MeshStandardMaterial({ color: 0xff3300, emissive: 0xff2200, emissiveIntensity: 2.0 });
      const tip = new THREE.Mesh(tipGeo, tipMat);
      tip.position.set(-photoWidth * 0.15 + ox + (idx - 1) * 0.015 * s, stepTopY + 0.13 * s, accZ);
      group.add(tip);
    });

    // 3. Brass Prasad / Offering Thali in Center
    const thaliGeo = new THREE.CylinderGeometry(0.14 * s, 0.12 * s, 0.02 * s, 20);
    const thali = new THREE.Mesh(thaliGeo, goldMat);
    thali.position.set(0, stepTopY + 0.01 * s, accZ);
    group.add(thali);

    // Offerings inside thali
    const sweetMat = new THREE.MeshStandardMaterial({ color: 0xff9900, roughness: 0.8 });
    [
      [0, 0.02 * s, 0],
      [-0.03 * s, 0.02 * s, -0.02 * s],
      [0.03 * s, 0.02 * s, -0.02 * s],
      [0, 0.02 * s, 0.03 * s]
    ].forEach(([sx, sy, sz]) => {
      const sweetGeo = new THREE.SphereGeometry(0.018 * s, 8, 8);
      const sweet = new THREE.Mesh(sweetGeo, sweetMat);
      sweet.position.set(sx, stepTopY + sy, accZ + sz);
      group.add(sweet);
    });

    // 4. Brass Aarti Diya with sacred flame
    const aartiGeo = new THREE.CylinderGeometry(0.045 * s, 0.03 * s, 0.035 * s, 12);
    const aarti = new THREE.Mesh(aartiGeo, brassMat);
    aarti.position.set(photoWidth * 0.20, stepTopY + 0.0175 * s, accZ);
    group.add(aarti);

    const flameMat = new THREE.MeshStandardMaterial({
      color: 0xffe680,
      emissive: 0xff5500,
      emissiveIntensity: 3.0
    });
    const flameGeo = new THREE.ConeGeometry(0.022 * s, 0.065 * s, 8);
    const flame = new THREE.Mesh(flameGeo, flameMat);
    flame.position.set(photoWidth * 0.20, stepTopY + 0.065 * s, accZ);
    group.add(flame);

    // Warm Devotional Glow for the Sanctum
    const mandirGlow = new THREE.PointLight(0xffdf99, 0.75, 10 * s, 1.4);
    mandirGlow.position.set(0, photoCenterY + 0.3 * s, photoZ - 0.5 * s);
    group.add(mandirGlow);

    return group;
  }

  createMandirPlatform(item) {
    const [xmin, xmax, ymin, ymax, zmin, zmax] = item.box;
    const sizeX = xmax - xmin;
    const sizeY = zmax - zmin; // CAD Z -> Three.js Y
    const sizeZ = ymax - ymin; // CAD Y -> Three.js Z

    const posX = (xmin + xmax) / 2;
    const posY = (zmin + zmax) / 2;
    const posZ = -((ymin + ymax) / 2);

    const s = WORLD_SCALE;
    const group = new THREE.Group();
    group.name = `MandirPlatform_${item.id}`;
    group.position.set(posX, posY, posZ);
    group.userData = item;

    // White Makrana polished marble
    const marbleMat = new THREE.MeshStandardMaterial({
      color: 0xf5f3ee,
      roughness: 0.16,
      metalness: 0.02
    });

    // Base platform body
    const slabHeight = 0.08 * s;
    const baseHeight = sizeY - slabHeight;
    const baseGeo = new THREE.BoxGeometry(sizeX * 0.98, baseHeight, sizeZ * 0.98);
    const baseMesh = new THREE.Mesh(baseGeo, marbleMat);
    baseMesh.position.set(0, -slabHeight / 2, 0);
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    group.add(baseMesh);

    // Top marble slab with bullnose edge overhang
    const slabGeo = new THREE.BoxGeometry(sizeX, slabHeight, sizeZ);
    const slabMesh = new THREE.Mesh(slabGeo, marbleMat);
    slabMesh.position.set(0, sizeY / 2 - slabHeight / 2, 0);
    slabMesh.castShadow = true;
    slabMesh.receiveShadow = true;
    group.add(slabMesh);

    // Subtle golden trim edge around top slab
    const edgeGeo = new THREE.EdgesGeometry(slabGeo);
    const edgeMat = new THREE.LineBasicMaterial({ color: 0xd4af37, transparent: true, opacity: 0.45 });
    slabMesh.add(new THREE.LineSegments(edgeGeo, edgeMat));

    return group;
  }

  createBrassDiya(item) {
    const [xmin, xmax, ymin, ymax, zmin, zmax] = item.box;
    const sizeX = xmax - xmin;
    const sizeY = zmax - zmin; // CAD Z -> Three.js Y
    const sizeZ = ymax - ymin; // CAD Y -> Three.js Z

    const posX = (xmin + xmax) / 2;
    const posY = (zmin + zmax) / 2;
    const posZ = -((ymin + ymax) / 2);

    const s = WORLD_SCALE;
    const group = new THREE.Group();
    group.name = `BrassDiya_${item.id}`;
    group.position.set(posX, posY, posZ);
    group.userData = item;

    const brassMat = this.materials.get('M-BRASS') || new THREE.MeshStandardMaterial({
      color: 0xdfaa33,
      roughness: 0.22,
      metalness: 0.88
    });
    const flameMat = new THREE.MeshStandardMaterial({
      color: 0xffe680,
      emissive: 0xff6600,
      emissiveIntensity: 2.5
    });

    const baseRadius = 0.16 * s;
    const baseHeight = 0.06 * s;
    const baseGeo = new THREE.CylinderGeometry(baseRadius * 0.7, baseRadius, baseHeight, 16);
    const baseMesh = new THREE.Mesh(baseGeo, brassMat);
    baseMesh.position.set(0, -sizeY / 2 + baseHeight / 2, 0);
    baseMesh.castShadow = true;
    group.add(baseMesh);

    // Stem
    const stemHeight = sizeY * 0.65;
    const stemGeo = new THREE.CylinderGeometry(0.025 * s, 0.035 * s, stemHeight, 12);
    const stemMesh = new THREE.Mesh(stemGeo, brassMat);
    stemMesh.position.set(0, -sizeY / 2 + baseHeight + stemHeight / 2, 0);
    stemMesh.castShadow = true;
    group.add(stemMesh);

    // Oil cup / bowl (Katori)
    const cupRadius = 0.14 * s;
    const cupHeight = 0.06 * s;
    const cupGeo = new THREE.CylinderGeometry(cupRadius, cupRadius * 0.4, cupHeight, 16);
    const cupMesh = new THREE.Mesh(cupGeo, brassMat);
    const cupPosY = -sizeY / 2 + baseHeight + stemHeight;
    cupMesh.position.set(0, cupPosY, 0);
    cupMesh.castShadow = true;
    group.add(cupMesh);

    // Small brass peacock / kalash finial in center
    const finialGeo = new THREE.ConeGeometry(0.03 * s, 0.10 * s, 8);
    const finialMesh = new THREE.Mesh(finialGeo, brassMat);
    finialMesh.position.set(0, cupPosY + cupHeight / 2 + 0.05 * s, 0);
    group.add(finialMesh);

    // Flame wick with warm glow
    const flameGeo = new THREE.ConeGeometry(0.025 * s, 0.07 * s, 8);
    const flameMesh = new THREE.Mesh(flameGeo, flameMat);
    flameMesh.position.set(0, cupPosY + cupHeight / 2 + 0.08 * s, cupRadius * 0.6);
    group.add(flameMesh);

    return group;
  }

  createWaterTank(item) {
    const [xmin, xmax, ymin, ymax, zmin, zmax] = item.box;
    const posX = (xmin + xmax) / 2;
    const posY = (zmin + zmax) / 2;
    const posZ = -((ymin + ymax) / 2);
    const height = zmax - zmin;
    const radius = Math.min(xmax - xmin, ymax - ymin) / 2;
    const s = WORLD_SCALE;

    const group = new THREE.Group();
    group.name = `WaterTank_${item.id}`;
    group.position.set(posX, posY, posZ);
    group.userData = item;

    const tankMat = this.materials.get('M-WATER-TANK') || new THREE.MeshStandardMaterial({
      color: 0x1a1c1e,
      roughness: 0.35,
      metalness: 0.15
    });
    const pipeMat = this.materials.get('M-PVC-PIPE') || new THREE.MeshStandardMaterial({
      color: 0xe0e2e5,
      roughness: 0.35
    });

    // Main Cylindrical Body
    const mainBodyHeight = height * 0.82;
    const tankGeo = new THREE.CylinderGeometry(radius, radius, mainBodyHeight, 32);
    const tankMesh = new THREE.Mesh(tankGeo, tankMat);
    tankMesh.position.set(0, -height / 2 + mainBodyHeight / 2, 0);
    tankMesh.castShadow = true;
    tankMesh.receiveShadow = true;
    group.add(tankMesh);

    // Reinforcing Rib Rings (Sintex style)
    const ribCount = 4;
    for (let i = 1; i <= ribCount; i++) {
      const ribY = -height / 2 + (mainBodyHeight / (ribCount + 1)) * i;
      const ribGeo = new THREE.TorusGeometry(radius + 0.02 * s, 0.04 * s, 8, 32);
      ribGeo.rotateX(Math.PI / 2);
      const ribMesh = new THREE.Mesh(ribGeo, tankMat);
      ribMesh.position.set(0, ribY, 0);
      group.add(ribMesh);
    }

    // Conical Domed Top
    const domeHeight = height * 0.14;
    const domeGeo = new THREE.ConeGeometry(radius, domeHeight, 32);
    const domeMesh = new THREE.Mesh(domeGeo, tankMat);
    domeMesh.position.set(0, -height / 2 + mainBodyHeight + domeHeight / 2, 0);
    domeMesh.castShadow = true;
    group.add(domeMesh);

    // Inspection Lid / Cap on Top
    const lidRadius = radius * 0.45;
    const lidHeight = height * 0.05;
    const lidGeo = new THREE.CylinderGeometry(lidRadius, lidRadius * 1.05, lidHeight, 24);
    const lidMesh = new THREE.Mesh(lidGeo, tankMat);
    lidMesh.position.set(0, -height / 2 + mainBodyHeight + domeHeight + lidHeight / 2, 0);
    lidMesh.castShadow = true;
    group.add(lidMesh);

    // Overflow / Air Vent Pipe Fitting
    const ventGeo = new THREE.CylinderGeometry(0.04 * s, 0.04 * s, 0.35 * s, 8);
    const ventMesh = new THREE.Mesh(ventGeo, pipeMat);
    ventMesh.position.set(radius * 0.7, -height / 2 + mainBodyHeight + 0.1 * s, 0);
    group.add(ventMesh);

    return group;
  }

  createGymTreadmill(item) {
    const [xmin, xmax, ymin, ymax, zmin, zmax] = item.box;
    const posX = (xmin + xmax) / 2;
    const posY = (zmin + zmax) / 2;
    const posZ = -((ymin + ymax) / 2);
    const sizeX = xmax - xmin;
    const sizeY = zmax - zmin;
    const sizeZ = ymax - ymin;
    const s = WORLD_SCALE;

    const group = new THREE.Group();
    group.name = `GymTreadmill_${item.id}`;
    group.position.set(posX, posY, posZ);
    group.userData = item;

    const steelMat = this.materials.get('M-STEEL-GREY');
    const rubberMat = this.materials.get('M-GYM-RUBBER');
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0x050a12,
      emissive: 0x103a5e,
      emissiveIntensity: 0.8,
      roughness: 0.1
    });

    // Running deck / platform
    const deckH = 0.35 * s;
    const deckGeo = new THREE.BoxGeometry(sizeX * 0.9, deckH, sizeZ * 0.85);
    const deckMesh = new THREE.Mesh(deckGeo, steelMat);
    deckMesh.position.set(0, -sizeY / 2 + deckH / 2, -sizeZ * 0.05);
    deckMesh.castShadow = true;
    group.add(deckMesh);

    // Treadmill Belt
    const beltGeo = new THREE.BoxGeometry(sizeX * 0.7, 0.04 * s, sizeZ * 0.75);
    const beltMesh = new THREE.Mesh(beltGeo, rubberMat);
    beltMesh.position.set(0, -sizeY / 2 + deckH + 0.02 * s, -sizeZ * 0.05);
    group.add(beltMesh);

    // Front Motor Housing
    const motorH = 0.75 * s;
    const motorGeo = new THREE.BoxGeometry(sizeX * 0.92, motorH, sizeZ * 0.22);
    const motorMesh = new THREE.Mesh(motorGeo, steelMat);
    motorMesh.position.set(0, -sizeY / 2 + motorH / 2, sizeZ * 0.38);
    motorMesh.castShadow = true;
    group.add(motorMesh);

    // Side Handrail Uprights
    const uprightGeo = new THREE.CylinderGeometry(0.04 * s, 0.04 * s, sizeY * 0.85, 8);
    const leftUpright = new THREE.Mesh(uprightGeo, steelMat);
    leftUpright.position.set(-sizeX * 0.42, 0, sizeZ * 0.28);
    leftUpright.rotation.x = -0.15;
    group.add(leftUpright);

    const rightUpright = new THREE.Mesh(uprightGeo, steelMat);
    rightUpright.position.set(sizeX * 0.42, 0, sizeZ * 0.28);
    rightUpright.rotation.x = -0.15;
    group.add(rightUpright);

    // Console & Digital Display Screen
    const consoleGeo = new THREE.BoxGeometry(sizeX * 0.85, 0.20 * s, 0.45 * s);
    const consoleMesh = new THREE.Mesh(consoleGeo, steelMat);
    consoleMesh.position.set(0, sizeY / 2 - 0.2 * s, sizeZ * 0.35);
    consoleMesh.rotation.x = -0.35;
    group.add(consoleMesh);

    const screenGeo = new THREE.PlaneGeometry(sizeX * 0.5, 0.3 * s);
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(0, sizeY / 2 - 0.16 * s, sizeZ * 0.36);
    screenMesh.rotation.x = -0.35;
    group.add(screenMesh);

    return group;
  }

  createGymBench(item) {
    const [xmin, xmax, ymin, ymax, zmin, zmax] = item.box;
    const posX = (xmin + xmax) / 2;
    const posY = (zmin + zmax) / 2;
    const posZ = -((ymin + ymax) / 2);
    const sizeX = xmax - xmin;
    const sizeY = zmax - zmin;
    const sizeZ = ymax - ymin;
    const s = WORLD_SCALE;

    const group = new THREE.Group();
    group.name = `GymBench_${item.id}`;
    group.position.set(posX, posY, posZ);
    group.userData = item;

    const steelMat = this.materials.get('M-STEEL-GREY');
    const leatherMat = this.materials.get('M-GYM-RUBBER');

    // Bench Steel Frame & Legs
    const legGeo = new THREE.CylinderGeometry(0.04 * s, 0.04 * s, sizeY * 0.85, 8);
    const leg1 = new THREE.Mesh(legGeo, steelMat);
    leg1.position.set(0, -sizeY * 0.08, -sizeZ * 0.38);
    group.add(leg1);

    const leg2 = new THREE.Mesh(legGeo, steelMat);
    leg2.position.set(0, -sizeY * 0.08, sizeZ * 0.38);
    group.add(leg2);

    const baseBarGeo = new THREE.BoxGeometry(sizeX * 0.7, 0.06 * s, 0.12 * s);
    const baseBar1 = new THREE.Mesh(baseBarGeo, steelMat);
    baseBar1.position.set(0, -sizeY / 2 + 0.03 * s, -sizeZ * 0.38);
    group.add(baseBar1);

    const baseBar2 = new THREE.Mesh(baseBarGeo, steelMat);
    baseBar2.position.set(0, -sizeY / 2 + 0.03 * s, sizeZ * 0.38);
    group.add(baseBar2);

    const centerSpine = new THREE.Mesh(new THREE.BoxGeometry(0.10 * s, 0.08 * s, sizeZ * 0.85), steelMat);
    centerSpine.position.set(0, sizeY / 2 - 0.22 * s, 0);
    group.add(centerSpine);

    // Padded Seat Cushion
    const seatPad = new THREE.Mesh(new THREE.BoxGeometry(sizeX * 0.8, 0.12 * s, sizeZ * 0.32), leatherMat);
    seatPad.position.set(0, sizeY / 2 - 0.08 * s, -sizeZ * 0.28);
    seatPad.castShadow = true;
    group.add(seatPad);

    // Padded Backrest Cushion (slightly elevated angle)
    const backPad = new THREE.Mesh(new THREE.BoxGeometry(sizeX * 0.8, 0.12 * s, sizeZ * 0.58), leatherMat);
    backPad.position.set(0, sizeY / 2 - 0.04 * s, sizeZ * 0.18);
    backPad.rotation.x = -0.12;
    backPad.castShadow = true;
    group.add(backPad);

    return group;
  }

  createDumbbellRack(item) {
    const [xmin, xmax, ymin, ymax, zmin, zmax] = item.box;
    const posX = (xmin + xmax) / 2;
    const posY = (zmin + zmax) / 2;
    const posZ = -((ymin + ymax) / 2);
    const sizeX = xmax - xmin;
    const sizeY = zmax - zmin;
    const sizeZ = ymax - ymin;
    const s = WORLD_SCALE;

    const group = new THREE.Group();
    group.name = `DumbbellRack_${item.id}`;
    group.position.set(posX, posY, posZ);
    group.userData = item;

    const steelMat = this.materials.get('M-STEEL-GREY');
    const weightMat = this.materials.get('M-TYRE-BLACK');
    const chromeMat = this.materials.get('M-CHROME');

    // A-frame side supports
    const supportGeo = new THREE.BoxGeometry(sizeX * 0.15, sizeY, 0.08 * s);
    const supLeft = new THREE.Mesh(supportGeo, steelMat);
    supLeft.position.set(0, 0, -sizeZ * 0.45);
    group.add(supLeft);

    const supRight = new THREE.Mesh(supportGeo, steelMat);
    supRight.position.set(0, 0, sizeZ * 0.45);
    group.add(supRight);

    // Two tiers of angled shelves
    for (let tier = 0; tier < 2; tier++) {
      const tierY = -sizeY * 0.2 + tier * (sizeY * 0.45);
      const shelfMesh = new THREE.Mesh(new THREE.BoxGeometry(sizeX * 0.85, 0.05 * s, sizeZ * 0.95), steelMat);
      shelfMesh.position.set(0, tierY, 0);
      shelfMesh.rotation.z = -0.15;
      group.add(shelfMesh);

      // Dumbbell pairs on this shelf
      const numPairs = 4;
      for (let p = 0; p < numPairs; p++) {
        const dZ = -sizeZ * 0.35 + (p / (numPairs - 1)) * (sizeZ * 0.70);
        const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.02 * s, 0.02 * s, sizeX * 0.5, 8), chromeMat);
        handle.rotation.z = Math.PI / 2;
        handle.position.set(0, tierY + 0.08 * s, dZ);
        group.add(handle);

        const wRadius = (0.09 + tier * 0.04 + p * 0.015) * s;
        const wThick = 0.05 * s;
        const plateGeo = new THREE.CylinderGeometry(wRadius, wRadius, wThick, 16);
        plateGeo.rotateZ(Math.PI / 2);

        const plateL = new THREE.Mesh(plateGeo, weightMat);
        plateL.position.set(-sizeX * 0.22, tierY + 0.08 * s, dZ);
        group.add(plateL);

        const plateR = new THREE.Mesh(plateGeo, weightMat);
        plateR.position.set(sizeX * 0.22, tierY + 0.08 * s, dZ);
        group.add(plateR);
      }
    }

    return group;
  }

  createYogaMat(item) {
    const [xmin, xmax, ymin, ymax, zmin, zmax] = item.box;
    const posX = (xmin + xmax) / 2;
    const posY = (zmin + zmax) / 2;
    const posZ = -((ymin + ymax) / 2);
    const sizeX = xmax - xmin;
    const sizeY = zmax - zmin;
    const sizeZ = ymax - ymin;

    const group = new THREE.Group();
    group.name = `YogaMat_${item.id}`;
    group.position.set(posX, posY, posZ);
    group.userData = item;

    const mat = this.materials.get(item.material) || new THREE.MeshStandardMaterial({
      color: 0x5c3877,
      roughness: 0.95
    });

    const matMesh = new THREE.Mesh(new THREE.BoxGeometry(sizeX, sizeY, sizeZ), mat);
    matMesh.receiveShadow = true;
    group.add(matMesh);

    return group;
  }

  getTelevisions() {
    return this.televisions || [];
  }

  getRoot() {
    return this.rootGroup;
  }
}
