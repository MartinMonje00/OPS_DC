import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UtilsService } from '../services/utils';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const utilsSvc = inject(UtilsService);

  const token = utilsSvc.getFromLocalStorage('Token');

  if(token) {
    console.warn('Ya hay una sesión activa')
    return utilsSvc.getRouterUrlTree('/main/home');
  }

  return true;
};
