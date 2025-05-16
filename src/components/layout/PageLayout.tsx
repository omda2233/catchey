
import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface PageLayoutProps {
  children: ReactNode;
  fullWidth?: boolean;
}

export const PageLayout = ({ children, fullWidth = false }: PageLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {fullWidth ? (
          children
        ) : (
          <div className="container py-6 md:py-10">{children}</div>
        )}
      </main>
      <Footer />
    </div>
  );
};
