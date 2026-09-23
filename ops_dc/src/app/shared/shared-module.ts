import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { CurrencyModalComponent } from './components/modals/currency-modal/currency-modal.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [],
  exports: [
    CommonModule,
    HeaderComponent,
    CurrencyModalComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    HeaderComponent,
    CurrencyModalComponent,
    FooterComponent
]
})
export class SharedModule { }
