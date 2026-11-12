/**
 * TouchControls — High-Performance Mobile Dual-Touch Controller
 *
 * Designed for full mobile and tablet usability:
 *  - Dynamic Virtual Joystick (Left Thumb): Touch anywhere on left half to steer (smooth 360° analog).
 *  - Swipe-to-Look (Right Thumb): Touch and drag on right half to rotate camera yaw/pitch.
 *  - Action Buttons: Thumb-reachable buttons for Interact, Jump, Sprint toggle, POV switch, Orbit toggle.
 *  - Tap-to-Interact: Quick tap on interactive elements (doors, sinks, chairs, cars) interacts directly.
 *  - Landscape / Device Orientation recommendation notice.
 */

export function checkIsTouchDevice() {
  if (typeof window === 'undefined') return false;
  return (
    'ontouchstart' in window ||
    (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) ||
    window.matchMedia('(pointer: coarse)').matches
  );
}

export class TouchControls {
  constructor(engine) {
    this.engine = engine;
    this.isTouchDevice = checkIsTouchDevice();

    // Joystick state
    this.joystickTouchId = null;
    this.joystickOrigin = { x: 0, y: 0 };
    this.joystickRadius = 48; // Max displacement in pixels
    this.joystickVector = { x: 0, y: 0 };

    // Camera look state
    this.lookTouchId = null;
    this.lastLookX = 0;
    this.lastLookY = 0;
    this.lookSensitivity = 0.0038;
    this.touchStartTime = 0;
    this.touchStartPos = { x: 0, y: 0 };

    // Sprint toggle state
    this.sprintActive = false;

    // DOM references
    this.container = null;
    this.joystickZone = null;
    this.joystickBase = null;
    this.joystickKnob = null;
    this.lookZone = null;
    this.btnInteract = null;
    this.btnJump = null;
    this.btnSprint = null;
    this.btnView = null;
    this.btnPOV = null;
    this.btnMap = null;

    if (this.isTouchDevice) {
      this.init();
    }
  }

  init() {
    this.buildDOM();
    this.bindEvents();
    this.checkOrientation();
    window.addEventListener('resize', () => this.checkOrientation());
    window.addEventListener('orientationchange', () => this.checkOrientation());
  }

