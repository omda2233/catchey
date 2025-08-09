import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { useCart, CartProvider } from "@/contexts/CartContext";
import { OrderProvider } from "@/contexts/OrderContext";
import { useState, useEffect } from "react";
import { NotificationProvider } from './contexts/NotificationContext';

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
import AdminAddUserPage from "./pages/AdminAddUserPage";
import ShippingOrdersPage from "./pages/ShippingOrdersPage";
import SellerProductsPage from "./pages/SellerProductsPage";
import AddProductPage from "./pages/AddProductPage";
import OrdersPage from "./pages/OrdersPage";
import PaymentPage from "./pages/PaymentPage";
import ForgotPasswordForm from './components/auth/ForgotPasswordForm';
import ResetPasswordForm from './components/auth/ResetPasswordForm';
import OfflineScreen from './components/OfflineScreen';

const queryClient = new QueryClient();

// Detect mobile at the top-level scope for use in App
const isMobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent);

const AppContent = () => {
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    // Check if we've shown the splash screen before
    const hasSeenSplash = localStorage.getItem('hasSeenSplash');
    
    if (hasSeenSplash) {
      setShowSplash(false);
    }
  }, []);

  // Handle Android hardware back button
  useEffect(() => {
    if (!isMobile) return;
    let App;
    try {
      App = require('@capacitor/app').App;
    } catch {}
    if (!App) return;
    const handler = App.addListener('backButton', ({ canGoBack }) => {
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        // Optionally show a toast or confirmation before exiting
      }
    });
    return () => { handler && handler.remove(); };
  }, [isMobile, navigate]);

  const handleSplashComplete = () => {
    setShowSplash(false);
    localStorage.setItem('hasSeenSplash', 'true');
    navigate('/auth/signin');
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (!isOnline) {
    return <OfflineScreen />;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/products" element={<ProductListingPage />} />
        <Route path="/products/:productId" element={<ProductDetailPage />} />
        <Route path="/auth/signin" element={<AuthPage />} />
        <Route path="/auth/signup" element={<AuthPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/auth/reset-password" element={<ResetPasswordForm />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/payment/:orderId" element={<PaymentPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/add-user" element={<AdminAddUserPage />} />
        <Route path="/shipping/orders" element={<ShippingOrdersPage />} />
        <Route path="/seller/products" element={<SellerProductsPage />} />
        <Route path="/add-product" element={<AddProductPage />} />
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
            <NotificationProvider>
              <OrderProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  {isMobile ? (
                    <HashRouter>
                      <AppContent />
                    </HashRouter>
                  ) : (
                    <BrowserRouter>
                      <AppContent />
                    </BrowserRouter>
                  )}
                </TooltipProvider>
              </OrderProvider>
            </NotificationProvider>
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
