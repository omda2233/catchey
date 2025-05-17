
export type ProductCategory = 'fabrics' | 'accessories' | 'tools' | 'threads';

export interface Product {
  id: string;
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  price: number;
  category: ProductCategory;
  image: string;
  images: string[]; // Adding images array
  rating: number;
  inStock: number; // Changed from boolean to number
  sellerId: string;
  sellerName: string;
  reviewCount: number; // Added reviewCount
  featured?: boolean; // Added featured flag
  popular?: boolean; // Added popular flag
  currency?: string; // Added currency
  createdAt: Date; // Added createdAt
}

// Mock products data for development
export const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Premium Cotton Fabric",
    nameAr: "قماش قطني فاخر",
    description: "High-quality cotton fabric ideal for dresses and shirts.",
    descriptionAr: "قماش قطني عالي الجودة مثالي للفساتين والقمصان.",
    price: 24.99,
    category: "fabrics",
    image: "https://placehold.co/800x600/1A1F2C/E6B54A?text=Cotton+Fabric",
    images: [
      "https://placehold.co/800x600/1A1F2C/E6B54A?text=Cotton+Fabric",
      "https://placehold.co/800x600/1A1F2C/E6B54A?text=Cotton+Detail"
    ],
    rating: 4.5,
    inStock: 25,
    sellerId: "seller-1",
    sellerName: "Fabrics World",
    reviewCount: 85,
    featured: true,
    popular: true,
    currency: "USD",
    createdAt: new Date("2024-01-15")
  },
  {
    id: "prod-2",
    name: "Silk Fabric Roll",
    nameAr: "لفة قماش حرير",
    description: "Luxurious silk fabric for elegant garments and accessories.",
    descriptionAr: "قماش حرير فاخر للملابس والإكسسوارات الأنيقة.",
    price: 49.99,
    category: "fabrics",
    image: "https://placehold.co/800x600/1A1F2C/E6B54A?text=Silk+Fabric",
    images: [
      "https://placehold.co/800x600/1A1F2C/E6B54A?text=Silk+Fabric",
      "https://placehold.co/800x600/1A1F2C/E6B54A?text=Silk+Detail"
    ],
    rating: 4.8,
    inStock: 15,
    sellerId: "seller-2",
    sellerName: "Luxury Fabrics",
    reviewCount: 62,
    featured: false,
    popular: true,
    currency: "USD",
    createdAt: new Date("2024-02-03")
  },
  {
    id: "prod-3",
    name: "Sewing Needle Set",
    nameAr: "مجموعة إبر خياطة",
    description: "Professional sewing needles for all types of fabrics.",
    descriptionAr: "إبر خياطة احترافية لجميع أنواع الأقمشة.",
    price: 12.50,
    category: "tools",
    image: "https://placehold.co/800x600/1A1F2C/E6B54A?text=Needle+Set",
    images: [
      "https://placehold.co/800x600/1A1F2C/E6B54A?text=Needle+Set",
      "https://placehold.co/800x600/1A1F2C/E6B54A?text=Needle+Detail"
    ],
    rating: 4.2,
    inStock: 50,
    sellerId: "seller-3",
    sellerName: "Sewing Tools",
    reviewCount: 128,
    featured: false,
    popular: false,
    currency: "USD",
    createdAt: new Date("2024-01-28")
  },
  {
    id: "prod-4",
    name: "Golden Buttons",
    nameAr: "أزرار ذهبية",
    description: "Decorative golden buttons for adding elegance to garments.",
    descriptionAr: "أزرار ذهبية زخرفية لإضافة الأناقة للملابس.",
    price: 8.99,
    category: "accessories",
    image: "https://placehold.co/800x600/1A1F2C/E6B54A?text=Golden+Buttons",
    images: [
      "https://placehold.co/800x600/1A1F2C/E6B54A?text=Golden+Buttons",
      "https://placehold.co/800x600/1A1F2C/E6B54A?text=Button+Detail"
    ],
    rating: 4.7,
    inStock: 100,
    sellerId: "seller-1",
    sellerName: "Fabrics World",
    reviewCount: 42,
    featured: true,
    popular: false,
    currency: "USD",
    createdAt: new Date("2024-03-01")
  },
  {
    id: "prod-5",
    name: "Colorful Thread Pack",
    nameAr: "حزمة خيوط ملونة",
    description: "Set of 24 different colored threads for all your sewing needs.",
    descriptionAr: "مجموعة من 24 خيطًا بألوان مختلفة لجميع احتياجات الخياطة.",
    price: 15.99,
    category: "threads",
    image: "https://placehold.co/800x600/1A1F2C/E6B54A?text=Thread+Pack",
    images: [
      "https://placehold.co/800x600/1A1F2C/E6B54A?text=Thread+Pack",
      "https://placehold.co/800x600/1A1F2C/E6B54A?text=Thread+Detail"
    ],
    rating: 4.9,
    inStock: 30,
    sellerId: "seller-2",
    sellerName: "Luxury Fabrics",
    reviewCount: 75,
    featured: false,
    popular: true,
    currency: "USD",
    createdAt: new Date("2024-02-15")
  }
];
