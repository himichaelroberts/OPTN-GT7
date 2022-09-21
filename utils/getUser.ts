import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";

import {
  ApiError,
  CookieOptions,
  TOKEN_REFRESH_MARGIN,
  jwtDecoder,
  JWTPayloadFailed,
  AccessTokenNotFound,
  RefreshTokenNotFound,
  AuthHelperError,
  ErrorPayload
} from '@supabase/auth-helpers-shared';

import { getCookie, setCookie } from 'cookies-next'
import { User } from "../types";
import { refreshAuthToken } from "./passage";

interface ResponsePayload {
  user: User | null;
  accessToken: string | null;
  error?: ErrorPayload;
}

export interface GetUserOptions {
  cookieOptions?: CookieOptions;
  forceRefresh?: boolean;
  tokenRefreshMargin?: number;
}

async function getCurrentUser(accessToken: string): Promise<User> {
  const jwtUser = jwtDecoder(accessToken);

  return fetch(`${jwtUser.iss}/currentuser/`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    }
  })
    .then((response) => response.json())
    .then((response) => {
      return response.user;
    })
}

export default async function getUser(
  context:
  | GetServerSidePropsContext
  | { req: NextApiRequest; res: NextApiResponse },
  options: GetUserOptions = { forceRefresh: false }
): Promise<ResponsePayload> {
  try {
    const tokenRefreshMargin = options.tokenRefreshMargin ?? TOKEN_REFRESH_MARGIN;
    const accessToken = getCookie('psg_auth_token', { req: context.req, res: context.res }) as string;
    const refreshToken = getCookie('psg_refresh_token', { req: context.req, res: context.res }) as string;

    if (!accessToken) throw new AccessTokenNotFound();

    // Get payload from access token.
    const jwtUser = jwtDecoder(accessToken);
    if (!jwtUser?.exp) throw new JWTPayloadFailed();
    if (!jwtUser?.iss) throw new JWTPayloadFailed();

    const timeNow = Math.round(Date.now() / 1000);

    if (options.forceRefresh || jwtUser.exp < timeNow + tokenRefreshMargin) {
      // JWT is expired, let's refresh JWT
      if (!refreshToken) throw new RefreshTokenNotFound();

      console.info('Refreshing access token...');

      const data = await refreshAuthToken(jwtUser.iss, refreshToken)

      setCookie('psg_auth_token', data.auth_token, {
        req: context.req,
        res: context.res,
      });

      setCookie('psg_refresh_token', data.refresh_token, {
        req: context.req,
        res: context.res,
        expires: new Date(data.refresh_token_expiration * 1000)
      });

      const user = await getCurrentUser(data.auth_token);

      return {
        user,
        accessToken: data.auth_token,
      }
    } else {
      console.info('Getting the user object from Passage...');

      const user = await getCurrentUser(accessToken);

      // TODO: Handle Failed to getCurrentUser

      return { user, accessToken}
    }

  } catch(e) {
    let response: ResponsePayload = { user: null, accessToken: null };
    if (e instanceof JWTPayloadFailed) {
      console.info('JWTPayloadFailed error has happened!');
      response.error = e.toObj();
    } else if (e instanceof AuthHelperError) {
      // do nothing, these are all just to disrupt the control flow
    } else {
      const error = e as ApiError;
      console.error(error.message);
    }
    return response;
  }
}
