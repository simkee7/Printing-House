import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userRaw = localStorage.getItem('ulogovan');
  const user = userRaw ? JSON.parse(userRaw) : null;

  if(user && user.tip == 'admin') return true;

  router.navigate(['admin/login']);
  return false;
};
