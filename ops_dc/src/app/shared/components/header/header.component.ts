import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { IonButtons, IonHeader, IonMenuButton, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IndicatorsService } from 'src/app/services/indicators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton
  ]
})
export class HeaderComponent implements OnInit {
  private indicatorsSvc = inject(IndicatorsService);

  @Input({ required: true }) title!: string;
  @Input() showIndicators: boolean = true;

  uf = this.indicatorsSvc.uf;
  dollar = this.indicatorsSvc.dollar;
  weather = this.indicatorsSvc.weather;

  ngOnInit() {
    if (this.showIndicators) {
      this.indicatorsSvc.getEconomicIndicators();
      this.indicatorsSvc.getWeather();
    }
  }
}
