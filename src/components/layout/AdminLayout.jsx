import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, Home, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-zinc-50 overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile / Generic Top Header */}
        <header className="h-16 shrink-0 border-b border-zinc-200 bg-white flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 -ml-2 text-zinc-500 hover:text-zinc-900 rounded-lg hover:bg-zinc-100 transition-colors"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="hidden lg:flex items-center text-sm font-medium text-zinc-500 gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Système opérationnel
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/home">
              <Button variant="outline" size="sm" className="hidden sm:flex rounded-full text-xs font-semibold">
                <Home className="w-3.5 h-3.5 mr-2" /> Retour au site
              </Button>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl animate-in fade-in duration-300">
             <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
