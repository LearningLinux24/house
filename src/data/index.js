/**
 * Master Floors Registry
 * Scalable architecture for multi-floor house simulation.
 * Applies WORLD_SCALE uniformly to all geometric datasets to preserve 1:1 CAD aspect ratios.
 */

import { GROUND_FLOOR_DATA as RAW_GF_DATA } from './groundFloorData.js';
import { GROUND_FLOOR_FITOUT as RAW_GF_FITOUT, FITOUT_FANS as RAW_FANS, FITOUT_LIGHTS as RAW_LIGHTS } from './groundFloorFitout.js';
import { FIRST_FLOOR_DATA as RAW_FF_DATA } from './firstFloorData.js';
import { WORLD_SCALE } from '../config/constants.js';

function scaleFloor(floor, s) {
  return {
    ...floor,
    spawn: {
      ...floor.spawn,
      x: floor.spawn.x * s,
      y_spec: floor.spawn.y_spec * s,
      elev: floor.spawn.elev * s
    },
    solids: floor.solids.map(solid => ({
      ...solid,
      box: solid.box.map(coord => coord * s)
    })),
    garageWedge: floor.garageWedge ? {
      ...floor.garageWedge,
      xMin: floor.garageWedge.xMin * s,
      xMax: floor.garageWedge.xMax * s,
      yMin: floor.garageWedge.yMin * s,
      yMax: floor.garageWedge.yMax * s,
      zMin: floor.garageWedge.zMin * s,
      zMaxAtNorth: floor.garageWedge.zMaxAtNorth * s
    } : undefined,
    zones: (floor.zones || []).map(zone => ({
      ...zone,
      bounds: zone.bounds ? zone.bounds.map(coord => coord * s) : undefined
    })),
    labels: (floor.labels || []).map(label => ({
      ...label,
      x: label.x * s,
      y_spec: label.y_spec * s,
      elev: label.elev * s
    })),
    teleports: (floor.teleports || []).map(teleport => ({
      ...teleport,
      x: teleport.x * s,
      y_spec: teleport.y_spec * s,
      elev: teleport.elev * s
    }))
  };
}

function scaleFitout(fitout, s) {
  return fitout.map(item => ({
    ...item,
    box: item.box.map(coord => coord * s)
  }));
}

function scaleFans(fans, s) {
  return fans.map(fan => ({
    ...fan,
    cx: fan.cx * s,
    cy_spec: fan.cy_spec * s
  }));
}

function scaleLights(lights, s) {
  return lights.map(light => ({
    ...light,
    cx: light.cx * s,
    cy_spec: light.cy_spec * s,
    sizeX: light.sizeX * s,
    sizeY: light.sizeY * s
  }));
}

export const GROUND_FLOOR_DATA = scaleFloor(RAW_GF_DATA, WORLD_SCALE);
export const FIRST_FLOOR_DATA = scaleFloor(RAW_FF_DATA, WORLD_SCALE);
export const GROUND_FLOOR_FITOUT = scaleFitout(RAW_GF_FITOUT, WORLD_SCALE);
export const FITOUT_FANS = scaleFans(RAW_FANS, WORLD_SCALE);
export const FITOUT_LIGHTS = scaleLights(RAW_LIGHTS, WORLD_SCALE);

export const FLOORS = [
  GROUND_FLOOR_DATA,
  FIRST_FLOOR_DATA
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
