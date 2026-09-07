import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, checkmarkOutline, refreshOutline } from 'ionicons/icons';
import { DataService } from 'src/app/services/data';
import { UtilsService } from 'src/app/services/utils';
import { CreateTaskComponent } from 'src/app/shared/components/modals/create-task/create-task.component';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
  standalone: true,
  imports: [
    IonIcon, CommonModule
  ]
})
export class TasksPage implements OnInit, ViewWillEnter {
  private dataSvc = inject(DataService);
  private utilsSvc = inject(UtilsService);

  tasks = signal<any[]>([]);
  isLoading = signal<boolean>(false);

  constructor() {
    addIcons({
      checkmarkOutline, refreshOutline, addOutline
    })
  }

  ngOnInit() {
    this.getTasks();
  }

  ionViewWillEnter() {
    this.getTasks();
  }

  getTasks() {
    this.isLoading.set(true);
    this.dataSvc.getTasks().subscribe({
      next: (res: any) => {
        const list = Array.isArray(res?.data) ? res.data : [];
        this.tasks.set(list);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        console.error('Error al obtener las tareas:', err);
        this.tasks.set([]);
        this.isLoading.set(false);
        this.utilsSvc.presentToast({
          message: 'Error al obtener el listado de tareas',
          duration: 2500,
          color: 'danger',
          position: 'middle'
        });
      }
    });
  }

  async openTaskModal() {
    const resData = await this.utilsSvc.presentModal({
      component: CreateTaskComponent,
      cssClass: 'custom-task-modal'
    });

    if (resData?.success || resData?.code === 'ROW_INSERT_OK' || resData?.data) {
      this.getTasks();
    }
  }

  toggleTaskStatus(task: any) {
    const id = task.task_id || task.id;
    if (!id) return;

    this.dataSvc.updateTaskStatus(id, { action: 'toggle' }).subscribe({
      next: (res: any) => {
        const newStatus = res?.data?.status;
        const statusLabel = newStatus === 1 ? 'En Proceso' : 'Abierto';

        this.utilsSvc.presentToast({
          message: 'Estado de tarea actualizado',
          duration: 1500,
          color: 'primary',
          position: 'bottom'
        });
        this.getTasks();
      },
      error: (err: any) => {
        console.error('Error al alternar estados:', err);
        this.utilsSvc.presentToast({
          message: 'No se pudo actualizar el estado',
          duration: 2000,
          color: 'danger',
          position: 'middle'
        });
      }
    });
  }

  async confirmCompleteTask(task: any) {
    const id = task.task_id || task.id;
    if (!id) return;

    const confirmed = await this.utilsSvc.presentAlert({
      header: 'Completar tarea',
      message: '¿Deseas marcar la tarea como completada?',
      confirmText: 'Si, completar',
      cancelText: 'Cancelar'
    });

    if (confirmed) {
      this.executeCompleteTask(id);
    } 
  }

  executeCompleteTask(id: string) {
    this.dataSvc.updateTaskStatus(id, { status: 0 }).subscribe({
      next: () => {
        this.utilsSvc.presentToast({
          message: 'Tarea completada exitosamente',
          duration: 2000,
          color: 'success',
          position: 'middle'
        });
        this.getTasks();
      },
      error: (err: any) => {
        console.error('Error al completar la tarea:', err);
        this.utilsSvc.presentToast({
          message: 'No se pudo completar la tarea',
          duration: 2500,
          color: 'danger',
          position: 'middle'
        });
      }
    });
  }
}
