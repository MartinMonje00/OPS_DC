import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { 
  IonContent, IonMenu, IonSplitPane, IonRouterOutlet, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  briefcaseOutline, cartOutline, clipboardOutline,
  flashOutline, gridOutline, logOutOutline, peopleOutline, serverOutline,
  shapesOutline, shieldCheckmarkOutline, square, squareOutline, statsChartOutline,
  sunnyOutline, triangleOutline, cogOutline, downloadOutline, thermometerOutline,
  alertOutline,
  chevronDownOutline,
  chevronForwardOutline
} from 'ionicons/icons';
import { filter } from 'rxjs';
import { AuthService } from 'src/app/services/auth';
import { ThemeService } from 'src/app/services/theme';
import { UserdataService } from 'src/app/services/userdata';
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

  public themeSvc = inject(ThemeService);
  private userDataSvc = inject(UserdataService);

  isDatacenterExpanded = signal<boolean>(false);

  user = this.userDataSvc.currentUser;
  initials = this.userDataSvc.currentUserInitials;
  theme = this.userDataSvc.currentUserTheme;

  constructor() {
    addIcons({
      sunnyOutline, square, statsChartOutline, briefcaseOutline, cogOutline,
      gridOutline, cartOutline, shapesOutline, serverOutline, shieldCheckmarkOutline,
      squareOutline, triangleOutline, downloadOutline, chevronDownOutline, chevronForwardOutline,
      flashOutline, peopleOutline, logOutOutline, clipboardOutline, thermometerOutline,
      alertOutline
    })
  }

  ngOnInit() {
    this.checkDatacenterRoute(this.router.url);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.checkDatacenterRoute(event.urlAfterRedirects || event.url);
    });
  }

  toggleDatacenterMenu() {
    this.isDatacenterExpanded.update(value => !value);
  }

  private checkDatacenterRoute(url: string) {
    if (url.includes('/main/datacenter')) {
      this.isDatacenterExpanded.set(true);
    }
  }

  isAdmin = computed(() => {
    const user = this.authSvc.currentUser();
    return user?.role === 'admin';
  });

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
