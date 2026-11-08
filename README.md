# 3D House Simulation Architecture

A modular, extensible Three.js + Vite architectural simulation engine for multi-storey residential buildings, built to exact CAD specifications.

---

## 🎮 Controls & Keyboard Shortcuts

### First-Person Exploration Mode

| Key / Action | Action Description |
| :--- | :--- |
| <kbd>W</kbd> or <kbd>↑</kbd> | Move Forward |
| <kbd>S</kbd> or <kbd>↓</kbd> | Move Backward |
| <kbd>A</kbd> or <kbd>←</kbd> | Strafe Left |
| <kbd>D</kbd> or <kbd>→</kbd> | Strafe Right |
| <kbd>Shift</kbd> (Hold) | Sprint / Walk Fast |
| <kbd>Space</kbd> | Jump |
| <kbd>E</kbd> | **Interact** (Doors, Gates, Sinks, Beds, Seating, Toilets, Curtains, Almirahs, Cupboards, Drawers) |
| <kbd>H</kbd> | **Toggle Interaction Prompt** (Show/hide the "[E] Interact" hint on screen) |
| **Mouse Move** | Look around (Yaw & Pitch) |
| **Left Click** | Lock mouse cursor & enter walk mode (or interact with doors) |
| <kbd>Esc</kbd> | Release mouse cursor & pause navigation |

### View & Simulation Hotkeys

| Shortcut | Function | Description |
| :--- | :--- | :--- |
| <kbd>V</kbd> | **Toggle Camera Mode** | Switch between **First-Person Walk** and **Dollhouse Orbit View** |
| <kbd>5</kbd> or <kbd>P</kbd> | **Cycle POV Perspective** | Cycle between **First-Person**, **Third-Person (Back)**, and **Third-Person (Front)** |
| <kbd>1</kbd> | **Isolate Ground Floor** | Isolate Ground Floor in Dollhouse overview (auto-switches to Dollhouse if in FP) |
| <kbd>2</kbd> | **Isolate First Floor** | Isolate First Floor in Dollhouse overview (auto-switches to Dollhouse if in FP) |
| <kbd>3</kbd> or <kbd>0</kbd> | **Show Both Floors** | Display the full two-storey residential building in Dollhouse overview |
| <kbd>C</kbd> | **Toggle Roof Slab** | Show/hide top roof slab and terrace parapets to look inside from above |
| <kbd>L</kbd> | **Toggle Room Labels** | Show/hide 3D architectural room name badges (OFF by default for clean immersion) |
| <kbd>H</kbd> | **Toggle Interaction Prompt** | Toggle the on-screen "[E] Interact" hint prompt without affecting room labels |
| <kbd>F</kbd> | **Toggle Furniture** | Show/hide interior fitout (furniture, fixtures, appliances, doors, fans) |
| <kbd>R</kbd> | **Reset Position** | Teleport player back to the default spawn point (Gate Landing) |

### Dollhouse / Orbit Camera Controls

| Mouse Action | Effect |
| :--- | :--- |
| **Left Click + Drag** | Orbit / Rotate camera around the house |
| **Left Click on Door/Gate** | Interactively open / close door, gate, or motorized garage door |
| **Right Click + Drag** | Pan camera horizontally and vertically |
| **Scroll Wheel** | Zoom in / Zoom out |

### Interactive UI & Architecture Features

* **Interactive Doors, Boundary Gates & Motorized Garage System**:
  * **Motorized Overhead Sectional Garage Door**:
    * Authentic residential overhead roll-up sectional mechanism replacing swinging leaves.
    * 5 horizontal articulating panels in architectural dark charcoal steel (`M-GATE-MS`) with embossed shadow grooves, 4 upper frosted glass vision lites (`M-GLASS`), bottom rubber bulb weather seal, recessed flush handle, and side roller hinges.
    * Structural C-channel vertical guide jamb tracks, top lintel torsion drum shaft, motorized opener unit, and horizontal ceiling runners extending into the garage.
    * Lifts smoothly vertically **UP** ($7.60$ ft lift height) into ceiling clearance when activated, clearing the full 12.7 ft driveway width for vehicle and player passage.
    * Realistic mechanical audio via Web Audio API featuring electric motor hum combined with chain and roller track rumble.
    * Dynamic collision integration: solid physical barrier when closed; dynamically deactivated when open for smooth walk-through / drive-through.
  * **Interactive Pedestrian Entrance Gate (<kbd>G1</kbd>)**: Dual-leaf mild steel boundary gate with solid kick plates, horizontal privacy slats, and vertical stainless steel pull handles.
  * **Interactive Glazed Balcony Doors (<kbd>DF3</kbd>, <kbd>DF8</kbd>)**: Powder-coated aluminum framed doors with full-height safety glass panels leading to exterior first-floor balconies.
  * **Interior Flush Doors**: Solid teak doors with stainless steel lever handles and realistic latch audio.
  * **Dual Interaction Support**: Walk up in First-Person mode and press <kbd>E</kbd> or click; in Dollhouse / Orbit mode, simply left-click directly on any door or gate leaf.
