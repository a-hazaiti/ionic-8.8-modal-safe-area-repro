import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  ModalController,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-example-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Modal (no ion-footer)</ion-title>
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

      <div style="padding: 16px; text-align: center; color: red; font-weight: bold;">
        ⬇ If this text is cut off or hidden behind the home indicator,
        the bug is reproduced. The modal wrapper height was reduced
        by safe-area-inset-bottom.
      </div>
    </ion-content>

    <!-- NOTE: No <ion-footer> — this is intentional to reproduce the bug.
         Ionic 8.8's applyFullscreenSafeArea() shrinks the modal wrapper
         height when ion-content exists without ion-footer. -->
  `,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonList,
    IonItem,
    IonLabel,
  ],
})
export class ExampleModalComponent {
  items = Array.from({ length: 30 }, (_, i) => i + 1);

  constructor(private modalCtrl: ModalController) {}

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
