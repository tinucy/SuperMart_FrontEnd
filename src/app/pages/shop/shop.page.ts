import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import {
  Product,
  ProductCategory,
  ProductDeal,
} from '../../interfaces/product.interface';
import { ModalController } from '@ionic/angular';
import { ProductDetailsModalComponent } from '../../components/product-details-modal/product-details-modal.component';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
})
export class ShopPage implements OnInit {
  products: Product[] = [];
  categories = Object.values(ProductCategory);
  selectedCategory: ProductCategory | null = null;
  searchQuery: string = '';
  cartItemCount: number = 0;

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private wishlistService: WishlistService,
    private cartService: CartService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.loadCartCount();
  }

  logout() {
    this.authService.logout();
  }

  loadProducts() {
    if (this.selectedCategory) {
      this.productService
        .getProductsByCategory(this.selectedCategory)
        .subscribe((products) => {
          this.products = products;
        });
    } else {
      this.productService.getProducts().subscribe((products) => {
        this.products = products;
      });
    }
  }

  filterByCategory(category: ProductCategory) {
    this.selectedCategory = category;
    this.loadProducts();
  }

  showAllProducts() {
    this.selectedCategory = null;
    this.loadProducts();
  }

  search(event: any) {
    this.searchQuery = event.target.value.toLowerCase();
    if (this.searchQuery.length > 0) {
      this.productService
        .searchProducts(this.searchQuery)
        .subscribe((products) => {
          this.products = products;
        });
    } else {
      this.loadProducts();
    }
  }

  isLowStock(product: Product): boolean {
    return this.productService.isLowStock(product);
  }

  isDealExpired(deal: ProductDeal): boolean {
    return this.productService.isDealExpired(deal);
  }

  async showProductDetails(product: Product) {
    const modal = await this.modalController.create({
      component: ProductDetailsModalComponent,
      componentProps: {
        product: product,
      },
    });
    return await modal.present();
  }

  calculateRatingWidth(
    rating: number,
    distribution: Record<1 | 2 | 3 | 4 | 5, number>,
    total: number
  ): number {
    return (distribution[rating as 1 | 2 | 3 | 4 | 5] / total) * 100;
  }

  isInWishlist(productId: string): boolean {
    return this.wishlistService.isInWishlist(productId);
  }

  toggleWishlist(product: Product, event: Event): void {
    event.stopPropagation();
    if (this.isInWishlist(product.id)) {
      this.wishlistService.removeFromWishlist(product.id);
    } else {
      this.wishlistService.addToWishlist(product.id);
    }
  }

  addToCart(product: Product, event: Event): void {
    event.stopPropagation();
    if (product.inStock) {
      this.cartService.addToCart(product);
    }
  }

  private loadCartCount() {
    this.cartService.getCart().subscribe((cart) => {
      this.cartItemCount = this.cartService.getItemCount();
    });
  }
}
