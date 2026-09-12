import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const pravnoLiceGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userRaw = localStorage.getItem('ulogovan');
  const user = userRaw ? JSON.parse(userRaw) : null;

  if (user && user.tip == 'pravno lice') return true;

  router.navigate(['']);
  return false;
};
