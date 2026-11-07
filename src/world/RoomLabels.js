import * as THREE from 'three';
import { WORLD_SCALE } from '../config/constants.js';

export class RoomLabelsManager {
  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'RoomLabels';
    this.visible = true;
  }

  addLabels(labelsData) {
    labelsData.forEach(item => {
      const sprite = this.createLabelSprite(item.text, item.sub);
      sprite.position.set(item.x, item.elev, -item.y_spec);
      this.group.add(sprite);
    });
  }

  createLabelSprite(text, subtitle = '') {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Background pill card
    ctx.fillStyle = 'rgba(10, 13, 20, 0.85)';
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)'; // Amber accent border
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.roundRect(16, 16, 480, 224, 28);
    ctx.fill();
    ctx.stroke();

    // Subtle glass glow top line
    const grad = ctx.createLinearGradient(32, 20, 480, 20);
    grad.addColorStop(0, 'rgba(255,255,255,0.0)');
    grad.addColorStop(0.5, 'rgba(255,255,255,0.4)');
    grad.addColorStop(1, 'rgba(255,255,255,0.0)');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(40, 22);
    ctx.lineTo(472, 22);
    ctx.stroke();

    // Main room title
    ctx.font = 'bold 42px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 256, subtitle ? 96 : 128);

    // Dimension subtitle
    if (subtitle) {
      ctx.font = '600 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
      ctx.fillStyle = '#f59e0b';
      ctx.fillText(subtitle, 256, 164);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const spriteMat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false
    });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(6.5 * WORLD_SCALE, 3.25 * WORLD_SCALE, 1);
    return sprite;
  }

  setVisibility(visible) {
    this.visible = visible;
    this.group.visible = visible;
  }

  toggle() {
    this.setVisibility(!this.visible);
    return this.visible;
  }

  getRoot() {
    return this.group;
  }
}
