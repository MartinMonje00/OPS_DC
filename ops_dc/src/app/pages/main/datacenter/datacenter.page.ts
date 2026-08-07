import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';

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
export class DatacenterPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
