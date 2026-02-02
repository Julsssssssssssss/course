import {CanActivateFn} from '@angular/router';
import {inject} from '@angular/core';
import {AuthState} from '../states/auth.state';

export const authGuard: CanActivateFn = () => {
  const authState = inject(AuthState);
  return authState.loggedIn();
}

export const nonAuthGuard: CanActivateFn = () => {
  const authState = inject(AuthState);
  return !authState.loggedIn();
}

