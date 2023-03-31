import { createContext } from 'use-context-selector';
import { User } from '../../types';

export interface AuthContextProperties {
  user?: User;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  signIn: (input: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (input: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  confirmAccount: (input: { code: string }) => Promise<void>;
}

export const AuthContext = createContext<AuthContextProperties | undefined>(
  undefined
);
