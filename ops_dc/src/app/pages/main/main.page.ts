import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { 
  IonContent, IonMenu, IonSplitPane, IonRouterOutlet, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  briefcaseOutline, caretDownOutline, caretForwardOutline, cartOutline, clipboardOutline,
  flashOutline, gridOutline, logOutOutline, peopleOutline, serverOutline,
  shapesOutline, shieldCheckmarkOutline, square, squareOutline, statsChartOutline,
  sunnyOutline, triangleOutline, cogOutline, downloadOutline, thermometerOutline,
  alertOutline,
  timeSharp
} from 'ionicons/icons';
import { filter } from 'rxjs';
import { AuthService } from 'src/app/services/auth';
import { UtilsService } from 'src/app/services/utils';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
  standalone: true,
  imports: [
    IonSplitPane, IonMenu, IonContent, IonRouterOutlet, IonIcon,
    RouterLink, RouterLinkActive
  ]
})
export class MainPage implements OnInit {
  private authSvc = inject(AuthService);
  private utilsSvc = inject(UtilsService);
  private router = inject(Router);

  isDatacenterOpen: boolean = false;

  constructor() {
    addIcons({
      sunnyOutline, square, statsChartOutline, briefcaseOutline, cogOutline,
      gridOutline, cartOutline, shapesOutline, serverOutline, caretForwardOutline,
      caretDownOutline, shieldCheckmarkOutline, squareOutline, triangleOutline, downloadOutline,
      flashOutline, peopleOutline, logOutOutline, clipboardOutline, thermometerOutline,
      alertOutline
    })
  }

  ngOnInit() {
    this.checkActiveRoute(this.router.url);

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.checkActiveRoute(event.urlAfterRedirects);
    });
  }

  private checkActiveRoute(url: string) {
    if (url.includes('/datacenter')) {
      this.isDatacenterOpen = true;
    }
  }

  toggleDatacenter(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.isDatacenterOpen = !this.isDatacenterOpen;
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
