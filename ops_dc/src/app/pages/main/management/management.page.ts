import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-management',
  templateUrl: './management.page.html',
  styleUrls: ['./management.page.scss'],
  standalone: true,
  imports: [
      CommonModule, IonHeader, IonToolbar, IonTitle, IonContent
    ]
})
export class ManagementPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
