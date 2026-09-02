import { Component, inject, OnInit } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkOutline, refreshOutline } from 'ionicons/icons';
import { DataService } from 'src/app/services/data';
import { UtilsService } from 'src/app/services/utils';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
  standalone: true,
  imports: [
    IonIcon
  ]
})
export class TasksPage implements OnInit, ViewWillEnter {
  private dataSvc = inject(DataService);
  private utilsSvc = inject(UtilsService);

  constructor() {
    addIcons({
      checkmarkOutline, refreshOutline
    })
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
  }

  getTasks() {
    console.log('hola');
  }

  toggleTaskStatus(task: any) {
    this.dataSvc.updateTaskStatus(task.id, { action: 'toggle' }).subscribe({
      next: () => {
        this.getTasks();
      },
      error: (err) => console.error('Error al alternar el estado:', err)
    });
  }

  completeTask(task: any) {
    this.dataSvc.updateTaskStatus(task.id, { status: 0 }).subscribe({
      next: () => {
        this.utilsSvc.presentToast({
          message: 'Tarea completada exitosamente',
          duration: 2000,
          color: 'success'
        });
        this.getTasks();
      },
      error: (err) => console.error('Error al completar la tarea:', err)
    });
  }

  
}
