import Profile from '../components/Profile';

type Prop = {
  appId: string
}

const SettingsPage = ({ appId }: Prop) => (
  <Profile appId={appId} />
);

export async function getServerSideProps() {
  const appID = process.env.NEXT_PUBLIC_PASSAGE_APP_ID || '';

  return { props: { appId: appID } };
}

export default SettingsPage;
