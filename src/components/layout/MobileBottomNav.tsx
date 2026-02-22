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
        <div className="flex items-center justify-between h-14 px-4 bg-[hsl(0,0%,2%)]/95 border-b border-white/[0.06]">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.06] hover:bg-white/[0.1]"
          >
            <Menu className="w-5 h-5 text-white/70" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-black overflow-hidden flex items-center justify-center">
              <img src={logo} alt="OrganicSMM" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-white text-sm tracking-tight">OrganicSMM</span>
          </div>

          <div className="w-10" />
        </div>
      </header>

      {/* Sidebar overlay — no animation, instant toggle */}
      {sidebarOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 z-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Sidebar panel */}
          <div className="fixed inset-y-0 left-0 z-50 w-[280px] lg:hidden">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </>
      )}
    </>
  );
}
