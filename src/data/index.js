/**
 * Master Floors Registry
 * Scalable architecture for multi-floor house simulation.
 */

import { GROUND_FLOOR_DATA } from './groundFloorData.js';
import { GROUND_FLOOR_FITOUT, FITOUT_FANS, FITOUT_LIGHTS } from './groundFloorFitout.js';
import { FIRST_FLOOR_DATA } from './firstFloorData.js';

export { GROUND_FLOOR_DATA } from './groundFloorData.js';
export { GROUND_FLOOR_FITOUT, FITOUT_FANS, FITOUT_LIGHTS } from './groundFloorFitout.js';
export { FIRST_FLOOR_DATA } from './firstFloorData.js';

export const FLOORS = [
  GROUND_FLOOR_DATA,
  FIRST_FLOOR_DATA
  // Future additions:
  // ROOF_TERRACE_DATA
];

export function getFloorById(id) {
  return FLOORS.find(f => f.id === id);
}

export function getAllColliders() {
  const colliders = [];
  FLOORS.forEach(floor => {
    floor.solids.forEach(solid => {
      if (
        solid.type.startsWith('wall') ||
        solid.type === 'lintel' ||
        solid.type === 'duct'
      ) {
        colliders.push(solid);
      }
    });
  });
  return colliders;
}

export function getAllTeleports() {
  return FLOORS.flatMap(f => f.teleports);
}

export function getAllZones() {
  return FLOORS.flatMap(f => f.zones);
}

export function getSpawnPoint() {
  return GROUND_FLOOR_DATA.spawn;
}
