import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <header className="bg-gray-100 shadow-md p-4">
          <h1 className="text-xl font-semibold">Investigation Platform</h1>
        </header>
        <main className="p-4 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
