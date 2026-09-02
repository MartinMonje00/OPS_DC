import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonButton, IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { alertCircleOutline, businessOutline, personCircleOutline } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth';
import { UtilsService } from 'src/app/services/utils';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: true,
  imports: [
    CommonModule, IonContent, IonButton, IonIcon, ReactiveFormsModule
  ]
})
export class AuthPage {
  authSvc = inject(AuthService);
  utilsSvc = inject(UtilsService);

  form = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  constructor() {
    addIcons({ personCircleOutline, alertCircleOutline, businessOutline })
  }

  async submit() {
    if(this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const loading = await this.utilsSvc.loading();
    await loading.present();

    const { username, password } = this.form.value;

    try {
      const res = await this.authSvc.signIn({
        username: username!,
        password: password!
      });

      console.log(res.code)

      this.utilsSvc.routerLink('/main/home')

      this.form.reset();
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    } finally {
      loading.dismiss();
    }
  }
}
