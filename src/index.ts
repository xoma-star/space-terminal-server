import {Elysia} from 'elysia';
import {cors} from '@elysiajs/cors';
import * as jose from 'jose';
import {generateKey} from './auth/generateKeys.ts';
import validateChunk from './shared/lib/validateChunk.ts';
import generateGalacticChunk from './shared/lib/generateGalacticChunk.ts';
import generateSystem from './shared/lib/generateSystem.ts';
import * as PImage from 'pureimage';
import seedrandom from 'seedrandom';
import {PNG} from 'pngjs';


const app = new Elysia();
app.use(cors());

app.get('/map/chunkPreview', (request) => {
  try {
    const isValid = Boolean(request.query.chunk) && validateChunk(request.query.chunk);
    if (!isValid) {
      throw new Error('неверные координаты');
    }

    const chunk = generateGalacticChunk(request.query.chunk)
      .map(x => {
        const fullData = generateSystem(x);
        if (!fullData) return fullData;
        const {name, luminosityClass, starType, blackHoleType, spectralClass} = fullData;
        return {
          name,
          luminosityClass,
          starType,
          blackHoleType,
          spectralClass
        };
      });
    return chunk;
  } catch (e) {
    return e
  }
});

app.get('/map/:z/:x/:y', (req) => {
  const z = Number(req.params.z);
  const x = req.params.x;
  const y = req.params.y;

  const image = new PNG({ width: 128, height: 128 });

  const pointsPosition = Array.from({length: z < 14 ? 18 : 0}, () => Math.floor(Math.random() * 128 * 128));

  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++) {
      const idx = (image.width * y + x) << 2;
      const color = pointsPosition.includes(idx) ? 255 : 0;
      image.data[idx] = color;
      image.data[idx + 1] = color;
      image.data[idx + 2] = color;
      image.data[idx + 3] = 255;
    }
  }

  const buffer = PNG.sync.write(image);

  const response = new Response(buffer, {
    headers: {
      'Content-Type': 'image/png'
    }
  });

  return response;
});

app.post('/auth', async (payload) => {
  const key = await generateKey();
  console.log(await jose.jwtVerify(key, new TextEncoder().encode('pizdak')));
  return key;
});

app.listen(3000);
console.log('started at port 3000');