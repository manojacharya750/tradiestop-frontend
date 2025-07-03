import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-full mx-auto py-4">
        <div className="text-center">
          <p className="text-sm text-slate-500">&copy; {new Date().getFullYear()} TradieStop Pro. All rights reserved.</p>
          <p className="text-xs text-slate-400 mt-1">A world-class front-end application showcase.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
