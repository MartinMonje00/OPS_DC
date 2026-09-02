import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { IonContent, IonIcon, ViewWillEnter } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';
import { DataService } from 'src/app/services/data';
import { UtilsService } from 'src/app/services/utils';
import { CreateIncidentComponent } from 'src/app/shared/components/modals/create-incident/create-incident.component';

@Component({
  selector: 'app-incidents',
  templateUrl: './incidents.page.html',
  styleUrls: ['./incidents.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonIcon, CommonModule
  ]
})
export class IncidentsPage implements OnInit, ViewWillEnter {
  private dataSvc = inject(DataService);
  private utilsSvc = inject(UtilsService);

  incidents = signal<any[]>([]);
  isLoading = signal<boolean>(false);

  constructor() {
    addIcons({
      addOutline
    })
  }

  ngOnInit() {
    this.getIncidents();
  }

  ionViewWillEnter() {
    this.getIncidents();
  }

  getIncidents() {
    this.isLoading.set(true);
    this.dataSvc.getIncidents().subscribe({
      next: (res: any) => {
        const list = Array.isArray(res?.data) ? res.data : [];
        this.incidents.set(list);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        console.error('Error al obtener incidentes:', err);
        this.isLoading.set(false);
        this.utilsSvc.presentToast({
          message: 'Error al obtener el historial de incidentes',
          duration: 2500,
          color: 'danger',
          position: 'middle'
        });
      }
    });
  }

  async openIncidentModal() {
    const modal = await this.utilsSvc.presentModal({
      component: CreateIncidentComponent,
      cssClass: 'custom-incident-modal'
    });

    const { data } = await modal.onWillDismiss();
    if (data?.success || data?.code === 'ROW_INSERT_OK' || data?.data) {
      this.getIncidents();
    }
  }

  async confirmCloseIncident(item: any) {
    const id = item.incident_id || item.id;
    if (!id) return;

    const confirmed = await this.utilsSvc.presentAlert({
      header: 'Cerrar incidente',
      message: '¿Desea dar por resuelto y cerrar el incidente?',
      confirmText: 'Si,cerrar',
      cancelText: 'Cancelar'
    });

    if (confirmed) {
      this.executeCloseIncident(id);
    }
  }

  private executeCloseIncident(id: string) {
    this.dataSvc.updateIncident(id, {}).subscribe({
      next: (res: any) => {
        this.utilsSvc.presentToast({
          message: res?.message || 'Incidente cerrado correctamente',
          duration: 2000,
          color: 'success',
          position: 'middle'
        });
        this.getIncidents();
      },
      error: (err: any) => {
        console.error('error al cerrar el incidente:', err);
        const errorMsg = err?.error?.error || 'No se pudo cerrar el incidente';
        this.utilsSvc.presentToast({
          message: errorMsg,
          duration: 2500,
          color: 'danger',
          position: 'middle'
        });
      }
    });
  }
}
