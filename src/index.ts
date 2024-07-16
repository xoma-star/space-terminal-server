import {Elysia} from 'elysia';
import {cors} from '@elysiajs/cors';
import * as jose from 'jose';
import {generateKey} from './auth/generateKeys.ts';
import validateChunk from './shared/lib/validateChunk.ts';
import generateGalacticChunk from './shared/lib/generateGalacticChunk.ts';
import {PNG} from 'pngjs';
import generateTile from './map/generateTile.ts';


const app = new Elysia();
app.use(cors());

app.get('/map/chunkPreview', (request) => {
  try {
    const isValid = validateChunk(request.query);
    if (!isValid) {
      throw new Error('неверные координаты');
    }

    return generateGalacticChunk(request.query);
  } catch (e) {
    return e
  }
});

app.get('/map/:z/:x/:y', (req) => {
  const image = generateTile(req.params);

  const buffer = PNG.sync.write(image);

  return new Response(buffer, {
    headers: {
      'Content-Type': 'image/png'
    }
  });
});

app.post('/auth', async (payload) => {
  const key = await generateKey();
  console.log(await jose.jwtVerify(key, new TextEncoder().encode('pizdak')));
  return key;
});

app.listen(3000);
console.log('started at port 3000');