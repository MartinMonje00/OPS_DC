import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { SharedModule } from 'src/app/shared/shared-module';
import { addIcons } from 'ionicons';
import { UserdataService, User } from 'src/app/services/userdata';
import { addOutline, checkmarkOutline, closeOutline, pencilOutline } from 'ionicons/icons';
import { UtilsService } from 'src/app/services/utils';
import { EditUserComponent } from 'src/app/shared/components/modals/edit-user/edit-user.component';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, SharedModule, IonContent, IonIcon,
    DatePipe, FooterComponent
  ]
})
export class UsersPage implements OnInit {
  public userdataSvc = inject(UserdataService);
  private utilsSvc = inject(UtilsService);

  users = signal<User[]>([]);
  isLoading = signal<boolean>(true);

  constructor() {
    addIcons({
      checkmarkOutline, closeOutline, pencilOutline, addOutline
    })
  }

  ngOnInit() {
    this.loadUsers();
  }

  ionViewWillEnter(): void {
    this.loadUsers();
  }

  async openEditModal(user: User): Promise<void> {
    const res = await this.utilsSvc.presentModal({
      component: EditUserComponent,
      componentProps: { user },
      cssClass: 'custom-edit-user-modal'
    });

    if (res && res.updated) {
      this.loadUsers();
    }
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.userdataSvc.getAllUsers().subscribe({
      next: (data) => {
        this.users.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al obtener la lista de usuarios:', err);
        this.isLoading.set(false);
      }
    });
  }
}
