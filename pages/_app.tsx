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

function MyApp({ Component, pageProps }: CustomAppProps) {
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
