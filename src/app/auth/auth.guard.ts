import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const LogonIn = !!localStorage.getItem('user');
  if (LogonIn) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
