import * as THREE from 'three';
import { SceneManager } from './SceneManager.js';
import { Lighting } from './Lighting.js';
import { Environment } from '../world/Environment.js';
import { MaterialManager } from '../world/Materials.js';
import { HouseBuilder } from '../world/HouseBuilder.js';
import { FitoutBuilder } from '../world/FitoutBuilder.js';
import { RoomLabelsManager } from '../world/RoomLabels.js';
import { CollisionSystem } from '../player/CollisionSystem.js';
import { InputManager } from '../player/InputManager.js';
import { Player } from '../player/Player.js';
import { CameraController } from '../camera/CameraController.js';
import { UIManager } from '../ui/UIManager.js';

import {
  FLOORS,
  GROUND_FLOOR_FITOUT,
  FITOUT_FANS,
  FITOUT_LIGHTS,
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
    this.fitoutBuilder.buildFitout(GROUND_FLOOR_FITOUT, FITOUT_FANS, FITOUT_LIGHTS);
    this.sceneManager.scene.add(this.fitoutBuilder.getRoot());

    // 6. Floating Room Labels
    this.labels = new RoomLabelsManager();
    FLOORS.forEach(floor => {
      if (floor.labels) {
        this.labels.addLabels(floor.labels);
      }
    });
    this.sceneManager.scene.add(this.labels.getRoot());

    // 7. Physics & Wall Collisions
    const allZones = getAllZones();
    const allColliders = getAllColliders();
    this.collision = new CollisionSystem(allZones, allColliders);

    // 8. FPS Player
    this.spawnPoint = getSpawnPoint();
    this.player = new Player(this.spawnPoint, this.collision);

    // 9. Camera Controller (FP + Orbit Dollhouse)
    this.cameraCtrl = new CameraController(
      this.sceneManager.camera,
      this.sceneManager.renderer.domElement
    );

    // 10. Input Manager
    this.input = new InputManager();

    // 11. UI State
    this.roofVisible = true;
    this.labelsVisible = true;
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
      onToggleFurniture: () => {
        this.toggleFurniture();
      },
      onFloorFilter: (filter) => {
        this.houseBuilder.setFloorFilter(filter);
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
        this.houseBuilder.setRoofVisibility(this.roofVisible);
      }
    });

    // Wire hotkeys
    this.input.on('toggleView', () => this.toggleView());
    this.input.on('toggleRoof', () => this.toggleRoof());
    this.input.on('toggleLabels', () => this.toggleLabels());
    this.input.on('toggleFurniture', () => this.toggleFurniture());
    this.input.on('resetPlayer', () => this.resetPlayer());

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
    this.ui.setLabelsButtonState(this.labelsVisible);
  }

  toggleFurniture() {
    this.furnitureVisible = this.fitoutBuilder.toggleFurniture();
    this.ui.setFurnitureButtonState(this.furnitureVisible);
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

    // Animate ceiling fan blades
    this.fitoutBuilder.update(delta);

    // Extract current camera yaw angle
    const euler = new THREE.Euler(0, 0, 0, 'YXZ');
    euler.setFromQuaternion(this.sceneManager.camera.quaternion);
    const cameraYaw = euler.y;

    if (!this.cameraCtrl.isOrbitMode && this.cameraCtrl.fpControls.isLocked) {
      // First person movement & collisions
      this.player.update(delta, this.input, this.sceneManager.camera);
      this.sceneManager.camera.position.copy(this.player.position);

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
    } else if (this.cameraCtrl.isOrbitMode) {
      // Orbit camera damping update
      this.cameraCtrl.update();

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

    // Render 3D Scene
    this.sceneManager.render();
  }
}
