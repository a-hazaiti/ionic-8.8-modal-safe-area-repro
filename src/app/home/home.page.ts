import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  ModalController,
} from '@ionic/angular/standalone';
import { ExampleModalComponent } from '../example-modal/example-modal.component';
import { FixedModalComponent } from '../fixed-modal/fixed-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton],
})
export class HomePage {
  constructor(private modalCtrl: ModalController) {}

  async openBuggyModal() {
    const modal = await this.modalCtrl.create({
      component: ExampleModalComponent,
    });
    await modal.present();
  }

  async openFixedModal() {
    const modal = await this.modalCtrl.create({
      component: FixedModalComponent,
    });
    await modal.present();
  }
}
