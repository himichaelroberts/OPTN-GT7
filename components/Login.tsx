
import { useEffect, useRef } from "react";
import Router from "next/router";
import { setCookie } from 'cookies-next';

type AuthResult = {
  refresh_token: string;
  refresh_token_expiration: number;
  redirect_url: string;
}

export default function Login({ appId }: { appId: string }) {
  const ref = useRef();

  const onSuccess = (authResult: AuthResult) => {
    setCookie('psg_refresh_token', authResult.refresh_token, { expires: new Date(authResult.refresh_token_expiration * 1000) });

    Router.push(authResult.redirect_url)
  }

  useEffect(() => {
    const { current } = ref;
    current.onSuccess = onSuccess;
    return () => { }
  });

  return (
    <>
      <passage-auth ref={ref} app-id={appId}></passage-auth>
    </>
  );
}
