import React from 'react';
import Sidebar from './Sidebar';
import AppHeader from './AppHeader';

interface Props {
  children: React.ReactNode;
  currentModule: string;
}

export default function Layout({ children, currentModule }: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="relative min-h-screen">
      {/* Fixed Background Image */}
      <div 
        className="fixed inset-0 z-0 bg-center bg-cover bg-no-repeat opacity-20"
        style={{ backgroundImage: `url('/assets/logos/logo1.jpg')` }}
      />

      {/* Content Layer */}
      <div className="relative z-10">
        <AppHeader onOpenSidebar={() => setIsSidebarOpen(true)} />
        
        <div className="flex h-screen pt-16">
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
          
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
