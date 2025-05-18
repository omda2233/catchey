
import React from "react";
import { AppLayout } from "./AppLayout";

interface PageLayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
}

export function PageLayout({ children, fullWidth = false }: PageLayoutProps) {
  return (
    <AppLayout>
      <div className={fullWidth ? "w-full" : "container mx-auto px-4 py-6"}>
        {children}
      </div>
    </AppLayout>
  );
}
