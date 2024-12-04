import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { Cart, CartItem } from '../../interfaces/cart.interface';
import { Product } from '../../interfaces/product.interface';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  cart!: Cart;
  cartProducts: Map<string, Product> = new Map();
  couponCode: string = '';

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCart().subscribe((cart) => {
      this.cart = cart;
      this.loadProducts();
    });
  }

  private loadProducts() {
    this.productService.getProducts().subscribe((products) => {
      this.cartProducts = new Map(
        products
          .filter((product) =>
            this.cart.items.some((item) => item.productId === product.id)
          )
          .map((product) => [product.id, product])
      );
    });
  }

  getProduct(productId: string): Product | undefined {
    return this.cartProducts.get(productId);
  }

  updateQuantity(item: CartItem, event: any) {
    const quantity = parseInt(event.target.value);
    if (quantity > 0) {
      this.cartService.updateQuantity(item.productId, quantity);
    }
  }

  removeItem(productId: string) {
    this.cartService.removeFromCart(productId);
  }

  clearCart() {
    this.cartService.clearCart();
  }

  async applyCoupon() {
    if (!this.couponCode) {
      return;
    }

    const success = this.cartService.applyCoupon(this.couponCode);

    const toast = await this.toastController.create({
      message: success ? 'Coupon applied successfully!' : 'Invalid coupon code',
      duration: 2000,
      position: 'bottom',
      color: success ? 'success' : 'danger',
    });

    await toast.present();
    if (!success) {
      this.couponCode = '';
    }
  }

  removeCoupon() {
    this.cartService.removeCoupon();
    this.couponCode = '';
  }

  async proceedToCheckout() {
    if (this.cart.items.length === 0) {
      const toast = await this.toastController.create({
        message: 'Your cart is empty',
        duration: 2000,
        color: 'warning',
      });
      await toast.present();
      return;
    }
    this.router.navigate(['/checkout']);
  }
}
