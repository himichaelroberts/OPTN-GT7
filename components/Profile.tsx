
import { profile } from "console";
import app from "next/app";
import { useEffect } from "react";

export default function Profile(user: unknown) {
  useEffect(()=> {
    require('@passageidentity/passage-elements/passage-profile');
  }, []);

  return (
    <>
      <passage-profile app-id={appID}></passage-profile>
    </>
  );'
}
