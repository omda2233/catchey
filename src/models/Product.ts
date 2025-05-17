
export interface Product {
  id: string;
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  inStock: boolean;
  sellerId: string;
  sellerName: string;
}
