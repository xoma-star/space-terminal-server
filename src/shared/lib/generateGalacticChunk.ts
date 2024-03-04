import {CHUNK_SIZE} from '@xoma_star/shared-stellar-goose';

function parseChunk(value: number): string {
  return value.toString(CHUNK_SIZE);
}

export default function generateGalacticChunk(currentChunk: string | null): string[] {
  const result = [];
  if (currentChunk === null) {
    for (let i = 0; i < CHUNK_SIZE ** 2; i++) {
      result.push(`${parseChunk(Math.floor(i / 32))}:${parseChunk(i % CHUNK_SIZE)}`.toUpperCase());
    }
  } else {
    const [x, y] = currentChunk.split(':');
    for (let i = 0; i < CHUNK_SIZE ** 2; i++) {
      const chunkX = Math.floor(i / 32);
      const chunkY = (i % CHUNK_SIZE);
      result.push(`${x}${parseChunk(chunkX)}:${y}${parseChunk(chunkY)}`.toUpperCase());
    }
  }

  return result;
}