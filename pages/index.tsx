import { Car } from '../types';
import { getCarList } from '../utils/supabase-client';
import withPageAuth from '../utils/withPageAuth';

type Props = {
  cars: Car[]
}

const IndexPage = ({ cars }: Props) => {
  return (
    <>
      <h1>CarList </h1>
      <pre>
        {JSON.stringify(cars, null, 2)}
      </pre>
    </>
  )
}

export const getServerSideProps = withPageAuth({
  redirectTo: '/login',
  async getServerSideProps(ctx) {
    const carList = await getCarList();

    return {
      props: {
        cars: carList,
      }
    }
  }
});

export default IndexPage
