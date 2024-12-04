import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'app-product-details-modal',
  templateUrl: './product-details-modal.component.html',
  styleUrls: ['./product-details-modal.component.scss'],
})
export class ProductDetailsModalComponent {
  @Input() product!: Product;

  constructor(private modalController: ModalController) {}

  dismiss() {
    this.modalController.dismiss();
  }

  calculateRatingWidth(
    rating: number,
    distribution: Record<1 | 2 | 3 | 4 | 5, number>,
    total: number
  ): number {
    return (distribution[rating as 1 | 2 | 3 | 4 | 5] / total) * 100;
  }

  getRatingCount(rating: number): number {
    return this.product.ratings.distribution[rating as 1 | 2 | 3 | 4 | 5];
  }
}
