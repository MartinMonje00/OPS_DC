import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { SidebarMenuComponent } from './components/sidebar-menu/sidebar-menu.component';
import { IonicModule } from "@ionic/angular";



@NgModule({
  declarations: [
    HeaderComponent,
    SidebarMenuComponent
  ],
  exports: [
    HeaderComponent,
    SidebarMenuComponent
  ],
  imports: [
    CommonModule,
    IonicModule
]
})
export class SharedModule { }
