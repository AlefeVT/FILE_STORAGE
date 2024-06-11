'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface SidebarContextProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void; 
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <SidebarContext.Provider value={{ sidebarOpen, setSidebarOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

interface ClientSideProviderProps {
  children: ReactNode;
}

export const ClientSideProvider = ({ children }: ClientSideProviderProps) => {
  
  return (
    <SidebarProvider>
      {children}
    </SidebarProvider>
  );
};
