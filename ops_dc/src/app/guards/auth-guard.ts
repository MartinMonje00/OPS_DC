import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UtilsService } from '../services/utils';

export const authGuard: CanActivateFn = (route, state) => {
  const utilsSvc = inject(UtilsService);

  const token = utilsSvc.getFromLocalStorage('Token');

  if(token) {
    return true;
  }

  console.warn('Acceso restringio: Se requiere Inicio de Sesión');
  return utilsSvc.getRouterUrlTree('/auth');
};
