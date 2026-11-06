import * as THREE from 'three';
import { PALETTE } from '../config/palette.js';

export class MaterialManager {
  constructor() {
    this.materials = new Map();

    // Edge outline line material for crisp architectural render
    this.edgeMaterial = new THREE.LineBasicMaterial({
      color: PALETTE.edge_outline.color,
      transparent: true,
      opacity: PALETTE.edge_outline.opacity,
      depthTest: true
    });

    this.initMaterials();
  }

  initMaterials() {
    for (const [key, cfg] of Object.entries(PALETTE)) {
      if (key === 'edge_outline') continue;

      const matParams = {
        color: new THREE.Color(cfg.color),
        roughness: cfg.roughness ?? 0.7,
        metalness: cfg.metalness ?? 0.0
      };

      if (cfg.transparent) {
        matParams.transparent = true;
        matParams.opacity = cfg.opacity ?? 0.5;
        matParams.depthWrite = false;
      }

      if (cfg.emissive) {
        matParams.emissive = new THREE.Color(cfg.emissive);
        matParams.emissiveIntensity = cfg.emissiveIntensity ?? 1.0;
      }

      const mat = new THREE.MeshStandardMaterial(matParams);
      mat.name = key;
      this.materials.set(key, mat);
    }
  }

  get(type) {
    if (!type) return this.materials.get('wall_int');
    if (this.materials.has(type)) {
      return this.materials.get(type);
    }

    // Try matching without prefix or case-insensitive
    const lowerType = type.toLowerCase();
    for (const [key, mat] of this.materials.entries()) {
      if (key.toLowerCase() === lowerType) {
        return mat;
      }
    }

    // Fallbacks based on naming heuristics
    if (lowerType.includes('glass')) return this.materials.get('M-GLASS');
    if (lowerType.includes('wood')) return this.materials.get('M-WOOD-DARK');
    if (lowerType.includes('door')) return this.materials.get('M-DOOR-TEAK');
    if (lowerType.includes('wall')) return this.materials.get('wall_int');
    if (lowerType.includes('step') || lowerType.includes('tread')) return this.materials.get('step');

    return this.materials.get('wall_int');
  }

  getEdgeMaterial() {
    return this.edgeMaterial;
  }
}
