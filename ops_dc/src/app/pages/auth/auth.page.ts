import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonButton, IonContent } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { alertCircleOutline, lockClosedOutline, mailOutline, personCircleOutline } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth';
import { UtilsService } from 'src/app/services/utils';
import { CustomAppInputComponent } from 'src/app/shared/components/custom-app-input/custom-app-input.component';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: true,
  imports: [
    CommonModule, IonContent, IonButton, CustomAppInputComponent, ReactiveFormsModule
  ]
})
export class AuthPage {
  authSvc = inject(AuthService);
  utilsSvc = inject(UtilsService);

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  constructor() {
    addIcons({ mailOutline, lockClosedOutline, personCircleOutline, alertCircleOutline })
  }

  async submit() {
    if(this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const loading = await this.utilsSvc.loading();
    await loading.present();

    const { email, password } = this.form.value;

    try {
      const res = await this.authSvc.signIn({
        email: email!,
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
