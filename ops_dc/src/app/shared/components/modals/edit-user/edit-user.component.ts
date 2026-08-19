import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, personOutline, saveOutline } from 'ionicons/icons';
import { User, UserdataService } from 'src/app/services/userdata';
import { UtilsService } from 'src/app/services/utils';

export interface RoleOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonIcon
  ]
})
export class EditUserComponent  implements OnInit {
  @Input({ required: true }) user!: User;

  private utilsSvc = inject(UtilsService);
  private userdataSvc = inject(UserdataService);

  roles: RoleOption[] = [
    { value: 'ventas', label: 'Ventas' },
    { value: 'arquitectura', label: 'Arquitectura' },
    { value: 'gerencia', label: 'Gerencia' },
    { value: 'operaciones', label: 'Operaciones' },
    { value: 'seguridad', label: 'Seguridad' },
    { value: 'datacenter', label: 'Datacenter' }
  ];

  selectedRole: string = 'operaciones';
  isActive: boolean = true;
  isSaving: boolean = false;

  constructor() {
    addIcons({ closeOutline, saveOutline, personOutline });
  }

  ngOnInit(): void {
    if (this.user) {
      const roleExists = this.roles.some(r => r.value === this.user.role?.toLowerCase());
      this.selectedRole = roleExists ? this.user.role.toLowerCase() : 'operaciones';
      this.isActive = this.user.isActive;
    }
  }

  closeModal(): void {
    this.utilsSvc.dismissModal();
  }

  async saveChanges(): Promise<void> {
    if (!this.user.id) {
      this.utilsSvc.presentToast({
        message: 'No se identifico el UUID del usuario.',
        duration: 2500,
        color: 'danger'
      });
      return;
    }

    this.isSaving = true;

    this.userdataSvc.updateUser(this.user.id, {
      role: this.selectedRole,
      isActive: this.isActive
    }).subscribe({
      next: (res) => {
        this.isSaving = false;
        this.utilsSvc.presentToast({
          message: res.message || 'Usuario actualizado de forma exitosa.',
          duration: 2000,
          color: 'success'
        });

        this.utilsSvc.dismissModal({ updated: true });
      },
      error: (err) => {
        this.isSaving = false;
        this.utilsSvc.presentToast({
          message: err.error?.message || 'Error al intentar actualizar el usuario.',
          duration: 2500,
          color: 'danger'
        });
      }
    });
  }
}
