import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { UtilsService } from 'src/app/services/utils';
import { CustomAppInputComponent } from '../../custom-app-input/custom-app-input.component';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addCircleOutline, briefcaseOutline, businessOutline, callOutline, checkmarkCircleOutline,
  chevronDownOutline, closeOutline, createOutline, mailOutline, personAddOutline,
  personOutline, saveOutline
} from 'ionicons/icons';
import { DataService } from 'src/app/services/data';

@Component({
  selector: 'app-create-contact',
  templateUrl: './create-contact.component.html',
  styleUrls: ['./create-contact.component.scss'],
  standalone: true,
  imports: [
    IonIcon, ReactiveFormsModule, CustomAppInputComponent
  ]
})
export class CreateContactComponent  implements OnInit {
  @Input() contactData?: any;

  private fb = inject(FormBuilder);
  private utilsSvc = inject(UtilsService);
  private dataSvc = inject(DataService);

  form!: FormGroup;
  isEditMode = false;

  contactTypes = [
    { value: 'proveedor', label: 'Proveedor' },
    { value: 'cliente', label: 'Cliente' },
    { value: 'interno', label: 'Interno' },
    { value: 'gobierno', label: 'Gobierno' },
    { value: 'otro', label: 'Otro' }
  ];

  constructor() {
    addIcons({
      createOutline, personAddOutline, closeOutline, personOutline, businessOutline,
      briefcaseOutline, mailOutline, callOutline, chevronDownOutline, saveOutline,
      addCircleOutline, checkmarkCircleOutline
    });
  }

  ngOnInit() {
    this.isEditMode = !!this.contactData;

    this.form = this.fb.group({
      name: [this.contactData?.name || '', [Validators.required, Validators.maxLength(80)]],
      company: [this.contactData?.company || '', [Validators.maxLength(100)]],
      charge: [this.contactData?.charge || '', [Validators.maxLength(35)]],
      email: [this.contactData?.email || '', [Validators.maxLength(100)]],
      telephone: [this.contactData?.telephone || null, [Validators.pattern('^[0-9]{9}$')]],
      type: [this.contactData?.type || 'cliente', [Validators.required]]
    });
  }

  getFormControl(name: string): FormControl {
    return (this.form?.get(name) as FormControl) || new FormControl('');
  }

  closeModal(): void {
    this.utilsSvc.dismissModal();
  }

  async saveContact(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const loading = await this.utilsSvc.loading();
    await loading.present();

    try {
      const formVal = this.form.value;
      const payload = {
        ...(this.isEditMode && this.contactData?.id ? { id: this.contactData.id } : {}),
        name: formVal.name.trim(),
        company: formVal.company ? formVal.company.trim() : null,
        charge: formVal.charge ? formVal.charge.trim() : null,
        email: formVal.email ? formVal.email.trim() : null,
        telephone: formVal.telephone ? Number(formVal.telephone) : null,
        type: formVal.type
      };

      const response: any = await firstValueFrom(this.dataSvc.saveContact(payload));

      await loading.dismiss();

      this.utilsSvc.presentToast({
        message: response?.message || (this.isEditMode ? 'Contacto actualizado' : 'Contacto creado'),
        duration: 2000,
        color: 'success',
        position: 'middle',
        icon: 'ccheckmark-circle-outline'
      });

      this.utilsSvc.dismissModal({ success: true });
    } catch (error: any) {
      await loading.dismiss();
      const errorMsg = error?.error?.message || error?.message || 'Error al procesar la solicitud';
      this.utilsSvc.presentToast({
        message: errorMsg,
        duration: 2500,
        color: 'danger',
        position: 'middle'
      });
    }
  }
}
