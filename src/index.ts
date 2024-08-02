import {Elysia} from 'elysia';
import {cors} from '@elysiajs/cors';
import {jwt} from '@elysiajs/jwt'
import * as jose from 'jose';
import {generateKey} from './auth/generateKeys.ts';
import validateChunk from './shared/lib/validateChunk.ts';
import generateGalacticChunk from './shared/lib/generateGalacticChunk.ts';
import {PNG} from 'pngjs';
import generateTile from './map/generateTile.ts';
import type {Chunk} from './shared/types.ts';
import {cookie as useCookie} from '@elysiajs/cookie';
import {validate} from '@telegram-apps/init-data-node';


const app = new Elysia();
app.use(cors());
app.use(useCookie());
app.use(jwt({
  name: 'jwt',
  secret: 'aboba'
}));

app.get('/map/chunkPreview', (request) => {
  try {
    const isValid = validateChunk(request.query);
    if (!isValid) {
      throw new Error('неверные координаты');
    }

    return generateGalacticChunk(request.query as unknown as Chunk);
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
  const {
    body,
    set,
    jwt,
    cookie
  } = payload;


  cookie.auth = await jwt.sign(body);

  try {
    validate(body, '6757425014:AAGTIDExA1tu0-zavI2rZjyrjfgY3QjaoMw');
  } catch (e) {
    set.status = 403;

    throw e;
  }


  // const key = await generateKey();
  // console.log(await jose.jwtVerify(key, new TextEncoder().encode('pizdak')));
  // return key;
});

app.listen(3000);
console.log('started at port 3000');


/** тип разницы в схеме */
enum SchemeDiff {
  REMOVE,
  INSERT,
  EQUAL
}

/** разница в схеме */
type SchemeDiffContent = [
  /** тип разницы */
  SchemeDiff,
  /** значение этой разницы. если добавлено, до добавленный текст. если удалено, удаленный текст */
  string
];

/** что метод должен вернуть */
type MethodResult = SchemeDiffContent[];


// проверяемая схема
const checkScheme = `
  {\n
    "$id": 22,\n
    "Port": 43,\n
    "Driver": ""\n
  }
`;

/**
 * посчитать разницу между переданной схемой и типовой
 * типовая где-то на сервере лежит
 */
function getSchemeDiff(scheme: string): MethodResult {
  // типовая схема
  const standardValue = `
      {\n
        "$id": 123,\n
        "ConnectionType": 0,\n
        "Driver": "Arcus"\n
      }
  `;
  // ...

  return [] as MethodResult;
}

// getSchemeDiff(checkScheme) -> [
//   [2, '{\n"$id": '],
//   [0, '22'],
//   [1, '123'],
//   [2, ',\n"'],
//   [0, 'Port": 43'],
//   [1, 'ConnectionType": 0'],
//   [2, ',\n"Driver": "'],
//   [1, 'Arcus'],
//   [2, "\n}"]
// ]