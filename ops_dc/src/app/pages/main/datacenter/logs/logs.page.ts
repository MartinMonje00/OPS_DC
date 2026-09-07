import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, bookOutline, createOutline, lockClosedOutline } from 'ionicons/icons';
import { DataService } from 'src/app/services/data';
import { UtilsService } from 'src/app/services/utils';
import { CreateLogComponent } from 'src/app/shared/components/modals/create-log/create-log.component';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.page.html',
  styleUrls: ['./logs.page.scss'],
  standalone: true,
  imports: [
    CommonModule, IonIcon
  ]
})
export class LogsPage implements OnInit, ViewWillEnter {
  private dataSvc = inject(DataService);
  private utilsSvc = inject(UtilsService);

  logs = signal<any[]>([]);
  isLoading = signal<boolean>(false);

  constructor() {
    addIcons({
      addOutline, bookOutline, createOutline, lockClosedOutline
    });
  }

  ngOnInit() {
    this.getLogs();
  }

  ionViewWillEnter() {
    this.getLogs();
  }

  getLogs() {
    this.isLoading.set(true);
    this.dataSvc.getLogbook().subscribe({
      next: (res: any) => {
        const list = Array.isArray(res?.data) ? res.data : [];
        this.logs.set([...list]);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        console.error('Error al obtener incidentes:', err);
        this.isLoading.set(false);
        this.utilsSvc.presentToast({
          message: 'Error al obtener el registro de Bitacoras',
          duration: 2500,
          color: 'danger',
          position: 'middle'
        });
      }
    });
  }

  async openLogsModal(log?: any) {
    const res = await this.utilsSvc.presentModal({
      component: CreateLogComponent,
      componentProps: { logData: log },
      cssClass: 'custom-logbook-modal'
    });

    if (res?.success || res?.data) {
      this.getLogs();
    }
  }

  getStateBadgeClass(state: string): string {
    switch (state?.toLowerCase()) {
      case 'abierto': return 'badge-open';
      case 'archivado': return 'badge-archived';
      case 'cerrado': return 'badge-closed';
      default: return 'badge-default';
    }
  }
}
