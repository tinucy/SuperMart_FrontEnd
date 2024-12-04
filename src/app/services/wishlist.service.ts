import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { WishlistItem } from '../interfaces/wishlist.interface';
import { Product } from '../interfaces/product.interface';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private wishlistItems: WishlistItem[] = [];
  private wishlistSubject = new BehaviorSubject<WishlistItem[]>([]);

  constructor(private productService: ProductService) {
    // Load wishlist from localStorage
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      this.wishlistItems = JSON.parse(savedWishlist);
      this.wishlistSubject.next(this.wishlistItems);
    }
  }

  getWishlist(): Observable<WishlistItem[]> {
    return this.wishlistSubject.asObservable();
  }

  isInWishlist(productId: string): boolean {
    return this.wishlistItems.some((item) => item.productId === productId);
  }

  addToWishlist(productId: string): void {
    if (!this.isInWishlist(productId)) {
      const newItem: WishlistItem = {
        productId,
        dateAdded: new Date(),
      };
      this.wishlistItems.push(newItem);
      this.updateWishlist();
    }
  }

  removeFromWishlist(productId: string): void {
    this.wishlistItems = this.wishlistItems.filter(
      (item) => item.productId !== productId
    );
    this.updateWishlist();
  }

  private updateWishlist(): void {
    this.wishlistSubject.next(this.wishlistItems);
    localStorage.setItem('wishlist', JSON.stringify(this.wishlistItems));
  }

  getWishlistProducts(): Observable<Product[]> {
    return new Observable<Product[]>((observer) => {
      this.productService.getProducts().subscribe((allProducts) => {
        const wishlistProducts = allProducts.filter((product) =>
          this.isInWishlist(product.id)
        );
        observer.next(wishlistProducts);
      });
    });
  }
}
