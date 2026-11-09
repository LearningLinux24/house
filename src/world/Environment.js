import * as THREE from 'three';
import { WORLD_SCALE } from '../config/constants.js';

/**
 * Environment & Colony Exterior Builder
 * Builds an authentic "unprepared colony" road network extending till world borders.
 * Features:
 *   - Interconnected road mesh: Front Main Avenue, Middle Sector Road, Outer Boundary Road,
 *     Rear Service Lane, Far West Lane, and multiple North-South cross-streets.
 *   - "Unprepared colony" character: Asymmetrical layout, staggered T-junctions, dead-end plot
 *     access spurs, asphalt patch repairs, unpaved gravel/earth shoulders (berms), speed breakers.
 *   - Plotted land demarcations: White RCC boundary corner pegs with painted tops, low raw brick
 *     marker walls, construction sand & gravel mounds.
 *   - Colony infrastructure: State Electricity Board RCC concrete poles with cross-arms, insulators,
 *     overhead wires, streetlights, 2-pole H-frame transformer, colony signboard, roadside trees.
 */
export class Environment {
  constructor(scene) {
    this.scene = scene;
    this.rootGroup = new THREE.Group();
    this.rootGroup.name = 'Environment_Colony_Root';
    this.scene.add(this.rootGroup);

    this.init();
  }

  init() {
    const s = WORLD_SCALE;

    this.initMaterials();
    this.initAtmosphere(s);
    this.initTerrain(s);
    this.initRoadMesh(s);
    this.initColonyDemarcations(s);
    this.initColonyInfrastructure(s);
  }

