import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonFooter,
  IonButtons,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  ModalController,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-fixed-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Modal (with empty ion-footer fix)</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        @for (item of items; track item) {
          <ion-item>
            <ion-label>
              <h2>Item {{ item }}</h2>
              <p>This item demonstrates the modal content area</p>
            </ion-label>
          </ion-item>
        }
      </ion-list>

      <div style="padding: 16px; text-align: center; color: green; font-weight: bold;">
        ⬇ This text should be fully visible because the empty
        ion-footer workaround prevents the wrapper height shrink.
      </div>
    </ion-content>

    <!-- Workaround: empty ion-footer triggers early return in applyFullscreenSafeArea() -->
    <ion-footer></ion-footer>
  `,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonFooter,
    IonButtons,
    IonButton,
    IonList,
    IonItem,
    IonLabel,
  ],
})
export class FixedModalComponent {
  items = Array.from({ length: 30 }, (_, i) => i + 1);

  constructor(private modalCtrl: ModalController) {}

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
