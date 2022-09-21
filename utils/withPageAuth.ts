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
import { authGuard } from './passage';
import { time } from 'console';
// import { PassageUser } from '@passageidentity/passage-elements/passage-user';
import getUser from './getUser';

/**
 * ## Protecting Pages with Server Side Rendering (SSR)
 * If you wrap your `getServerSideProps` with {@link withPageAuth} your props object will be augmented with
 * the user object {@link User}
 *
 * ```js
 * // pages/profile.js
 * import { withPageAuth } from '@supabase/auth-helpers-nextjs';
 *
 * export default function Profile({ user }) {
 *   return <div>Hello {user.name}</div>;
 * }
 *
 * export const getServerSideProps = withPageAuth({ redirectTo: '/login' });
 * ```
 *
 * If there is no authenticated user, they will be redirect to your home page, unless you specify the `redirectTo` option.
 *
 * You can pass in your own `getServerSideProps` method, the props returned from this will be merged with the
 * user props. You can also access the user session data by calling `getUser` inside of this method, eg:
 *
 * ```js
 * // pages/protected-page.js
 * import { withPageAuth, getUser } from '@supabase/auth-helpers-nextjs';
 *
 * export default function ProtectedPage({ user, customProp }) {
 *   return <div>Protected content</div>;
 * }
 *
 * export const getServerSideProps = withPageAuth({
 *   redirectTo: '/foo',
 *   async getServerSideProps(ctx) {
 *     // Run queries with RLS on the server
 *     const { data } = await supabaseServerClient(ctx).from('test').select('*');
 *     return { props: { data } };
 *   }
 * });
 * ```
 *
 * @category Server
 */
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

      const response = await getUser(context, { cookieOptions, forceRefresh: true });
      console.log(response)

      return {
        props: {}
      }

      if (!authGuard(authToken)) throw new AccessTokenNotFound();


      let user, accessToken;

      // Get payload from cached access token.
      const jwtUser = jwtDecoder(authToken);
      if (!jwtUser?.exp) {
        throw new JWTPayloadFailed();
      }

      const timeNow = Math.round(Date.now() / 1000);

      console.log('jwt exp', jwtUser.exp);
      console.log('timeNow', timeNow)
      if (jwtUser.exp < timeNow + tokenRefreshMargin) {
        console.log('Lets go get a new token')
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
