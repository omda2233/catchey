import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Product } from '@/models/product';

const productSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  price: z.number().min(0, {
    message: "Price must be positive.",
  }),
  category: z.enum(['fabrics-and-accessories', 'clothing-manufacturing']),
  manufacturingType: z.enum(['manufacturing-for-others', 'printing-services']).optional(),
  isReserved: z.boolean(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export function ProductForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category: 'fabrics-and-accessories',
      isReserved: false,
    },
  });

  async function onSubmit(data: ProductFormValues) {
    try {
      setIsSubmitting(true);
      // TODO: Implement product creation API call
      toast({
        title: "Success",
        description: "Product created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input {...field} disabled={isSubmitting} />
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} disabled={isSubmitting} />
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
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} disabled={isSubmitting} />
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
              <FormLabel>Category</FormLabel>
              <select
                {...field}
                className="w-full p-2 border rounded-md"
                disabled={isSubmitting}
              >
                <option value="fabrics-and-accessories">Fabrics & Accessories</option>
                <option value="clothing-manufacturing">Clothing Manufacturing</option>
              </select>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch('category') === 'clothing-manufacturing' && (
          <FormField
            control={form.control}
            name="manufacturingType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Manufacturing Type</FormLabel>
                <select
                  {...field}
                  className="w-full p-2 border rounded-md"
                  disabled={isSubmitting}
                >
                  <option value="manufacturing-for-others">Manufacturing for Others</option>
                  <option value="printing-services">Printing Services</option>
                </select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="isReserved"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isSubmitting}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Reserve Product</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Reserve this product for customers. Requires 50% down payment.
                </p>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Product'}
        </Button>
      </form>
    </Form>
  );
}
