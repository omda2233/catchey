
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { OrderProvider } from "@/contexts/OrderContext";
import { useState, useEffect } from "react";

import Index from "./pages/Index";
import ProductListingPage from "./pages/ProductListingPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import NotFound from "./pages/NotFound";
import { SplashScreen } from "./components/SplashScreen";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import ShippingOrdersPage from "./pages/ShippingOrdersPage";
import SellerProductsPage from "./pages/SellerProductsPage";
import OrdersPage from "./pages/OrdersPage";
import PaymentPage from "./pages/PaymentPage";

const queryClient = new QueryClient();

const AppContent = () => {
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we've shown the splash screen before
    const hasSeenSplash = localStorage.getItem('hasSeenSplash');
    
    if (hasSeenSplash) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    localStorage.setItem('hasSeenSplash', 'true');
    navigate('/auth/signin');
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/products" element={<ProductListingPage />} />
        <Route path="/products/:productId" element={<ProductDetailPage />} />
        <Route path="/auth/signin" element={<AuthPage />} />
        <Route path="/auth/signup" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/payment/:orderId" element={<PaymentPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/shipping/orders" element={<ShippingOrdersPage />} />
        <Route path="/seller/products" element={<SellerProductsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            <OrderProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <AppContent />
                </BrowserRouter>
              </TooltipProvider>
            </OrderProvider>
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
