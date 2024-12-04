import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../../services/wishlist.service';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.page.html',
  styleUrls: ['./wishlist.page.scss'],
})
export class WishlistPage implements OnInit {
  wishlistProducts: Product[] = [];

  constructor(private wishlistService: WishlistService) {}

  ngOnInit() {
    this.loadWishlist();
  }

  loadWishlist() {
    this.wishlistService.getWishlistProducts().subscribe((products) => {
      this.wishlistProducts = products;
    });
  }

  removeFromWishlist(productId: string) {
    this.wishlistService.removeFromWishlist(productId);
    this.loadWishlist();
  }
}
