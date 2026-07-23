import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-datacenter',
  templateUrl: './datacenter.page.html',
  styleUrls: ['./datacenter.page.scss'],
  standalone: true,
  imports: [
    CommonModule, IonHeader, IonToolbar, IonTitle, IonContent
  ]
})
export class DatacenterPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
