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
        <div className="flex items-center justify-between h-14 px-4" style={{ background: 'hsl(150 25% 4% / 0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid hsl(145 72% 52% / 0.08)' }}>
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center justify-center w-10 h-10 rounded-xl" style={{ background: 'hsl(145 72% 52% / 0.08)', border: '1px solid hsl(145 72% 52% / 0.1)' }}
          >
            <Menu className="w-5 h-5" style={{ color: 'hsl(145 72% 52% / 0.7)' }} />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center" style={{ background: 'hsl(150 25% 8%)', border: '1px solid hsl(145 72% 52% / 0.15)' }}>
              <img src={logo} alt="OrganicSMM" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-sm tracking-tight" style={{ color: 'hsl(140 60% 95%)' }}>OrganicSMM</span>
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
