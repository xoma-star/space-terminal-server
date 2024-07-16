import {weightRandom} from './pseudoRandom';
import generateStarSystem from './generateSystem/generateStarSystem';
import * as crypto from 'crypto';
import generatePlanet from './generateSystem/generatePlanet';
import generateName from './generateName';
import {
  BASE_SYSTEM_APPEAR_PROBABILITY, type PlanetData,
  STAR_TYPE_PROBABILITY,
  StarType,
  type SystemData
} from '@xoma_star/shared-stellar-goose';
import Alea from 'alea';

interface Coordinates {
  x: number;
  y: number;
}

/**
 * Г
 * @param coordinates
 * @param fullData надо ли включать расширенные данные
 */
export default function generateSystem(coordinates: Coordinates, fullData: boolean = false): SystemData | null {
  const {x, y} = coordinates;
  const seed = `${x}-${y}`;
  const maskSeed = crypto.createHash('sha256')
    .update(`${seed} my secret key`)
    .digest('hex');

  const random = new Alea(maskSeed);
  if (random() < (1 - BASE_SYSTEM_APPEAR_PROBABILITY)) {
    return null;
  }

  const starType = weightRandom(STAR_TYPE_PROBABILITY, random);

  const baseProperties = {
    name: generateName(random),
    id: maskSeed,
    offsetX: random(),
    offsetY: random()
  };

  let specificProperties: SystemData;

  switch (starType) {
    case StarType.STAR:
      specificProperties = {...baseProperties, ...generateStarSystem(random)};
      break;
    default: return null;
  }

  if (!fullData) {
    return specificProperties;
  }

  const planetCount = Math.floor(random() * 7) + 2;
  const planets: PlanetData[] = [];
  for (let i = 0; i < planetCount; i++) {
    planets.push(generatePlanet(`${seed}-planet-${i}`, specificProperties, i));
  }
  specificProperties.planets = planets;

  return specificProperties;
}