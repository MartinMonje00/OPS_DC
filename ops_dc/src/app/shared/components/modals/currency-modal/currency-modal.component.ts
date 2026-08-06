import { Component, inject, Input, OnInit } from '@angular/core';
import { IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
import { HistoryRecord, IndicatorsService } from 'src/app/services/indicators';
import { UtilsService } from 'src/app/services/utils';

export interface HistoryItem {
  fecha: string;
  valor: string;
  variacion: string;
}

@Component({
  selector: 'app-currency-modal',
  templateUrl: './currency-modal.component.html',
  styleUrls: ['./currency-modal.component.scss'],
  standalone: true,
  imports: [
    IonIcon, IonSpinner
  ]
})
export class CurrencyModalComponent  implements OnInit {
  utilsSvc = inject(UtilsService);
  indicatorsSvc = inject(IndicatorsService);

  @Input() indicatorType: 'uf' | 'dolar' = 'uf';

  historyList: HistoryRecord[] = [];
  isLoading: boolean = true

  constructor() {
    addIcons({
      closeOutline
    })
  }

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory() {
    this.isLoading = true;
    console.log('Solicitando historial para:', this.indicatorType);

    this.indicatorsSvc.getIndicatorHistory(this.indicatorType).subscribe({
      next: (data) => {
        console.log('Datos recibidos con exito:', data);
        this.historyList = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al obtener el historial:', err);
        this.isLoading = false;
      }
    });
  }

  dismiss() {
    this.utilsSvc.dismissModal();
  }
}
