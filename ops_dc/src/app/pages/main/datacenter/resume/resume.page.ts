import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
import { DataService } from 'src/app/services/data';
import { UtilsService } from 'src/app/services/utils';

export interface LatestRoomReading {
  id: string;
  name: string;
  temp: number;
  humidity: number;
  status: string;
  timestamp: string;
}

@Component({
  selector: 'app-resume',
  templateUrl: './resume.page.html',
  styleUrls: ['./resume.page.scss'],
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class ResumePage implements OnInit, ViewWillEnter {
  private dataSvc = inject(DataService);
  private utilsSvc = inject(UtilsService);
  private router = inject(Router);

  loadingIncidents = signal<boolean>(false);
  loadingTasks = signal<boolean>(false);

  alerts = signal<any[]>([]);
  tasks = signal<any[]>([]);

  latestReadings = signal<LatestRoomReading[]>([
    { id: 'sala-1', name: 'Sala Principal', temp: 21.8, humidity: 48.0, status: 'normal', timestamp: '13:45 hrs' },
    { id: 'sala-2', name: 'Sala Comunicaciones', temp: 28.4, humidity: 40.5, status: 'warning', timestamp: '13:45 hrs' },
    { id: 'sala-3', name: 'Sala Energia', temp: 33.1, humidity: 32.0, status: 'critical', timestamp: '13:45 hrs' }
  ]);

  ngOnInit() {
    this.loadIncidents();
    this.loadTasks();
  }

  ionViewWillEnter() {
    this.loadIncidents();
    this.loadTasks();
  }

  loadIncidents() {
    this.loadingIncidents.set(true);
    this.dataSvc.getIncidents().subscribe({
      next: (res: any) => {
        console.log('repuesta en crudo:', res);
        const list = Array.isArray(res?.data) ? res.data : [];
        this.alerts.set(list);
        console.log('respuesta en arreglo:');
        console.table(this.alerts());
        this.loadingIncidents.set(false);
      },
      error: (err: any) => {
        console.error('Error HTTP en getIncidents:', err);
        this.loadingIncidents.set(false);
        this.utilsSvc.presentToast({
          message: 'Error al obtener el historial de incidentes',
          duration: 1500,
          color: 'danger',
          position: 'middle'
        });
      }
    });
  }

  loadTasks() {
    this.loadingTasks.set(true);
    this.dataSvc.getTasks().subscribe({
      next: (res: any) => {
        console.log('respuesta en crudo:', res);
        const list = Array.isArray(res?.data) ? res.data : [];
        this.tasks.set(list);
        console.log('Respuesta en arreglo:');
        console.table(this.tasks());
        this.loadingTasks.set(false);
      },
      error: (err: any) => {
        console.error('Error HTTP en getTasks:', err);
        this.loadingTasks.set(false);
        this.utilsSvc.presentToast({
          message: 'Error al obtener el historial de tareas',
          duration: 2500,
          color: 'danger',
          position: 'middle'
        });
      }
    });
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
