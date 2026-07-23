import { Component, inject } from '@angular/core';
import { 
  IonContent, IonMenu, IonSplitPane, IonRouterOutlet, IonToolbar,
  IonHeader, IonTitle, IonList, IonMenuToggle, IonItem,
  IonIcon, IonLabel, IonFooter 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, logOutOutline } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth';
import { UtilsService } from 'src/app/services/utils';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
  standalone: true,
  imports: [
    IonSplitPane, IonMenu, IonContent, IonRouterOutlet, IonToolbar,
    IonHeader, IonTitle, IonList, IonMenuToggle, IonItem,
    IonIcon, IonLabel, IonFooter
  ]
})
export class MainPage {
  private authSvc = inject(AuthService);
  private utilsSvc = inject(UtilsService);

  constructor() {
    addIcons({ homeOutline, logOutOutline })
  }

  async signOut() {
    const loading = await this.utilsSvc.loading();
    await loading.present();

    try {
      this.authSvc.signOut();

      this.utilsSvc.presentToast({
        message: 'Sesion cerrada correctamente',
        duration: 2000,
        color: 'dark',
        position: 'top',
        icon: 'log-out-outline'
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      loading.dismiss();
    }
  }
}
