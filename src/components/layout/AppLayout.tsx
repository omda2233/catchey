
import React from 'react';
import AppHeader from './AppHeader';
import Footer from './Footer';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
