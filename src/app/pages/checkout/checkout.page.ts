import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  LoadingController,
  ToastController,
  ActionSheetController,
} from '@ionic/angular';
import { CartService } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import {
  AddressService,
  GeocodingResult,
} from '../../services/address.service';
import {
  PaymentMethod,
  CheckoutData,
} from '../../interfaces/payment.interface';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {
  checkoutForm: FormGroup;
  paymentMethods = Object.values(PaymentMethod);
  selectedPaymentMethod: PaymentMethod = PaymentMethod.CREDIT_CARD;
  sameAsShipping: boolean = true;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private addressService: AddressService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private actionSheetController: ActionSheetController,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      shipping: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zipCode: ['', Validators.required],
        country: ['', Validators.required],
      }),
      billing: this.fb.group({
        street: [''],
        city: [''],
        state: [''],
        zipCode: [''],
        country: [''],
      }),
      payment: this.fb.group({
        cardNumber: ['', [Validators.required, Validators.minLength(16)]],
        expiryMonth: ['', Validators.required],
        expiryYear: ['', Validators.required],
        cvv: ['', [Validators.required, Validators.minLength(3)]],
        name: ['', Validators.required],
      }),
    });
  }

  ngOnInit() {
    this.cartService.getCart().subscribe((cart) => {
      if (cart.items.length === 0) {
        this.router.navigate(['/cart']);
      }
    });
  }

  onPaymentMethodChange(event: any) {
    const method = event.detail.value as PaymentMethod;
    this.selectedPaymentMethod = method;
    if (method !== PaymentMethod.CREDIT_CARD) {
      this.checkoutForm.get('payment')?.disable();
    } else {
      this.checkoutForm.get('payment')?.enable();
    }
  }

  onSameAsShippingChange() {
    if (this.sameAsShipping) {
      const shippingAddress = this.checkoutForm.get('shipping')?.value;
      this.checkoutForm.get('billing')?.patchValue(shippingAddress);
      this.checkoutForm.get('billing')?.disable();
    } else {
      this.checkoutForm.get('billing')?.enable();
    }
  }

  formatCardNumber(event: any) {
    let value = event.target.value.replace(/\s/g, '');
    event.target.value = this.checkoutService.formatCardNumber(value);
  }

  async submitOrder() {
    if (this.checkoutForm.invalid) {
      return;
    }

    const loading = await this.loadingController.create({
      message: this.getPaymentProcessingMessage(),
    });
    await loading.present();

    try {
      const formValue = this.checkoutForm.value;
      const checkoutData: CheckoutData = {
        paymentDetails: {
          method: this.selectedPaymentMethod,
          cardDetails:
            this.selectedPaymentMethod === PaymentMethod.CREDIT_CARD
              ? formValue.payment
              : undefined,
          billingAddress: this.sameAsShipping
            ? formValue.shipping
            : formValue.billing,
        },
        shippingAddress: formValue.shipping,
        sameAsShipping: this.sameAsShipping,
        email: formValue.email,
        phone: formValue.phone,
      };

      const success = await this.checkoutService.processPayment();
      await loading.dismiss();

      if (success) {
        const toast = await this.toastController.create({
          message: 'Order placed successfully!',
          duration: 2000,
          color: 'success',
        });
        await toast.present();
        this.router.navigate(['/shop']);
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      await loading.dismiss();
      const toast = await this.toastController.create({
        message: 'Payment failed. Please try again.',
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
    }
  }

  private getPaymentProcessingMessage(): string {
    switch (this.selectedPaymentMethod) {
      case PaymentMethod.CREDIT_CARD:
        return 'Processing credit card payment...';
      case PaymentMethod.PAYPAL:
        return 'Connecting to PayPal...';
      case PaymentMethod.APPLE_PAY:
        return 'Processing Apple Pay payment...';
      case PaymentMethod.GOOGLE_PAY:
        return 'Processing Google Pay payment...';
      default:
        return 'Processing payment...';
    }
  }

  async useCurrentLocation() {
    const loading = await this.loadingController.create({
      message: 'Getting your location...',
    });
    await loading.present();

    try {
      const position = await this.addressService.getCurrentLocation();
      const address = await this.addressService
        .reverseGeocode(position.coords.latitude, position.coords.longitude)
        .toPromise();

      if (address && this.addressService.validateAddress(address)) {
        this.checkoutForm.get('shipping')?.patchValue(address);
        if (this.sameAsShipping) {
          this.checkoutForm.get('billing')?.patchValue(address);
        }

        const toast = await this.toastController.create({
          message: 'Address updated successfully',
          duration: 2000,
          color: 'success',
        });
        await toast.present();
      } else {
        throw new Error('Invalid address');
      }
    } catch (error) {
      const toast = await this.toastController.create({
        message: 'Unable to get your location. Please enter manually.',
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
    } finally {
      loading.dismiss();
    }
  }

  async showSavedAddresses() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Saved Addresses',
      buttons: [
        {
          text: 'Home',
          handler: () => {
            this.useSavedAddress('home');
          },
        },
        {
          text: 'Work',
          handler: () => {
            this.useSavedAddress('work');
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }

  private async useSavedAddress(type: string) {
    // In a real app, you would fetch this from a backend
    const savedAddresses = {
      home: {
        street: '123 Home Street',
        city: 'Hometown',
        state: 'ST',
        zipCode: '12345',
        country: 'United States',
      },
      work: {
        street: '456 Work Avenue',
        city: 'Worktown',
        state: 'ST',
        zipCode: '67890',
        country: 'United States',
      },
    };

    const address = savedAddresses[type as keyof typeof savedAddresses];
    this.checkoutForm.get('shipping')?.patchValue(address);
    if (this.sameAsShipping) {
      this.checkoutForm.get('billing')?.patchValue(address);
    }
  }
}
