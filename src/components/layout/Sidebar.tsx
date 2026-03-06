import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Wallet,
  ListOrdered,
  Settings,
  LifeBuoy,
  Shield,
  LogOut,
  Rocket,
  Sparkles,
  ChevronRight,
  X,
  Zap,
  Crown,
  ChevronDown,
  Code2
} from 'lucide-react';
import logo from '@/assets/logo.png';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useCurrency, CURRENCIES, type CurrencyCode } from '@/hooks/useCurrency';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface SidebarProps {
  onClose?: () => void;
}

const userNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Rocket, label: 'Full Engagement', path: '/engagement-order', highlight: true },
  { icon: Sparkles, label: 'Engagement Orders', path: '/engagement-orders' },
  { icon: ShoppingCart, label: 'Single Order', path: '/order' },
  { icon: ListOrdered, label: 'Single Orders', path: '/orders' },
  { icon: Package, label: 'Services', path: '/services' },
  { icon: Wallet, label: 'Wallet', path: '/wallet' },
  { icon: Code2, label: 'API Access', path: '/api-access' },
  { icon: LifeBuoy, label: 'Support', path: '/support' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const adminNavItems = [
  { icon: Shield, label: 'Admin Panel', path: '/admin' },
];

export function Sidebar({ onClose }: SidebarProps) {
  const location = useLocation();
  const { isAdmin, signOut, wallet, profile } = useAuth();
  const { hasActiveSubscription } = useSubscription();
  const { currency, setCurrency, formatPrice, currencyInfo } = useCurrency();
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <div className="h-full w-full overflow-hidden bg-white border-r border-[#f1f5f9] shadow-[0_0_40px_rgba(0,0,0,0.02)]">
      <div className="flex h-full flex-col overflow-hidden">
        {/* Logo Section */}
        <div className="flex h-[80px] items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-[#9b87f5] to-[#7E69AB] rounded-xl flex items-center justify-center shadow-lg shadow-[#9b87f5]/20">
              <Zap className="w-4.5 h-4.5 text-white fill-current" />
            </div>
            <div>
              <h1 className="font-black text-[16px] tracking-tight text-[#1a1a2e]">OrganicSMM</h1>
              <p className="text-[9px] font-[1000] uppercase tracking-[0.15em] text-[#1a1a2e]/20">Pro Console</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden h-8 w-8"
            style={{ color: 'hsl(145 15% 45%)' }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* User Profile Mini */}
        {profile && (
          <div className="mx-4 mb-3 flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-[#f8fafc] border border-[#f1f5f9]">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black shrink-0 bg-white border border-[#f1f5f9] text-[#9b87f5] shadow-sm">
              {profile.full_name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-[1000] truncate flex items-center gap-1.5 text-[#1a1a2e]">
                {profile.full_name || 'User'}
                {hasActiveSubscription && <Crown className="h-3 w-3 text-amber-500 shrink-0" />}
              </p>
              <p className="text-[10px] font-bold truncate text-[#1a1a2e]/30">{profile.email}</p>
            </div>
          </div>
        )}

        {/* Balance Card */}
        <div className="mx-4 relative group">
          <div className="rounded-[2rem] p-6 bg-[#1a1a2e] shadow-[0_20px_40px_rgba(26,26,46,0.2)] relative overflow-hidden border border-[#2e2e4a]">
            {/* Glossy Accents */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#9b87f5]/10 blur-[40px] rounded-full -mr-16 -mt-16" />

            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-white/5 border border-white/10">
                <Wallet className="h-3.5 w-3.5 text-white/50" />
              </div>
              <p className="text-[9px] font-black tracking-[0.2em] uppercase text-white/30">Terminal Wallet</p>
            </div>

            <p className="text-3xl font-[1000] tracking-tighter leading-none text-white mb-6">
              {formatPrice(wallet?.balance || 0)}
            </p>

            <Link
              to="/wallet"
              onClick={handleNavClick}
              className="w-full h-11 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-white transition-all active:scale-95"
            >
              <Zap className="h-3 w-3 text-[#9b87f5] fill-current" />
              Recharge Console
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5 px-3 pt-6 pb-3 overflow-y-auto scrollbar-thin">
          <p className="px-4 mb-4 text-[9px] font-black uppercase tracking-[0.2em] text-[#1a1a2e]/20">
            Console Menu
          </p>
          {userNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            const isHighlight = (item as any).highlight;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={cn(
                  'group relative flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-black transition-all mb-1',
                  isActive
                    ? 'bg-[#1a1a2e] text-white shadow-lg shadow-[#1a1a2e]/10 translate-x-1'
                    : 'text-[#1a1a2e]/40 hover:text-[#1a1a2e] hover:bg-[#f8fafc]'
                )}
              >
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-xl transition-all",
                  isActive ? "bg-white/10" : "bg-transparent group-hover:bg-white border border-transparent group-hover:border-[#f1f5f9]"
                )}>
                  <item.icon className={cn("h-[15px] w-[15px]", isActive ? "text-white" : "text-inherit")} />
                </div>
                <span className="flex-1">{item.label}</span>
                {isHighlight && !isActive && (
                  <span className="text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest bg-[#fdf2f8] text-[#d946ef] border border-[#ffdeed]">
                    Elite
                  </span>
                )}
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#9b87f5] shadow-[0_0_10px_#9b87f5]" />
                )}
              </Link>
            );
          })}

          {isAdmin && (
            <>
              <div className="my-4 mx-3 border-t border-[#f1f5f9]" />
              <p className="px-3 mb-2.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#1a1a2e]/30">
                Admin
              </p>
              {adminNavItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={handleNavClick}
                    className={cn(
                      'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium',
                      isActive
                        ? 'bg-[#1a1a2e] text-white shadow-lg'
                        : 'text-[#1a1a2e]/40 hover:text-[#1a1a2e] hover:bg-[#f8fafc]'
                    )}
                  >
                    <div className={cn(
                      'flex items-center justify-center w-8 h-8 rounded-lg',
                      isActive ? 'bg-white/10' : 'bg-[#9b87f5]/5'
                    )}>
                      <item.icon className={cn('h-[15px] w-[15px]', isActive ? 'text-white' : 'text-[#9b87f5]')} />
                    </div>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </>
          )}
        </nav>

        {/* Currency Switcher */}
        <div className="px-3 pb-2 relative">
          <button
            onClick={() => setShowCurrencyPicker(!showCurrencyPicker)}
            className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-[13px] font-medium text-[#1a1a2e]/50 hover:bg-[#f8fafc]"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base">{currencyInfo.flag}</span>
              <span>{currencyInfo.code}</span>
            </div>
            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", showCurrencyPicker && "rotate-180")} />
          </button>

          {showCurrencyPicker && (
            <div className="absolute bottom-full left-3 right-3 mb-1 rounded-xl overflow-hidden z-50 bg-white border border-[#f1f5f9] shadow-lg">
              {CURRENCIES.map((c) => (
                <button
                  key={c.code}
                  onClick={() => {
                    setCurrency(c.code);
                    setShowCurrencyPicker(false);
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-2.5 text-[13px]',
                    currency === c.code
                      ? 'bg-[#9b87f5]/10 text-[#9b87f5] font-medium'
                      : 'text-[#1a1a2e]/50 hover:bg-[#f8fafc]'
                  )}
                >
                  <span className="text-base">{c.flag}</span>
                  <span className="flex-1 text-left">{c.code}</span>
                  <span className="text-[11px] text-[#1a1a2e]/30">{c.symbol}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sign Out */}
        <div className="p-3 border-t border-[#f1f5f9]">
          <button
            onClick={() => signOut()}
            className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-[#1a1a2e]/40 hover:bg-[#f8fafc]"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50">
              <LogOut className="h-[15px] w-[15px] text-red-400" />
            </div>
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