* **Interactive Sinks & Running Water System**:
  * **8 Interactive Sinks & Basins**: Operating taps across Ground Floor and First Floor (Ground Floor Kitchen, West Bathroom, East Bathroom, First Floor Kitchen, Basin Niche, Bathrooms 1 & 2, and North Gallery).
  * **Procedural Running Water Simulation**: Turning on any tap displays an animated shimmering translucent water stream with dynamic pulsing and expanding basin splash ripple rings.
  * **Web Audio Sound Synthesis**: Built-in procedural audio synthesizing tap lever clicks and realistic running water hiss/trickle using modulated bandpass noise filters without needing external audio files.
  * **Dual Interaction Support**: Approach any sink in First-Person mode and press <kbd>E</kbd> (or left-click), or click directly on any tap in Dollhouse / Orbit mode.
* **Interactive Beds, Seating & Toilet System**:
  * **Accurate Sleeping Mechanism (Beds)**: Approach any bed (Ground Floor Bedroom Queen Bed, First Floor Master King Bed, or Child Bedroom Bed) and press <kbd>E</kbd> to sleep. The avatar transitions into an anatomically accurate horizontal lying pose flat on the mattress with head resting on the pillow, arms relaxed, and subtle chest-rise breathing motion, accompanied by procedural blanket rustle audio. Supports both First-Person bed view and Third-Person (toggled with <kbd>5</kbd>) views. Press <kbd>E</kbd>, <kbd>Space</kbd>, or any movement key (<kbd>W</kbd>/<kbd>A</kbd>/<kbd>S</kbd>/<kbd>D</kbd>) to smoothly stand up beside the bed.
  * **All Sofas & Chairs Interactive**: Approach any sofa (Ground Floor Living Room Sofa or First Floor Lobby Sofa), dining chair (all 10 dining chairs across GF and 1F), or study desk chair and press <kbd>E</kbd> to sit. Full-bounding-box reach detection allows approaching any part of the sofa. Camera lowers to seated eye-level, avatar drops hips onto cushion with thighs horizontal and knees bent 90° down with feet on the floor, accompanied by soft cushion compression audio. Look around freely with mouse while seated; press <kbd>E</kbd>, <kbd>Space</kbd>, or movement keys to stand up.
  * **Context-Aware Toilet System (Lid, Sit & Flush)**: High-detail ceramic 3D toilet models across all 4 bathrooms featuring a cistern tank, chrome dual flush button, contoured ceramic bowl, inner well with water disc, seat ring, and fully visible articulated lid cover.
    * **Flush Button Targeting**: Looking at the chrome flush button on top of the cistern displays `[E] Flush Toilet`. Pressing <kbd>E</kbd> triggers swirling water disc rotation, suction dip animation, and realistic procedural rushing water and refill hiss audio. Flushing can also be activated while seated!
    * **Toilet Lid Targeting**: Looking at a closed lid displays `[E] Open Toilet Lid` (swings smoothly open ~104° against cistern with ceramic clack audio); looking at an open lid displays `[E] Close Toilet Lid` (swings down flat to cover bowl).
    * **Toilet Seat Targeting**: Looking at the seat with lid open displays `[E] Sit on Toilet`, allowing the player to sit down in proper seated posture. Looking at the seat with lid closed displays `[E] Open Toilet Lid` first.
* **Interactive Window Curtains**:
  * **7 Dynamic Window Drapes**: Fully interactive fabric curtains across Ground Floor and First Floor (`CURTAIN-GF-BED`, `CURTAIN-GF-HALL`, `CURTAIN-GF-LOBBY`, `CURTAIN-1F-MASTER`, `CURTAIN-1F-LOBBY-L`, `CURTAIN-1F-LOBBY-R`, `CURTAIN-1F-CHILD`).
  * **Animated Gathering Kinematics**: Pressing <kbd>E</kbd> or clicking slides both fabric panels smoothly apart to the outer edges ($openRatio \to 1.0$), gathering into folds and exposing over 76% of the window glass to provide clear views of the outdoor gardens and street.
  * **Procedural Fabric Slide Audio**: Web Audio synthesis simulating realistic curtain fabric sliding on brass rings across the metallic curtain rod.
