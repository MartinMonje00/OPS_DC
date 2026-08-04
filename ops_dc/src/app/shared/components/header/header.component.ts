import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { IonButton, IonButtons, IonHeader, IonIcon, IonMenuButton, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  cloudOutline, cloudyNightOutline, cloudyOutline, moonOutline, notifications,
  partlySunnyOutline, rainyOutline, snowOutline, sunnyOutline, thunderstormOutline
} from 'ionicons/icons';
import { IndicatorsService } from 'src/app/services/indicators';
import { UtilsService } from 'src/app/services/utils';
import { CurrencyModalComponent } from '../modals/currency-modal/currency-modal.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton,
    IonIcon, IonButton
  ]
})
export class HeaderComponent implements OnInit {
  private indicatorsSvc = inject(IndicatorsService);
  private utilsSvc = inject(UtilsService);

  @Input({ required: true }) title!: string;
  @Input() showIndicators: boolean = true;

  
  uf = this.indicatorsSvc.uf;
  dollar = this.indicatorsSvc.dollar;
  weather = this.indicatorsSvc.weather;
  

  ngOnInit() {
    if (this.showIndicators) {
      this.indicatorsSvc.startAutoRefresh();
    }
  }

  constructor() {
    addIcons({
      notifications, sunnyOutline, moonOutline, partlySunnyOutline, cloudyNightOutline,
      cloudyOutline, cloudOutline, rainyOutline, snowOutline, thunderstormOutline
    })
  }

  async openCurrencyModal(type: 'uf' | 'dolar') {
    await this.utilsSvc.presentModal({
      component: CurrencyModalComponent,
      componentProps: { indicatorType: type },
      cssClass: 'custom-currency-modal'
    })
  }
}
