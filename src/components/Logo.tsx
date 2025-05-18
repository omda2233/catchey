
import React from 'react';

export interface LogoProps {
  showText?: boolean;
}

export function Logo({ showText = true }: LogoProps) {
  return (
    <div className="flex items-center">
      <img 
        src="/lovable-uploads/822241b3-b922-4024-800c-50fc579566b1.png"
        alt="Fabric Market Logo" 
        className="h-8 w-auto" 
      />
      {showText && (
        <span className="ml-2 text-lg font-bold text-gold">Fabric Market</span>
      )}
    </div>
  );
}
