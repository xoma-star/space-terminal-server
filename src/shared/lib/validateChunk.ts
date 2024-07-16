import type {Chunk} from '../types';

type ValidateChunkPayload = Partial<Chunk>;

/**
 * проверить координаты на валидность
 * @param payload request.query
 */
export default function validateChunk(payload: ValidateChunkPayload): boolean {
  const {
    left,
    top,
    bottom,
    right
  } = payload;

  try {
    const coordinates = [left, right, top, bottom];

    const checkValue = (value: unknown): boolean => {
      if (typeof value !== 'string') {
        return false;
      }
      const number = parseFloat(value);

      return !isNaN(number);
    }

    return coordinates.every(checkValue);
  } catch {
    return false;
  }
}