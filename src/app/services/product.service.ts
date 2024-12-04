import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Product,
  ProductCategory,
  DealType,
  ProductDeal,
  ProductDetails,
  ProductRating,
  ProductReview,
} from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly LOW_STOCK_THRESHOLD = 5;
  private readonly STOCK_UPDATE_INTERVAL = 30000; // 30 seconds

  private products: Product[] = [
    {
      id: '1',
      name: 'Fresh Apples',
      description: 'Sweet and crispy red apples',
      price: 2.99,
      image: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2',
      category: ProductCategory.FRUITS,
      inStock: true,
      stockCount: 15,
      deal: {
        type: DealType.PERCENTAGE_OFF,
        discount: 20,
        endDate: new Date(Date.now() + 86400000), // 24 hours from now
        description: '20% off today!',
      },
      originalPrice: 2.99,
      ...this.generateDefaultProductDetails('Apples', "Nature's Best"),
    },
    {
      id: '2',
      name: 'Organic Bananas',
      description: 'Ripe organic bananas',
      price: 1.99,
      image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e',
      category: ProductCategory.FRUITS,
      inStock: true,
      stockCount: 10,
      deal: {
        type: DealType.FIXED_AMOUNT_OFF,
        discount: 0.5,
        endDate: new Date(Date.now() + 86400000), // 24 hours from now
        description: '0.5 off today!',
      },
      originalPrice: 1.99,
      ...this.generateDefaultProductDetails('Bananas', 'Organic Farms'),
    },
    {
      id: '3',
      name: 'Fresh Milk',
      description: 'Organic whole milk',
      price: 3.49,
      image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b',
      category: ProductCategory.DAIRY,
      inStock: true,
      stockCount: 8,
      deal: {
        type: DealType.BUY_ONE_GET_ONE,
        discount: 0,
        endDate: new Date(Date.now() + 86400000), // 24 hours from now
        description: 'Buy 1 get 1 free today!',
      },
      originalPrice: 3.49,
      ...this.generateDefaultProductDetails('Milk', 'Organic Farms'),
    },
    {
      id: '4',
      name: 'Organic Carrots',
      description: 'Fresh farm carrots',
      price: 1.49,
      image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37',
      category: ProductCategory.VEGETABLES,
      inStock: true,
      stockCount: 12,
      deal: {
        type: DealType.BUNDLE_DEAL,
        discount: 0,
        endDate: new Date(Date.now() + 86400000), // 24 hours from now
        description: 'Buy 3 get 1 free today!',
      },
      originalPrice: 1.49,
      ...this.generateDefaultProductDetails('Carrots', 'Fresh Farms'),
    },
    {
      id: '5',
      name: 'Chicken Breast',
      description: 'Fresh boneless chicken breast',
      price: 5.99,
      image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791',
      category: ProductCategory.MEAT,
      inStock: true,
      stockCount: 6,
      deal: {
        type: DealType.PERCENTAGE_OFF,
        discount: 10,
        endDate: new Date(Date.now() + 86400000), // 24 hours from now
        description: '10% off today!',
      },
      originalPrice: 5.99,
      ...this.generateDefaultProductDetails('Chicken Breast', 'Local Farms'),
    },
    {
      id: '6',
      name: 'Coca Cola',
      description: '2L bottle of Coca Cola',
      price: 2.49,
      image: 'https://images.unsplash.com/photo-1629203851265-5e8cc3c1f40b',
      category: ProductCategory.BEVERAGES,
      inStock: true,
      stockCount: 18,
      deal: {
        type: DealType.FIXED_AMOUNT_OFF,
        discount: 0.5,
        endDate: new Date(Date.now() + 86400000), // 24 hours from now
        description: '0.5 off today!',
      },
      originalPrice: 2.49,
      ...this.generateDefaultProductDetails('Coca Cola', 'Local Beverages'),
    },
    {
      id: '7',
      name: 'Potato Chips',
      description: 'Classic salted potato chips',
      price: 3.99,
      image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b',
      category: ProductCategory.SNACKS,
      inStock: true,
      stockCount: 20,
      deal: {
        type: DealType.BUY_ONE_GET_ONE,
        discount: 0,
        endDate: new Date(Date.now() + 86400000), // 24 hours from now
        description: 'Buy 1 get 1 free today!',
      },
      originalPrice: 3.99,
      ...this.generateDefaultProductDetails('Potato Chips', 'Local Snacks'),
    },
    {
      id: '8',
      name: 'Fresh Bread',
      description: 'Freshly baked whole wheat bread',
      price: 2.99,
      image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73',
      category: ProductCategory.BAKERY,
      inStock: true,
      stockCount: 10,
      deal: {
        type: DealType.BUNDLE_DEAL,
        discount: 0,
        endDate: new Date(Date.now() + 86400000), // 24 hours from now
        description: 'Buy 3 get 1 free today!',
      },
      originalPrice: 2.99,
      ...this.generateDefaultProductDetails('Fresh Bread', 'Local Bakery'),
    },
    {
      id: '9',
      name: 'Cleaning Spray',
      description: 'All-purpose cleaning spray',
      price: 4.99,
      image: 'https://images.unsplash.com/photo-1585842378054-ee2e52f94ba2',
      category: ProductCategory.HOUSEHOLD,
      inStock: true,
      stockCount: 15,
      deal: {
        type: DealType.PERCENTAGE_OFF,
        discount: 15,
        endDate: new Date(Date.now() + 86400000), // 24 hours from now
        description: '15% off today!',
      },
      originalPrice: 4.99,
      ...this.generateDefaultProductDetails(
        'Cleaning Spray',
        'Local Household'
      ),
    },
    {
      id: '10',
      name: 'Fresh Tomatoes',
      description: 'Ripe red tomatoes',
      price: 2.49,
      image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337',
      category: ProductCategory.VEGETABLES,
      inStock: true,
      stockCount: 18,
      deal: {
        type: DealType.BUY_ONE_GET_ONE,
        discount: 0,
        endDate: new Date(Date.now() + 86400000), // 24 hours from now
        description: 'Buy 1 get 1 free today!',
      },
      originalPrice: 2.49,
      ...this.generateDefaultProductDetails('Fresh Tomatoes', 'Local Farms'),
    },
    {
      id: '11',
      name: 'Orange Juice',
      description: 'Fresh squeezed orange juice',
      price: 4.99,
      image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba',
      category: ProductCategory.BEVERAGES,
      inStock: true,
      stockCount: 12,
      deal: {
        type: DealType.FIXED_AMOUNT_OFF,
        discount: 0.5,
        endDate: new Date(Date.now() + 86400000), // 24 hours from now
        description: '0.5 off today!',
      },
      originalPrice: 4.99,
      ...this.generateDefaultProductDetails('Orange Juice', 'Local Beverages'),
    },
    {
      id: '12',
      name: 'Greek Yogurt',
      description: 'Plain Greek yogurt',
      price: 3.99,
      image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777',
      category: ProductCategory.DAIRY,
      inStock: true,
      stockCount: 10,
      deal: {
        type: DealType.BUY_ONE_GET_ONE,
        discount: 0,
        endDate: new Date(Date.now() + 86400000), // 24 hours from now
        description: 'Buy 1 get 1 free today!',
      },
      originalPrice: 3.99,
      ...this.generateDefaultProductDetails('Greek Yogurt', 'Local Dairy'),
    },
    {
      id: '13',
      name: 'Fresh Strawberries',
      description: 'Sweet organic strawberries',
      price: 4.99,
      image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6',
      category: ProductCategory.FRUITS,
      inStock: true,
      stockCount: 15,
      deal: {
        type: DealType.BUNDLE_DEAL,
        discount: 0,
        endDate: new Date(Date.now() + 86400000), // 24 hours from now
        description: 'Buy 3 get 1 free today!',
      },
      originalPrice: 4.99,
      ...this.generateDefaultProductDetails(
        'Fresh Strawberries',
        'Local Farms'
      ),
    },
    {
      id: '14',
      name: 'Broccoli',
      description: 'Fresh green broccoli',
      price: 2.49,
      image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc',
      category: ProductCategory.VEGETABLES,
      inStock: true,
      stockCount: 18,
      deal: {
        type: DealType.PERCENTAGE_OFF,
        discount: 10,
        endDate: new Date(Date.now() + 86400000), // 24 hours from now
        description: '10% off today!',
      },
      originalPrice: 2.49,
      ...this.generateDefaultProductDetails('Broccoli', 'Local Farms'),
    },
    {
      id: '15',
      name: 'Cheddar Cheese',
      description: 'Aged cheddar cheese',
      price: 5.99,
      image: 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c',
      category: ProductCategory.DAIRY,
      inStock: true,
      stockCount: 12,
      deal: {
        type: DealType.BUY_ONE_GET_ONE,
        discount: 0,
        endDate: new Date(Date.now() + 86400000), // 24 hours from now
        description: 'Buy 1 get 1 free today!',
      },
      originalPrice: 5.99,
      ...this.generateDefaultProductDetails('Cheddar Cheese', 'Local Dairy'),
    },
    {
      id: '16',
      name: 'Ground Beef',
      description: 'Fresh lean ground beef',
      price: 6.99,
      image: 'https://images.unsplash.com/photo-1588347785102-2944e0a3c614',
      category: ProductCategory.MEAT,
      inStock: true,
      stockCount: 8,
      deal: {
        type: DealType.BUNDLE_DEAL,
        discount: 0,
        endDate: new Date(Date.now() + 86400000), // 24 hours from now
        description: 'Buy 3 get 1 free today!',
      },
      originalPrice: 6.99,
      ...this.generateDefaultProductDetails('Ground Beef', 'Local Farms'),
    },
    {
      id: '17',
      name: 'Mineral Water',
      description: 'Sparkling mineral water',
      price: 1.99,
      image: 'https://images.unsplash.com/photo-1560023907-5f339617ea30',
      category: ProductCategory.BEVERAGES,
      inStock: true,
      stockCount: 20,
      deal: {
        type: DealType.FIXED_AMOUNT_OFF,
        discount: 0.5,
        endDate: new Date(Date.now() + 86400000), // 24 hours from now
        description: '0.5 off today!',
      },
      originalPrice: 1.99,
      ...this.generateDefaultProductDetails('Mineral Water', 'Local Beverages'),
    },
    {
      id: '18',
      name: 'Chocolate Bar',
      description: 'Dark chocolate bar',
      price: 3.49,
      image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919',
      category: ProductCategory.SNACKS,
      inStock: true,
      stockCount: 10,
      deal: {
        type: DealType.BUY_ONE_GET_ONE,
        discount: 0,
        endDate: new Date(Date.now() + 86400000), // 24 hours from now
        description: 'Buy 1 get 1 free today!',
      },
      originalPrice: 3.49,
      ...this.generateDefaultProductDetails('Chocolate Bar', 'Local Snacks'),
    },
    {
      id: '19',
      name: 'Croissants',
      description: 'Freshly baked butter croissants',
      price: 4.99,
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a',
      category: ProductCategory.BAKERY,
      inStock: true,
      stockCount: 15,
      deal: {
        type: DealType.BUNDLE_DEAL,
        discount: 0,
        endDate: new Date(Date.now() + 86400000), // 24 hours from now
        description: 'Buy 3 get 1 free today!',
      },
      originalPrice: 4.99,
      ...this.generateDefaultProductDetails('Croissants', 'Local Bakery'),
    },
    {
      id: '20',
      name: 'Laundry Detergent',
      description: 'Fresh scent laundry detergent',
      price: 8.99,
      image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce',
      category: ProductCategory.HOUSEHOLD,
      inStock: true,
      stockCount: 12,
      deal: {
        type: DealType.PERCENTAGE_OFF,
        discount: 10,
        endDate: new Date(Date.now() + 86400000), // 24 hours from now
        description: '10% off today!',
      },
      originalPrice: 8.99,
      ...this.generateDefaultProductDetails(
        'Laundry Detergent',
        'Local Household'
      ),
    },
    {
      id: '21',
      name: 'Avocados',
      description: 'Ripe Hass avocados',
      price: 2.99,
      image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578',
      category: ProductCategory.VEGETABLES,
      inStock: true,
      stockCount: 18,
      deal: {
        type: DealType.FIXED_AMOUNT_OFF,
        discount: 0.5,
        endDate: new Date(Date.now() + 86400000), // 24 hours from now
        description: '0.5 off today!',
      },
      originalPrice: 2.99,
      ...this.generateDefaultProductDetails('Avocados', 'Local Farms'),
    },
    {
      id: '22',
      name: 'Green Tea',
      description: 'Organic green tea bags',
      price: 4.49,
      image: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5',
      category: ProductCategory.BEVERAGES,
      inStock: true,
      stockCount: 10,
      deal: {
        type: DealType.BUY_ONE_GET_ONE,
        discount: 0,
        endDate: new Date(Date.now() + 86400000), // 24 hours from now
        description: 'Buy 1 get 1 free today!',
      },
      originalPrice: 4.49,
      ...this.generateDefaultProductDetails('Green Tea', 'Local Beverages'),
    },
    {
      id: '23',
      name: 'Salmon Fillet',
      description: 'Fresh Atlantic salmon',
      price: 12.99,
      image: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6',
      category: ProductCategory.MEAT,
      inStock: true,
      stockCount: 6,
      deal: {
        type: DealType.BUNDLE_DEAL,
        discount: 0,
        endDate: new Date(Date.now() + 86400000), // 24 hours from now
        description: 'Buy 3 get 1 free today!',
      },
      originalPrice: 12.99,
      ...this.generateDefaultProductDetails('Salmon Fillet', 'Local Farms'),
    },
    {
      id: '24',
      name: 'Paper Towels',
      description: 'Multi-purpose paper towels',
      price: 5.99,
      image: 'https://images.unsplash.com/photo-1583947581924-860bda3c4083',
      category: ProductCategory.HOUSEHOLD,
      inStock: true,
      stockCount: 15,
      deal: {
        type: DealType.PERCENTAGE_OFF,
        discount: 10,
        endDate: new Date(Date.now() + 86400000), // 24 hours from now
        description: '10% off today!',
      },
      originalPrice: 5.99,
      ...this.generateDefaultProductDetails('Paper Towels', 'Local Household'),
    },
    {
      id: '25',
      name: 'Blueberry Muffins',
      description: 'Fresh baked blueberry muffins',
      price: 4.99,
      image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa',
      category: ProductCategory.BAKERY,
      inStock: true,
      stockCount: 12,
      deal: {
        type: DealType.BUY_ONE_GET_ONE,
        discount: 0,
        endDate: new Date(Date.now() + 86400000), // 24 hours from now
        description: 'Buy 1 get 1 free today!',
      },
      originalPrice: 4.99,
      ...this.generateDefaultProductDetails(
        'Blueberry Muffins',
        'Local Bakery'
      ),
    },
    {
      id: '26',
      name: 'Mixed Nuts',
      description: 'Roasted mixed nuts',
      price: 6.99,
      image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32',
      category: ProductCategory.SNACKS,
      inStock: true,
      stockCount: 18,
      deal: {
        type: DealType.BUNDLE_DEAL,
        discount: 0,
        endDate: new Date(Date.now() + 86400000), // 24 hours from now
        description: 'Buy 3 get 1 free today!',
      },
      originalPrice: 6.99,
      ...this.generateDefaultProductDetails('Mixed Nuts', 'Local Snacks'),
    },
    {
      id: '27',
      name: 'Butter',
      description: 'Unsalted pure butter',
      price: 4.49,
      image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d',
      category: ProductCategory.DAIRY,
      inStock: true,
      stockCount: 10,
      deal: {
        type: DealType.FIXED_AMOUNT_OFF,
        discount: 0.5,
        endDate: new Date(Date.now() + 86400000), // 24 hours from now
        description: '0.5 off today!',
      },
      originalPrice: 4.49,
      ...this.generateDefaultProductDetails('Butter', 'Local Dairy'),
    },
    {
      id: '28',
      name: 'Mangoes',
      description: 'Sweet ripe mangoes',
      price: 2.99,
      image: 'https://images.unsplash.com/photo-1553279768-865429fa0078',
      category: ProductCategory.FRUITS,
      inStock: true,
      stockCount: 15,
      deal: {
        type: DealType.BUY_ONE_GET_ONE,
        discount: 0,
        endDate: new Date(Date.now() + 86400000), // 24 hours from now
        description: 'Buy 1 get 1 free today!',
      },
      originalPrice: 2.99,
      ...this.generateDefaultProductDetails('Mangoes', 'Local Farms'),
    },
  ];

  private productsSubject = new BehaviorSubject<Product[]>(this.products);

  constructor() {
    this.simulateStockUpdates();
  }

  private simulateStockUpdates() {
    interval(this.STOCK_UPDATE_INTERVAL).subscribe(() => {
      this.products = this.products.map((product) => ({
        ...product,
        stockCount: this.updateStockCount(product.stockCount),
        inStock: this.updateStockCount(product.stockCount) > 0,
      }));
      this.productsSubject.next(this.products);
    });
  }

  private updateStockCount(currentStock: number): number {
    // Randomly increase or decrease stock
    const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
    return Math.max(0, Math.min(20, currentStock + change));
  }

  isLowStock(product: Product): boolean {
    return (
      product.stockCount <= this.LOW_STOCK_THRESHOLD && product.stockCount > 0
    );
  }

  getDiscountedPrice(product: Product): number {
    if (!product.deal) return product.price;

    switch (product.deal.type) {
      case DealType.PERCENTAGE_OFF:
        return product.price * (1 - product.deal.discount / 100);
      case DealType.FIXED_AMOUNT_OFF:
        return Math.max(0, product.price - product.deal.discount);
      default:
        return product.price;
    }
  }

  isDealExpired(deal: ProductDeal): boolean {
    return new Date() > new Date(deal.endDate);
  }

  getProducts(): Observable<Product[]> {
    return this.productsSubject.asObservable().pipe(
      map((products) =>
        products.map((product) => ({
          ...product,
          price: this.getDiscountedPrice(product),
        }))
      )
    );
  }

  getProductsByCategory(category: ProductCategory): Observable<Product[]> {
    const filteredProducts = this.products.filter(
      (product) => product.category === category
    );
    return new BehaviorSubject<Product[]>(filteredProducts).asObservable();
  }

  searchProducts(query: string): Observable<Product[]> {
    const filteredProducts = this.products.filter(
      (product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
    );
    return new BehaviorSubject<Product[]>(filteredProducts).asObservable();
  }

  private generateDefaultProductDetails(
    name: string,
    brand: string
  ): {
    details: ProductDetails;
    ratings: ProductRating;
    reviews: ProductReview[];
  } {
    return {
      details: {
        brand: brand,
        weight: '1',
        unit: 'kg',
        origin: 'Local',
        storage: 'Store in a cool, dry place',
        shelfLife: '2 weeks',
        allergens: [],
        ingredients: [name],
      },
      ratings: {
        average: 4.5,
        count: 128,
        distribution: {
          1: 2,
          2: 4,
          3: 12,
          4: 38,
          5: 72,
        },
      },
      reviews: [
        {
          id: '1',
          userId: 'user1',
          userName: 'John D.',
          rating: 5,
          comment: `Great quality ${name.toLowerCase()}. Will buy again!`,
          date: new Date('2024-01-15'),
          helpful: 12,
          verified: true,
        },
      ],
    };
  }
}