* **Interactive Storage System (Almirahs, Cupboards & Drawers)**:
  * **3 Interactive Wardrobes / Almirahs**: Built for Master Bedroom (GF), Master Bedroom (1F), and Child Bedroom (1F). Features dual swinging doors (left door swings $-98^\circ$, right door $+98^\circ$ out into the room), realistic chrome pull handles, upper hat shelf, lower shelf, and stainless steel clothing hanger rail.
  * **2 Interactive Kitchen Wall Cupboards**: Overhead storage cupboards in GF Kitchen with swinging cabinet doors, interior shelving, and chrome handles.
  * **6 Interactive Bedside Nightstand Drawers**: Flanking bedside tables in GF Master Bedroom, 1F Master Bedroom, and 1F Child Bedroom. Animated pull-out drawer boxes slide smoothly forward into the room with sleek metallic handles and exposed hollow storage cavities.
  * **Procedural Wood & Slide Audio**: Authentic cabinet wood hinge creak and magnetic catch latch on wardrobe/cupboard doors, paired with wooden glide runner friction on bedside drawers.
* **Realistic Interior Furniture Collisions & Dynamic Surface Physics**:
  * **63 Comprehensive Physical Furniture Colliders**: Full physical presence for all interior objects across Ground Floor and First Floor:
    * **Tables & Desks**: Dining tables, living coffee tables, TV media consoles, dressing tables, and study desks.
    * **Chairs & Seating**: All dining chairs, study chairs, armchairs, and living sofas.
    * **Cabinets & Storage**: Kitchen base counters, overhead wall cabinets, almirahs/wardrobes, bedside nightstands, storeroom racks, shoe racks, and mandir units.
    * **Sinks & Sanitary**: All 8 kitchen and bathroom washbasins, sink counters, and all 4 flush toilets.
    * **Vehicles**: Full collision volume for vehicles in the garage.
  * **Stepable Surfaces (Stand & Jump on Beds, Tables, Sofas & Counters)**:
    * Jumping onto beds, tables, study desks, chairs, sofas, or kitchen counters dynamically samples their top surface elevation.
    * Players can jump on, land on, walk across, and stand on top of beds without getting pushed or thrown off!
    * Walking off the edge triggers smooth gravity fall back to the room floor.
  * **Anti-Tunneling Continuous Collision Detection (CCD)**:
    * Substepped player movement integration ($dt$ partitioned into discrete substeps $\le 0.20$ ft) combined with full-depth doorway threshold colliders ($0.56$ - $0.70$ ft depth).
    * Completely prevents tunneling through closed doors and gates when sprinting at full velocity.
  * **Dynamic Seating & Sleeping Collision Bypass**:
    * Occupying any bed, sofa, dining chair, or toilet automatically disables that specific item's collider during sitting/sleeping, preventing any physics jitter, and safely restores it upon standing up.
* **Collapsible Sidebar (<kbd>☰</kbd> / <kbd>✕</kbd>)**: Click the toggle tab on the right edge to expand or collapse the control drawer.
* **Floor Level View (Dollhouse Overview)**:
  * **🏢 Both Floors (<kbd>3</kbd>)**: View the full two-storey residential building.
  * **🏠 Ground Floor (<kbd>1</kbd>)**: Isolate Ground Floor architecture, furniture, and lights; intermediate slab is hidden for an open top-down view into GF rooms.
  * **🏢 First Floor (<kbd>2</kbd>)**: Isolate First Floor architecture and fitout with intermediate slab as its floor; roof and terrace parapets are hidden for an open look into 1F rooms.
* **3-Tier Vertical Exploration (GF + 1F + Terrace)**:
  * **Ground Floor** ($Z = 1.50$ ft plinth): Porch, Living room, Kitchen, Dining, Bedroom, Bathrooms, Storeroom, Garage ramp ($Z = 0.0$ to $0.50$ ft).
  * **First Floor** ($Z = 12.00$ ft): Master Bedroom, Kitchen, Lobby, North Gallery, Bathrooms, Child Bedroom, Mandir, and open exterior balcony with 3.5 ft stainless steel railings.
  * **Terrace Level** ($Z = 22.50$ ft): Fully accessible open-air terrace with 3.25 ft perimeter parapet walls and 3-sided stairwell guard enclosure.
  * **Open Central Shaft with Walkable Gratings**: Features heavy-duty stainless steel open-bar gratings on the 1F floor (allowing see-through views down to GF without falling) and 1F ceiling (providing open sightlines up to the terrace and sky).
