import * as jose from 'jose';

const secret = new TextEncoder().encode('pizdak')

export async function generateKey() {
  return new jose.SignJWT({aboba: true, biba: 3})
    .setProtectedHeader({alg: 'HS256'})
    .setExpirationTime('2h')
    .sign(secret);
}