import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import {
  AccessTokenNotFound,
  AuthHelperError,
  CookieOptions,
  jwtDecoder,
  JWTPayloadFailed,
  TOKEN_REFRESH_MARGIN
} from '@supabase/auth-helpers-shared';
import { getCookie } from 'cookies-next'
import getUser from './getUser';

export default function withPageAuth({
  authRequired = true,
  redirectTo = '/',
  getServerSideProps = undefined,
  cookieOptions = {},
  tokenRefreshMargin = TOKEN_REFRESH_MARGIN
}: {
  authRequired?: boolean;
  redirectTo?: string;
  getServerSideProps?: GetServerSideProps;
  cookieOptions?: CookieOptions;
  tokenRefreshMargin?: number;
} = {}) {
  return async (context: GetServerSidePropsContext) => {
    try {
      const authToken = getCookie('psg_auth_token', { req: context.req, res: context.res }) as string;

      if (!authToken) throw new AccessTokenNotFound();

      let user, accessToken;

      // Get payload from cached access token.
      const jwtUser = jwtDecoder(authToken);
      if (!jwtUser?.exp) {
        throw new JWTPayloadFailed();
      }

      const timeNow = Math.round(Date.now() / 1000);

      if (jwtUser.exp < timeNow + tokenRefreshMargin) {
        console.log('Lets go get a new token')
        const response = await getUser(context, { cookieOptions });

        user = response.user;
        accessToken = response.accessToken;
      } else {
        user = {
          id: jwtUser.sub
        }

        accessToken = authToken;
      }

      if (!user) {
        throw new Error('No user found!');
      }

      let ret: any = { props: {} };
      if (getServerSideProps) {
        try {
          ret = await getServerSideProps(context);
        } catch (error) {
          ret = {
            props: {
              error: String(error)
            }
          };
        }
      }

      return {
        ...ret,
        props: { ...ret.props }
      };
    } catch (e) {
      if (authRequired) {
        return {
          redirect: {
            destination: redirectTo,
            permanent: false
          }
        };
      }

      let props = { user: null, accessToken: null, error: '' };
      if (e instanceof AuthHelperError) {
        console.debug(e.toObj());
      } else {
        console.debug(String(e));
        props.error = String(e);
      }

      return {
        props
      };
    }
  };
}
