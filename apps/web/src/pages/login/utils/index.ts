import { Mode } from '../../../types';

export function renderHeader(mode: Mode) {
  if (mode === 'signIn') {
    return 'Sign in';
  }

  if (mode === 'signUp') {
    return 'Sign out';
  }

  return 'Confirm Account';
}

export function renderSubmitButtonText(mode: Mode) {
  if (mode === 'signIn') {
    return 'Login';
  }

  if (mode === 'signUp') {
    return 'Create an account';
  }

  return 'Confirm';
}

export function renderBackButtonText(mode: Mode) {
  if (mode === 'signIn') {
    return 'Create an account';
  }

  if (mode === 'signUp') {
    return 'Login';
  }

  return 'Back';
}
