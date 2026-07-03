import { Component } from '@angular/core';
import { IonApp, IonContent, IonMenu, IonSplitPane, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
  standalone: true,
  imports: [IonSplitPane, IonMenu, IonContent, IonRouterOutlet]
})
export class MainPage {}
