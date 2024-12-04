import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ProductDetailsModalComponent } from '../components/product-details-modal/product-details-modal.component';

@NgModule({
  declarations: [ProductDetailsModalComponent],
  imports: [CommonModule, IonicModule],
  exports: [ProductDetailsModalComponent],
})
export class SharedModule {}
