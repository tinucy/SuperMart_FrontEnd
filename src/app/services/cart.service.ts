import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart, CartItem, CartSummary } from '../interfaces/cart.interface';
import { Product } from '../interfaces/product.interface';
import { CouponService } from './coupon.service';
import { Coupon } from '../interfaces/coupon.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly TAX_RATE = 0.08; // 8% tax
  private readonly FREE_SHIPPING_THRESHOLD = 50;
  private readonly SHIPPING_COST = 5.99;
  private appliedCoupon: Coupon | null = null;

  private cart: Cart = {
    items: [],
    summary: {
      subtotal: 0,
      discount: 0,
      couponDiscount: 0,
      tax: 0,
      shipping: 0,
      total: 0,
    },
  };

  private cartSubject = new BehaviorSubject<Cart>(this.cart);

  constructor(private couponService: CouponService) {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
      this.cartSubject.next(this.cart);
    }
  }

  getCart(): Observable<Cart> {
    return this.cartSubject.asObservable();
  }

  addToCart(product: Product, quantity: number = 1): void {
    const existingItem = this.cart.items.find(
      (item) => item.productId === product.id
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      const cartItem: CartItem = {
        productId: product.id,
        quantity,
        price: product.price,
        originalPrice: product.originalPrice,
        dealDiscount: product.deal?.discount,
      };
      this.cart.items.push(cartItem);
    }

    this.updateCartSummary();
  }

  removeFromCart(productId: string): void {
    this.cart.items = this.cart.items.filter(
      (item) => item.productId !== productId
    );
    this.updateCartSummary();
  }

  updateQuantity(productId: string, quantity: number): void {
    const item = this.cart.items.find((item) => item.productId === productId);
    if (item) {
      item.quantity = quantity;
      this.updateCartSummary();
    }
  }

  clearCart(): void {
    this.cart = {
      items: [],
      summary: {
        subtotal: 0,
        discount: 0,
        couponDiscount: 0,
        tax: 0,
        shipping: 0,
        total: 0,
      },
    };
    this.updateCartSummary();
  }

  private updateCartSummary(): void {
    const summary = this.calculateSummary();
    this.cart.summary = summary;
    this.cartSubject.next(this.cart);
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  private calculateSummary(): CartSummary {
    const subtotal = this.cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const discount = this.cart.items.reduce((sum, item) => {
      if (item.originalPrice && item.dealDiscount) {
        return sum + (item.originalPrice - item.price) * item.quantity;
      }
      return sum;
    }, 0);

    let couponDiscount = 0;
    if (this.appliedCoupon) {
      couponDiscount = this.couponService.calculateDiscount(
        this.appliedCoupon,
        subtotal - discount
      );
    }

    const shipping =
      subtotal >= this.FREE_SHIPPING_THRESHOLD ||
      (this.appliedCoupon?.type === 'FREE_SHIPPING' &&
        subtotal >= (this.appliedCoupon.minPurchase || 0))
        ? 0
        : this.SHIPPING_COST;
    const taxableAmount = subtotal - discount - couponDiscount;
    const tax = taxableAmount * this.TAX_RATE;
    const total = taxableAmount + tax + shipping;

    return {
      subtotal,
      discount,
      couponDiscount,
      couponCode: this.cart.summary.couponCode,
      tax,
      shipping,
      total,
    };
  }

  getItemCount(): number {
    return this.cart.items.reduce((count, item) => count + item.quantity, 0);
  }

  applyCoupon(code: string): boolean {
    const coupon = this.couponService.validateCoupon(
      code,
      this.cart.summary.subtotal
    );

    if (coupon) {
      this.appliedCoupon = coupon;
      this.cart.summary.couponCode = code;
      this.updateCartSummary();
      return true;
    }
    return false;
  }

  removeCoupon(): void {
    this.appliedCoupon = null;
    this.cart.summary.couponCode = undefined;
    this.updateCartSummary();
  }
}
