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
| <kbd>E</kbd> | **Interact with Doors & Gates** (Open / Close targeted door or overhead garage door) |
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
    │   └── index.js             # Master Floors Registry aggregating floors, colliders, teleports
    ├── core/
    │   ├── Engine.js            # Main loop, time delta, FPS counter, and system orchestration
    │   ├── SceneManager.js      # Three.js scene, camera, WebGL renderer, tone mapping
    │   └── Lighting.js          # Directional sun with soft shadow map & ambient fill
    ├── world/
    │   ├── HouseBuilder.js      # Procedural mesh builder for structural solids and stairs
    │   ├── FitoutBuilder.js     # Mesh builder for doors, windows, gates, animated fans, lights
    │   ├── DoorManager.js       # Interactive doors, pedestrian gates, motorized overhead garage door & audio
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
