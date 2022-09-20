
import { useEffect } from "react";

export default function Login({ appId }: { appId: string }) {
  // useEffect(() => {
  //   require('@passageidentity/passage-elements/passage-auth');
  // }, []);

  return (
    <>
      <passage-auth app-id={appId}></passage-auth>
    </>
  );
}
