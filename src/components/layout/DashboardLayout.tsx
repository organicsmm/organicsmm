import { ReactNode, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { Sidebar } from './Sidebar';
import { MobileBottomNav } from './MobileBottomNav';
import { LiveChatWidget } from '@/components/chat/LiveChatWidget';
import { cn } from '@/lib/utils';
import { Clock, Sparkles, ArrowRight } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

function TrialBanner() {
  const { isTrial, trialDaysRemaining } = useSubscription();
  
  if (!isTrial) return null;

  const isUrgent = trialDaysRemaining !== null && trialDaysRemaining <= 2;

  return (
    <div className={cn(
      "w-full px-4 py-2.5 flex items-center justify-center gap-3 text-sm font-medium",
      isUrgent 
        ? "bg-rose-500/10 border-b border-rose-500/20 text-rose-300"
        : "bg-emerald-500/10 border-b border-emerald-500/20 text-emerald-300"
    )}>
      <Clock className="h-3.5 w-3.5" />
      <span>
        {trialDaysRemaining === 0 
          ? 'Trial expires today!' 
          : `Free trial: ${trialDaysRemaining} day${trialDaysRemaining === 1 ? '' : 's'} remaining`
        }
      </span>
      <span className="text-white/20">•</span>
      <button 
        onClick={() => {
          const event = new CustomEvent('open-subscription-dialog');
          window.dispatchEvent(event);
        }}
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all hover:scale-105",
          isUrgent
            ? "bg-rose-500/20 border border-rose-500/30 text-rose-200 hover:bg-rose-500/30"
            : "bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 hover:bg-emerald-500/30"
        )}
      >
        <Sparkles className="h-3 w-3" />
        Upgrade Now
      </button>
    </div>
  );
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar - hidden on mobile */}
      <aside className="fixed inset-y-0 left-0 z-40 w-[280px] hidden lg:block">
        <Sidebar />
      </aside>

      {/* Mobile Header & Sidebar */}
      <MobileBottomNav />

      {/* Main content */}
      <main className="lg:pl-[280px] w-full">
        {/* Trial Banner */}
        <div className="hidden lg:block">
          <TrialBanner />
        </div>
        {/* Add padding top on mobile for header, no bottom padding needed anymore */}
        <div className="min-h-screen pt-16 lg:pt-0 px-3 py-4 sm:px-4 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>

      {/* Live Chat Widget */}
      <LiveChatWidget />
    </div>
  );
}
