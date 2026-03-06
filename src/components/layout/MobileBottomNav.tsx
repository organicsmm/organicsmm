import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';
import logo from '@/assets/logo.png';

export function MobileBottomNav() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-40 lg:hidden">
        <div className="flex items-center justify-between h-14 px-4 bg-white/95 backdrop-blur-md border-b border-[#f1f5f9]">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#9b87f5]/10 border border-[#9b87f5]/15"
          >
            <Menu className="w-5 h-5 text-[#9b87f5]" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center bg-[#f8fafc] border border-[#f1f5f9]">
              <img src={logo} alt="OrganicSMM" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-sm tracking-tight text-[#1a1a2e]">OrganicSMM</span>
          </div>

          <div className="w-10" />
        </div>
      </header>

      {/* Sidebar overlay — instant toggle */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-[280px] lg:hidden">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </>
      )}
    </>
  );
}