  initMaterials() {
    // 1. Road Materials
    this.mats = {
      asphalt: new THREE.MeshStandardMaterial({
        color: 0x2c2f35,
        roughness: 0.88,
        metalness: 0.08
      }),
      asphaltPatch: new THREE.MeshStandardMaterial({
        color: 0x1c1e22,
        roughness: 0.82,
        metalness: 0.12
      }),
      berm: new THREE.MeshStandardMaterial({
        color: 0x766752,
        roughness: 0.98,
        metalness: 0.0
      }),
      dirtTrack: new THREE.MeshStandardMaterial({
        color: 0x8a7860,
        roughness: 0.98,
        metalness: 0.0
      }),
      curb: new THREE.MeshStandardMaterial({
        color: 0x9ca3af,
        roughness: 0.75
      }),
      concreteSlab: new THREE.MeshStandardMaterial({
        color: 0xa8a49c,
        roughness: 0.70
      }),
      speedBreaker: new THREE.MeshStandardMaterial({
        color: 0x222428,
        roughness: 0.85
      }),
      hazardYellow: new THREE.MeshBasicMaterial({ color: 0xeab308 }),
      hazardBlack: new THREE.MeshBasicMaterial({ color: 0x18181b }),
      whiteMark: new THREE.MeshBasicMaterial({ color: 0xdedede }),
      yellowMark: new THREE.MeshBasicMaterial({ color: 0xfacc15 }),

      // 2. Colony Demarcation & Infrastructure Materials
      pegWhite: new THREE.MeshStandardMaterial({ color: 0xf3f4f6, roughness: 0.55 }),
      pegYellow: new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.50 }),
      pegRed: new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.50 }),
      brick: new THREE.MeshStandardMaterial({ color: 0x9c4c34, roughness: 0.90 }),
      cinderBlock: new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.85 }),
      sandMound: new THREE.MeshStandardMaterial({ color: 0xc2a673, roughness: 0.95 }),
      gravelMound: new THREE.MeshStandardMaterial({ color: 0x5a5c60, roughness: 0.92 }),
      poleConcrete: new THREE.MeshStandardMaterial({ color: 0x8e9298, roughness: 0.80 }),
      poleSteel: new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.75, roughness: 0.35 }),
      insulator: new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.3, metalness: 0.2 }),
      wire: new THREE.LineBasicMaterial({ color: 0x1e293b }),
      lampHousing: new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.6, roughness: 0.4 }),
      lampGlow: new THREE.MeshBasicMaterial({ color: 0xfff3d4 }),
      signboardBlue: new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.4, metalness: 0.2 }),
      signboardFrame: new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7, roughness: 0.3 }),
      treeTrunk: new THREE.MeshStandardMaterial({ color: 0x4a3728, roughness: 0.92 }),
      foliageGreen: new THREE.MeshStandardMaterial({ color: 0x3d4e35, roughness: 0.90 }),
      dryShrub: new THREE.MeshStandardMaterial({ color: 0x6b694b, roughness: 0.95 })
    };
  }

  initAtmosphere(s) {
    const skyColor = new THREE.Color(0x87ceeb);
    this.scene.background = skyColor;
    this.scene.fog = new THREE.FogExp2(0x9bd2f0, 0.0016);
  }

  initTerrain(s) {
    // Expansive 1100x1100 ft landscape covering the entire world
    const groundGeo = new THREE.PlaneGeometry(1100 * s, 1100 * s);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x546644,
      roughness: 0.96,
      metalness: 0.0
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(50 * s, -0.06 * s, 60 * s);
    ground.receiveShadow = true;
    ground.name = 'ColonyGround_Substrate';
    this.rootGroup.add(ground);
  }

  initRoadMesh(s) {
    const roadGroup = new THREE.Group();
    roadGroup.name = 'Colony_Road_Network';

    // Helper: create rectangular road segment
    const addRoad = (name, posX, posZ, widthX, lengthZ, mat = this.mats.asphalt) => {
      const geo = new THREE.PlaneGeometry(widthX, lengthZ);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set(posX, 0.005 * s, posZ);
      mesh.receiveShadow = true;
      mesh.name = name;
      roadGroup.add(mesh);
      return mesh;
    };

    // Helper: create unpaved gravel/earth roadside berm shoulder
    const addBerm = (posX, posZ, widthX, lengthZ) => {
      const geo = new THREE.PlaneGeometry(widthX, lengthZ);
      const mesh = new THREE.Mesh(geo, this.mats.berm);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set(posX, 0.002 * s, posZ);
      mesh.receiveShadow = true;
      roadGroup.add(mesh);
    };

    // ── 1. PRIMARY PARALLEL ROADS (Running East-West along X till World Borders) ────
    const spanX = 1000 * s;
    const centerX = 50 * s;

    // Road 1: Front Colony Main Road (right in front of house plot, Z = 3.0s to 38.0s)
    addRoad('Road_Front_Main', centerX, 20.5 * s, spanX, 35.0 * s);
    addBerm(centerX, 39.5 * s, spanX, 3.0 * s);
    addBerm(centerX, 1.5 * s, spanX, 3.0 * s);

    // Driveway apron connecting garage ramp (X = 36.2s to 47.0s) smoothly into Front Road
    const garageApronGeo = new THREE.PlaneGeometry(10.8 * s, 3.5 * s);
    const garageApron = new THREE.Mesh(garageApronGeo, this.mats.asphalt);
    garageApron.rotation.x = -Math.PI / 2;
    garageApron.position.set(41.6 * s, 0.007 * s, 1.75 * s);
    garageApron.receiveShadow = true;
    roadGroup.add(garageApron);

    // Pedestrian main entrance apron (X = -0.5s to 4.0s)
    const gateApronGeo = new THREE.PlaneGeometry(4.5 * s, 3.5 * s);
    const gateApron = new THREE.Mesh(gateApronGeo, this.mats.asphalt);
    gateApron.rotation.x = -Math.PI / 2;
    gateApron.position.set(1.75 * s, 0.007 * s, 1.75 * s);
    gateApron.receiveShadow = true;
    roadGroup.add(gateApron);

    // Road 2: Middle Sector Colony Road (Z = 125.0s to 155.0s)
    addRoad('Road_Middle_Sector', centerX, 140.0 * s, spanX, 30.0 * s);
    addBerm(centerX, 156.5 * s, spanX, 3.0 * s);
    addBerm(centerX, 123.5 * s, spanX, 3.0 * s);

    // Road 3: Outer Colony Ring Road (Z = 250.0s to 276.0s)
    addRoad('Road_Outer_Ring', centerX, 263.0 * s, spanX, 26.0 * s);
    addBerm(centerX, 278.0 * s, spanX, 4.0 * s);
    addBerm(centerX, 248.0 * s, spanX, 4.0 * s);

    // Road 4: Rear Service Lane (behind house backyard, Z = -56.0s to -38.0s)
    addRoad('Road_Rear_Service', centerX, -47.0 * s, spanX, 18.0 * s);
    addBerm(centerX, -36.5 * s, spanX, 3.0 * s);
    addBerm(centerX, -57.5 * s, spanX, 3.0 * s);

    // Road 5: Far West Colony Boundary Road (Z = -145.0s to -125.0s)
    addRoad('Road_Far_West_Boundary', centerX, -135.0 * s, spanX, 20.0 * s);
    addBerm(centerX, -123.5 * s, spanX, 3.0 * s);
    addBerm(centerX, -146.5 * s, spanX, 3.0 * s);

    // ── 2. PERPENDICULAR CROSS-ROADS (Running North-South along Z connecting the Mesh) ──
    const crossSpanZ = 430 * s;
    const crossCenterZ = 65.5 * s;

    // Cross Road 1: Far South Sector Road (X = -320s to -294s)
    addRoad('CrossRoad_Far_South', -307.0 * s, crossCenterZ, 26.0 * s, crossSpanZ);
    addBerm(-321.5 * s, crossCenterZ, 3.0 * s, crossSpanZ);
    addBerm(-292.5 * s, crossCenterZ, 3.0 * s, crossSpanZ);

    // Cross Road 2: South Sector Main Road (X = -150s to -122s)
    addRoad('CrossRoad_South_Main', -136.0 * s, crossCenterZ, 28.0 * s, crossSpanZ);
    addBerm(-151.5 * s, crossCenterZ, 3.0 * s, crossSpanZ);
    addBerm(-120.5 * s, crossCenterZ, 3.0 * s, crossSpanZ);

    // Cross Road 3: House South Gali / Connector (X = -32s to -14s, runs from Z = -56s to +155s)
    addRoad('CrossRoad_House_South', -23.0 * s, 49.5 * s, 18.0 * s, 211.0 * s);
    addBerm(-33.5 * s, 49.5 * s, 3.0 * s, 211.0 * s);
    addBerm(-12.5 * s, 49.5 * s, 3.0 * s, 211.0 * s);

    // Cross Road 4: House North Main Sector Road (X = 72s to 100s)
    addRoad('CrossRoad_House_North', 86.0 * s, crossCenterZ, 28.0 * s, crossSpanZ);
    addBerm(70.5 * s, crossCenterZ, 3.0 * s, crossSpanZ);
    addBerm(101.5 * s, crossCenterZ, 3.0 * s, crossSpanZ);

    // Cross Road 5: North Sector Main Road (X = 230s to 258s)
    addRoad('CrossRoad_North_Main', 244.0 * s, crossCenterZ, 28.0 * s, crossSpanZ);
    addBerm(228.5 * s, crossCenterZ, 3.0 * s, crossSpanZ);
    addBerm(259.5 * s, crossCenterZ, 3.0 * s, crossSpanZ);

    // Cross Road 6: Far North Colony Road (X = 380s to 406s)
    addRoad('CrossRoad_Far_North', 393.0 * s, crossCenterZ, 26.0 * s, crossSpanZ);
    addBerm(378.5 * s, crossCenterZ, 3.0 * s, crossSpanZ);
    addBerm(407.5 * s, crossCenterZ, 3.0 * s, crossSpanZ);

    // ── 3. IRREGULAR BRANCH LANES & DEAD-ENDS (The "Unprepared Colony" Character) ──
    // Dead-end Spur 1: Plot access lane branching south from Front Road into unbuilt sector (X = -222s)
    addRoad('Spur_South_Sector', -222.0 * s, 71.5 * s, 18.0 * s, 67.0 * s);
    // Cul-de-sac turning circle at dead-end
    const cul1Geo = new THREE.CircleGeometry(16.0 * s, 24);
    const cul1 = new THREE.Mesh(cul1Geo, this.mats.asphalt);
    cul1.rotation.x = -Math.PI / 2;
    cul1.position.set(-222.0 * s, 0.006 * s, 105.0 * s);
    cul1.receiveShadow = true;
    roadGroup.add(cul1);

    // Dead-end Spur 2: Branching north from Middle Sector Road (X = 169s, Z = 65s to 125s)
    addRoad('Spur_North_Sector', 169.0 * s, 95.0 * s, 18.0 * s, 60.0 * s);
    const cul2Geo = new THREE.CircleGeometry(15.0 * s, 24);
    const cul2 = new THREE.Mesh(cul2Geo, this.mats.asphalt);
    cul2.rotation.x = -Math.PI / 2;
    cul2.position.set(169.0 * s, 0.006 * s, 65.0 * s);
    cul2.receiveShadow = true;
    roadGroup.add(cul2);

    // Diagonal unpaved earth/morum shortcut track across open block
    const trackGeo = new THREE.PlaneGeometry(12.0 * s, 110.0 * s);
    const track = new THREE.Mesh(trackGeo, this.mats.dirtTrack);
    track.rotation.x = -Math.PI / 2;
    track.rotation.z = 0.52; // ~30 deg diagonal
    track.position.set(170.0 * s, 0.004 * s, 205.0 * s);
    track.receiveShadow = true;
    roadGroup.add(track);

    // ── 4. ASPHALT REPAIR PATCHES (Weathered maintenance patches on colony roads) ──
    const patchCoords = [
      [25.0 * s, 24.0 * s, 8.0 * s, 12.0 * s],
      [-80.0 * s, 18.0 * s, 10.0 * s, 7.0 * s],
      [140.0 * s, 22.0 * s, 9.0 * s, 11.0 * s],
      [86.0 * s, 140.0 * s, 14.0 * s, 14.0 * s],
      [-136.0 * s, 20.5 * s, 15.0 * s, 15.0 * s],
      [244.0 * s, 140.0 * s, 12.0 * s, 10.0 * s],
      [310.0 * s, 21.0 * s, 8.0 * s, 14.0 * s],
      [-210.0 * s, -47.0 * s, 11.0 * s, 7.0 * s],
      [50.0 * s, 142.0 * s, 12.0 * s, 8.0 * s]
    ];
    patchCoords.forEach(([px, pz, pw, pl], idx) => {
      const pGeo = new THREE.PlaneGeometry(pw, pl);
      const pMesh = new THREE.Mesh(pGeo, this.mats.asphaltPatch);
      pMesh.rotation.x = -Math.PI / 2;
      pMesh.position.set(px, 0.008 * s, pz);
      pMesh.receiveShadow = true;
      pMesh.name = `Asphalt_Patch_${idx}`;
      roadGroup.add(pMesh);
    });

    // ── 5. ROAD DETAILS (Speed Breakers, Markings & Drainage Culverts) ─────────
    // Speed breakers with alternating black & yellow stripes before major intersections
    const speedBreakers = [
      [-110.0 * s, 20.5 * s, 34.0 * s, 0],       // Front Road before South Junction
      [58.0 * s, 20.5 * s, 34.0 * s, 0],         // Front Road before House North Junction
      [115.0 * s, 20.5 * s, 34.0 * s, 0],        // Front Road after House North Junction
      [86.0 * s, 52.0 * s, 27.0 * s, Math.PI / 2], // House North Road approaching Front Road
      [-136.0 * s, 52.0 * s, 27.0 * s, Math.PI / 2] // South Main Road approaching Front Road
    ];
    speedBreakers.forEach(([bx, bz, bLen, rotY]) => {
      const sbGroup = new THREE.Group();
      sbGroup.position.set(bx, 0.01 * s, bz);
      sbGroup.rotation.y = rotY;

      // Base rounded hump body
      const humpGeo = new THREE.BoxGeometry(bLen, 0.16 * s, 2.6 * s);
      const hump = new THREE.Mesh(humpGeo, this.mats.speedBreaker);
      hump.position.y = 0.08 * s;
      hump.receiveShadow = true;
      sbGroup.add(hump);

      // Alternating yellow hazard chevron stripes
      const stripeW = 2.0 * s;
      for (let sx = -bLen / 2 + stripeW / 2; sx < bLen / 2; sx += stripeW * 2) {
        const stripeGeo = new THREE.PlaneGeometry(stripeW, 2.5 * s);
        const stripe = new THREE.Mesh(stripeGeo, this.mats.hazardYellow);
        stripe.rotation.x = -Math.PI / 2;
        stripe.position.set(sx, 0.17 * s, 0);
        sbGroup.add(stripe);
      }
      roadGroup.add(sbGroup);
    });

    // Faded center dashed lines along Front Main Road
    const dashLength = 4.5 * s;
    const dashGap = 3.5 * s;
    for (let x = -420 * s; x <= 520 * s; x += dashLength + dashGap) {
      // Skip gaps at major crossroad intersections to keep junctions clean
      if (
        (x >= -325 * s && x <= -290 * s) ||
        (x >= -155 * s && x <= -118 * s) ||
        (x >= 68 * s && x <= 104 * s) ||
        (x >= 225 * s && x <= 262 * s) ||
        (x >= 375 * s && x <= 410 * s)
      ) {
        continue;
      }
      const dashGeo = new THREE.PlaneGeometry(dashLength, 0.35 * s);
      const dash = new THREE.Mesh(dashGeo, this.mats.whiteMark);
      dash.rotation.x = -Math.PI / 2;
      dash.position.set(x, 0.009 * s, 20.5 * s);
      roadGroup.add(dash);
    }

    // Precast concrete culvert slabs spanning roadside drain crossings
    const culvertLocations = [
      [41.6 * s, 0.4 * s, 12.0 * s, 2.2 * s],  // In front of garage apron
      [1.75 * s, 0.4 * s, 5.0 * s, 2.2 * s],   // In front of main gate
      [-23.0 * s, 38.5 * s, 19.0 * s, 2.8 * s],// House South Gali entrance
      [86.0 * s, 38.5 * s, 29.0 * s, 3.0 * s]  // House North Boulevard entrance
    ];
    culvertLocations.forEach(([cx, cz, cw, cl]) => {
      const cGeo = new THREE.BoxGeometry(cw, 0.18 * s, cl);
      const culvert = new THREE.Mesh(cGeo, this.mats.concreteSlab);
      culvert.position.set(cx, 0.09 * s, cz);
      culvert.receiveShadow = true;
      culvert.castShadow = true;
      roadGroup.add(culvert);
    });

    // Curbs along House frontage (protecting house boundary while keeping driveways open)
    // Curb 1: West of Main Gate (X = -120s to -0.6s)
    const curb1Len = 119.4 * s;
    const curb1Geo = new THREE.BoxGeometry(curb1Len, 0.22 * s, 0.5 * s);
    const curb1 = new THREE.Mesh(curb1Geo, this.mats.curb);
    curb1.position.set((-120 * s + -0.6 * s) / 2, 0.11 * s, 0.5 * s);
    curb1.receiveShadow = true;
    roadGroup.add(curb1);

    // Curb 2: Between Main Gate and Garage Driveway (X = 4.0s to 36.2s)
    const curb2Len = 32.2 * s;
    const curb2Geo = new THREE.BoxGeometry(curb2Len, 0.22 * s, 0.5 * s);
    const curb2 = new THREE.Mesh(curb2Geo, this.mats.curb);
    curb2.position.set((4.0 * s + 36.2 * s) / 2, 0.11 * s, 0.5 * s);
    curb2.receiveShadow = true;
    roadGroup.add(curb2);

    // Curb 3: East of Garage Driveway (X = 47.0s to 71.0s)
    const curb3Len = 24.0 * s;
    const curb3Geo = new THREE.BoxGeometry(curb3Len, 0.22 * s, 0.5 * s);
    const curb3 = new THREE.Mesh(curb3Geo, this.mats.curb);
    curb3.position.set((47.0 * s + 71.0 * s) / 2, 0.11 * s, 0.5 * s);
    curb3.receiveShadow = true;
    roadGroup.add(curb3);

    this.rootGroup.add(roadGroup);
  }

  initColonyDemarcations(s) {
    const demGroup = new THREE.Group();
    demGroup.name = 'Colony_Demarcations';

    // 1. RCC Plot Demarcation Corner Pegs (White stones with yellow/red painted tops)
    // Demarcating residential plots across the blocks between roads
    const plotOrigins = [
      // Block South-East: X = -115s to -35s, Z = 45s to 120s
      [-110 * s, 50 * s], [-75 * s, 50 * s], [-40 * s, 50 * s],
      [-110 * s, 85 * s], [-75 * s, 85 * s], [-40 * s, 85 * s],
      [-110 * s, 115 * s], [-75 * s, 115 * s], [-40 * s, 115 * s],

      // Block North-East: X = 105s to 225s, Z = 45s to 120s
      [110 * s, 50 * s], [145 * s, 50 * s], [185 * s, 50 * s], [220 * s, 50 * s],
      [110 * s, 85 * s], [145 * s, 85 * s], [185 * s, 85 * s], [220 * s, 85 * s],
      [110 * s, 115 * s], [145 * s, 115 * s], [185 * s, 115 * s], [220 * s, 115 * s],

      // Block Far-North: X = 265s to 375s, Z = 45s to 120s
      [270 * s, 50 * s], [315 * s, 50 * s], [365 * s, 50 * s],
      [270 * s, 85 * s], [315 * s, 85 * s], [365 * s, 85 * s],
      [270 * s, 115 * s], [315 * s, 115 * s], [365 * s, 115 * s],

      // Block Outer-East: X = -115s to 220s, Z = 165s to 240s
      [-105 * s, 170 * s], [-60 * s, 170 * s], [-15 * s, 170 * s],
      [110 * s, 170 * s], [165 * s, 170 * s], [215 * s, 170 * s],
      [-105 * s, 210 * s], [-60 * s, 210 * s], [-15 * s, 210 * s],
      [110 * s, 210 * s], [165 * s, 210 * s], [215 * s, 210 * s],
      [-105 * s, 240 * s], [-60 * s, 240 * s], [-15 * s, 240 * s],
      [110 * s, 240 * s], [165 * s, 240 * s], [215 * s, 240 * s]
    ];

    const pegBodyGeo = new THREE.BoxGeometry(0.40 * s, 1.40 * s, 0.40 * s);
    const pegCapGeo = new THREE.BoxGeometry(0.42 * s, 0.35 * s, 0.42 * s);

    plotOrigins.forEach(([px, pz], idx) => {
      const peg = new THREE.Group();
      peg.position.set(px, 0.70 * s, pz);

      const body = new THREE.Mesh(pegBodyGeo, this.mats.pegWhite);
      body.castShadow = true;
      body.receiveShadow = true;
      peg.add(body);

      // Alternating yellow / red painted tops
      const capMat = (idx % 2 === 0) ? this.mats.pegYellow : this.mats.pegRed;
      const cap = new THREE.Mesh(pegCapGeo, capMat);
      cap.position.y = 0.60 * s;
      peg.add(cap);

      demGroup.add(peg);
    });

    // 2. Low Unfinished Plot Boundary Walls (1.5-2.0 ft high raw brick or block marker walls)
    const wallSegments = [
      // Plot A boundary: X = 110s to 145s, Z = 50s to 85s
      [127.5 * s, 50.0 * s, 35.0 * s, 0.6 * s, 1.6 * s, this.mats.brick],       // Front wall
      [110.0 * s, 67.5 * s, 0.6 * s, 35.0 * s, 1.6 * s, this.mats.brick],       // Side wall
      [145.0 * s, 67.5 * s, 0.6 * s, 35.0 * s, 1.6 * s, this.mats.brick],       // Side wall

      // Plot B boundary (Cinder blocks): X = -105s to -65s, Z = 170s to 210s
      [-85.0 * s, 170.0 * s, 40.0 * s, 0.7 * s, 1.8 * s, this.mats.cinderBlock],
      [-105.0 * s, 190.0 * s, 0.7 * s, 40.0 * s, 1.8 * s, this.mats.cinderBlock],

      // Plot C boundary (Partial brick foundation): X = 270s to 315s, Z = 50s to 85s
      [292.5 * s, 50.0 * s, 45.0 * s, 0.6 * s, 1.4 * s, this.mats.brick],
      [270.0 * s, 67.5 * s, 0.6 * s, 35.0 * s, 1.4 * s, this.mats.brick]
    ];

    wallSegments.forEach(([wx, wz, wLenX, wLenZ, wH, wMat]) => {
      const wGeo = new THREE.BoxGeometry(wLenX, wH, wLenZ);
      const wMesh = new THREE.Mesh(wGeo, wMat);
      wMesh.position.set(wx, wH / 2, wz);
      wMesh.castShadow = true;
      wMesh.receiveShadow = true;
      demGroup.add(wMesh);
    });

    // 3. Construction Material Mounds (Dumped river sand & crushed aggregate gravel heaps)
    const mounds = [
      [150.0 * s, 46.0 * s, 4.5 * s, 2.2 * s, this.mats.sandMound],
      [158.0 * s, 46.0 * s, 4.0 * s, 1.9 * s, this.mats.gravelMound],
      [-70.0 * s, 45.0 * s, 5.0 * s, 2.4 * s, this.mats.sandMound],
      [-62.0 * s, 45.0 * s, 4.2 * s, 2.0 * s, this.mats.gravelMound],
      [280.0 * s, 46.0 * s, 4.8 * s, 2.3 * s, this.mats.sandMound]
    ];

    mounds.forEach(([mx, mz, radius, height, mMat]) => {
      const mGeo = new THREE.ConeGeometry(radius, height, 16);
      const mMesh = new THREE.Mesh(mGeo, mMat);
      mMesh.position.set(mx, height / 2, mz);
      mMesh.castShadow = true;
      mMesh.receiveShadow = true;
      demGroup.add(mMesh);
    });

    this.rootGroup.add(demGroup);
  }

  initColonyInfrastructure(s) {
    const infraGroup = new THREE.Group();
    infraGroup.name = 'Colony_Infrastructure';

    // 1. Concrete Electric Utility Poles (RCC Stanchions) with Cross-Arms & Insulators
    const poleLocations = [
      // Along Front Colony Main Road (Z = 41.0s, lining the south shoulder)
      [-360 * s, 41.0 * s],
      [-280 * s, 41.0 * s],
      [-200 * s, 41.0 * s],
      [-120 * s, 41.0 * s],
      [-40 * s, 41.0 * s],
      [40 * s, 41.0 * s],
      [120 * s, 41.0 * s],
      [200 * s, 41.0 * s],
      [280 * s, 41.0 * s],
      [360 * s, 41.0 * s],
      [440 * s, 41.0 * s],

      // Along House North Boulevard (X = 103.0s, lining the east shoulder)
      [103.0 * s, -40 * s],
      [103.0 * s, 41.0 * s],
      [103.0 * s, 120 * s],
      [103.0 * s, 200 * s],
      [103.0 * s, 280 * s],

      // Along South Sector Main Road (X = -118.0s)
      [-118.0 * s, -40 * s],
      [-118.0 * s, 120 * s],
      [-118.0 * s, 200 * s]
    ];

    const poleH = 26.0 * s;
    const poleGeo = new THREE.BoxGeometry(0.80 * s, poleH, 0.80 * s);
    const armGeo = new THREE.BoxGeometry(4.2 * s, 0.25 * s, 0.25 * s);
    const insGeo = new THREE.CylinderGeometry(0.12 * s, 0.16 * s, 0.40 * s, 8);
    const lampArmGeo = new THREE.CylinderGeometry(0.06 * s, 0.06 * s, 2.5 * s, 8);
    lampArmGeo.rotateZ(Math.PI / 3);
    const lampHeadGeo = new THREE.BoxGeometry(0.6 * s, 0.2 * s, 1.2 * s);

    const poleObjects = [];

    poleLocations.forEach(([px, pz], idx) => {
      const pole = new THREE.Group();
      pole.position.set(px, poleH / 2, pz);

      // RCC Pole Shaft
      const shaft = new THREE.Mesh(poleGeo, this.mats.poleConcrete);
      shaft.castShadow = true;
      shaft.receiveShadow = true;
      pole.add(shaft);

      // Steel Cross-Arm at top
      const arm = new THREE.Mesh(armGeo, this.mats.poleSteel);
      arm.position.set(0, poleH * 0.46, 0);
      pole.add(arm);

      // 3 Pin Insulators on the arm
      [-1.8 * s, 0, 1.8 * s].forEach(ox => {
        const ins = new THREE.Mesh(insGeo, this.mats.insulator);
        ins.position.set(ox, poleH * 0.46 + 0.30 * s, 0);
        pole.add(ins);
      });

      // Streetlight on every 2nd pole
      if (idx % 2 === 0) {
        const lampArm = new THREE.Mesh(lampArmGeo, this.mats.poleSteel);
        lampArm.position.set(1.0 * s, poleH * 0.44, 0);
        pole.add(lampArm);

        const lampHead = new THREE.Mesh(lampHeadGeo, this.mats.lampHousing);
        lampHead.position.set(2.0 * s, poleH * 0.42, 0);
        pole.add(lampHead);

        const bulb = new THREE.Mesh(new THREE.PlaneGeometry(0.4 * s, 0.8 * s), this.mats.lampGlow);
        bulb.rotation.x = Math.PI / 2;
        bulb.position.set(2.0 * s, poleH * 0.42 - 0.11 * s, 0);
        pole.add(bulb);
      }

      infraGroup.add(pole);
      poleObjects.push({ x: px, y: poleH * 0.96, z: pz });
    });

    // 2. Overhead Power Cable Wires strung between consecutive Front Road poles
    for (let i = 0; i < 10; i++) {
      const p1 = poleObjects[i];
      const p2 = poleObjects[i + 1];

      [-1.8 * s, 0, 1.8 * s].forEach(ox => {
        const points = [
          new THREE.Vector3(p1.x + ox, p1.y, p1.z),
          new THREE.Vector3((p1.x + p2.x) / 2 + ox, p1.y - 1.2 * s, (p1.z + p2.z) / 2),
          new THREE.Vector3(p2.x + ox, p2.y, p2.z)
        ];
        const curve = new THREE.CatmullRomCurve3(points);
        const wireGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(12));
        const wireLine = new THREE.Line(wireGeo, this.mats.wire);
        infraGroup.add(wireLine);
      });
    }

    // 3. Roadside Distribution Transformer Sub-Station (2-Pole H-Frame with Danger Board)
    const transGroup = new THREE.Group();
    transGroup.position.set(98.0 * s, 0, 36.0 * s);

    // 2 Support H-Frame Poles
    [-2.5 * s, 2.5 * s].forEach(px => {
      const tPole = new THREE.Mesh(new THREE.BoxGeometry(0.8 * s, 22.0 * s, 0.8 * s), this.mats.poleConcrete);
      tPole.position.set(px, 11.0 * s, 0);
      tPole.castShadow = true;
      transGroup.add(tPole);
    });

    // Channel Iron Platform across poles
    const platGeo = new THREE.BoxGeometry(6.5 * s, 0.3 * s, 4.0 * s);
    const plat = new THREE.Mesh(platGeo, this.mats.poleSteel);
    plat.position.set(0, 10.0 * s, 0);
    transGroup.add(plat);

    // Main 100kVA Transformer Tank Box
    const tankGeo = new THREE.BoxGeometry(3.5 * s, 4.2 * s, 2.8 * s);
    const tank = new THREE.Mesh(tankGeo, new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.6, roughness: 0.4 }));
    tank.position.set(0, 12.2 * s, 0);
    tank.castShadow = true;
    transGroup.add(tank);

    // Radiator Cooling Fins
    [-1.85 * s, 1.85 * s].forEach(px => {
      const finGeo = new THREE.BoxGeometry(0.2 * s, 3.2 * s, 2.4 * s);
      const fin = new THREE.Mesh(finGeo, this.mats.poleSteel);
      fin.position.set(px, 12.2 * s, 0);
      transGroup.add(fin);
    });

    // Yellow Danger Board: "DANGER 440V"
    const dangerGeo = new THREE.PlaneGeometry(1.8 * s, 1.2 * s);
    const dangerBoard = new THREE.Mesh(dangerGeo, this.mats.hazardYellow);
    dangerBoard.position.set(0, 5.5 * s, 0.45 * s);
    transGroup.add(dangerBoard);

    const skullIcon = new THREE.Mesh(new THREE.CircleGeometry(0.25 * s, 8), this.mats.hazardBlack);
    skullIcon.position.set(0, 5.65 * s, 0.46 * s);
    transGroup.add(skullIcon);

    infraGroup.add(transGroup);

    // 4. Colony Entrance Metal Layout Signboard
    const signGroup = new THREE.Group();
    signGroup.position.set(-132.0 * s, 0, 42.0 * s);

    // Dual Steel Support Posts
    [-3.0 * s, 3.0 * s].forEach(px => {
      const sPost = new THREE.Mesh(new THREE.CylinderGeometry(0.12 * s, 0.12 * s, 9.0 * s, 8), this.mats.signboardFrame);
      sPost.position.set(px, 4.5 * s, 0);
      sPost.castShadow = true;
      signGroup.add(sPost);
    });

    // Main Signboard Panel
    const boardGeo = new THREE.BoxGeometry(7.2 * s, 3.6 * s, 0.15 * s);
    const board = new THREE.Mesh(boardGeo, this.mats.signboardBlue);
    board.position.set(0, 6.8 * s, 0);
    board.castShadow = true;
    signGroup.add(board);

    // White Header Strip & Text Placeholder
    const headerGeo = new THREE.PlaneGeometry(6.8 * s, 0.8 * s);
    const headerMesh = new THREE.Mesh(headerGeo, this.mats.whiteMark);
    headerMesh.position.set(0, 7.8 * s, 0.08 * s);
    signGroup.add(headerMesh);

    infraGroup.add(signGroup);

    // 5. Roadside Native Trees (Neem, Acacia, Gulmohar style) & Shrubs
    const treeCoords = [
      [-170 * s, 48 * s], [-85 * s, 48 * s], [140 * s, 48 * s], [210 * s, 48 * s],
      [310 * s, 48 * s], [430 * s, 48 * s], [-250 * s, 48 * s], [-330 * s, 48 * s],
      [104 * s, 90 * s], [104 * s, 160 * s], [104 * s, 230 * s], [-117 * s, 90 * s],
      [-117 * s, 160 * s], [60 * s, -65 * s], [150 * s, -65 * s], [-80 * s, -65 * s],
      [-160 * s, 180 * s], [40 * s, 180 * s], [180 * s, 180 * s], [290 * s, 180 * s]
    ];

    const trunkGeo = new THREE.CylinderGeometry(0.35 * s, 0.55 * s, 8.5 * s, 8);
    const canopyGeo1 = new THREE.SphereGeometry(3.6 * s, 8, 8);
    const canopyGeo2 = new THREE.SphereGeometry(2.8 * s, 8, 8);

    treeCoords.forEach(([tx, tz], idx) => {
      const tree = new THREE.Group();
      tree.position.set(tx, 0, tz);

      // Trunk
      const trunk = new THREE.Mesh(trunkGeo, this.mats.treeTrunk);
      trunk.position.y = 4.25 * s;
      trunk.castShadow = true;
      trunk.receiveShadow = true;
      tree.add(trunk);

      // Organic Foliage Canopy (Double Spheres)
      const canopy1 = new THREE.Mesh(canopyGeo1, this.mats.foliageGreen);
      canopy1.position.set(0, 8.8 * s, 0);
      canopy1.castShadow = true;
      tree.add(canopy1);

      const canopy2 = new THREE.Mesh(canopyGeo2, this.mats.foliageGreen);
      canopy2.position.set(0.8 * s, 10.5 * s, -0.6 * s);
      canopy2.castShadow = true;
      tree.add(canopy2);

      infraGroup.add(tree);
    });

    // Low dry shrubs / wild bushes
    const shrubGeo = new THREE.SphereGeometry(1.2 * s, 6, 6);
    for (let i = 0; i < 35; i++) {
      const rx = (Math.sin(i * 1.7) * 400 + 50) * s;
      const rz = (Math.cos(i * 2.3) * 200 + 80) * s;
      // Skip if on top of house plot
      if (rx >= -5 * s && rx <= 55 * s && rz >= -30 * s && rz <= 10 * s) continue;

      const shrub = new THREE.Mesh(shrubGeo, this.mats.dryShrub);
      shrub.scale.set(1.0, 0.6, 1.2);
      shrub.position.set(rx, 0.5 * s, rz);
      infraGroup.add(shrub);
    }

    this.rootGroup.add(infraGroup);
  }
}
