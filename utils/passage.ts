import jwtDecode, { JwtPayload } from 'jwt-decode';
import jwt from "jsonwebtoken";
import jwkToPem, { RSA } from "jwk-to-pem";
import { GetServerSidePropsContext } from 'next';
import { getCookie } from 'cookies-next';

interface authResult {
  redirect_url: string;
  auth_token: string;
  refresh_token: string;
  refresh_token_expiration: number;
}

interface JwtHeader {
  alg: string;
  typ: string;
  kid: string;
}

export interface AUTHCACHE {
  [appID: string]: {
    jwks: JWKS;
  };
}

export interface JWKS {
  [kid: string]: JWK;
}

export interface JWK {
  alg: Algorithm;
  kty: string;
  use: string;
  n: string;
  e: string;
  kid: string;
}

const AUTH_CACHE: AUTHCACHE = {};

export const getPassageUserId = async (ctx: GetServerSidePropsContext) => {
  if (!process.env.NEXT_PUBLIC_PASSAGE_APP_ID) {
    return undefined;
  }

  const authToken = getCookie('psg_auth_token', { req: ctx.req, res: ctx.res }) as string;

  if (!authToken) {
    return null
  }

  try {
    const { kid } = jwtDecode<JwtHeader>(authToken, { header: true });

    if (!kid) {
      return undefined;
    }

    const jwk = await _findJWK(process.env.NEXT_PUBLIC_PASSAGE_APP_ID, kid);

    if (!jwk) {
      return undefined;
    }

    const pem = jwkToPem(jwk as RSA);

    const userID = jwt.verify(authToken, pem, {
      // @ts-ignore
      algorithms: jwk.alg,
    }).sub;

    return userID ? userID.toString() : undefined;

  } catch(e) {
    return null;
  }
}

export function authGuard(authToken?: string): boolean {
  if (!authToken) return false;

  try {
    const header = jwtDecode<JwtHeader>(authToken, { header: true });
    const payload = jwtDecode<JwtPayload>(authToken);

    if (payload !== undefined && header !== undefined) {
      if (_validJWTPayload(payload) && _validJWTHeader(header)) {
          return true;
      }
    }
    return false;
  } catch(e) {
    return false;
  }
}

function _validJWTHeader(header: JwtHeader): boolean {
  const expectedObject = { alg: 'RS256', typ: 'JWT' };

  if (header.alg !== expectedObject.alg) return false;

  if (header.typ !== expectedObject.typ) return false;
  return true;
}

function _validJWTPayload(payload: JwtPayload): boolean {
  const expectedKeys = ['exp', 'iss', 'sub'];
  const currentTime = Math.floor(Date.now() / 1000);

  expectedKeys.forEach((expectedKey) => {
      if (!(expectedKey in payload)) return false;
  });

  if (payload.exp && currentTime > payload.exp) return false;
  return true;
}

async function fetchJWKS(appId: string, resetCache?: boolean): Promise<JWKS> {
  // use cached value if found
  if (AUTH_CACHE[appId] !== undefined && Object.keys(AUTH_CACHE).length > 0 && !resetCache) {
    return AUTH_CACHE[appId]["jwks"];
  }

  const jwks: { [kid: string]: JWK } = await fetch(`https://auth.passage.id/v1/apps/${appId}/.well-known/jwks.json`)
    .then((response) => response.json())
    .then((data) => {
      const jwks = data.keys;
      const formattedJWKS: JWKS = {};

      // format jwks for cache
      for (const jwk of jwks) {
          formattedJWKS[jwk.kid] = jwk;
      }

      Object.assign(AUTH_CACHE, {
          [appId]: { jwks: { ...formattedJWKS } },
      });
      return formattedJWKS;
    })
    .catch((error) => {
      throw new Error(
        `Could not fetch appID\'s JWKs. HTTP status: ${error.response.status}`
      );
    });

  return jwks;
}

async function _findJWK(appId: string, kid: string): Promise<JWK | undefined> {
  if (!AUTH_CACHE) return undefined;
  try {
    const jwk = AUTH_CACHE[appId]["jwks"][kid];
    if (jwk) {
        return jwk;
    }
  } catch (e) {
    await fetchJWKS(appId);
    const jwk = AUTH_CACHE[appId]["jwks"][kid];
    if (jwk) {
        return jwk;
    }
    return undefined
  }
}

export async function refreshAuthToken(url: string, refreshToken: string): Promise<authResult> {
  const err = new Error("Login Required");

  return fetch(`${url}/tokens/`, {
    method: 'POST',
    body: JSON.stringify({ refresh_token: refreshToken }),
  })
    .then((response) => response.json())
    .then((response: { auth_result: authResult }) => {
      return response.auth_result;
    })
    .catch((e) => {
      console.error(e);
      throw err;
    });
}

