export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  READY_FOR_PICKUP = 'READY_FOR_PICKUP',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export interface OrderStatusUpdate {
  status: OrderStatus;
  timestamp: Date;
  description: string;
  updatedBy?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
    name: string;
  }[];
  total: number;
  status: OrderStatus;
  statusHistory: OrderStatusUpdate[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  createdAt: Date;
  delivery: {
    estimatedDate: Date;
    timeWindow?: {
      start: string; // e.g., "09:00"
      end: string; // e.g., "12:00"
    };
    actualDeliveryTime?: Date;
    notes?: string;
    trackingNumber?: string;
    carrier?: string;
    distance?: number; // in kilometers
    remainingTime?: number; // in minutes
  };
  trackingNumber?: string;
}
