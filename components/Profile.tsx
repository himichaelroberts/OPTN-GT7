import Link from "next/link";
import React, { useEffect, useState } from "react";

interface User {
  id: string;
}

type Props = {
  appId: string;
}

export default function Profile({ appId }: Props) {
  return (
    <div>
      <passage-profile app-id={appId}></passage-profile>
    </div>
  );
}
