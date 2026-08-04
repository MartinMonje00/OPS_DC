import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { SidebarMenuComponent } from './components/sidebar-menu/sidebar-menu.component';
import { CustomAppInputComponent } from './components/custom-app-input/custom-app-input.component';
import { CurrencyModalComponent } from './components/modals/currency-modal/currency-modal.component';



@NgModule({
  declarations: [],
  exports: [
    CommonModule,
    HeaderComponent,
    SidebarMenuComponent,
    CustomAppInputComponent,
    CurrencyModalComponent
  ],
  imports: [
    CommonModule,
    HeaderComponent,
    SidebarMenuComponent,
    CustomAppInputComponent,
    CurrencyModalComponent
]
})
export class SharedModule { }
