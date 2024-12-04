import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../interfaces/order.interface';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.page.html',
  styleUrls: ['./order-history.page.scss'],
})
export class OrderHistoryPage implements OnInit {
  orders: Order[] = [];
  isLoading = true;

  constructor(public orderService: OrderService, private router: Router) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getOrders().subscribe((orders) => {
      this.orders = orders.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      this.isLoading = false;
    });
  }

  viewOrderDetails(orderId: string) {
    this.router.navigate(['/orders', orderId]);
  }

  getOrderTotal(order: Order): string {
    return order.total.toFixed(2);
  }
}
