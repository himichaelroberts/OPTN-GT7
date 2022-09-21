import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import type { AppProps } from 'next/app'
import UserLayout from '../layouts/UserLayout';
import type { NextComponentType } from 'next';

import { User } from '../types';

const darkTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

type CustomAppProps = {
  pageProps: any;
  Component: NextComponentType;
}

// type CustomAppProps = Component: NextComponentType & {
// AppProps
// }

// type CustomAppProps = AppProps & {
// Component: NextComponentType & {user?: User} // add auth type
// }

// interface CustomAppProps<P = CustomPageProps> extends AppProps<P> {
//   pageProps: CustomPageProps
//   Component: any;
// }

function MyApp({ Component, pageProps }: CustomAppProps) {
  console.log(pageProps)
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <UserLayout title="OPTN GT7" user={pageProps?.user}>
        <Component {...pageProps} />
      </UserLayout>
    </ThemeProvider>
  )
}

export default MyApp
