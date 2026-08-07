import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { CustomAppInputComponent } from './components/custom-app-input/custom-app-input.component';
import { CurrencyModalComponent } from './components/modals/currency-modal/currency-modal.component';



@NgModule({
  declarations: [],
  exports: [
    CommonModule,
    HeaderComponent,
    CustomAppInputComponent,
    CurrencyModalComponent
  ],
  imports: [
    CommonModule,
    HeaderComponent,
    CustomAppInputComponent,
    CurrencyModalComponent
]
})
export class SharedModule { }
