
export type ProductCategory = 'fabrics-and-accessories' | 'clothing-manufacturing';

export interface Product {
  id: string;
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  price: number;
  category: ProductCategory;
  image: string;
  images: string[];
  rating: number;
  inStock: number;
  sellerId: string;
  sellerName: string;
  reviewCount: number;
  featured?: boolean;
  popular?: boolean;
  currency?: string;
  createdAt: Date;
  isReserved?: boolean;
  downPaymentRequired?: boolean;
  manufacturingType?: 'manufacturing-for-others' | 'printing-services';
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
    category: "fabrics-and-accessories",
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
    name: "Embroidery Thread",
    nameAr: "خيوط التطريز",
    description: "High-quality embroidery thread for detailed work.",
    descriptionAr: "خيوط تطريز عالية الجودة للعمل الدقيق.",
    price: 12.99,
    category: "fabrics-and-accessories",
    image: "https://placehold.co/800x600/1A1F2C/E6B54A?text=Embroidery+Thread",
    images: [
      "https://placehold.co/800x600/1A1F2C/E6B54A?text=Embroidery+Thread",
      "https://placehold.co/800x600/1A1F2C/E6B54A?text=Thread+Detail"
    ],
    rating: 4.8,
    inStock: 100,
    sellerId: "seller-2",
    sellerName: "Thread Master",
    reviewCount: 120,
    featured: true,
    currency: "USD",
    createdAt: new Date("2024-01-10")
  },
  {
    id: "prod-3",
    name: "Custom Buttons",
    nameAr: "أزرار مخصصة",
    description: "Assorted set of decorative buttons for clothing.",
    descriptionAr: "مجموعة متنوعة من الأزرار الزخرفية للملابس.",
    price: 8.99,
    category: "fabrics-and-accessories",
    image: "https://placehold.co/800x600/1A1F2C/E6B54A?text=Buttons",
    images: [
      "https://placehold.co/800x600/1A1F2C/E6B54A?text=Buttons",
      "https://placehold.co/800x600/1A1F2C/E6B54A?text=Button+Detail"
    ],
    rating: 4.6,
    inStock: 50,
    sellerId: "seller-4",
    sellerName: "Button Boutique",
    reviewCount: 65,
    featured: true,
    currency: "USD",
    createdAt: new Date("2024-01-12")
  },
  {
    id: "prod-4",
    name: "Professional Clothing Manufacturing",
    nameAr: "تصنيع ملابس احترافي",
    description: "Complete clothing manufacturing services for businesses.",
    descriptionAr: "خدمات تصنيع ملابس كاملة للأعمال.",
    price: 999.99,
    category: "clothing-manufacturing",
    image: "https://placehold.co/800x600/1A1F2C/E6B54A?text=Manufacturing",
    images: [
      "https://placehold.co/800x600/1A1F2C/E6B54A?text=Manufacturing",
      "https://placehold.co/800x600/1A1F2C/E6B54A?text=Factory+Detail"
    ],
    rating: 4.9,
    inStock: 1,
    sellerId: "seller-5",
    sellerName: "Manufacturing Co.",
    reviewCount: 150,
    featured: true,
    manufacturingType: "manufacturing-for-others",
    currency: "USD",
    createdAt: new Date("2024-01-18")
  },
  {
    id: "prod-5",
    name: "Colorful Thread Pack",
    nameAr: "حزمة خيوط ملونة",
    description: "Set of 24 different colored threads for all your sewing needs.",
    descriptionAr: "مجموعة من 24 خيطًا بألوان مختلفة لجميع احتياجات الخياطة.",
    price: 15.99,
    category: "fabrics-and-accessories",
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
