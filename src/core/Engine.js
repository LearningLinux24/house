import * as THREE from 'three';
import { SceneManager } from './SceneManager.js';
import { Lighting } from './Lighting.js';
import { Environment } from '../world/Environment.js';
import { MaterialManager } from '../world/Materials.js';
import { HouseBuilder } from '../world/HouseBuilder.js';
import { FitoutBuilder } from '../world/FitoutBuilder.js';
import { RoomLabelsManager } from '../world/RoomLabels.js';
import { DoorManager } from '../world/DoorManager.js';
import { CollisionSystem } from '../player/CollisionSystem.js';
import { InputManager } from '../player/InputManager.js';
import { Player } from '../player/Player.js';
import { PlayerAvatar } from '../player/PlayerAvatar.js';
import { CameraController } from '../camera/CameraController.js';
import { UIManager } from '../ui/UIManager.js';

import {
  FLOORS,
  ALL_FITOUT,
  ALL_FANS,
  ALL_LIGHTS,
  getAllColliders,
  getAllTeleports,
  getAllZones,
  getSpawnPoint
} from '../data/index.js';

export class Engine {
  constructor(containerElement) {
    this.container = containerElement;
    this.clock = new THREE.Clock();

    // FPS calculation tracking
    this.frameCount = 0;
    this.fpsTimer = 0;
    this.currentFps = 60;

    // 1. Scene, Camera & WebGL Renderer
    this.sceneManager = new SceneManager(this.container);

    // 2. Lighting & Environment
    this.lighting = new Lighting(this.sceneManager.scene);
    this.environment = new Environment(this.sceneManager.scene);

    // 3. Materials Manager
    this.materials = new MaterialManager();

    // 4. House Structure Builder
    this.houseBuilder = new HouseBuilder(this.materials);
    FLOORS.forEach(floor => {
      this.houseBuilder.buildFloor(floor);
    });
    this.sceneManager.scene.add(this.houseBuilder.getRoot());

    // 5. Fitout & Interior Builder
    this.fitoutBuilder = new FitoutBuilder(this.materials);
    this.fitoutBuilder.buildFitout(ALL_FITOUT, ALL_FANS, ALL_LIGHTS);
    this.sceneManager.scene.add(this.fitoutBuilder.getRoot());

    // 6. Floating Room Labels
    this.labels = new RoomLabelsManager();
    FLOORS.forEach(floor => {
      if (floor.labels) {
        this.labels.addLabels(floor.labels, floor.id);
      }
    });
    this.labels.setVisibility(false);
    this.sceneManager.scene.add(this.labels.getRoot());

    // 7. Physics & Wall Collisions
    const allZones = getAllZones();
    const allColliders = getAllColliders();
    this.collision = new CollisionSystem(allZones, allColliders);

    // 7b. Interactive Doors Manager (12 Residential Doors with Dynamic Colliders)
    this.doorManager = new DoorManager(this.materials, this.collision);
    this.doorManager.buildDoors(this.sceneManager.scene);

    // 8. FPS Player
    this.spawnPoint = getSpawnPoint();
    this.player = new Player(this.spawnPoint, this.collision);

    // 8b. Player Avatar
    this.avatar = new PlayerAvatar(this.sceneManager.scene);

    // 9. Camera Controller (FP + Third-Person + Orbit Dollhouse)
    this.cameraCtrl = new CameraController(
      this.sceneManager.camera,
      this.sceneManager.renderer.domElement
    );

    // 10. Input Manager
    this.input = new InputManager();

    // 11. UI State
    this.roofVisible = true;
    this.labelsVisible = false;
    this.promptsVisible = false;
    this.furnitureVisible = true;

    // 12. UI Manager
    this.ui = new UIManager({
      zones: allZones,
      onStart: () => {
        if (!this.cameraCtrl.isOrbitMode) {
          this.cameraCtrl.fpControls.lock();
        }
      },
      onToggleView: () => {
        this.toggleView();
      },
      onToggleRoof: () => {
        this.toggleRoof();
      },
      onToggleLabels: () => {
        this.toggleLabels();
      },
      onTogglePrompts: () => {
        this.togglePrompts();
      },
      onToggleFurniture: () => {
        this.toggleFurniture();
      },
      onFloorFilter: (filter) => {
        this.setFloorFilter(filter);
      },
      onReset: () => {
        this.resetPlayer();
      },
      onTeleport: (x, y_spec, elev) => {
        this.teleport(x, y_spec, elev);
      }
    });

    this.ui.populateTeleports(getAllTeleports());

    // Camera lock/unlock UI handlers
    this.cameraCtrl.fpControls.addEventListener('lock', () => {
      this.ui.hideBlocker();
    });

    this.cameraCtrl.fpControls.addEventListener('unlock', () => {
      if (!this.cameraCtrl.isOrbitMode) {
        this.ui.showBlocker();
      }
    });

    this.cameraCtrl.onModeChange((isOrbit) => {
      this.ui.setMode(isOrbit);
      if (isOrbit) {
        this.houseBuilder.setRoofVisibility(false);
      } else {
        // When returning to First-Person, restore full house view
        this.setFloorFilter('all', false);
        this.houseBuilder.setRoofVisibility(this.roofVisible);
      }
    });

    // Wire hotkeys
    this.input.on('toggleView', () => this.toggleView());
    this.input.on('togglePOV', () => {
      const label = this.cameraCtrl.cyclePOV();
      this.ui.showToast(`Perspective: ${label}`);
    });
    this.input.on('toggleRoof', () => this.toggleRoof());
    this.input.on('toggleLabels', () => this.toggleLabels());
    this.input.on('togglePrompts', () => this.togglePrompts());
    this.input.on('toggleFurniture', () => this.toggleFurniture());
    this.input.on('interact', () => this.doorManager.interact(this.ui, this.promptsVisible));
    this.input.on('resetPlayer', () => this.resetPlayer());
    this.input.on('filterFloor', (filter) => this.setFloorFilter(filter));

    // Mouse click door interaction (FP click + Orbit raycast click)
    let pointerDownPos = { x: 0, y: 0 };
    window.addEventListener('pointerdown', (e) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('click', (e) => {
      const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
      if (dist > 5) return; // Ignore drag operations (e.g. orbit rotation)

      if (this.cameraCtrl.fpControls.isLocked) {
        this.doorManager.interact(this.ui, this.promptsVisible);
      } else if (this.cameraCtrl.isOrbitMode) {
        this.doorManager.handleOrbitClick(e, this.sceneManager.camera);
      }
    });

    // Position initial camera
    this.sceneManager.camera.position.copy(this.player.position);

    // Start Animation Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  toggleView() {
    this.cameraCtrl.toggleMode(this.player);
  }

  toggleRoof() {
    this.roofVisible = !this.roofVisible;
    this.houseBuilder.setRoofVisibility(this.roofVisible);
    this.ui.setRoofButtonState(this.roofVisible);
  }

  toggleLabels() {
    this.labelsVisible = this.labels.toggle();
    // Synchronize prompt visibility with labels
    this.promptsVisible = this.labelsVisible;
    this.ui.setLabelsButtonState(this.labelsVisible);
    this.ui.setPromptsButtonState(this.promptsVisible);
    if (!this.promptsVisible) {
      this.ui.hideInteractionPrompt();
    }
  }

  togglePrompts() {
    this.promptsVisible = !this.promptsVisible;
    this.ui.setPromptsButtonState(this.promptsVisible);
    if (!this.promptsVisible) {
      this.ui.hideInteractionPrompt();
    }
  }

  toggleFurniture() {
    this.furnitureVisible = this.fitoutBuilder.toggleFurniture();
    this.ui.setFurnitureButtonState(this.furnitureVisible);
  }

  setFloorFilter(filter, autoSwitchToOrbit = true) {
    this.currentFloorFilter = filter;
    this.houseBuilder.setFloorFilter(filter);
    this.fitoutBuilder.setFloorFilter(filter);
    this.labels.setFloorFilter(filter);
    if (this.doorManager) {
      this.doorManager.setFloorFilter(filter);
    }
    this.ui.setFloorButtonState(filter);

    if (autoSwitchToOrbit && !this.cameraCtrl.isOrbitMode) {
      this.cameraCtrl.setMode(true, this.player);
    }
  }

  resetPlayer() {
    this.teleport(this.spawnPoint.x, this.spawnPoint.y_spec, this.spawnPoint.elev);
  }

  teleport(x, y_spec, elev) {
    this.player.teleport(x, y_spec, elev);
    if (this.cameraCtrl.isOrbitMode) {
      this.cameraCtrl.setMode(false, this.player);
    } else {
      this.sceneManager.camera.position.copy(this.player.position);
      this.cameraCtrl.fpControls.lock();
    }
  }

  animate() {
    requestAnimationFrame(this.animate);

    const delta = Math.min(this.clock.getDelta(), 0.1);

    // Track FPS
    this.frameCount++;
    this.fpsTimer += delta;
    if (this.fpsTimer >= 0.5) {
      this.currentFps = this.frameCount / this.fpsTimer;
      this.frameCount = 0;
      this.fpsTimer = 0;
    }

    // Animate ceiling fan blades & dynamic light assignment
    this.fitoutBuilder.update(delta, this.sceneManager.camera.position);

    // Update interactive doors (hinge swing lerping + reticle proximity targeting)
    const isFPActive = !this.cameraCtrl.isOrbitMode && this.cameraCtrl.fpControls.isLocked;
    this.doorManager.update(
      delta,
      this.sceneManager.camera,
      this.player.position,
      isFPActive,
      this.ui,
      this.promptsVisible
    );

    // Extract current camera yaw (from actual camera, not a proxy)
    const cameraYaw = this.cameraCtrl.getYaw();
    const isMoving = this.input.keys.forward || this.input.keys.backward || this.input.keys.left || this.input.keys.right;

    if (!this.cameraCtrl.isOrbitMode && this.cameraCtrl.fpControls.isLocked) {
      // Player movement — pass the actual camera as source of look direction
      this.player.update(delta, this.input, this.sceneManager.camera);

      // Camera follows player (handles all 3 POV modes)
      this.cameraCtrl.update(this.player, delta, this.collision);

      const zone = this.collision.getZoneAt(this.player.position.x, this.player.position.z, this.player.feetElevation);
      this.ui.updateHUD(
        zone.name,
        this.player.position.x,
        -this.player.position.z,
        this.player.feetElevation,
        this.currentFps
      );

      this.ui.updateMinimap(
        this.player.position.x,
        -this.player.position.z,
        cameraYaw,
        this.player.feetElevation
      );
    } else {
      // Orbit camera damping or idle camera update
      this.cameraCtrl.update(this.player, delta, this.collision);

      const zone = this.collision.getZoneAt(this.player.position.x, this.player.position.z, this.player.feetElevation);
      this.ui.updateHUD(
        zone.name,
        this.player.position.x,
        -this.player.position.z,
        this.player.feetElevation,
        this.currentFps
      );

      this.ui.updateMinimap(
        this.player.position.x,
        -this.player.position.z,
        cameraYaw,
        this.player.feetElevation
      );
    }

    // Update Avatar model (position, walk cycle, visibility based on POV mode)
    this.avatar.update(
      delta,
      this.player.position,
      this.player.feetElevation,
      cameraYaw,
      isMoving,
      this.cameraCtrl.getPOVMode(),
      this.cameraCtrl.isOrbitMode
    );

    // Render 3D Scene
    this.sceneManager.render();
  }
}
