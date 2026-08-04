import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { 
  IonButton, IonCard, IonContent, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowForwardOutline, cartOutline, cubeOutline, gridOutline, personOutline,
  radioOutline, serverOutline, shieldOutline, statsChartOutline
} from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth';
import { SharedModule } from 'src/app/shared/shared-module';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, IonContent, IonButton, IonCard, IonIcon,
    SharedModule
  ]
})
export class HomePage {
  private authSvc= inject(AuthService);

  user = this.authSvc.currentUser;

  userRole = computed(() => this.user()?.role)

  constructor() {
    addIcons({
      gridOutline, arrowForwardOutline, cartOutline, serverOutline, personOutline,
      radioOutline, cubeOutline, statsChartOutline, shieldOutline
    })
  }
}
