import {Elysia, ValidationError} from 'elysia';
import * as jose from 'jose';
import {generateKey} from './auth/generateKeys.ts';
import validateChunk from './shared/lib/validateChunk.ts';
import generateGalacticChunk from './shared/lib/generateGalacticChunk.ts';
import generateSystem from './shared/lib/generateSystem.ts';

const app = new Elysia();

app.get('/map/chunkPreview', (request) => {
  try {
    const isValid = Boolean(request.query.chunk) && validateChunk(request.query.chunk);
    if (!isValid) {
      throw new Error('неверные координаты');
    }

    const chunk = generateGalacticChunk(request.query.chunk)
      .map(x => generateSystem(x));
    return chunk;
  } catch (e) {
    return e
  }
});

app.post('/auth', async (payload) => {
  const key = await generateKey();
  console.log(await jose.jwtVerify(key, new TextEncoder().encode('pizdak')));
  return key;
});

app.listen(3000);
console.log('started at port 3000');