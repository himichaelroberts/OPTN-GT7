import { GetServerSidePropsContext } from 'next';

import { Wishlist } from '../types';
import { getWishLists } from '../utils/supabase-client';
import withPageAuth from '../utils/withPageAuth';
import getUser from '../utils/getUser';

type Props = {
  wishLists: Wishlist[]
}

function Wishlist({ wishLists }: Props) {
  return (
    <>
      <h1>Wishlist</h1>

      <pre>
        {JSON.stringify(wishLists, null, 2)}
      </pre>
    </>
  )
};

export const getServerSideProps = withPageAuth({
  redirectTo: '/login',
  async getServerSideProps(ctx: GetServerSidePropsContext) {
    const { user } = await getUser(ctx);
    const wishLists = await getWishLists(ctx);

    return {
      props: {
        user,
        wishLists,
      }
    }
  }
});

export default Wishlist;
