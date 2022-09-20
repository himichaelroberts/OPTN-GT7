import Login from '../components/Login';

type Prop = {
  appId: string
}

const LoginPage = ({ appId }: Prop) => (
  <Login appId={appId} />
)

export async function getServerSideProps() {
  return {
    props: { appId: process.env.NEXT_PUBLIC_PASSAGE_APP_ID },
  }
}

export default LoginPage
