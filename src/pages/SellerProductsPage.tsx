
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Product, ProductCategory } from "@/models/Product";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Edit, 
  Plus, 
  Search,
  Trash2
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { productService, realtimeService } from '@/lib/firestore';
import { Product as FirestoreProduct } from '@/models/firestoreSchemas';

export default function SellerProductsPage() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Helper: Map Firestore Product to App Product
  function mapFirestoreProductToAppProduct(fProduct: FirestoreProduct): Product {
    return {
      id: fProduct.id!,
      name: fProduct.name,
      nameAr: undefined, // Not present in Firestore
      description: fProduct.description || '',
      descriptionAr: undefined, // Not present in Firestore
      price: fProduct.price,
      category: fProduct.category as ProductCategory,
      image: fProduct.imageUrl,
      images: fProduct.images || [fProduct.imageUrl],
      rating: 5, // Default or fetch from reviews if available
      inStock: 1, // Not present in Firestore, default to 1
      sellerId: fProduct.ownerId,
      sellerName: fProduct.ownerName || '',
      reviewCount: 0, // Not present in Firestore
      featured: false, // Not present in Firestore
      popular: false, // Not present in Firestore
      currency: 'USD', // Default
      createdAt: new Date(fProduct.createdAt),
      isReserved: fProduct.isReserved,
      downPaymentRequired: !!fProduct.reservationPrice,
      manufacturingType: undefined // Not present in Firestore
    };
  }

  // Fetch seller's products in real-time from Firestore
  useEffect(() => {
    if (!user) return;
    productService.getProductsByOwner(user.id).then(firestoreProducts => {
      setProducts(firestoreProducts.map(mapFirestoreProductToAppProduct));
    });
  }, [user]);

  // Filter products by search term
  const sellerProducts = products.filter(
    (product) => 
      (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.nameAr && product.nameAr.includes(searchTerm)))
  );

  const handleAddProduct = () => {
    navigate('/add-product');
  };

  const handleEditProduct = (productId: string) => {
    // In a real app, navigate to an edit product page with the product ID
    toast({
      title: language === 'en' ? "Edit Product" : "تعديل المنتج",
      description: language === 'en' 
        ? "This feature is coming soon!" 
        : "هذه الميزة قادمة قريباً!",
    });
  };

  const handleDeleteProduct = (productId: string) => {
    // In a real app, this would call an API to delete the product
    const index = products.findIndex(product => product.id === productId);
    if (index !== -1) {
      const deletedProduct = {...products[index]};
      products.splice(index, 1);
      
      toast({
        title: language === 'en' ? "Product Deleted" : "تم حذف المنتج",
        description: language === 'en' 
          ? `${deletedProduct.name} has been deleted.` 
          : `تم حذف ${deletedProduct.nameAr || deletedProduct.name}.`,
      });
    }
  };

  return (
    <PageLayout>
      <div className="container mx-auto py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold">
            {language === "en" ? "My Products" : "منتجاتي"}
          </h1>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={language === "en" ? "Search products..." : "البحث عن منتجات..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button onClick={handleAddProduct}>
              <Plus className="h-4 w-4 mr-2" />
              {language === "en" ? "Add Product" : "إضافة منتج"}
            </Button>
          </div>
        </div>

        {sellerProducts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-muted-foreground text-center">
                <p className="text-lg mb-2">
                  {language === "en" 
                    ? "You don't have any products yet" 
                    : "ليس لديك أي منتجات بعد"}
                </p>
                <p className="mb-6">
                  {language === "en"
                    ? "Start by adding your first product"
                    : "ابدأ بإضافة منتجك الأول"}
                </p>
                <Button onClick={handleAddProduct}>
                  <Plus className="h-4 w-4 mr-2" />
                  {language === "en" ? "Add Product" : "إضافة منتج"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sellerProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={() => handleEditProduct(product.id)}
                onDelete={() => handleDeleteProduct(product.id)}
                language={language}
              />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}

interface ProductCardProps {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
  language: string;
}

function ProductCard({ product, onEdit, onDelete, language }: ProductCardProps) {
  return (
    <Card>
      <div className="relative h-48 overflow-hidden rounded-t-lg">
        <img
          src={product.image}
          alt={language === "en" ? product.name : product.nameAr || product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">
          {language === "en" ? product.name : product.nameAr || product.name}
        </CardTitle>
        <CardDescription>
          ${product.price.toFixed(2)} • {language === "en" ? "In Stock" : "متوفر"}: {product.inStock}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {language === "en"
            ? product.description
            : product.descriptionAr || product.description}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit className="h-4 w-4 mr-2" />
          {language === "en" ? "Edit" : "تعديل"}
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          <Trash2 className="h-4 w-4 mr-2" />
          {language === "en" ? "Delete" : "حذف"}
        </Button>
      </CardFooter>
    </Card>
  );
}
