
import React from 'react';
import Header from './Header';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-base-200 text-white font-sans relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-no-repeat bg-cover bg-center z-0 opacity-10"
        style={{ backgroundImage: `url('https://picsum.photos/seed/aibrain/1920/1080')`, filter: 'blur(8px)' }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-transparent z-0"></div>
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
