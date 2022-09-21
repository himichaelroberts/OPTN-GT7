import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import { Wishlist } from '../types';
import { getWishLists } from '../utils/supabase-client';
import { getPassageUserId } from '../utils/passage'
import withPageAuth from '../utils/withPageAuth';

// import { passageClient } from '../passage/nextjs';

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
    const wishLists = await getWishLists(ctx);

    return {
      props: {
        wishLists,
      }
    }
  }
});

export default Wishlist;
