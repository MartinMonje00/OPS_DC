import { inject, Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class Utils {

  loadingCtrl = inject(LoadingController);

  loading() {
    return this.loadingCtrl.create({spinner: 'crescent'})
  }

  saveInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  // preferiblemente requerido: hacer funcion de obtener datos del localStorage para funcion de los guards
  
}
