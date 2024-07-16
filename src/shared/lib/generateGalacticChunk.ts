import {type SystemData} from '@xoma_star/shared-stellar-goose';
import type {Chunk} from '../types';
import generateSystem from './generateSystem';

const MAX_WIDTH = 1;
/** длина дробной части */
const DECIMALS = 3;
const STEP = 1 / Math.pow(10, DECIMALS);

/**
 * приводит координату к нужному значению
 * @param payload
 * @example "54.5983487623" -> 54.598
 */
function parseCoordinate(payload: string) {
  return Number(parseFloat(payload).toFixed(DECIMALS));
}

/**
 * добавляет шаг к значению. нужно, т.к. компьютер не может нормально складывать числа дробные
 * @param payload
 */
function addStep(payload: number) {
  const multiplier = Math.pow(10, DECIMALS);
  return Math.round((payload + STEP) * multiplier) / multiplier;
}

/**
 * сгенерировать звездные системы в указанном чанке
 * @param chunk
 */
export default function generateGalacticChunk(chunk: Chunk): SystemData[] {
  const systems = [];

  if (Math.abs(chunk.left - chunk.right) > MAX_WIDTH) {
    return [];
  }

  const start = {
    x: Math.min(parseCoordinate(chunk.left), parseCoordinate(chunk.right)),
    y: Math.min(parseCoordinate(chunk.top), parseCoordinate(chunk.bottom))
  };

  const end = {
    x: Math.max(parseCoordinate(chunk.left), parseCoordinate(chunk.right)),
    y: Math.max(parseCoordinate(chunk.top), parseCoordinate(chunk.bottom))
  };

  for (let i = start.x; i <= end.x; i = addStep(i)) {
    for (let j = start.y; j <= end.y; j = addStep(j)) {
      const systemData = generateSystem({
        x: i,
        y: j
      });
      if (systemData) {
        const {
          offsetX,
          offsetY,
          ...data
        } = systemData;
        systems.push({...data, x: i + offsetX * STEP, y: j + offsetY * STEP});
      }
    }
  }

  return systems;
}