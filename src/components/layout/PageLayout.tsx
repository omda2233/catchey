
import React from "react";
import { AppLayout } from "./AppLayout";

interface PageLayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
}

export function PageLayout({ children, fullWidth = false }: PageLayoutProps) {
  return (
    <AppLayout>
      {children}
    </AppLayout>
  );
}
