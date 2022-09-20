import { User } from '@passageidentity/passage-js';
import React, {
  useEffect,
  useState,
  createContext,
  useContext,
  useCallback
} from 'react';
import { passageClient } from '../../nextjs';
// import { SupabaseClient, User } from '@supabase/supabase-js';
// import {
//   CallbackUrlFailed,
//   ErrorPayload,
//   UserFetcher,
//   UserState
// } from '@supabase/auth-helpers-shared';
// import {
//   TOKEN_REFRESH_MARGIN,
//   RETRY_INTERVAL,
//   MAX_RETRIES
// } from '@supabase/auth-helpers-shared';

let networkRetries = 0;
let refreshTokenTimer: ReturnType<typeof setTimeout>;

const PassageContext = createContext<UserState | undefined>(undefined);




export interface Props {
  [propName: string]: any;
}

export const PassageProvider = (props: Props) => {
  const {
    passageClient,
  } = props;

  // console.log(passageClient)

  useEffect(() => {
  }, []);

  const value = {
  };
  return <PassageContext.Provider value={value} {...props} />;
};

export const usePassage = () => {
  const context = useContext(PassageContext);
  if (context === undefined) {
    throw new Error(`usePassage must be used within a PassageProvider.`);
  }
  return context;
};
