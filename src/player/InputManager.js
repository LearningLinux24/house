export class InputManager {
  constructor() {
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      sprint: false,
      jump: false
    };

    this.actionListeners = new Map();
    this.init();
  }

  init() {
    window.addEventListener('keydown', (e) => this.onKeyDown(e));
    window.addEventListener('keyup', (e) => this.onKeyUp(e));
  }

  onKeyDown(e) {
    // Prevent default scroll on arrow keys / space
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
      e.preventDefault();
    }

    switch (e.code) {
      // Movement
      case 'KeyW':
      case 'ArrowUp':
        this.keys.forward = true;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.keys.backward = true;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.keys.left = true;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.keys.right = true;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        this.keys.sprint = true;
        break;
      case 'Space':
        this.keys.jump = true;
        break;

      // Hotkey Actions
      case 'KeyV':
        this.emit('toggleView');
        break;
      case 'Digit5':
      case 'Numpad5':
      case 'KeyP':
        this.emit('togglePOV');
        break;
      case 'KeyC':
        this.emit('toggleRoof');
        break;
      case 'KeyL':
        this.emit('toggleLabels');
        break;
      case 'KeyF':
        this.emit('toggleFurniture');
        break;
      case 'KeyG':
        this.emit('toggleGarage');
        break;
      case 'KeyE':
        this.emit('interact');
        break;
      case 'KeyH':
        this.emit('togglePrompts');
        break;
      case 'KeyR':
        this.emit('resetPlayer');
        break;

      // Floor Isolation Hotkeys (Dollhouse Overview)
      case 'Digit1':
      case 'Numpad1':
        this.emit('filterFloor', 'ground_floor');
        break;
      case 'Digit2':
      case 'Numpad2':
        this.emit('filterFloor', 'first_floor');
        break;
      case 'Digit3':
      case 'Numpad3':
      case 'Digit0':
      case 'Numpad0':
        this.emit('filterFloor', 'all');
        break;
    }
  }

  onKeyUp(e) {
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.keys.forward = false;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.keys.backward = false;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.keys.left = false;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.keys.right = false;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        this.keys.sprint = false;
        break;
      case 'Space':
        this.keys.jump = false;
        break;
    }
  }

  on(action, callback) {
    if (!this.actionListeners.has(action)) {
      this.actionListeners.set(action, []);
    }
    this.actionListeners.get(action).push(callback);
  }

  emit(action, data) {
    const list = this.actionListeners.get(action);
    if (list) {
      list.forEach(cb => cb(data));
    }
  }
}
