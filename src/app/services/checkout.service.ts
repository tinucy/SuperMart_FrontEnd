import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PaymentDetails, CheckoutData } from '../interfaces/payment.interface';
import { CartService } from './cart.service';
import { OrderService } from './order.service';
import { PaymentProcessorService } from './payment-processor.service';
import { Order, OrderStatus } from '../interfaces/order.interface';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private checkoutData: CheckoutData | null = null;
  private checkoutSubject = new BehaviorSubject<CheckoutData | null>(null);

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private paymentProcessor: PaymentProcessorService
  ) {}

  getCheckoutData(): Observable<CheckoutData | null> {
    return this.checkoutSubject.asObservable();
  }

  setCheckoutData(data: CheckoutData) {
    this.checkoutData = data;
    this.checkoutSubject.next(data);
  }

  async processPayment(): Promise<boolean> {
    if (!this.checkoutData) return false;

    const cart = await this.cartService.getCart().toPromise();
    if (!cart) return false;

    const result = await this.paymentProcessor.processPayment(
      cart.summary.total,
      this.checkoutData.paymentDetails
    );

    if (result.success) {
      const order: Order = {
        id: 'ORD' + Date.now(),
        userId: 'current-user-id',
        items: cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          name: 'Product Name',
        })),
        total: cart.summary.total,
        status: OrderStatus.PENDING,
        statusHistory: [
          {
            status: OrderStatus.PENDING,
            timestamp: new Date(),
            description: 'Order placed successfully',
          },
        ],
        shippingAddress: this.checkoutData.shippingAddress,
        paymentMethod: this.checkoutData.paymentDetails.method,
        createdAt: new Date(),
        delivery: {
          estimatedDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          timeWindow: {
            start: '09:00',
            end: '17:00',
          },
          distance: 5, // Example distance in km
          notes: 'Leave at front door if no answer',
        },
      };

      this.orderService.createOrder(order);
      this.cartService.clearCart();
      return true;
    }

    throw new Error(result.error || 'Payment failed');
  }

  validateCardNumber(number: string): boolean {
    return /^\d{16}$/.test(number.replace(/\s/g, ''));
  }

  validateExpiryDate(month: string, year: string): boolean {
    const currentDate = new Date();
    const expiryDate = new Date(parseInt(year), parseInt(month) - 1);
    return expiryDate > currentDate;
  }

  validateCVV(cvv: string): boolean {
    return /^\d{3,4}$/.test(cvv);
  }

  formatCardNumber(number: string): string {
    return number
      .replace(/\s/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim();
  }
}
