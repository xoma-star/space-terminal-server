import {weightRandom} from '../pseudoRandom';
import {
  StarLuminosityClass,
  STARS_DISTRIBUTION,
  StarSpectralClass,
  StarType,
  type SystemData
} from '@xoma_star/shared-stellar-goose';

/**
 * Сгенерировать звездную систему со звездой
 * @param random
 */
export default function generateStarSystem(random: () => number): SystemData<StarType.STAR> {
  const spectralClass = weightRandom((Object.keys(STARS_DISTRIBUTION) as StarSpectralClass[])
    .reduce((acc, key) => {
      acc[key] = STARS_DISTRIBUTION[key].frequency;
      return acc;
    }, {} as Record<StarSpectralClass, number>), random);
  const luminosityProbability = STARS_DISTRIBUTION[spectralClass].luminosityClasses as Record<StarLuminosityClass, number>;
  const luminosityClass = weightRandom(luminosityProbability, random);

  return {
    starType: StarType.STAR,
    luminosityClass,
    spectralClass
  };
}