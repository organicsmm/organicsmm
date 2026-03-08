import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';
import logo from '@/assets/logo.png';

export function MobileBottomNav() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-40 lg:hidden px-2 pt-2">
        <div className="flex items-center justify-between h-14 px-4 bg-[#0a0a0c]/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-white/5 border border-white/10 p-1">
              <img src="/favicon.png" alt="OrganicSMM" className="w-full h-full object-contain" />
            </div>
            <span className="font-black text-sm tracking-tighter text-white">OrganicSMM</span>
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
