import React, { ReactNode, useEffect, useState } from 'react'
import Head from 'next/head'
import Router from 'next/router'
import NavBar from '../components/NavBar';

type Props = {
  children?: ReactNode
  title?: string
}

const UserLayout = ({ children, title = 'This is the default title' }: Props) => {
  const [user, setUser] = useState(undefined)

  useEffect(() => {
    const passageUser = new window.Passage.PassageUser()

    passageUser.userInfo()
      .then((data) => {
        setUser(data)
      });
  }, [])

  const handleLogout = async () => {
    const passageUser = new window.Passage.PassageUser()
    await passageUser.signOut()

    setUser(undefined)
    Router.push('/');
  }

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header>
        {user ?
          <NavBar username={user?.user_metadata?.username} logout={handleLogout} />
          :
          <NavBar />
        }
      </header>
      {children}

    </div>
  );
}

export default UserLayout
