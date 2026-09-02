import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { CustomAppInputComponent } from '../../custom-app-input/custom-app-input.component';
import { UtilsService } from 'src/app/services/utils';
import { DataService } from 'src/app/services/data';
import { addIcons } from 'ionicons';
import { calendarOutline, chevronDownOutline, closeOutline } from 'ionicons/icons';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss'],
  standalone: true,
  imports: [
    IonContent, IonIcon, ReactiveFormsModule, CustomAppInputComponent
  ]
})
export class CreateTaskComponent  implements OnInit {
  @Input() taskData?: any

  private fb = inject(FormBuilder);
  private utilsSvc = inject(UtilsService);
  private dataSvc = inject(DataService);

  form!: FormGroup;

  priorities = [
    { value: 'baja', label: 'Prioridad baja' },
    { value: 'media', label: 'Prioridad media' },
    { value: 'alta', label: 'Prioridad alta' }
  ];

  constructor() {
    addIcons({
      closeOutline, calendarOutline, chevronDownOutline
    });
  }

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.maxLength(255)]],
      priority: ['media', [Validators.required]],
      date: ['']
    });
  }

  getFormControl(name: string): FormControl {
    return (this.form?.get(name) as FormControl) || new FormControl('');
  }

  closeModal(): void {
    this.utilsSvc.dismissModal();
  }

  async saveTask(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const loading = await this.utilsSvc.loading();
    await loading.present();

    try {
      const formVal = this.form.value;
      const payload = {
        name: formVal.name.trim(),
        description: formVal.description ? formVal.description.trim() : null,
        priority: formVal.priority,
        date: formVal.date ? formVal.date : null
      };

      const response: any = await firstValueFrom(this.dataSvc.saveTasks(payload));

      await loading.dismiss();

      this.utilsSvc.presentToast({
        message: response?.message || 'Tarea creada exitosamente',
        duration: 2000,
        color: 'success',
        position: 'middle'
      });

      this.utilsSvc.dismissModal({ success: true });
    } catch (error: any) {
      await loading.dismiss();
      const errorMsg = error?.error?.message || error?.message || 'Error al guardar la tarea';
      this.utilsSvc.presentToast({
        message: errorMsg,
        duration: 2500,
        color: 'danger',
        position: 'middle'
      });
    }
  }
}
