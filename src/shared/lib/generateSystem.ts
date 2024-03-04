import seedrandom from 'seedrandom';
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

/**
 * Г
 * @param seed
 */
export default function generateSystem(seed: string): SystemData | null {
  const maskSeed = crypto.createHash('sha256')
    .update(`${seed.toUpperCase()} my secret key`)
    .digest('hex');
  const random = seedrandom(maskSeed);
  if (random() < (1 - BASE_SYSTEM_APPEAR_PROBABILITY)) {
    return null;
  }

  const starType = weightRandom(STAR_TYPE_PROBABILITY, random);

  const baseProperties = {
    name: generateName(random)
  };

  let specificProperties: SystemData;

  switch (starType) {
    case StarType.STAR:
      specificProperties = {...baseProperties, ...generateStarSystem(random)};
      break;
    default: return null;
  }

  const planetCount = Math.floor(random() * 7) + 2;
  const planets: PlanetData[] = [];
  for (let i = 0; i < planetCount; i++) {
    planets.push(generatePlanet(`${seed}-planet-${i}`, specificProperties, i));
  }
  specificProperties.planets = planets;

  return specificProperties;
}