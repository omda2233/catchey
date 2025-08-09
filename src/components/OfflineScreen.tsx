import { Logo } from './Logo';

const OfflineScreen = () => {
  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-navy navy-gradient opacity-100 transition-opacity duration-500"
    >
      <Logo size="lg" className="animate-pulse" />
      <h1 className="text-4xl font-bold gold-text-gradient mt-6">Offline</h1>
      <p className="text-gold/70 mt-2 text-center max-w-xs">
        You are currently offline. Please check your internet connection to use Catchy Fabric Market.
      </p>
    </div>
  );
};

export default OfflineScreen; 