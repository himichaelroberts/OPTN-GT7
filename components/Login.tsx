
import { useEffect, useRef } from "react";
import Router from "next/router";
import { setCookie } from 'cookies-next';

type AuthResult = {
  refresh_token: string;
  refresh_token_expiration: number;
  redirect_url: string;
}

export enum OnEventType {
  onLoaded = 'onLoaded',
  onRegisterDevice = 'onRegisterDevice',
  onVerifyIdentity = 'onVerifyIdentity',
  onMagicLinkLogin = 'onMagicLinkLogin',
  onMagicLinkRegister = 'onMagicLinkRegister',
  onMagicLinkActivated = 'onMagicLinkActivated',
  onMagicLinkActivateSuccess = 'onMagicLinkActivateSuccess',
}

type PasageCallback = {
  onSuccess: (authResult: AuthResult) => void;
  beforeAuth: (identifier: string) => boolean;
  OnEvent: (type: OnEventType, data?: unknown) => void;
}

export default function Login({ appId }: { appId: string }) {
  const ref = useRef<PasageCallback>(null);

  const onSuccess = (authResult: AuthResult) => {
    setCookie('psg_refresh_token', authResult.refresh_token, { expires: new Date(authResult.refresh_token_expiration * 1000) });

    Router.push(authResult.redirect_url)
  }

  useEffect(() => {
    const { current } = ref;

    current!.onSuccess = onSuccess;
  }, [ref]);

  return (
    <>
      <passage-auth ref={ref} app-id={appId}></passage-auth>
    </>
  );
}
