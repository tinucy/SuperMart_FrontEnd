import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Coupon, CouponType } from '../interfaces/coupon.interface';

@Injectable({
  providedIn: 'root',
})
export class CouponService {
  private coupons: Coupon[] = [
    {
      code: 'WELCOME10',
      type: CouponType.PERCENTAGE,
      value: 10,
      minPurchase: 20,
      description: '10% off on orders above $20',
      isActive: true,
    },
    {
      code: 'FREESHIP',
      type: CouponType.FREE_SHIPPING,
      value: 0,
      minPurchase: 30,
      description: 'Free shipping on orders above $30',
      isActive: true,
    },
    {
      code: 'SAVE15',
      type: CouponType.FIXED_AMOUNT,
      value: 15,
      minPurchase: 50,
      description: '$15 off on orders above $50',
      isActive: true,
    },
  ];

  validateCoupon(code: string, subtotal: number): Coupon | null {
    const coupon = this.coupons.find(
      (c) => c.code === code.toUpperCase() && c.isActive
    );

    if (!coupon) {
      return null;
    }

    if (coupon.minPurchase && subtotal < coupon.minPurchase) {
      return null;
    }

    if (coupon.expiryDate && new Date() > new Date(coupon.expiryDate)) {
      return null;
    }

    return coupon;
  }

  calculateDiscount(coupon: Coupon, subtotal: number): number {
    switch (coupon.type) {
      case CouponType.PERCENTAGE:
        const discount = (subtotal * coupon.value) / 100;
        return coupon.maxDiscount
          ? Math.min(discount, coupon.maxDiscount)
          : discount;

      case CouponType.FIXED_AMOUNT:
        return Math.min(coupon.value, subtotal);

      case CouponType.FREE_SHIPPING:
        return 0; // Shipping discount is handled separately

      default:
        return 0;
    }
  }
}
