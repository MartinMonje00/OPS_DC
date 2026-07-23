import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DatacenterPage } from './datacenter.page';

const routes: Routes = [
  {
    path: '',
    component: DatacenterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatacenterPageRoutingModule {}
