import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatacenterPageRoutingModule } from './datacenter-routing.module';

import { DatacenterPage } from './datacenter.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatacenterPageRoutingModule
  ],
  declarations: [DatacenterPage]
})
export class DatacenterPageModule {}
