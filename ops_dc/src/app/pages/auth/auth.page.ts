import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonButton, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth';
import { UtilsService } from 'src/app/services/utils';
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
  authSvc = inject(AuthService);
  utilsSvc = inject(UtilsService);

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

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

      console.log('\ninicio de sesion exitoso\n', res.code, '\n', res.token, '\n', res.user)

      //this.utilsSvc.routerLink('/home')
    } catch (error: any) {
      console.log('error c:', error)
    }
  }
}
