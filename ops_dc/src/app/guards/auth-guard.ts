import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UtilsService } from '../services/utils';
import { jwtDecode } from 'jwt-decode';

interface CustomJwtPayload {
  user_id: string;
  username: string;
  role: string;
  iat: number;
  exp: number;
}

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const utilsSvc = inject(UtilsService);
  const token = utilsSvc.getFromLocalStorage('Token')

  if(!token) {
    cleanSessionAndRedirect(utilsSvc, router);
    return false;
  }

  try {
    const decoded = jwtDecode<CustomJwtPayload>(token);
    const currentTime = Math.floor(Date.now() / 1000);

    if (decoded.exp && decoded.exp < currentTime) {
      utilsSvc.presentToast({
        message: 'Tu sesión ha expirado. Por favor, ingresa de nuevo.',
        duration : 2500,
        color: 'warning',
        position: 'bottom',
        icon: 'time-outline'
      });
      cleanSessionAndRedirect(utilsSvc, router);
      return false;
    }

    return true;
  } catch (error) {
    cleanSessionAndRedirect(utilsSvc, router);
    return false
  }
};

function cleanSessionAndRedirect(utilsSvc: UtilsService, router: Router) {
  utilsSvc.removeFromLocalStorage('Token');
  utilsSvc.removeFromLocalStorage('User');
  router.navigateByUrl('/auth');
}
