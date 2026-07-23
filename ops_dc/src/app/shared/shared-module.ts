import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { SidebarMenuComponent } from './components/sidebar-menu/sidebar-menu.component';
import { IonicModule } from "@ionic/angular";
import { CustomAppInputComponent } from './components/custom-app-input/custom-app-input.component';



@NgModule({
  declarations: [],
  exports: [
    CommonModule,
    HeaderComponent,
    SidebarMenuComponent,
    CustomAppInputComponent
  ],
  imports: [
    CommonModule,
    HeaderComponent,
    SidebarMenuComponent,
    CustomAppInputComponent
]
})
export class SharedModule { }
