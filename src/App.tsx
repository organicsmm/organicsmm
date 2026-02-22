import { useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { CurrencyProvider } from "@/hooks/useCurrency";
import { ScrollToTop } from "@/components/ScrollToTop";
import { toast } from "sonner";
import { AppErrorBoundary } from "@/components/app/AppErrorBoundary";
import { GlobalSubscriptionGuard } from "@/components/subscription/GlobalSubscriptionGuard";

// INSTANT PAGES - Only the absolute smallest/most-visited pages eager-loaded
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// ALL other pages lazy-loaded for faster initial bundle
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Services = lazy(() => import("./pages/Services"));
const Order = lazy(() => import("./pages/Order"));
const Orders = lazy(() => import("./pages/Orders"));
const Wallet = lazy(() => import("./pages/Wallet"));
const Settings = lazy(() => import("./pages/Settings"));
const Support = lazy(() => import("./pages/Support"));
const ApiAccess = lazy(() => import("./pages/ApiAccess"));

// Engagement pages - lazy loaded
const EngagementOrder = lazy(() => import("./pages/EngagementOrder"));
const EngagementOrders = lazy(() => import("./pages/EngagementOrders"));
const EngagementOrderDetail = lazy(() => import("./pages/EngagementOrderDetail"));

// Admin pages - lazy loaded (only admins)
const Admin = lazy(() => import("./pages/admin/Admin"));
const AdminServices = lazy(() => import("./pages/admin/AdminServices"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminBundles = lazy(() => import("./pages/admin/AdminBundles"));
const AdminCronMonitor = lazy(() => import("./pages/admin/AdminCronMonitor"));
const AdminSubscriptions = lazy(() => import("./pages/admin/AdminSubscriptions"));
const AdminChat = lazy(() => import("./pages/admin/AdminChat"));
const AdminProviderAccounts = lazy(() => import("./pages/admin/AdminProviderAccounts"));
const AdminServiceProviderMapping = lazy(() => import("./pages/admin/AdminServiceProviderMapping"));

// Legal pages - lazy loaded
const TermsOfService = lazy(() => import("./pages/legal/TermsOfService"));
const PrivacyPolicy = lazy(() => import("./pages/legal/PrivacyPolicy"));
const RefundPolicy = lazy(() => import("./pages/legal/RefundPolicy"));
const CookiePolicy = lazy(() => import("./pages/legal/CookiePolicy"));

// Shared loading fallback
const LazyFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      <span className="text-sm text-muted-foreground">Loading...</span>
    </div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,       // 5 min — use cache, don't refetch
      gcTime: 15 * 60 * 1000,          // 15 min cache retention
      refetchOnWindowFocus: false,      // Don't refetch on tab switch
      refetchOnReconnect: false,        // Don't refetch on reconnect
      refetchOnMount: false,            // Use cached data on navigation
      retry: 2,
      retryDelay: (i) => Math.min(1000 * 2 ** i, 10000),
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
});

const App = () => {
  useEffect(() => {
    const handleRejection = (e: PromiseRejectionEvent) => {
      console.error("Unhandled rejection:", e.reason);
      toast.error("An error occurred. Please try again.");
      e.preventDefault();
    };
    const handleError = (e: ErrorEvent) => {
      console.error("Unhandled error:", e.error || e.message);
    };
    window.addEventListener("unhandledrejection", handleRejection);
    window.addEventListener("error", handleError);
    return () => {
      window.removeEventListener("unhandledrejection", handleRejection);
      window.removeEventListener("error", handleError);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CurrencyProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AppErrorBoundary>
              <BrowserRouter>
                <ScrollToTop />
                <GlobalSubscriptionGuard>
                  <Suspense fallback={<LazyFallback />}>
                    <Routes>
                      {/* Eagerly loaded */}
                      <Route path="/" element={<Index />} />
                      <Route path="*" element={<NotFound />} />

                      {/* User pages */}
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/services" element={<Services />} />
                      <Route path="/order" element={<Order />} />
                      <Route path="/orders" element={<Orders />} />
                      <Route path="/wallet" element={<Wallet />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/support" element={<Support />} />
                      <Route path="/api-access" element={<ApiAccess />} />

                      {/* Engagement */}
                      <Route path="/engagement-order" element={<EngagementOrder />} />
                      <Route path="/engagement-orders" element={<EngagementOrders />} />
                      <Route path="/engagement-orders/:orderNumber" element={<EngagementOrderDetail />} />

                      {/* Admin */}
                      <Route path="/admin" element={<Admin />} />
                      <Route path="/admin/services" element={<AdminServices />} />
                      <Route path="/admin/users" element={<AdminUsers />} />
                      <Route path="/admin/orders" element={<AdminOrders />} />
                      <Route path="/admin/bundles" element={<AdminBundles />} />
                      <Route path="/admin/cron-monitor" element={<AdminCronMonitor />} />
                      <Route path="/admin/subscriptions" element={<AdminSubscriptions />} />
                      <Route path="/admin/chat" element={<AdminChat />} />
                      <Route path="/admin/provider-accounts" element={<AdminProviderAccounts />} />
                      <Route path="/admin/service-provider-mapping" element={<AdminServiceProviderMapping />} />

                      {/* Legal */}
                      <Route path="/terms" element={<TermsOfService />} />
                      <Route path="/privacy" element={<PrivacyPolicy />} />
                      <Route path="/refund" element={<RefundPolicy />} />
                      <Route path="/cookies" element={<CookiePolicy />} />
                    </Routes>
                  </Suspense>
                </GlobalSubscriptionGuard>
              </BrowserRouter>
            </AppErrorBoundary>
          </TooltipProvider>
        </CurrencyProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
