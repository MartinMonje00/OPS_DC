import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './main.page';

const routes: Routes = [
  {
    path: '',
    component: MainPage
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },  {
    path: 'management',
    loadChildren: () => import('./management/management.module').then( m => m.ManagementPageModule)
  },
  {
    path: 'datacenter',
    loadChildren: () => import('./datacenter/datacenter.module').then( m => m.DatacenterPageModule)
  },
  {
    path: 'backup',
    loadChildren: () => import('./backup/backup.module').then( m => m.BackupPageModule)
  },
  {
    path: 'incidents',
    loadChildren: () => import('./datacenter/incidents/incidents.module').then( m => m.IncidentsPageModule)
  },
  {
    path: 'temp',
    loadChildren: () => import('./datacenter/temp/temp.module').then( m => m.TempPageModule)
  },
  {
    path: 'log-book',
    loadChildren: () => import('./datacenter/log-book/log-book.module').then( m => m.LogBookPageModule)
  },
  {
    path: 'logs',
    loadChildren: () => import('./datacenter/logs/logs.module').then( m => m.LogsPageModule)
  },
  {
    path: 'datacenter',
    loadChildren: () => import('./datacenter/datacenter.module').then( m => m.DatacenterPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}
