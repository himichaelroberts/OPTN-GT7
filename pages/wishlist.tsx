import { GetServerSideProps } from 'next';
import { getCookie } from 'cookies-next'

import { Wishlist } from '../types';
import { getWishLists } from '../utils/supabase-client';
import { getPassageUserId } from '../utils/passage'
import { useEffect } from 'react';

import { passageClient } from '../passage/nextjs';

type Props = {
  wishLists: Wishlist[]
}

function Wishlist({ wishLists }: Props) {

  useEffect(() => {
    // const authToken = getCookie('psg_auth_token') as string;
    // const user = passageClient.getCurrentUser(authToken);
    // // user.userInfo()
    // // console.log(passageClient)
    // user.userInfo()
    //   .then((data) => {
    //     console.log('data', data)
    //   });
  }, [])

  return (
    <>
      <h1>Wishlist</h1>

      <pre>
        {JSON.stringify(wishLists, null, 2)}
      </pre>

    </>
  )
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const userId = await getPassageUserId({ req, res });

  if (!userId) {
    return {
      props: {},
    }
  }

  const wishLists = await getWishLists(userId);

  return {
    props: {
      wishLists,
      appId: process.env.NEXT_PUBLIC_PASSAGE_APP_ID
    },
  }
}

export default Wishlist;
