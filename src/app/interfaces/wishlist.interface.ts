export interface WishlistItem {
  productId: string;
  dateAdded: Date;
}

export interface UserWishlist {
  userId: string;
  items: WishlistItem[];
}
