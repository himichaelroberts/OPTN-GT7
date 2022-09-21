import Profile from '../components/Profile';
import getUser from '../utils/getUser';
import withPageAuth from '../utils/withPageAuth';

type Prop = {
  appId: string
}

const SettingsPage = ({ appId }: Prop) => (
  <Profile appId={appId} />
);

export const getServerSideProps = withPageAuth({
  redirectTo: '/login',
  async getServerSideProps(ctx) {
    const appId = process.env.NEXT_PUBLIC_PASSAGE_APP_ID || '';
    const { user } = await getUser(ctx);

    return {
      props: {
        user,
        appId,
      }
    }
  }
});

export default SettingsPage;
