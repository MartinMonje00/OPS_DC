import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { UtilsService } from '../services/utils';

export const roleGuard: CanActivateFn = (route, state) => {
  const authSvc = inject(AuthService);
  const router = inject(Router);
  const utilsSvc = inject(UtilsService);

  const expectedRoles: string[] = route.data['roles'] || [];

  const currentUser = authSvc.currentUser();
  const userRole = currentUser?.role || localStorage.getItem('user_role');

  if (userRole && expectedRoles.includes(userRole)) {
    return true
  }

  utilsSvc.presentToast({
    message: 'No tienes permisos para acceder a esta sección.',
    duration: 2000,
    color: 'warning',
    position: 'bottom'
  });

  router.navigate(['/main/home']);
  return false;
};
