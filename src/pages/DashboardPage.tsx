
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PageLayout } from "@/components/layout/PageLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import SellerDashboard from "@/components/dashboard/SellerDashboard";
import ShippingDashboard from "@/components/dashboard/ShippingDashboard";
import BuyerDashboard from "@/components/dashboard/BuyerDashboard";

export default function DashboardPage() {
  const { user } = useAuth();
  const { language } = useLanguage();

  if (!user) {
    return <Navigate to="/auth/signin" />;
  }

  // Render different dashboards based on user role
  const renderDashboard = () => {
    switch (user.role) {
      case "admin":
        return <AdminDashboard />;
      case "seller":
        return <SellerDashboard />;
      case "shipping":
        return <ShippingDashboard />;
      default:
        return <BuyerDashboard />;
    }
  };

  return (
    <PageLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">
          {language === "en" ? "Dashboard" : "لوحة التحكم"}
        </h1>
        {renderDashboard()}
      </div>
    </PageLayout>
  );
}
