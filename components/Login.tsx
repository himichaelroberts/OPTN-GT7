
import { useEffect } from "react";

export default function Login({ appId }: { appId: string }) {
  return (
    <>
      <passage-auth app-id={appId}></passage-auth>
    </>
  );
}
