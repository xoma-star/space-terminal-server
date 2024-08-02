import {weightRandom} from '../pseudoRandom';
import {
  StarLuminosityClass,
  STARS_DISTRIBUTION,
  StarSpectralClass,
  STAR_LUMINOSITY_BY_SPECTRAL_CLASS,
  StarType,
  type SystemData
} from '@xoma_star/shared-stellar-goose';

/**
 * Сгенерировать звездную систему со звездой
 * @param random
 */
export default function generateStarSystem(random: () => number): SystemData<StarType.STAR> {
  const spectralClass = weightRandom(STARS_DISTRIBUTION, random);
  const luminosityProbability = STAR_LUMINOSITY_BY_SPECTRAL_CLASS[spectralClass];
  const luminosityClass = weightRandom(luminosityProbability, random);

  return {
    starType: StarType.STAR,
    luminosityClass,
    spectralClass
  };
}