* **Live Minimap (Top-Right)**: Real-time 2D top-down floor plan showing room boundaries, active floor (`GF PLAN` / `1F PLAN`), player position, and viewing direction cone.
* **Quick Teleports**: Click any of the room buttons in the sidebar to jump instantly to any zone across Ground Floor, First Floor, or Terrace.
* **Real-time Status Bar (Bottom)**: Displays current room zone, exact X/Y coordinates in feet, floor elevation, and FPS performance counter.
* **Optimized High-Fidelity Rendering**:
  * Dynamic point light pooling (8 active lights smoothly tracked to camera vicinity, keeping fragment loops constant and avoiding Three.js shader recompilation).
  * Soft PCF shadow mapping (2048x2048) and device pixel ratio capping for silky 60 FPS performance.

---

## 📁 Project Structure

```
house/
├── index.html                   # HTML shell, glassmorphism HUD, minimap & sidebar
├── vite.config.js               # Vite development server configuration
├── package.json                 # Dependencies & build scripts
├── run.sh                       # Quick-launch script
├── styles/
│   └── main.css                 # Dark glassmorphic design system & UI animations
└── src/
    ├── main.js                  # Application entry point bootstrapping Engine
    ├── config/
    │   ├── constants.js         # Global WORLD_SCALE multiplier & player physics configuration
    │   └── palette.js           # Full PBR architectural materials palette
    ├── data/
    │   ├── groundFloorData.js   # Ground floor CAD structure (walls, plinth, stairs, slab)
    │   ├── groundFloorFitout.js # Ground floor interior fitout (furniture, doors, windows, fans)
    │   ├── firstFloorData.js    # First floor CAD structure (cantilevers, walls, upper stair, roof, parapet)
    │   ├── firstFloorFitout.js  # First floor interior fitout (furniture, doors, windows, fans, shaft grills)
    │   ├── interiorColliders.js # Interior furniture obstacle collision definitions with walking insets
    │   └── index.js             # Master Floors Registry aggregating floors, colliders, teleports
    ├── core/
    │   ├── Engine.js            # Main loop, time delta, FPS counter, and system orchestration
    │   ├── SceneManager.js      # Three.js scene, camera, WebGL renderer, tone mapping
    │   └── Lighting.js          # Directional sun with soft shadow map & ambient fill
    ├── world/
    │   ├── HouseBuilder.js      # Procedural mesh builder for structural solids and stairs
    │   ├── FitoutBuilder.js     # Mesh builder for doors, windows, gates, animated fans, lights
    │   ├── DoorManager.js       # Interactive doors, pedestrian gates, motorized overhead garage door & audio
    │   ├── SinkManager.js       # Interactive sinks & washbasins with animated water streams & Web Audio
    │   ├── FurnitureManager.js  # Interactive beds, sofas, chairs, toilets with lid & flush mechanics
    │   ├── CurtainManager.js    # Interactive window curtains with fabric gathering drapes & slide audio
    │   ├── StorageManager.js    # Interactive wardrobes (almirahs), cupboards, and nightstand drawers
    │   ├── Materials.js         # Reusable Three.js PBR materials manager
    │   ├── Environment.js       # Extended terrain, street, fog, and sky dome
    │   └── RoomLabels.js        # 3D billboard canvas sprites for room labels
    ├── player/
    │   ├── Player.js            # Physics state, grounded elevation tracking, movement
    │   ├── CollisionSystem.js   # Multi-floor elevation sampling & sliding wall collision
    │   └── InputManager.js      # Keyboard and mouse event dispatching
    ├── camera/
    │   └── CameraController.js  # First-Person PointerLock + Dollhouse OrbitControls
    └── ui/
        └── UIManager.js         # Live HUD, interactive minimap canvas, sidebar, loader
```

---

## 🚀 Running the Project

* **Development Server:**
  ```bash
  npm run dev
  # or ./run.sh
  ```
  Open `http://localhost:3000` in your browser.

* **Production Build:**
  ```bash
  npm run build
  ```
