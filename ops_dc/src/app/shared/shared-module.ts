import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { SidebarMenuComponent } from './components/sidebar-menu/sidebar-menu.component';
import { IonicModule } from "@ionic/angular";
import { CustomAppInputComponent } from './components/custom-app-input/custom-app-input.component';



@NgModule({
  declarations: [
    HeaderComponent,
    SidebarMenuComponent,
    CustomAppInputComponent
  ],
  exports: [
    HeaderComponent,
    SidebarMenuComponent,
    CustomAppInputComponent
  ],
  imports: [
    CommonModule,
    IonicModule
]
})
export class SharedModule { }
