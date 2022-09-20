import { GetServerSideProps } from 'next';
import { getPassageUserId } from '../utils/passage'
import { getCarList } from '../utils/supabase-client';
import { Car } from '../types';
import { UserProvider, useUser } from '../utils/useUser';
import { useEffect } from 'react'

type Props = {
  cars: Car[]
}

const IndexPage = ({ cars }: Props) => {
  const { user } = useUser();

  useEffect(() => {
    console.log('user', user);
  }, [user])

  return (
    <>
      <pre>
        {JSON.stringify(cars, null, 2)}
      </pre>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  // const userId = await getPassageUserId({ req, res });

  const carList = await getCarList();

  return {
    props: {
      cars: carList,
      appId: process.env.NEXT_PUBLIC_PASSAGE_APP_ID
    },
  }
}

export default IndexPage
