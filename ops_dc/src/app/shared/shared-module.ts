import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { SidebarMenuComponent } from './components/sidebar-menu/sidebar-menu.component';



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
    CommonModule
  ]
})
export class SharedModule { }
