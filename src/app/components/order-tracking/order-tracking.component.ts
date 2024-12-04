import { Component, Input, OnInit } from '@angular/core';
import { Order, OrderStatus } from '../../interfaces/order.interface';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-tracking',
  templateUrl: './order-tracking.component.html',
  styleUrls: ['./order-tracking.component.scss'],
})
export class OrderTrackingComponent implements OnInit {
  @Input() order!: Order;
  statusSteps: OrderStatus[] = [
    OrderStatus.PENDING,
    OrderStatus.CONFIRMED,
    OrderStatus.PREPARING,
    OrderStatus.OUT_FOR_DELIVERY,
    OrderStatus.DELIVERED,
  ];

  constructor(public orderService: OrderService) {}

  ngOnInit() {}

  isStepCompleted(status: OrderStatus): boolean {
    const currentIndex = this.statusSteps.indexOf(this.order.status);
    const stepIndex = this.statusSteps.indexOf(status);
    return stepIndex <= currentIndex;
  }

  isStepActive(status: OrderStatus): boolean {
    return this.order.status === status;
  }
}
