import React from "react";
import { AppLayout } from "./AppLayout";
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface PageLayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
}

export function PageLayout({ children, fullWidth = false }: PageLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  // Hide back button on home page
  const showBack = location.pathname !== '/';
  return (
    <AppLayout>
      <div className={fullWidth ? "w-full" : "container mx-auto px-4 py-6"}>
        {showBack && (
          <button
            className="mb-4 flex items-center text-gold hover:text-gold-light focus:outline-none"
            onClick={() => navigate(-1)}
            aria-label="Back"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            <span>Back</span>
          </button>
        )}
        {children}
      </div>
    </AppLayout>
  );
}
