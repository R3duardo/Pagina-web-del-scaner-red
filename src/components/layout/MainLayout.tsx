'use client';

import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { ProtectedRoute } from '@/components/auth';
import { SidebarProvider, useSidebar } from '@/contexts/SidebarContext';
import { ScanProvider } from '@/contexts/ScanContext';

interface MainLayoutProps {
  children: ReactNode;
}

function LayoutContent({ children }: { children: ReactNode }) {
  const { collapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-black">
      <Sidebar />
      <main 
        className={`
          min-h-screen transition-all duration-300
          ${collapsed ? 'ml-16' : 'ml-56'}
        `}
      >
        {children}
      </main>
    </div>
  );
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <ScanProvider>
          <LayoutContent>{children}</LayoutContent>
        </ScanProvider>
      </SidebarProvider>
    </ProtectedRoute>
  );
}

export default MainLayout;
