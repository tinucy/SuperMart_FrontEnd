import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  Order,
  OrderStatus,
  OrderStatusUpdate,
} from '../interfaces/order.interface';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private orders: Order[] = [];
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  private readonly AVERAGE_SPEED = 30; // km/h

  constructor() {
    // Load orders from localStorage
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      this.orders = JSON.parse(savedOrders);
      this.ordersSubject.next(this.orders);
    }
    this.startDeliveryTimeUpdates();
  }

  private startDeliveryTimeUpdates() {
    setInterval(() => {
      const activeDeliveries = this.orders.filter(
        (order) => order.status === OrderStatus.OUT_FOR_DELIVERY
      );

      activeDeliveries.forEach((order) => {
        if (order.delivery.distance) {
          const remainingTime = this.calculateRemainingTime(order);
          order.delivery.remainingTime = remainingTime;
          this.updateOrders();
        }
      });
    }, 60000); // Update every minute
  }

  private calculateRemainingTime(order: Order): number {
    if (!order.delivery.distance) return 0;

    const now = new Date();
    const estimatedDate = new Date(order.delivery.estimatedDate);
    const timeWindow = order.delivery.timeWindow;

    if (timeWindow) {
      const [deliveryHour, deliveryMinute] = timeWindow.start
        .split(':')
        .map(Number);
      estimatedDate.setHours(deliveryHour, deliveryMinute);
    }

    const timeDiff = estimatedDate.getTime() - now.getTime();
    return Math.max(0, Math.round(timeDiff / 60000)); // Convert to minutes
  }

  getDeliveryStatus(order: Order): {
    label: string;
    timeRemaining?: string;
    isLate: boolean;
  } {
    if (order.status !== OrderStatus.OUT_FOR_DELIVERY) {
      return {
        label: this.getOrderStatusInfo(order.status).label,
        isLate: false,
      };
    }

    const remainingTime = order.delivery.remainingTime || 0;
    const isLate = remainingTime < 0;

    if (remainingTime <= 0) {
      return { label: 'Arriving any moment', isLate, timeRemaining: 'Now' };
    }

    const hours = Math.floor(remainingTime / 60);
    const minutes = remainingTime % 60;
    let timeString = '';

    if (hours > 0) {
      timeString += `${hours}h `;
    }
    if (minutes > 0 || hours === 0) {
      timeString += `${minutes}m`;
    }

    return {
      label: `Arriving in ${timeString}`,
      timeRemaining: timeString,
      isLate,
    };
  }

  getDeliveryTimeWindow(order: Order): string {
    if (!order.delivery.timeWindow) return '';

    const { start, end } = order.delivery.timeWindow;
    return `${this.formatTime(start)} - ${this.formatTime(end)}`;
  }

  private formatTime(time: string): string {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  }

  createOrder(order: Order): void {
    this.orders.push(order);
    this.updateOrders();
  }

  getOrders(): Observable<Order[]> {
    return this.ordersSubject.asObservable();
  }

  getOrder(orderId: string): Order | undefined {
    return this.orders.find((order) => order.id === orderId);
  }

  updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    description: string
  ): boolean {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) return false;

    const statusUpdate: OrderStatusUpdate = {
      status,
      timestamp: new Date(),
      description,
    };

    order.status = status;
    order.statusHistory.push(statusUpdate);
    this.updateOrders();
    return true;
  }

  private updateOrders(): void {
    this.ordersSubject.next(this.orders);
    localStorage.setItem('orders', JSON.stringify(this.orders));
  }

  getOrderStatusInfo(status: OrderStatus): {
    label: string;
    icon: string;
    color: string;
  } {
    switch (status) {
      case OrderStatus.PENDING:
        return { label: 'Pending', icon: 'time', color: 'warning' };
      case OrderStatus.CONFIRMED:
        return {
          label: 'Confirmed',
          icon: 'checkmark-circle',
          color: 'primary',
        };
      case OrderStatus.PREPARING:
        return { label: 'Preparing', icon: 'construct', color: 'tertiary' };
      case OrderStatus.READY_FOR_PICKUP:
        return { label: 'Ready for Pickup', icon: 'archive', color: 'success' };
      case OrderStatus.OUT_FOR_DELIVERY:
        return { label: 'Out for Delivery', icon: 'car', color: 'secondary' };
      case OrderStatus.DELIVERED:
        return {
          label: 'Delivered',
          icon: 'checkmark-done-circle',
          color: 'success',
        };
      case OrderStatus.CANCELLED:
        return { label: 'Cancelled', icon: 'close-circle', color: 'danger' };
      default:
        return { label: 'Unknown', icon: 'help-circle', color: 'medium' };
    }
  }
}
