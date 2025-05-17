
import { useEffect, useState } from 'react';
import { Logo } from './Logo';
import { useNavigate } from 'react-router-dom';

export const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Show splash screen for 2 seconds, then fade out
    const timer = setTimeout(() => {
      setIsVisible(false);
      
      // After fade animation completes, navigate to main page
      setTimeout(() => {
        navigate('/auth/signin');
      }, 500);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-navy navy-gradient
        ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        transition-opacity duration-500`}
    >
      <Logo size="xl" className="animate-pulse" />
      <h1 className="text-4xl font-bold gold-text-gradient mt-6">Catchy</h1>
      <p className="text-gold/70 mt-2">Premium Fabrics Marketplace</p>
    </div>
  );
};
