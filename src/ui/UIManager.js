import { WORLD_SCALE } from '../config/constants.js';

export class UIManager {
  constructor(options = {}) {
    this.options = options;

    // DOM Elements
    this.elements = {
      // Screens & Overlays
      blocker: document.getElementById('blocker'),
      loadingScreen: document.getElementById('loading-screen'),
      progressBar: document.getElementById('loading-progress-bar'),
      btnStart: document.getElementById('btn-start'),
      crosshair: document.getElementById('crosshair'),

      // Top-Left Mini HUD
      hudRoom: document.getElementById('hud-room'),
      hudFloor: document.getElementById('hud-floor'),
      modeBadge: document.getElementById('hud-mode-badge'),

      // Top-Right Minimap
      minimapCanvas: document.getElementById('minimap-canvas'),

      // Collapsible Sidebar
      sidebar: document.getElementById('sidebar'),
      sidebarToggle: document.getElementById('sidebar-toggle'),

      // Layer Controls
      btnToggleRoof: document.getElementById('btn-toggle-roof'),
      btnToggleLabels: document.getElementById('btn-toggle-labels'),
      btnToggleFurniture: document.getElementById('btn-toggle-furniture'),

      // Floor Level Controls
      btnFloorAll: document.getElementById('btn-floor-all'),
      btnFloorGf: document.getElementById('btn-floor-gf'),
      btnFloorFf: document.getElementById('btn-floor-ff'),

      // Navigation Controls
      btnToggleView: document.getElementById('btn-toggle-view'),
      btnReset: document.getElementById('btn-reset'),

      // Teleport buttons container
      teleportButtons: document.getElementById('teleport-buttons'),

      // Bottom Status Bar
      bottomStatusRoom: document.getElementById('status-room'),
      bottomStatusCoords: document.getElementById('status-coords'),
      bottomStatusElev: document.getElementById('status-elev'),
      bottomStatusFps: document.getElementById('status-fps')
    };

    // Minimap context & scaling
    if (this.elements.minimapCanvas) {
      this.minimapCtx = this.elements.minimapCanvas.getContext('2d');
    }
    this.zones = options.zones || [];

    // State tracking
    this.sidebarOpen = false;
    this.roofVisible = true;
    this.labelsVisible = false;
    this.furnitureVisible = true;
    this.isOrbitMode = false;

    // Callbacks
    this.onStart = options.onStart || (() => {});
    this.onToggleView = options.onToggleView || (() => {});
    this.onToggleRoof = options.onToggleRoof || (() => {});
    this.onToggleLabels = options.onToggleLabels || (() => {});
    this.onToggleFurniture = options.onToggleFurniture || (() => {});
    this.onFloorFilter = options.onFloorFilter || (() => {});
    this.onReset = options.onReset || (() => {});
    this.onTeleport = options.onTeleport || (() => {});

    this.initEvents();
    this.initLoadingSequence();
  }

  initEvents() {
    // Start button
    if (this.elements.btnStart) {
      this.elements.btnStart.addEventListener('click', () => {
        this.hideBlocker();
        this.onStart();
      });
    }

    // Sidebar collapse/expand toggle
    if (this.elements.sidebarToggle) {
      this.elements.sidebarToggle.addEventListener('click', () => {
        this.toggleSidebar();
      });
    }

    // Layer toggles
    if (this.elements.btnToggleRoof) {
      this.elements.btnToggleRoof.addEventListener('click', () => {
        this.onToggleRoof();
      });
    }

    if (this.elements.btnToggleLabels) {
      this.elements.btnToggleLabels.addEventListener('click', () => {
        this.onToggleLabels();
      });
    }

    if (this.elements.btnToggleFurniture) {
      this.elements.btnToggleFurniture.addEventListener('click', () => {
        this.onToggleFurniture();
      });
    }

    // Floor filter toggles
    const setupFloorBtn = (btn, filterName) => {
      if (!btn) return;
      btn.addEventListener('click', () => {
        ['btnFloorAll', 'btnFloorGf', 'btnFloorFf'].forEach(k => {
          if (this.elements[k]) this.elements[k].classList.remove('active');
        });
        btn.classList.add('active');
        this.onFloorFilter(filterName);
      });
    };
    setupFloorBtn(this.elements.btnFloorAll, 'all');
    setupFloorBtn(this.elements.btnFloorGf, 'ground_floor');
    setupFloorBtn(this.elements.btnFloorFf, 'first_floor');

    // Navigation toggles
    if (this.elements.btnToggleView) {
      this.elements.btnToggleView.addEventListener('click', () => {
        this.onToggleView();
      });
    }

    if (this.elements.btnReset) {
      this.elements.btnReset.addEventListener('click', () => {
        this.onReset();
      });
    }
  }

