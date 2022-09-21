import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import type { AppProps } from 'next/app'
import UserLayout from '../layouts/UserLayout';

import { PassageProvider } from '../passage/react';

const darkTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <UserLayout title="OPTN GT7">
        <Component {...pageProps} />
      </UserLayout>
    </ThemeProvider>
  )
}

export default MyApp
