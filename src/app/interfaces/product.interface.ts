export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: ProductCategory;
  inStock: boolean;
  quantity?: number;
  stockCount: number;
  deal?: ProductDeal;
  originalPrice?: number;
  details: ProductDetails;
  ratings: ProductRating;
  reviews: ProductReview[];
  nutritionInfo?: NutritionInfo;
}

export enum ProductCategory {
  FRUITS = 'Fruits',
  VEGETABLES = 'Vegetables',
  DAIRY = 'Dairy',
  MEAT = 'Meat',
  BEVERAGES = 'Beverages',
  SNACKS = 'Snacks',
  BAKERY = 'Bakery',
  HOUSEHOLD = 'Household',
}

export interface ProductDeal {
  type: DealType;
  discount: number;
  endDate: Date;
  description: string;
}

export enum DealType {
  PERCENTAGE_OFF = 'PERCENTAGE_OFF',
  FIXED_AMOUNT_OFF = 'FIXED_AMOUNT_OFF',
  BUY_ONE_GET_ONE = 'BUY_ONE_GET_ONE',
  BUNDLE_DEAL = 'BUNDLE_DEAL',
}

export interface ProductDetails {
  brand: string;
  weight?: string;
  unit?: string;
  origin?: string;
  allergens?: string[];
  ingredients?: string[];
  storage?: string;
  shelfLife?: string;
}

export interface ProductRating {
  average: number;
  count: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
}

export interface ProductReview {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: Date;
  helpful: number;
  images?: string[];
  verified: boolean;
}

export interface NutritionInfo {
  servingSize: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}
