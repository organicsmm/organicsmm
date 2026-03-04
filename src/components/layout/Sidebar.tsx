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
    <div className="h-full w-full overflow-hidden" style={{
      background: 'linear-gradient(180deg, hsl(150 25% 5%) 0%, hsl(150 25% 3%) 100%)',
      borderRight: '1px solid hsl(145 72% 52% / 0.08)',
    }}>
      <div className="flex h-full flex-col overflow-hidden">
        {/* Logo Section */}
        <div className="flex h-[72px] items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-xl" style={{ background: 'hsl(145 72% 52% / 0.08)' }} />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full overflow-hidden p-1" style={{
                background: 'hsl(150 25% 8%)',
                border: '1px solid hsl(145 72% 52% / 0.15)',
                boxShadow: '0 0 20px -6px hsl(145 72% 52% / 0.2)',
              }}>
                <img src={logo} alt="OrganicSMM" className="h-full w-full object-contain" />
              </div>
            </div>
            <div>
              <h1 className="font-bold text-[15px] tracking-tight" style={{ color: 'hsl(140 60% 95%)' }}>OrganicSMM</h1>
              <p className="text-[10px] font-medium" style={{ color: 'hsl(145 72% 52% / 0.5)' }}>Growth Platform</p>
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
          <div className="mx-4 mb-3 flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{
            background: 'hsl(145 72% 52% / 0.04)',
            border: '1px solid hsl(145 72% 52% / 0.06)',
          }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0" style={{
              background: 'linear-gradient(135deg, hsl(145 72% 52% / 0.2), hsl(160 72% 42% / 0.2))',
              color: 'hsl(145 72% 60%)',
              border: '1px solid hsl(145 72% 52% / 0.15)',
            }}>
              {profile.full_name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium truncate flex items-center gap-1.5" style={{ color: 'hsl(140 60% 90%)' }}>
                {profile.full_name || 'User'}
                {hasActiveSubscription && <Crown className="h-3 w-3 text-amber-400 shrink-0" />}
              </p>
              <p className="text-[10px] truncate" style={{ color: 'hsl(145 15% 40%)' }}>{profile.email}</p>
            </div>
          </div>
        )}

        {/* Balance Card */}
        <div className="mx-4 relative group">
          <div className="rounded-2xl p-5" style={{
            background: 'linear-gradient(145deg, hsl(150 20% 9%) 0%, hsl(150 22% 6%) 100%)',
            border: '1px solid hsl(145 72% 52% / 0.1)',
            boxShadow: '0 1px 0 0 hsl(145 72% 52% / 0.06) inset, 0 8px 24px -8px hsl(150 30% 3% / 0.6)',
          }}>
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{
                background: 'hsl(145 72% 52% / 0.1)',
                border: '1px solid hsl(145 72% 52% / 0.12)',
              }}>
                <Zap className="h-3 w-3" style={{ color: 'hsl(145 72% 52%)' }} />
              </div>
              <p className="text-[11px] font-medium tracking-wide uppercase" style={{ color: 'hsl(145 15% 45%)' }}>Available Balance</p>
            </div>
            <p className="text-[28px] font-bold tracking-tight leading-none" style={{ color: 'hsl(140 60% 95%)' }}>
              {formatPrice(wallet?.balance || 0)}
            </p>
            <Link
              to="/wallet"
              onClick={handleNavClick}
              className="mt-3 inline-flex items-center gap-1 text-[11px] group/link font-medium"
              style={{ color: 'hsl(145 72% 52% / 0.6)' }}
            >
              <span>Add Funds</span>
              <ChevronRight className="h-3 w-3 group-hover/link:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5 px-3 pt-6 pb-3 overflow-y-auto scrollbar-thin">
          <p className="px-3 mb-2.5 text-[10px] font-semibold uppercase tracking-[0.15em]" style={{ color: 'hsl(145 15% 35%)' }}>
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
                  'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium',
                )}
                style={isActive ? {
                  background: 'linear-gradient(135deg, hsl(145 72% 52%) 0%, hsl(160 72% 42%) 100%)',
                  color: 'hsl(152 50% 4%)',
                  boxShadow: '0 1px 0 0 hsl(145 80% 62% / 0.3) inset, 0 -1px 0 0 hsl(150 70% 30% / 0.3) inset, 0 4px 20px -4px hsl(145 72% 52% / 0.35)',
                } : {
                  color: 'hsl(145 15% 50%)',
                }}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={isActive ? {
                  background: 'hsl(152 50% 4% / 0.15)',
                } : {
                  background: 'hsl(145 72% 52% / 0.06)',
                }}>
                  <item.icon className="h-[15px] w-[15px]" style={isActive ? {
                    color: 'hsl(152 50% 4%)',
                  } : {
                    color: 'hsl(145 15% 45%)',
                  }} />
                </div>
                <span className="flex-1">{item.label}</span>
                {isHighlight && !isActive && (
                  <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide" style={{
                    background: 'linear-gradient(90deg, hsl(145 72% 52%), hsl(160 72% 42%))',
                    color: 'hsl(152 50% 4%)',
                    boxShadow: '0 0 12px -3px hsl(145 72% 52% / 0.4)',
                  }}>
                    New
                  </span>
                )}
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'hsl(152 50% 4%)' }} />
                )}
              </Link>
            );
          })}

          {isAdmin && (
            <>
              <div className="my-4 mx-3" style={{ borderTop: '1px solid hsl(145 72% 52% / 0.06)' }} />
              <p className="px-3 mb-2.5 text-[10px] font-semibold uppercase tracking-[0.15em]" style={{ color: 'hsl(145 15% 35%)' }}>
                Admin
              </p>
              {adminNavItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={handleNavClick}
                    className="group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium"
                    style={isActive ? {
                      background: 'linear-gradient(135deg, hsl(145 72% 52%) 0%, hsl(160 72% 42%) 100%)',
                      color: 'hsl(152 50% 4%)',
                      boxShadow: '0 1px 0 0 hsl(145 80% 62% / 0.3) inset, 0 -1px 0 0 hsl(150 70% 30% / 0.3) inset, 0 4px 20px -4px hsl(145 72% 52% / 0.35)',
                    } : {
                      color: 'hsl(145 15% 50%)',
                    }}
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={isActive ? {
                      background: 'hsl(152 50% 4% / 0.15)',
                    } : {
                      background: 'hsl(145 72% 52% / 0.06)',
                    }}>
                      <item.icon className="h-[15px] w-[15px]" style={isActive ? {
                        color: 'hsl(152 50% 4%)',
                      } : {
                        color: 'hsl(145 15% 45%)',
                      }} />
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
            className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-[13px] font-medium"
            style={{ color: 'hsl(145 15% 50%)' }}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base">{currencyInfo.flag}</span>
              <span>{currencyInfo.code}</span>
            </div>
            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", showCurrencyPicker && "rotate-180")} />
          </button>

          {showCurrencyPicker && (
            <div className="absolute bottom-full left-3 right-3 mb-1 rounded-xl overflow-hidden z-50" style={{
              border: '1px solid hsl(145 72% 52% / 0.1)',
              background: 'hsl(150 25% 5%)',
              boxShadow: '0 -8px 30px -8px hsl(150 30% 3% / 0.8)',
            }}>
              {CURRENCIES.map((c) => (
                <button
                  key={c.code}
                  onClick={() => {
                    setCurrency(c.code);
                    setShowCurrencyPicker(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px]"
                  style={currency === c.code ? {
                    background: 'hsl(145 72% 52% / 0.1)',
                    color: 'hsl(145 72% 60%)',
                    fontWeight: 500,
                  } : {
                    color: 'hsl(145 15% 50%)',
                  }}
                >
                  <span className="text-base">{c.flag}</span>
                  <span className="flex-1 text-left">{c.code}</span>
                  <span className="text-[11px]" style={{ color: 'hsl(145 15% 35%)' }}>{c.symbol}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sign Out */}
        <div className="p-3" style={{ borderTop: '1px solid hsl(145 72% 52% / 0.06)' }}>
          <button
            onClick={() => signOut()}
            className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium"
            style={{ color: 'hsl(145 15% 40%)' }}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{
              background: 'hsl(0 72% 50% / 0.06)',
            }}>
              <LogOut className="h-[15px] w-[15px]" style={{ color: 'hsl(0 72% 55%)' }} />
            </div>
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
