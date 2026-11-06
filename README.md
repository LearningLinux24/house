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
| **Mouse Move** | Look around (Yaw & Pitch) |
| **Left Click** | Lock mouse cursor & enter walk mode |
| <kbd>Esc</kbd> | Release mouse cursor & pause navigation |

### View & Simulation Hotkeys

| Shortcut | Function | Description |
| :--- | :--- | :--- |
| <kbd>V</kbd> | **Toggle Camera Mode** | Switch between **First-Person Walk** and **Dollhouse Orbit View** |
| <kbd>C</kbd> | **Toggle Roof Slab** | Show/hide top roof slab to look inside the house from above |
| <kbd>L</kbd> | **Toggle Room Labels** | Show/hide floating 3D architectural room name badges |
| <kbd>F</kbd> | **Toggle Furniture** | Show/hide interior fitout (furniture, fixtures, appliances) |
| <kbd>R</kbd> | **Reset Position** | Teleport player back to the default spawn point (Gate Landing) |

### Dollhouse / Orbit Camera Controls

| Mouse Action | Effect |
| :--- | :--- |
| **Left Click + Drag** | Orbit / Rotate camera around the house |
| **Right Click + Drag** | Pan camera horizontally and vertically |
| **Scroll Wheel** | Zoom in / Zoom out |

### Interactive UI Features

* **Collapsible Sidebar (<kbd>☰</kbd> / <kbd>✕</kbd>)**: Click the toggle tab on the right edge to expand or collapse the control drawer.
* **Floor Level View**:
  * **🏢 Both Floors**: View the full two-storey residential building.
  * **🏠 Ground Floor**: Isolate Ground Floor and view its interior from above.
  * **🏢 First Floor**: Isolate First Floor and inspect its layout.
* **Live Minimap (Top-Right)**: Real-time 2D top-down floor plan showing room boundaries, active floor (`GF PLAN` / `1F PLAN`), player position, and viewing direction cone.
* **Quick Teleports**: Click any of the 27 room buttons in the sidebar to jump instantly to any zone on the Ground Floor or First Floor.
* **Real-time Status Bar (Bottom)**: Displays current room zone, exact X/Y coordinates in feet, floor elevation, and FPS performance counter.

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
    │   ├── constants.js         # Player physics parameters (eye height, speed, radius)
    │   └── palette.js           # Full PBR architectural materials palette
    ├── data/
    │   ├── groundFloorData.js   # Ground floor CAD structure (walls, plinth, stairs, slab)
    │   ├── groundFloorFitout.js # Ground floor interior fitout (furniture, doors, windows, fans)
    │   ├── firstFloorData.js    # First floor CAD structure (cantilevers, walls, upper stair, roof)
    │   └── index.js             # Master Floors Registry aggregating floors, colliders, teleports
    ├── core/
    │   ├── Engine.js            # Main loop, time delta, FPS counter, and system orchestration
    │   ├── SceneManager.js      # Three.js scene, camera, WebGL renderer, tone mapping
    │   └── Lighting.js          # Directional sun with soft shadow map & ambient fill
    ├── world/
    │   ├── HouseBuilder.js      # Procedural mesh builder for structural solids and stairs
    │   ├── FitoutBuilder.js     # Mesh builder for doors, windows, gates, animated fans, lights
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
