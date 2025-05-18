
import React from 'react';

export interface LogoProps {
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Logo({ showText = true, size = 'md', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-12'
  };

  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src="/lovable-uploads/822241b3-b922-4024-800c-50fc579566b1.png"
        alt="Fabric Market Logo" 
        className={`${sizeClasses[size]} w-auto`} 
      />
      {showText && (
        <span className={`ml-2 ${size === 'lg' ? 'text-xl' : 'text-lg'} font-bold text-gold`}>
          Fabric Market
        </span>
      )}
    </div>
  );
}
