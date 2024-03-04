import {MAX_CHUNK_DEPTH, CHUNK_SIZE} from '@xoma_star/shared-stellar-goose';

export default function validateChunk(chunk: unknown) {
  if (typeof chunk !== 'string') return false;
  // Проверка на формат строки
  const regex = /^[0-9A-V]+:[0-9A-V]+$/;
  if(!regex.test(chunk)) {
    return false;
  }

  // Разделение строковой координаты на два числа
  const [x, y] = chunk.split(':').map(coord => parseInt(coord, CHUNK_SIZE));

  // Проверка на одинаковую длину координат
  return x.toString(CHUNK_SIZE).length === y.toString(CHUNK_SIZE).length && x.toString(CHUNK_SIZE).length <= MAX_CHUNK_DEPTH;
}