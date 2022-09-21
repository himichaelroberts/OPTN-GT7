import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";

import {
  ApiError,
  CookieOptions,
  setCookies,
  COOKIE_OPTIONS,
  TOKEN_REFRESH_MARGIN,
  NextRequestAdapter,
  NextResponseAdapter,
  jwtDecoder,
  JWTPayloadFailed,
  AccessTokenNotFound,
  RefreshTokenNotFound,
  AuthHelperError,
  CookieNotFound,
  ErrorPayload
} from '@supabase/auth-helpers-shared';

import { getCookie } from 'cookies-next'
import { User } from "../types";
import { authGuard } from "./passage";

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

    console.log('refreshToken', refreshToken)

    if (!accessToken) throw new AccessTokenNotFound();

    // if (!authGuard(accessToken)) throw new AccessTokenNotFound();

    // Get payload from access token.
    const jwtUser = jwtDecoder(accessToken);
    if (!jwtUser?.exp) throw new JWTPayloadFailed();

    const timeNow = Math.round(Date.now() / 1000);


    console.log('foo')

    if (options.forceRefresh || jwtUser.exp < timeNow + tokenRefreshMargin) {
      // JWT is expired, let's refresh from Gotrue

      console.log('hmmm', refreshToken)
      if (!refreshToken) throw new RefreshTokenNotFound();

      console.info('Refreshing access token...');

      // const { data, error } = await supabase.auth.api.refreshAccessToken(
      //   refresh_token
      // );
    }

    return {
      user: null,
      accessToken: null,
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
