import { HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { AlertController, LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  private router = inject(Router);

  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  modalCtrl = inject(ModalController);
  alertCtrl = inject(AlertController);

  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  getRouterUrlTree(url: string): UrlTree {
    return this.router.createUrlTree([url]);
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

  loading() {
    return this.loadingCtrl.create({spinner: 'crescent'})
  }

  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    await toast.present();
  }

  async presentModal(opts: ModalOptions) {
    const modal = await this.modalCtrl.create(opts);

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if(data) return data;
  }

  dismissModal(data?: any) {
    return this.modalCtrl.dismiss(data);
  }

  async presentAlert(opts: { header: string, message: string, confirmText: string, cancelText: string }): Promise<boolean> {
    return new Promise(async resolve => {
      const alert = await this.alertCtrl.create({
        header: opts.header,
        message: opts.message,
        cssClass: 'custom-alert',
        buttons: [
          { text: opts.cancelText, role: 'cancel', handler: () => resolve(false) },
          { text: opts.confirmText, role: 'confirm', handler: () => resolve(true) }
        ]
      });
      await alert.present();
    });
  }

  getHeaders(): HttpHeaders {
    const token = this.getFromLocalStorage('Token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
}
