import React, { ReactNode, useEffect, useState } from 'react'
import Head from 'next/head'
import Router from 'next/router'
import NavBar from '../components/NavBar';
import { deleteCookie } from 'cookies-next';

import { Container, Box } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

type Props = {
  children?: ReactNode
  title?: string
}

const UserLayout = ({ children, title = 'This is the default title' }: Props) => {
  const handleLogout = async () => {
    deleteCookie('psg_refresh_token');

    const passageUser = new window.Passage.PassageUser()
    await passageUser.signOut()

    Router.push('/');
  }

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <main>
        <Box sx={{ flexGrow: 1 }}>
          <header>
            {children.props.user ?
              <NavBar username={children.props.user?.user_metadata?.username} logout={handleLogout} />
              :
              <NavBar />
            }
          </header>
          <Container maxWidth="lg" sx={{ p: 3 }}>
            {children}
          </Container>
        </Box>

      </main>



    </div>
  );
}

export default UserLayout