  buildDOM() {
    // 1. Root Mobile Overlay
    this.container = document.createElement('div');
    this.container.id = 'mobile-touch-root';
    this.container.className = 'mobile-touch-root';

    this.container.innerHTML = `
      <!-- Left Screen Touch Zone for Joystick -->
      <div id="touch-joystick-zone" class="touch-joystick-zone" aria-label="Touch to Walk">
        <!-- Floating Visual Joystick -->
        <div id="touch-joystick-base" class="touch-joystick-base">
          <div class="joystick-ring"></div>
          <div id="touch-joystick-knob" class="touch-joystick-knob">
            <div class="knob-dot"></div>
          </div>
        </div>
      </div>

      <!-- Right Screen Touch Zone for Camera Look -->
      <div id="touch-look-zone" class="touch-look-zone" aria-label="Swipe to Look"></div>

      <!-- Action Buttons Bar (Bottom-Right) -->
      <div id="mobile-action-bar" class="mobile-action-bar">
        <!-- Utility Action Bar (POV, View, Map) -->
        <div class="mobile-util-group">
          <button id="btn-touch-view" class="mobile-btn circle-sm" title="Toggle Dollhouse View" aria-label="Dollhouse View">
            <span class="btn-icon">🔄</span>
            <span class="btn-micro">VIEW</span>
          </button>
          <button id="btn-touch-pov" class="mobile-btn circle-sm" title="Change Camera Angle" aria-label="Camera Angle">
            <span class="btn-icon">📷</span>
            <span class="btn-micro">POV</span>
          </button>
          <button id="btn-touch-map" class="mobile-btn circle-sm" title="Toggle Floor Plan" aria-label="Toggle Floor Plan">
            <span class="btn-icon">🗺️</span>
            <span class="btn-micro">MAP</span>
          </button>
        </div>

        <!-- Primary Thumb Action Controls -->
        <div class="mobile-main-group">
          <button id="btn-touch-sprint" class="mobile-btn action-pill" title="Toggle Run" aria-label="Toggle Run">
            <span class="btn-icon">⚡</span>
            <span class="btn-txt">RUN</span>
          </button>
          <button id="btn-touch-jump" class="mobile-btn action-circle" title="Jump" aria-label="Jump">
            <span class="btn-icon">⬆️</span>
            <span class="btn-txt">JUMP</span>
          </button>
          <button id="btn-touch-interact" class="mobile-btn action-primary" title="Interact" aria-label="Interact">
            <span class="btn-icon">✋</span>
            <span class="btn-txt" id="btn-interact-label">INTERACT</span>
          </button>
        </div>
      </div>

      <!-- Strictly Enforced Landscape Overlay for Mobile Phones -->
      <div id="landscape-enforce-overlay" class="landscape-enforce-overlay" style="display: none;">
        <div class="rotate-phone-anim">
          <div class="phone-icon-device"></div>
        </div>
        <h2 class="rotate-title">Rotate to Landscape</h2>
        <p class="rotate-desc">This 3D architectural simulation requires <strong>Landscape Mode</strong>.</p>
        <div class="rotate-sub">Turn your phone horizontally & tap to enter fullscreen</div>
      </div>
    `;

    document.body.appendChild(this.container);

    // Cache elements
    this.joystickZone = document.getElementById('touch-joystick-zone');
    this.joystickBase = document.getElementById('touch-joystick-base');
    this.joystickKnob = document.getElementById('touch-joystick-knob');
    this.lookZone = document.getElementById('touch-look-zone');
    this.btnInteract = document.getElementById('btn-touch-interact');
    this.btnJump = document.getElementById('btn-touch-jump');
    this.btnSprint = document.getElementById('btn-touch-sprint');
    this.btnView = document.getElementById('btn-touch-view');
    this.btnPOV = document.getElementById('btn-touch-pov');
    this.btnMap = document.getElementById('btn-touch-map');
    this.landscapeOverlay = document.getElementById('landscape-enforce-overlay');

    // Adapt Start Screen copy for mobile touch
    const startBtn = document.getElementById('btn-start');
    if (startBtn) {
      const textSpan = startBtn.querySelector('.btn-text');
      if (textSpan) textSpan.textContent = 'TAP TO EXPLORE';
      startBtn.addEventListener('click', () => this.requestFullscreenMode());
      startBtn.addEventListener('touchend', () => this.requestFullscreenMode());
    }
    const controlsHint = document.querySelector('.controls-hint');
    if (controlsHint) {
      controlsHint.innerHTML = '<span>Drag left to <strong>Walk</strong>, drag right to <strong>Look</strong>, tap <strong>Interact</strong></span>';
    }
  }

