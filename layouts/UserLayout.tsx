import React, { ReactNode, useEffect, useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import Router from 'next/router'
import NavBar from '../components/NavBar';
import { UserProvider, useUser } from '../utils/useUser';
import { passageClient } from '../passage/nextjs';
import { getCookie } from 'cookies-next'
// import { PassageUserInfo } from '@passageidentity/passage-js';

type Props = {
  children?: ReactNode
  title?: string
}

const UserLayout = ({ children, title = 'This is the default title' }: Props) => {
  // const [user, setUser] = useState(undefined)
  const { user } = useUser();

  useEffect(() => {
    console.log('passageUser', user);
  }, [user])

  const handleLogout = async () => {
    const passageUser = new window.Passage.PassageUser()
    await passageUser.signOut()

    // setUser(undefined)
    Router.push('/');
  }

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <UserProvider>
        <header>
          {user ?
            <NavBar username={user?.user_metadata?.username} logout={handleLogout} />
            :
            <NavBar />
          }
        </header>
        {children}
      </UserProvider>

    </div>
  );
}

export default UserLayout
