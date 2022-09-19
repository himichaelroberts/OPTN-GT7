
import app from "next/app";
import { useEffect } from "react";

export default function Login(appID: string) {
  useEffect(()=> {
    require('@passageidentity/passage-elements/passage-auth');
  }, []);


  return (
    <>
      <passage-auth app-id={appID}></passage-auth>
    </>
  );'
}