  initLoadingSequence() {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 15;
      if (this.elements.progressBar) {
        this.elements.progressBar.style.width = `${Math.min(progress, 100)}%`;
      }
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          if (this.elements.loadingScreen) {
            this.elements.loadingScreen.classList.add('fade-out');
            setTimeout(() => {
              this.elements.loadingScreen.style.display = 'none';
            }, 500);
          }
        }, 300);
      }
    }, 40);
  }

  populateTeleports(teleportList) {
    if (!this.elements.teleportButtons) return;
    this.elements.teleportButtons.innerHTML = '';

    teleportList.forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'teleport-btn';
      btn.innerHTML = item.label;
      btn.addEventListener('click', () => {
        this.onTeleport(item.x, item.y_spec, item.elev);
      });
      this.elements.teleportButtons.appendChild(btn);
    });
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
    if (this.elements.sidebar) {
      if (this.sidebarOpen) {
        this.elements.sidebar.classList.add('open');
        this.elements.sidebarToggle.innerHTML = '✕';
      } else {
        this.elements.sidebar.classList.remove('open');
        this.elements.sidebarToggle.innerHTML = '☰';
      }
    }
  }

  updateHUD(roomName, x, y_spec, elev, fps = 60) {
    const s = WORLD_SCALE;
    if (this.elements.hudRoom) this.elements.hudRoom.textContent = roomName;
    if (this.elements.hudFloor) {
      if (elev >= 22.0 * s) {
        this.elements.hudFloor.textContent = 'Terrace Level';
      } else if (elev >= 11.5 * s) {
        this.elements.hudFloor.textContent = 'First Floor';
      } else {
        this.elements.hudFloor.textContent = 'Ground Floor';
      }
    }
    // Normalise to architectural plan coordinates (feet)
    const normX = x / s;
    const normY = y_spec / s;
    const normElev = elev / s;

    if (this.elements.bottomStatusRoom) this.elements.bottomStatusRoom.textContent = `📍 ${roomName}`;
    if (this.elements.bottomStatusCoords) this.elements.bottomStatusCoords.textContent = `X: ${normX.toFixed(1)}' | Y: ${normY.toFixed(1)}'`;
    if (this.elements.bottomStatusElev) this.elements.bottomStatusElev.textContent = `Elev: ${normElev.toFixed(1)}'`;
    if (this.elements.bottomStatusFps) this.elements.bottomStatusFps.textContent = `${Math.round(fps)} FPS`;
  }

  updateMinimap(playerX, playerY_spec, cameraYaw = 0, playerElev = 0) {
    if (!this.minimapCtx) return;
    const ctx = this.minimapCtx;
    const width = 150;
    const height = 120;
    const s = WORLD_SCALE;

    const isFirstFloor = playerElev >= 11.0 * s;
    const minimapTitle = document.querySelector('.minimap-title');
    if (minimapTitle) {
      minimapTitle.textContent = isFirstFloor ? '1F PLAN' : 'GF PLAN';
    }

    ctx.clearRect(0, 0, width, height);

    // Plot: X: -0.75*s to 50.0*s (span 50.75*s), Y: -0.75*s to 24.0*s (span 24.75*s)
    const scaleX = width / (50.75 * s);
    const scaleY = height / (24.75 * s);

    // Dark sleek background
    ctx.fillStyle = '#0a0d14';
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 0.5;
    for (let gx = 0; gx < width; gx += 25) {
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, height);
      ctx.stroke();
    }

    // Draw architectural rooms for active floor only
    this.zones.forEach(r => {
      if (!r.bounds) return;
      const isZoneF1 = r.id.startsWith('F');
      if (isFirstFloor !== isZoneF1) return;

      const [xmin, xmax, ymin, ymax] = r.bounds;
      const rx = (xmin + 0.75 * s) * scaleX;
      const ry = (24.0 * s - ymax) * scaleY;
      const rw = (xmax - xmin) * scaleX;
      const rh = (ymax - ymin) * scaleY;

      // Fill room zone
      if (r.id === 'Z2' || r.id === 'F1' || r.id === 'F2') {
        ctx.fillStyle = 'rgba(79, 122, 50, 0.35)'; // Garden or Balcony
      } else {
        ctx.fillStyle = 'rgba(51, 65, 85, 0.45)';
      }
      ctx.fillRect(rx, ry, rw, rh);

      // Room outline
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
      ctx.lineWidth = 1;
      ctx.strokeRect(rx, ry, rw, rh);
    });

    // Outer plot perimeter
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(0, 0, width, height);

    // Player position
    const px = (playerX + 0.75 * s) * scaleX;
    const py = (24.0 * s - playerY_spec) * scaleY;

    // Viewing direction indicator cone
    ctx.save();
    ctx.translate(px, py);
    // Three.js yaw to minimap 2D angle (spec Y up is -py)
    const mapAngle = -cameraYaw - Math.PI / 2;
    ctx.rotate(mapAngle);

    ctx.fillStyle = 'rgba(245, 158, 11, 0.3)';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, 14, -Math.PI / 4, Math.PI / 4);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    // Player center dot
    ctx.fillStyle = '#f59e0b';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(px, py, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  setMode(isOrbitMode) {
    this.isOrbitMode = isOrbitMode;
    if (isOrbitMode) {
      if (this.elements.crosshair) this.elements.crosshair.style.display = 'none';
      if (this.elements.modeBadge) {
        this.elements.modeBadge.textContent = 'Dollhouse Overview';
        this.elements.modeBadge.className = 'hud-badge orbit';
      }
      if (this.elements.btnToggleView) {
        this.elements.btnToggleView.innerHTML = '🚶 First-Person View (V)';
      }
    } else {
      if (this.elements.crosshair) this.elements.crosshair.style.display = 'flex';
      if (this.elements.modeBadge) {
        this.elements.modeBadge.textContent = 'First-Person Walk';
        this.elements.modeBadge.className = 'hud-badge fps';
      }
      if (this.elements.btnToggleView) {
        this.elements.btnToggleView.innerHTML = '🔄 Dollhouse Orbit (V)';
      }
    }
  }

  setRoofButtonState(roofVisible) {
    this.roofVisible = roofVisible;
    if (this.elements.btnToggleRoof) {
      this.elements.btnToggleRoof.innerHTML = roofVisible ? '🏠 Roof: Visible (C)' : '🏠 Roof: Hidden (C)';
      this.elements.btnToggleRoof.classList.toggle('active', roofVisible);
    }
  }

  setLabelsButtonState(labelsVisible) {
    this.labelsVisible = labelsVisible;
    if (this.elements.btnToggleLabels) {
      this.elements.btnToggleLabels.innerHTML = labelsVisible ? '🏷️ Labels: ON (L)' : '🏷️ Labels: OFF (L)';
      this.elements.btnToggleLabels.classList.toggle('active', labelsVisible);
    }
  }

  setFurnitureButtonState(furnitureVisible) {
    this.furnitureVisible = furnitureVisible;
    if (this.elements.btnToggleFurniture) {
      this.elements.btnToggleFurniture.innerHTML = furnitureVisible ? '🛋️ Furniture: ON (F)' : '🛋️ Furniture: OFF (F)';
      this.elements.btnToggleFurniture.classList.toggle('active', furnitureVisible);
    }
  }

  setFloorButtonState(filter) {
    if (this.elements.btnFloorAll) this.elements.btnFloorAll.classList.toggle('active', filter === 'all');
    if (this.elements.btnFloorGf) this.elements.btnFloorGf.classList.toggle('active', filter === 'ground_floor');
    if (this.elements.btnFloorFf) this.elements.btnFloorFf.classList.toggle('active', filter === 'first_floor');
  }

  hideBlocker() {
    if (this.elements.blocker) {
      this.elements.blocker.style.display = 'none';
    }
  }

  showBlocker() {
    if (this.elements.blocker && !this.isOrbitMode) {
      this.elements.blocker.style.display = 'flex';
    }
  }
}