  bindEvents() {
    // ── 1. VIRTUAL JOYSTICK (Left Zone) ──────────────────────────────────────
    this.joystickZone.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (this.joystickTouchId !== null) return;

      const touch = e.changedTouches[0];
      this.joystickTouchId = touch.identifier;
      this.joystickOrigin = { x: touch.clientX, y: touch.clientY };

      // Position base under finger
      this.joystickBase.style.left = `${touch.clientX}px`;
      this.joystickBase.style.top = `${touch.clientY}px`;
      this.joystickBase.classList.add('active');
      this.joystickKnob.style.transform = 'translate(-50%, -50%)';

      this.updateJoystick(touch.clientX, touch.clientY);
    }, { passive: false });

    window.addEventListener('touchmove', (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === this.joystickTouchId) {
          e.preventDefault();
          this.updateJoystick(touch.clientX, touch.clientY);
        } else if (touch.identifier === this.lookTouchId) {
          e.preventDefault();
          this.updateLook(touch.clientX, touch.clientY);
        }
      }
    }, { passive: false });

    const handleJoystickEnd = (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === this.joystickTouchId) {
          this.joystickTouchId = null;
          this.joystickVector = { x: 0, y: 0 };
          this.joystickBase.classList.remove('active');
          this.joystickKnob.style.transform = 'translate(-50%, -50%)';

          if (this.engine.input) {
            this.engine.input.moveVector = { x: 0, y: 0 };
            this.engine.input.keys.forward = false;
            this.engine.input.keys.backward = false;
            this.engine.input.keys.left = false;
            this.engine.input.keys.right = false;
          }
          break;
        }
      }
    };

    window.addEventListener('touchend', handleJoystickEnd, { passive: false });
    window.addEventListener('touchcancel', handleJoystickEnd, { passive: false });

    // ── 2. CAMERA LOOK SWIPE (Right Zone) ───────────────────────────────────
    this.lookZone.addEventListener('touchstart', (e) => {
      // Don't capture touches intended for action buttons
      if (e.target.closest('#mobile-action-bar')) return;
      e.preventDefault();

      if (this.lookTouchId !== null) return;
      const touch = e.changedTouches[0];
      this.lookTouchId = touch.identifier;
      this.lastLookX = touch.clientX;
      this.lastLookY = touch.clientY;
      this.touchStartTime = Date.now();
      this.touchStartPos = { x: touch.clientX, y: touch.clientY };
    }, { passive: false });

    const handleLookEnd = (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === this.lookTouchId) {
          // Detect quick stationary tap to interact directly
          const elapsed = Date.now() - this.touchStartTime;
          const dist = Math.hypot(touch.clientX - this.touchStartPos.x, touch.clientY - this.touchStartPos.y);
          if (elapsed < 260 && dist < 12) {
            this.engine.handleInteraction();
          }

          this.lookTouchId = null;
          break;
        }
      }
    };

    window.addEventListener('touchend', handleLookEnd, { passive: false });
    window.addEventListener('touchcancel', handleLookEnd, { passive: false });

    // ── 3. BUTTON HANDLERS ──────────────────────────────────────────────────
    // Interact Button
    this.btnInteract.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.engine.handleInteraction();
    });

    // Jump Button
    const triggerJumpStart = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (this.engine.input) this.engine.input.keys.jump = true;
    };
    const triggerJumpEnd = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (this.engine.input) this.engine.input.keys.jump = false;
    };
    this.btnJump.addEventListener('touchstart', triggerJumpStart, { passive: false });
    this.btnJump.addEventListener('touchend', triggerJumpEnd, { passive: false });
    this.btnJump.addEventListener('mousedown', triggerJumpStart);
    this.btnJump.addEventListener('mouseup', triggerJumpEnd);

    // Sprint Button (Toggle)
    this.btnSprint.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.sprintActive = !this.sprintActive;
      if (this.engine.input) this.engine.input.keys.sprint = this.sprintActive;
      this.btnSprint.classList.toggle('active', this.sprintActive);
      this.engine.ui.showToast(this.sprintActive ? '⚡ Run Mode: ON' : '🚶 Walk Mode: ON');
    });

    // Orbit / Walk Toggle Button
    this.btnView.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.engine.toggleView();
    });

    // Cycle POV Button
    this.btnPOV.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (this.engine.vehicleManager && this.engine.vehicleManager.isDriving) {
        this.engine.vehicleManager.toggleCameraPOV(this.engine.ui);
        return;
      }
      const label = this.engine.cameraCtrl.cyclePOV();
      this.engine.ui.showToast(`Perspective: ${label}`);
    });

    // Toggle Minimap Button (compact view on mobile)
    this.btnMap.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const mapWidget = document.getElementById('minimap-widget');
      if (mapWidget) {
        const isHidden = mapWidget.classList.toggle('mobile-hidden');
        this.btnMap.classList.toggle('active', !isHidden);
      }
    });

    // Tap on landscape overlay or touch screen to enter fullscreen
    if (this.landscapeOverlay) {
      this.landscapeOverlay.addEventListener('click', () => this.requestFullscreenMode());
      this.landscapeOverlay.addEventListener('touchend', () => this.requestFullscreenMode());
    }

    window.addEventListener('touchend', () => {
      const isLandscape = window.innerWidth > window.innerHeight;
      if (isLandscape) {
        this.requestFullscreenMode();
      }
    }, { passive: true });
  }

  updateJoystick(clientX, clientY) {
    const dx = clientX - this.joystickOrigin.x;
    const dy = clientY - this.joystickOrigin.y;
    const dist = Math.hypot(dx, dy);

    const clampedDist = Math.min(dist, this.joystickRadius);
    const angle = Math.atan2(dy, dx);

    const knobX = Math.cos(angle) * clampedDist;
    const knobY = Math.sin(angle) * clampedDist;

    this.joystickKnob.style.transform = `translate(calc(-50% + ${knobX}px), calc(-50% + ${knobY}px))`;

    // Normalised vectors (-1.0 to 1.0)
    const normX = knobX / this.joystickRadius;
    const normY = knobY / this.joystickRadius;

    this.joystickVector = { x: normX, y: normY };

    if (this.engine.input) {
      this.engine.input.moveVector = this.joystickVector;
      this.engine.input.keys.forward = normY < -0.25;
      this.engine.input.keys.backward = normY > 0.25;
      this.engine.input.keys.left = normX < -0.25;
      this.engine.input.keys.right = normX > 0.25;
    }
  }

  updateLook(clientX, clientY) {
    if (!this.engine.cameraCtrl) return;
    if (this.engine.cameraCtrl.isOrbitMode) {
      // OrbitControls manages touch rotation natively
      return;
    }

    const deltaX = clientX - this.lastLookX;
    const deltaY = clientY - this.lastLookY;

    this.lastLookX = clientX;
    this.lastLookY = clientY;

    this.engine.cameraCtrl.rotate(
      deltaX * this.lookSensitivity,
      deltaY * this.lookSensitivity
    );
  }

  update(delta, activeInteractCandidate) {
    if (!this.isTouchDevice) return;

    // Update interact button status and prompt text
    if (activeInteractCandidate && activeInteractCandidate.prompt) {
      this.btnInteract.classList.add('highlight');
      const label = document.getElementById('btn-interact-label');
      if (label) {
        // Truncate or clean prompt for touch button display
        let cleanText = activeInteractCandidate.prompt.replace(/\[E\]/g, '').trim();
        if (cleanText.length > 14) cleanText = cleanText.substring(0, 14);
        label.textContent = cleanText || 'INTERACT';
      }
    } else {
      this.btnInteract.classList.remove('highlight');
      const label = document.getElementById('btn-interact-label');
      if (label) label.textContent = 'INTERACT';
    }
  }

  checkOrientation() {
    if (!this.isTouchDevice) return;
    const isPortrait = window.innerHeight > window.innerWidth;

    if (this.landscapeOverlay) {
      if (isPortrait) {
        // Enforce landscape: display blocker overlay, hide controls
        this.landscapeOverlay.style.display = 'flex';
        if (this.joystickZone) this.joystickZone.style.display = 'none';
        if (this.lookZone) this.lookZone.style.display = 'none';
        const actionBar = document.getElementById('mobile-action-bar');
        if (actionBar) actionBar.style.display = 'none';
      } else {
        // Device is in landscape: hide blocker overlay, restore controls
        this.landscapeOverlay.style.display = 'none';
        if (this.joystickZone) this.joystickZone.style.display = 'block';
        if (this.lookZone) this.lookZone.style.display = 'block';
        const actionBar = document.getElementById('mobile-action-bar');
        if (actionBar) actionBar.style.display = 'flex';

        // Automatically switch to fullscreen mode when in landscape
        this.requestFullscreenMode();
      }
    }
  }

  requestFullscreenMode() {
    if (!this.isTouchDevice) return;
    const docEl = document.documentElement;
    const isFullscreen = !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );

    if (!isFullscreen) {
      const enter = docEl.requestFullscreen ||
                    docEl.webkitRequestFullscreen ||
                    docEl.mozRequestFullScreen ||
                    docEl.msRequestFullscreen;
      if (enter) {
        try {
          const promise = enter.call(docEl);
          if (promise && promise.catch) {
            promise.catch(() => {
              // Browser may require an explicit touch gesture
            });
          }
        } catch (_) {}
      }
    }

    // Attempt to lock screen orientation to landscape via Screen Orientation API
    if (screen.orientation && screen.orientation.lock) {
      try {
        screen.orientation.lock('landscape').catch(() => {});
      } catch (_) {}
    }
  }

  destroy() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
}
