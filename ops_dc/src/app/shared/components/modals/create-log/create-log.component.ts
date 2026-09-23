import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonIcon } from '@ionic/angular/standalone';
import { UtilsService } from 'src/app/services/utils';
import { DataService } from 'src/app/services/data';
import { addIcons } from 'ionicons';
import { chevronDownOutline, closeOutline, documentTextOutline } from 'ionicons/icons';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-create-log',
  templateUrl: './create-log.component.html',
  styleUrls: ['./create-log.component.scss'],
  standalone: true,
  imports: [
    IonIcon, ReactiveFormsModule
  ]
})
export class CreateLogComponent  implements OnInit {
  @Input() logData?: any;

  private fb = inject(FormBuilder);
  private utilsSvc = inject(UtilsService);
  private dataSvc = inject(DataService);

  form!: FormGroup;
  isEditMode = false;

  logCategories = [
    { value: 'general', label: 'General' },
    { value: 'visita', label: 'Visita' },
    { value: 'mantenimiento', label: 'Mantenimiento' },
    { value: 'seguridad', label: 'Seguridad' },
    { value: 'operacion', label: 'Operación' }
  ];

  logStates = [
    { value: 'abierto', label: 'Abierto' },
    { value: 'archivado', label: 'Archivado' },
    { value: 'cerrado', label: 'Cerrado' }
  ];

  constructor() {
    addIcons({
      closeOutline, documentTextOutline, chevronDownOutline
    });
  }

  ngOnInit() {
    this.isEditMode = !!this.logData;

    if (this.isEditMode) {
      this.form = this.fb.group({
        description: [this.logData?.description || '', [Validators.required, Validators.maxLength(255)]],
        state: [this.logData?.state || 'abierto', [Validators.required]]
      });
    } else {
      this.form = this.fb.group({
        title: ['', [Validators.required, Validators.maxLength(25)]],
        category: ['general'],
        description: ['', [Validators.required, Validators.maxLength(255)]],
        state: ['abierto', [Validators.required]]
      });
    }
  }

  getFormControl(name: string): FormControl {
    return (this.form?.get(name) as FormControl) || new FormControl('');
  }

  closeModal(): void {
    this.utilsSvc.dismissModal();
  }

  async saveLog(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const loading = await this.utilsSvc.loading();
    await loading.present();

    try {
      const formVal = this.form.value;
      let request$;

      if (this.isEditMode) {
        const logId = this.logData.logId || this.logData.id || this.logData.log_id

        if (!logId) {
          await loading.dismiss();
          this.utilsSvc.presentToast({
            message: 'No se pudo verificar el ID del registo a modificar',
            duration: 2500,
            color: 'danger',
            position: 'middle'
          });
        }

        const payload = {
          description: formVal.description.trim(),
          state: formVal.state
        };

        request$ = this.dataSvc.updateLogbook(logId, payload);
      } else {
        const user = this.utilsSvc.getFromLocalStorage('user');

        const payload = {
          user_id: user?.id,
          title: formVal.title.trim(),
          category: formVal.category,
          description: formVal.description.trim(),
          state:formVal.state
        };

        request$ = this.dataSvc.saveLogbook(payload);
      }

      const response: any = await firstValueFrom(request$);
      await loading.dismiss();

      this.utilsSvc.presentToast({
        message: response?.message || (this.isEditMode ? 'Bitacora actualizada' : 'Bitacora registrada'),
        duration: 2000,
        color: 'success',
        position: 'middle'
      });

      this.utilsSvc.dismissModal({ success: true });
    } catch (error: any) {
      await loading.dismiss();
      const errorMsg = error?.error?.message || error?.message || 'error al procesar la bitácora';

      this.utilsSvc.presentToast({
        message: errorMsg,
        duration: 2500,
        color: 'danger',
        position: 'middle'
      });
    }
  }
}
