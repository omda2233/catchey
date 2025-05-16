
export type ProductCategory = 'fabrics' | 'accessories' | 'tools' | 'threads';

export interface Product {
  id: string;
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  price: number;
  currency: 'USD' | 'SAR';
  images: string[];
  category: ProductCategory;
  sellerId: string;
  sellerName: string;
  rating: number;
  reviewCount: number;
  inStock: number;
  featured?: boolean;
  popular?: boolean;
  createdAt: Date;
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Premium Silk Fabric',
    nameAr: 'قماش حرير فاخر',
    description: 'High-quality silk fabric with a smooth texture, perfect for luxury garments.',
    descriptionAr: 'قماش حرير عالي الجودة بنسيج ناعم، مثالي للملابس الفاخرة.',
    price: 79.99,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1603513492128-ba7bc9b3e143?q=80&w=2069&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1592913924587-20eab453f30c?q=80&w=1932&auto=format&fit=crop',
    ],
    category: 'fabrics',
    sellerId: '2',
    sellerName: 'Sarah Seller',
    rating: 4.8,
    reviewCount: 42,
    inStock: 24,
    featured: true,
    popular: true,
    createdAt: new Date('2023-04-15'),
  },
  {
    id: '2',
    name: 'Cotton Canvas',
    nameAr: 'قماش قطن كانفاس',
    description: 'Durable cotton canvas fabric, ideal for tote bags, upholstery, and crafts.',
    descriptionAr: 'قماش قطن كانفاس متين، مثالي لحقائب التسوق والمفروشات والحرف اليدوية.',
    price: 24.50,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1585051118204-764ba4b434f5?q=80&w=1974&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1612173214369-14ed4e969772?q=80&w=1974&auto=format&fit=crop',
    ],
    category: 'fabrics',
    sellerId: '2',
    sellerName: 'Sarah Seller',
    rating: 4.5,
    reviewCount: 28,
    inStock: 56,
    popular: true,
    createdAt: new Date('2023-05-20'),
  },
  {
    id: '3',
    name: 'Embroidery Hoop Set',
    nameAr: 'مجموعة أطواق تطريز',
    description: 'Set of 5 embroidery hoops in different sizes, made from quality bamboo.',
    descriptionAr: 'مجموعة من 5 أطواق تطريز بأحجام مختلفة، مصنوعة من الخيزران عالي الجودة.',
    price: 18.99,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1559297434-fae8a1916a79?q=80&w=1974&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1554158217-6f494f01544d?q=80&w=1964&auto=format&fit=crop',
    ],
    category: 'tools',
    sellerId: '2',
    sellerName: 'Sarah Seller',
    rating: 4.7,
    reviewCount: 65,
    inStock: 32,
    featured: true,
    createdAt: new Date('2023-03-10'),
  },
  {
    id: '4',
    name: 'Metallic Gold Thread',
    nameAr: 'خيط ذهبي معدني',
    description: 'Premium metallic gold thread for embellishment and decorative stitching.',
    descriptionAr: 'خيط ذهبي معدني ممتاز للتزيين والخياطة الزخرفية.',
    price: 12.75,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1597484662317-c93a1140151f?q=80&w=1974&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1578445339099-3b6c4c34768c?q=80&w=2071&auto=format&fit=crop',
    ],
    category: 'threads',
    sellerId: '2',
    sellerName: 'Sarah Seller',
    rating: 4.6,
    reviewCount: 37,
    inStock: 48,
    popular: true,
    createdAt: new Date('2023-06-05'),
  },
  {
    id: '5',
    name: 'Decorative Buttons',
    nameAr: 'أزرار زخرفية',
    description: 'Set of 24 assorted decorative buttons in various designs and colors.',
    descriptionAr: 'مجموعة من 24 زراً زخرفياً متنوعاً بتصاميم وألوان مختلفة.',
    price: 9.99,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1602293589930-45aad59ba3ab?q=80&w=1974&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519278454-04c1eb01b184?q=80&w=1974&auto=format&fit=crop',
    ],
    category: 'accessories',
    sellerId: '2',
    sellerName: 'Sarah Seller',
    rating: 4.4,
    reviewCount: 53,
    inStock: 120,
    featured: true,
    createdAt: new Date('2023-02-28'),
  },
  {
    id: '6',
    name: 'Professional Sewing Scissors',
    nameAr: 'مقص خياطة احترافي',
    description: 'Sharp, durable stainless steel scissors for precise fabric cutting.',
    descriptionAr: 'مقص حاد ومتين من الفولاذ المقاوم للصدأ لقص الأقمشة بدقة.',
    price: 34.50,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=1974&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1585238327658-7d388ca0de25?q=80&w=1974&auto=format&fit=crop',
    ],
    category: 'tools',
    sellerId: '2',
    sellerName: 'Sarah Seller',
    rating: 4.9,
    reviewCount: 89,
    inStock: 15,
    popular: true,
    createdAt: new Date('2023-01-15'),
  },
  {
    id: '7',
    name: 'Linen Blend Fabric',
    nameAr: 'قماش مزيج الكتان',
    description: 'Natural linen blend fabric with a textured finish, ideal for summer clothing.',
    descriptionAr: 'قماش مزيج الكتان الطبيعي بتشطيب نسيجي، مثالي لملابس الصيف.',
    price: 42.25,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1603512500383-f1f87c13ffc4?q=80&w=2069&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1598112152367-8f27a5f417c4?q=80&w=2070&auto=format&fit=crop',
    ],
    category: 'fabrics',
    sellerId: '2',
    sellerName: 'Sarah Seller',
    rating: 4.6,
    reviewCount: 41,
    inStock: 28,
    createdAt: new Date('2023-07-20'),
  },
  {
    id: '8',
    name: 'Rhinestone Appliqué',
    nameAr: 'تطريز بالأحجار اللامعة',
    description: 'Elegant rhinestone appliqué for adding sparkle to garments and accessories.',
    descriptionAr: 'تطريز أنيق بالأحجار اللامعة لإضافة لمعان للملابس والإكسسوارات.',
    price: 15.99,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1551135020-39e4ca508e33?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?q=80&w=1974&auto=format&fit=crop',
    ],
    category: 'accessories',
    sellerId: '2',
    sellerName: 'Sarah Seller',
    rating: 4.7,
    reviewCount: 36,
    inStock: 42,
    featured: true,
    createdAt: new Date('2023-08-05'),
  }
];
