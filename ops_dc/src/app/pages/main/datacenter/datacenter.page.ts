import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { IonContent, ViewWillEnter } from '@ionic/angular/standalone';
import { DatacenterDashboardService } from 'src/app/services/datacenter-dashboard';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';

export interface Dashboard {
  time_down: string | number;
  total_active: number;
  total_incidents: number;
  total_tasks: number;
  total_next_tasks: number;
}

@Component({
  selector: 'app-datacenter',
  templateUrl: './datacenter.page.html',
  styleUrls: ['./datacenter.page.scss'],
  standalone: true,
  imports: [
    HeaderComponent, CommonModule, RouterLink, RouterLinkActive, RouterOutlet,
    IonContent
  ]
})
export class DatacenterPage implements OnInit, OnDestroy, ViewWillEnter {
  private intervalId: any;

  public stateSvc = inject(DatacenterDashboardService);

  ngOnInit() {
    this.stateSvc.refreshMetrics();

    this.intervalId = setInterval(() => {
      this.stateSvc.refreshMetrics();
    }, 30000);
  }

  ionViewWillEnter() {
    this.stateSvc.refreshMetrics();
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}
