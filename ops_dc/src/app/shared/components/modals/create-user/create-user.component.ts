import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  checkmarkCircleOutline,
  closeOutline, lockClosedOutline, mailOutline, personAddOutline, personOutline,
  shieldOutline
} from 'ionicons/icons';
import { UserdataService } from 'src/app/services/userdata';
import { UtilsService } from 'src/app/services/utils';
import { CustomAppInputComponent } from '../../custom-app-input/custom-app-input.component';
import { firstValueFrom } from 'rxjs';

export interface RoleOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, IonIcon, CustomAppInputComponent
  ]
})
export class CreateUserComponent {
  private utildsSvc = inject(UtilsService);
  private userdataSvc = inject(UserdataService);

  roles: RoleOption[] = [
    { value: 'ventas', label: 'Ventas' },
    { value: 'arquitectura', label: 'Arquitectura' },
    { value: 'gerencia', label: 'Gerencia' },
    { value: 'operaciones', label: 'Operaciones' },
    { value: 'seguridad', label: 'Seguridad' },
    { value: 'datacenter', label: 'Datacenter' }
  ];

  form = new FormGroup({
    username: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    role: new FormControl('operaciones', [Validators.required])
  });

  isSaving = false;

  constructor() {
    addIcons({
      closeOutline, personAddOutline, personOutline, mailOutline, lockClosedOutline,
      shieldOutline, checkmarkCircleOutline
    });
  }

  getFormControl(key: string): FormControl {
    return this.form.get(key) as FormControl;
  }

  closeModal(): void {
    this.utildsSvc.dismissModal();
  }

  async createUser(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const loading = await this.utildsSvc.loading();
    await loading.present();

    const { username, name, email, password, role } =this.form.value;

    try {
      const response = await firstValueFrom(
        this.userdataSvc.createUser({
          username: username!.trim(),
          name: name!.trim(),
          email: email!.trim().toLowerCase(),
          password: password!,
          role: role!
        })
      );

      await loading.dismiss();

      this.utildsSvc.presentToast({
        message: response?.message || 'Usuario creado exitosamente',
        duration: 2000,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });

      this.form.reset();
      this.utildsSvc.dismissModal({ created: true });
    } catch (error: any) {
      const errorMsg = error?.error?.message || error?.message || 'Error al crear el ususario';

      console.error(errorMsg, error);

      this.utildsSvc.presentToast({
        message: errorMsg,
        duration: 2500,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    } finally {
      loading.dismiss();
    }
  }
}
