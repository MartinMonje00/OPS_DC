import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonButton, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth';
import { CustomAppInputComponent } from 'src/app/shared/components/custom-app-input/custom-app-input.component';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    CustomAppInputComponent,
    ReactiveFormsModule
  ]
})
export class AuthPage {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  authSvc = inject(AuthService);
  router = inject(Router);

  async submit() {
    if(this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.value;

    try {
      const res = await this.authSvc.signIn({
        email: email!,
        password: password!
      });

      console.log('inicio de sesion exitoso', res.code, res.token, res.user)
    } catch (error: any) {
      console.log('error c:', error)
    }
  }
}
