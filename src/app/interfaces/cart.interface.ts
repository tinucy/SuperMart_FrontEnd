export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  originalPrice?: number;
  dealDiscount?: number;
}

export interface CartSummary {
  subtotal: number;
  discount: number;
  couponDiscount: number;
  couponCode?: string;
  tax: number;
  shipping: number;
  total: number;
}

export interface Cart {
  items: CartItem[];
  summary: CartSummary;
}
