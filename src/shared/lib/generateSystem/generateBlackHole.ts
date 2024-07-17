import {weightRandom} from '../pseudoRandom';
import {
  BLACK_HOLE_TYPE_FREQUENCY,
  StarType,
  type SystemData
} from '@xoma_star/shared-stellar-goose';

/**
 * Сгенерировать звездную систему со звездой
 * @param random
 */
export default function generateBlackHole(random: () => number): SystemData<StarType.BLACK_HOLE> {
  const blackHoleType = weightRandom(BLACK_HOLE_TYPE_FREQUENCY, random)

  return {
    starType: StarType.BLACK_HOLE,
    blackHoleType
  };
}