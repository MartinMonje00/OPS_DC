import { Component, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IonButton, IonIcon, IonInput, IonItem } from '@ionic/angular/standalone';

@Component({
  selector: 'app-custom-app-input',
  templateUrl: './custom-app-input.component.html',
  styleUrls: ['./custom-app-input.component.scss'],
  imports: [
    IonIcon,
    IonItem,
    IonInput,
    IonButton,
    ReactiveFormsModule
  ],
  standalone: true
})
export class CustomAppInputComponent  implements OnInit {

  @Input() control!: FormControl;
  @Input() type!: string;
  @Input() label!: string;
  @Input() autocomplete!: string;
  @Input() icon!: string;

  isPassword!: boolean;
  hide: boolean = true;

  constructor() { }

  ngOnInit() {
    if (this.type === 'password') this.isPassword = true;
  }

  showOrHide() {
    this.hide = !this.hide;

    if (this.hide) this.type = 'password';
    else this.type = 'text';
  }

}
