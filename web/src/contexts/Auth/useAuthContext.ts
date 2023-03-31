import { useContextSelector } from 'use-context-selector';
import { AuthContext, AuthContextProperties } from './Context';

export function useAuth<T>(
  selector: (values: AuthContextProperties | undefined) => T
) {
  const value = useContextSelector<AuthContextProperties | undefined, T>(
    AuthContext,
    selector
  );

  if (!value) {
    throw new Error('UseAuth should be called inside a AuthProvider');
  }

  return value;
}
