import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-slate-900 transition-opacity duration-500">
      <div className="relative flex items-center justify-center">
        {/* Outer spinning ring */}
        <div className="h-20 w-20 animate-spin rounded-full border-4 border-slate-200 border-t-primary"></div>
        
        {/* Inner pulse */}
        <div className="absolute h-10 w-10 animate-pulse rounded-full bg-primary/20"></div>
        
        {/* Center dot */}
        <div className="absolute h-3 w-3 rounded-full bg-primary"></div>
      </div>
      
      {/* Loading text with subtle animation */}
      <div className="mt-8 flex flex-col items-center">
        <h2 className="text-xl font-semibold tracking-tight text-slate-800 dark:text-slate-100 animate-pulse">
          Chargement en cours...
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Nous préparons votre expérience
        </p>
      </div>
      
      {/* Bottom progress bar placeholder */}
      <div className="absolute bottom-0 left-0 h-1 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <div className="h-full bg-primary animate-progress origin-left"></div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes progress {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(0.7); }
          100% { transform: scaleX(1); }
        }
        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
      `}} />
    </div>
  );
};

export default Loader;
