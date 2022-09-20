import { useEffect, useState, createContext, useContext } from 'react';
import { usePassage } from '../passage/react'

export interface Props {
  [propName: string]: any;
}

type User = {
  id: string;
}

type UserContextType = {
  // accessToken: string | null;
  user: User | null;
  // userDetails: UserDetails | null;
  // isLoading: boolean;
  // subscription: Subscription | null;
};

export const UserContext = createContext<UserContextType | undefined>({
  user: null,
});

export const UserProvider = (props: Props) => {
  const [user, setUser] = useState<User | null>(null)
  // const { isLoading: isLoadingUser } = usePassage();
  // console.log('foo', props)

  useEffect(() => {
    const passageUser = new window.Passage.PassageUser()

    passageUser.userInfo()
      .then((data) => {
        console.log(data)
        setUser(data)
      });
  }, []);

  const value = {
    user,
  }

  return <UserContext.Provider value={value} {...props} />;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a MyUserContextProvider.`);
  }
  return context;
};
