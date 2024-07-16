import {PNG} from 'pngjs';
import Alea from 'alea';

const TILE_SIZE = 128;
const STAR_DISTRIBUTION = 0.0009;
/** максимальный зум, доступный в leaflet */
const MAX_ZOOM = 18;

/**
 * сгенерировать картинку для плитки
 * @param payload координаты плитки
 */
export default function generateTile(payload: {readonly x: number, readonly y: number, readonly z: number}): PNG {
  const {
    x, y, z
  } = payload;

  const random = new Alea(x, y, z);

  const image = new PNG({width: TILE_SIZE, height: TILE_SIZE});

  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++) {
      const idx = (image.width * y + x) << 2;
      // при максимальном зуме звезды не рисуются
      const color = (z < MAX_ZOOM && random() <= (STAR_DISTRIBUTION / (z ** 3) * 128))
        ? 255
        : 0;
      image.data[idx] = color;      // r
      image.data[idx + 1] = color;  // g
      image.data[idx + 2] = color;  // b
      image.data[idx + 3] = 255;    // a
    }
  }

  return image;
}