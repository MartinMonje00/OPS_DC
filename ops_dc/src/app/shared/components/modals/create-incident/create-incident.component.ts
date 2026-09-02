import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { CustomAppInputComponent } from '../../custom-app-input/custom-app-input.component';
import { UtilsService } from 'src/app/services/utils';
import { DataService } from 'src/app/services/data';
import { addIcons } from 'ionicons';
import { chevronDownOutline, closeOutline, time } from 'ionicons/icons';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-create-incident',
  templateUrl: './create-incident.component.html',
  styleUrls: ['./create-incident.component.scss'],
  standalone: true,
  imports: [
    IonContent, IonIcon, ReactiveFormsModule, CustomAppInputComponent
  ]
})
export class CreateIncidentComponent  implements OnInit {
  private fb = inject(FormBuilder);
  private utilsSvc = inject(UtilsService);
  private dataSvc = inject(DataService);

  form!: FormGroup;

  severities = [
    { value: 'baja', label: 'Baja' },
    { value: 'media', label: 'Media' },
    { value: 'alta', label: 'Alta' },
    { value: 'critica', label: 'Critica' }
  ];

  constructor() {
    addIcons({
      closeOutline, chevronDownOutline
    });
  }

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      type: ['', [Validators.maxLength(70)]],
      affected_service: ['', [Validators.maxLength(128)]],
      description: ['', [Validators.maxLength(255)]],
      severity: ['baja', [Validators.maxLength(7)]],
      startedAt: [this.formatForDateTimeInput(new Date())],
      endedAt: [''],
      affect: [false]
    });
  }

  getFormControl(name: string): FormControl {
    return (this.form?.get(name) as FormControl) || new FormControl('');
  }

  private formatForDateTimeInput(date: Date = new Date()): string {
    const pad = (n: number) => n.toString().padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  private getIsoForBackend(localInputString: string): string | null {
    if (!localInputString) return null;

    const [datePart, timePart] = localInputString.split('T');
    if (!datePart || !timePart) return null;

    const [year, month, day] = datePart.split('-').map(Number);
    const [hours, minutes] = timePart.split(':').map(Number);

    const localDate = new Date(year, month - 1, day, hours, minutes, 0, 0);

    return localDate.toISOString();
  }

  closeModal(): void {
    this.utilsSvc.dismissModal();
  }

  async saveIncident(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const loading = await this.utilsSvc.loading();
    await loading.present();

    try {
      const formVal = this.form.value;

      const startedAtISO = this.getIsoForBackend(formVal.startedAt);
      const endedAtISO = this.getIsoForBackend(formVal.endedAt);

      const payload: any = {
        name: formVal.name.trim(),
        type: formVal.type ? formVal.type.trim() : null,
        affected_service: formVal.affected_service ? formVal.affected_service.trim() : null,
        description: formVal.description.trim(),
        severity: formVal.severity,
        startedAt: startedAtISO,
        affect: formVal.affect ? 1 : 0
      };

      if (endedAtISO) {
        payload.endedAt = endedAtISO;
        payload.state = 'cerrado';
      }

      const response: any = await firstValueFrom(this.dataSvc.saveIncident(payload));
      await loading.dismiss();

      this.utilsSvc.presentToast({
        message: response?.message || 'Incidente reportado exitosamente.',
        duration: 2000,
        color: 'success',
        position: 'middle'
      });

      this.utilsSvc.dismissModal({ success: true });
    } catch (error: any) {
      await loading.dismiss();
      this.utilsSvc.presentToast({
        message: error?.error?.message || error?.message || 'Error al guardar el incidente',
        duration: 2500,
        color: 'danger',
        position: 'middle'
      });
    }
  }
}
