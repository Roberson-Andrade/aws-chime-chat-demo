import { Auth } from 'aws-amplify';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { UNDEFINED } from '../../constants';
import { User } from '../../types';
import { AuthContext, AuthContextProperties } from './Context';

interface AuthProviderProperties {
  children: ReactNode;
}
interface CognitoUser {
  attributes: {
    email: string;
    name: string;
    sub: string;
  };
}
export function AuthProvider({ children }: AuthProviderProperties) {
  const [user, setUser] = useState<User>();
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [unverifiedAccount, setUnverifiedAccount] = useState({
    email: '',
    password: '',
  });

  async function fetchAuthenticatedUser() {
    try {
      const { attributes }: CognitoUser = await Auth.currentAuthenticatedUser();

      setUser({
        email: attributes.email,
        id: attributes.sub,
        name: attributes.name,
      });
    } catch {
      setUser(UNDEFINED);
    } finally {
      setIsAuthenticating(false);
    }
  }

  useEffect(() => {
    fetchAuthenticatedUser();
  }, []);

  const signIn = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const { attributes }: CognitoUser = await Auth.signIn({
      username: email,
      password,
    });

    setUser({
      email: attributes.email,
      id: attributes.sub,
      name: attributes.name,
    });
  };

  const signUp = async ({
    email,
    password,
    name,
  }: {
    email: string;
    password: string;
    name: string;
  }) => {
    await Auth.signUp({
      username: email,
      password,
      attributes: {
        email,
        name,
      },
    });

    setUnverifiedAccount({ email, password });
  };

  const confirmAccount = useCallback(
    async ({ code }: { code: string }) => {
      await Auth.confirmSignUp(unverifiedAccount?.email, code);

      const { attributes }: CognitoUser = await Auth.signIn({
        username: unverifiedAccount?.email,
        password: unverifiedAccount?.password,
      });

      setUser({
        email: attributes.email,
        id: attributes.sub,
        name: attributes.name,
      });
    },
    [unverifiedAccount?.email, unverifiedAccount?.password]
  );

  const signOut = async () => {
    setIsAuthenticating(true);
    await Auth.signOut();

    setUser(UNDEFINED);
    setIsAuthenticating(false);
  };

  const value = useMemo<AuthContextProperties>(
    () => ({
      user,
      isAuthenticated: !!user,
      isAuthenticating,
      unverifiedAccount,
      signIn,
      signOut,
      signUp,
      confirmAccount,
    }),
    [confirmAccount, isAuthenticating, unverifiedAccount, user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
