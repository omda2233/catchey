
import React, { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Product, ProductCategory, MOCK_PRODUCTS } from "@/models/Product";

// Form schema for adding a product
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  nameAr: z.string().optional(),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  descriptionAr: z.string().optional(),
  price: z.coerce
    .number()
    .positive({
      message: "Price must be a positive number.",
    }),
  category: z.string(),
  inStock: z.coerce.number().int().positive({
    message: "Stock must be a positive number.",
  }),
  image: z.string().optional(),
});

export default function AddProductPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { toast } = useToast();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Check if user is a seller
  if (user?.role !== "seller") {
    navigate("/");
    return null;
  }

  // Initialize form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      nameAr: "",
      description: "",
      descriptionAr: "",
      price: 0,
      category: "fabrics",
      inStock: 1,
      image: "",
    },
  });

  // Mock function to handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // In a real app, we would upload the file to a storage service
      // For now, just create a data URL for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        form.setValue("image", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // In a real app, you would send this to your backend API
    // For demo purposes, we'll just simulate adding to mock data
    const newProduct: Product = {
      id: `prod-${Math.floor(Math.random() * 10000)}`,
      name: values.name,
      nameAr: values.nameAr || undefined,
      description: values.description,
      descriptionAr: values.descriptionAr || undefined,
      price: values.price,
      category: values.category as ProductCategory,
      image: values.image || "https://placehold.co/800x600/1A1F2C/E6B54A?text=Product",
      images: [values.image || "https://placehold.co/800x600/1A1F2C/E6B54A?text=Product"],
      rating: 5, // Default rating for new products
      inStock: values.inStock,
      sellerId: user.id,
      sellerName: user.name,
      reviewCount: 0,
      currency: "USD",
      createdAt: new Date(),
    };

    // Mock adding the product (in a real app, this would be an API call)
    MOCK_PRODUCTS.push(newProduct);

    toast({
      title: language === 'en' ? "Product Added" : "تمت إضافة المنتج",
      description: language === 'en' 
        ? `${newProduct.name} has been added to your products.` 
        : `تمت إضافة ${newProduct.nameAr || newProduct.name} إلى منتجاتك.`,
    });

    // Navigate back to seller products page
    navigate("/seller/products");
  };

  return (
    <PageLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">
          {language === "en" ? "Add New Product" : "إضافة منتج جديد"}
        </h1>

        <Card>
          <CardHeader>
            <CardTitle>
              {language === "en"
                ? "Product Information"
                : "معلومات المنتج"}
            </CardTitle>
            <CardDescription>
              {language === "en"
                ? "Enter the details for your new product"
                : "أدخل تفاصيل منتجك الجديد"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {language === "en" ? "Product Name" : "اسم المنتج"}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nameAr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {language === "en"
                        ? "Product Name (Arabic)"
                        : "اسم المنتج (بالعربية)"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="اسم المنتج بالعربية"
                        dir="rtl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {language === "en" ? "Price ($)" : "السعر ($)"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {language === "en" ? "Category" : "الفئة"}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="fabrics">
                          {language === "en" ? "Fabrics" : "أقمشة"}
                        </SelectItem>
                        <SelectItem value="accessories">
                          {language === "en" ? "Accessories" : "إكسسوارات"}
                        </SelectItem>
                        <SelectItem value="tools">
                          {language === "en" ? "Tools" : "أدوات"}
                        </SelectItem>
                        <SelectItem value="threads">
                          {language === "en" ? "Threads" : "خيوط"}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="inStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {language === "en"
                        ? "Quantity in Stock"
                        : "الكمية المتوفرة"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {language === "en" ? "Description" : "الوصف"}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your product..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="descriptionAr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {language === "en"
                        ? "Description (Arabic)"
                        : "الوصف (بالعربية)"}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="وصف المنتج بالعربية..."
                        className="min-h-[100px]"
                        dir="rtl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel>
                  {language === "en" ? "Product Image" : "صورة المنتج"}
                </FormLabel>
                <FormControl>
                  <div className="flex flex-col gap-4">
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    {uploadedImage && (
                      <div className="mt-2 rounded-md overflow-hidden border">
                        <img
                          src={uploadedImage}
                          alt="Product preview"
                          className="w-full h-48 object-contain"
                        />
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormDescription>
                  {language === "en"
                    ? "Upload a high-quality image of your product"
                    : "قم بتحميل صورة عالية الجودة لمنتجك"}
                </FormDescription>
              </FormItem>

              <CardFooter className="px-0 flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/seller/products")}
                >
                  {language === "en" ? "Cancel" : "إلغاء"}
                </Button>
                <Button type="submit">
                  {language === "en" ? "Add Product" : "إضافة المنتج"}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
