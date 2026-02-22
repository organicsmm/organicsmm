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
    <div className="h-full w-full bg-gradient-to-b from-zinc-950 via-zinc-950 to-black border-r border-white/[0.06] overflow-hidden">
      <div className="flex h-full flex-col overflow-hidden">
        {/* Logo Section */}
        <div className="flex h-[72px] items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-white/5 rounded-full blur-xl" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-black overflow-hidden p-1">
                <img src={logo} alt="OrganicSMM" className="h-full w-full object-contain" />
              </div>
            </div>
            <div>
              <h1 className="font-bold text-[15px] text-white tracking-tight">OrganicSMM</h1>
              <p className="text-[10px] text-zinc-600 font-medium">Growth Platform</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden h-8 w-8 text-zinc-500 hover:text-white hover:bg-white/5"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* User Profile Mini */}
        {profile && (
          <div className="mx-4 mb-3 flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.04]">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-xs font-bold text-white shrink-0">
              {profile.full_name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-white truncate flex items-center gap-1.5">
                {profile.full_name || 'User'}
                {hasActiveSubscription && <Crown className="h-3 w-3 text-amber-400 shrink-0" />}
              </p>
              <p className="text-[10px] text-zinc-600 truncate">{profile.email}</p>
            </div>
          </div>
        )}

        {/* Balance Card */}
        <div className="mx-4 relative group">
          <div className="rounded-2xl bg-gradient-to-br from-zinc-900/90 to-zinc-950 border border-white/[0.06] p-5 hover:border-white/[0.1] transition-all duration-300">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-6 h-6 rounded-lg bg-white/[0.08] flex items-center justify-center">
                <Zap className="h-3 w-3 text-zinc-400" />
              </div>
              <p className="text-[11px] text-zinc-500 font-medium tracking-wide uppercase">Available Balance</p>
            </div>
            <p className="text-[28px] font-bold text-white tracking-tight leading-none">
              {formatPrice(wallet?.balance || 0)}
            </p>
            <Link
              to="/wallet"
              onClick={handleNavClick}
              className="mt-3 inline-flex items-center gap-1 text-[11px] text-zinc-500 hover:text-white transition-colors group/link font-medium"
            >
              <span>Add Funds</span>
              <ChevronRight className="h-3 w-3 group-hover/link:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5 px-3 pt-6 pb-3 overflow-y-auto scrollbar-thin">
          <p className="px-3 mb-2.5 text-[10px] font-semibold text-zinc-600 uppercase tracking-[0.15em]">
            Menu
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
                  'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200',
                  isActive
                    ? 'bg-white text-black shadow-lg shadow-white/5'
                    : 'text-zinc-500 hover:text-white hover:bg-white/[0.04]',
                )}
              >
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-black/10"
                    : "bg-white/[0.04] group-hover:bg-white/[0.08]"
                )}>
                  <item.icon className={cn(
                    "h-[15px] w-[15px] transition-colors",
                    isActive ? "text-black" : "text-zinc-500 group-hover:text-white"
                  )} />
                </div>
                <span className="flex-1">{item.label}</span>
                {isHighlight && !isActive && (
                  <span className="text-[9px] bg-gradient-to-r from-orange-500 to-amber-500 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wide shadow-lg shadow-orange-500/20">
                    New
                  </span>
                )}
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-black" />
                )}
              </Link>
            );
          })}

          {isAdmin && (
            <>
              <div className="my-4 mx-3 border-t border-white/[0.04]" />
              <p className="px-3 mb-2.5 text-[10px] font-semibold text-zinc-600 uppercase tracking-[0.15em]">
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
                      'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200',
                      isActive
                        ? 'bg-white text-black shadow-lg shadow-white/5'
                        : 'text-zinc-500 hover:text-white hover:bg-white/[0.04]'
                    )}
                  >
                    <div className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-black/10"
                        : "bg-white/[0.04] group-hover:bg-white/[0.08]"
                    )}>
                      <item.icon className={cn(
                        "h-[15px] w-[15px] transition-colors",
                        isActive ? "text-black" : "text-zinc-500 group-hover:text-white"
                      )} />
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
            className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-[13px] font-medium text-zinc-500 hover:text-white hover:bg-white/[0.04] transition-all duration-200"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base">{currencyInfo.flag}</span>
              <span>{currencyInfo.code}</span>
            </div>
            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", showCurrencyPicker && "rotate-180")} />
          </button>

          {showCurrencyPicker && (
            <div className="absolute bottom-full left-3 right-3 mb-1 rounded-xl border border-white/[0.08] bg-zinc-950 shadow-2xl shadow-black/50 overflow-hidden z-50">
              {CURRENCIES.map((c) => (
                <button
                  key={c.code}
                  onClick={() => {
                    setCurrency(c.code);
                    setShowCurrencyPicker(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 text-[13px] transition-colors",
                    currency === c.code
                      ? "bg-white/[0.08] text-white font-medium"
                      : "text-zinc-500 hover:text-white hover:bg-white/[0.04]"
                  )}
                >
                  <span className="text-base">{c.flag}</span>
                  <span className="flex-1 text-left">{c.code}</span>
                  <span className="text-[11px] text-zinc-600">{c.symbol}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sign Out */}
        <div className="p-3 border-t border-white/[0.04]">
          <button
            onClick={() => signOut()}
            className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-zinc-600 hover:text-white hover:bg-white/[0.04] transition-all duration-200"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.04] group-hover:bg-rose-500/15 transition-all duration-200">
              <LogOut className="h-[15px] w-[15px] text-zinc-500 group-hover:text-rose-400 transition-colors" />
            </div>
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
