import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  private router = inject(Router);

  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  loadingCtrl = inject(LoadingController);

  loading() {
    return this.loadingCtrl.create({spinner: 'crescent'})
  }
  
  saveInLocalStorage(key: string, value: any) {
    const data = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, data);
  }

  getFromLocalStorage(key: string) {
    const item = localStorage.getItem(key);
    if(!item) return null;

    try {
      return JSON.parse(item);
    } catch {
      return item;
    }
  }

  removeFromLocalStorage(key: string) {
    localStorage.removeItem(key);
  }
}
