import { Engine } from './core/Engine.js';

window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('canvas-container');
  window.simulationEngine = new Engine(container);
});
