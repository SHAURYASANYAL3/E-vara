import { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import CyberDashboardLoader from "@/components/CyberDashboardLoader";
import { useAuth, UserProfile } from "@/hooks/useAuth";

const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const PricingPage = lazy(() => import("./pages/Pricing.tsx"));
const SolutionsPage = lazy(() => import("./pages/Solutions.tsx"));
const ThreatDetectionPage = lazy(() => import("./pages/ThreatDetection.tsx"));
const ResourcesPage = lazy(() => import("./pages/Resources.tsx"));
const DocsPage = lazy(() => import("./pages/Docs.tsx"));
const LandingPage = lazy(() => import("./pages/Landing.tsx"));
const AuthPage = lazy(() => import("./pages/AuthPage.tsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
const BookDemo = lazy(() => import("./pages/BookDemo.tsx"));
const ClientPortal = lazy(() => import("./pages/ClientPortal.tsx"));
const IdentityRecords = lazy(() => import("./pages/IdentityRecords.tsx"));
const BillingPage = lazy(() => import("./pages/Billing.tsx"));
const SupportPage = lazy(() => import("./pages/Support.tsx"));
const LegalProtocol = lazy(() => import("./pages/LegalProtocol.tsx"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy.tsx"));
const CookieNotice = lazy(() => import("./pages/CookieNotice.tsx"));
const DemoHealth = lazy(() => import("./pages/DemoHealth.tsx"));
const Contribution = lazy(() => import("./pages/Contribution.tsx"));
const TrustCenter = lazy(() => import("./pages/TrustCenter.tsx"));

import { ErrorBoundary } from "@/components/ErrorBoundary";
import FeedbackWidget from "@/components/FeedbackWidget";
import Index from "./pages/Index";
import Labs from "./pages/Labs";
import {
  usePageView,
  useScrollDepth,
  useSessionDuration,
  useClickTracking,
} from "@/hooks/useAnalytics";
import { QueryCache, MutationCache } from "@tanstack/react-query";
import { toast } from "sonner";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      console.warn(
        `[Self-Healing Query Failover] ${query.queryKey.join(":")}:`,
        error,
      );
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      console.warn(`[Self-Healing Mutation Failover]:`, error);
      toast.error("Security System Action Failed", {
        description: error.message || "Operation failed to complete online.",
      });
    },
  }),
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) =>
        Math.min(1000 * Math.pow(2, attemptIndex), 10000),
      refetchOnWindowFocus: false,
    },
  },
});

interface ProtectedRouteProps {
  children: React.ReactNode;
  user: { id: string } | null | undefined;
  profile: UserProfile | null | undefined;
  profileError: Error | null;
  requireActiveBilling?: boolean;
}

const ProtectedRoute = ({
  children,
  user,
  profile,
  profileError,
  requireActiveBilling = false,
}: ProtectedRouteProps) => {
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (profileError) {
    // If we failed to fetch the profile (e.g., db error or no access), force logout or show error
    return <Navigate to="/auth" replace />;
  }

  if (requireActiveBilling && profile?.billing_status !== "active") {
    return <Navigate to="/billing" replace />;
  }

  return <>{children}</>;
};

// Analytics wrapper — must be inside BrowserRouter for useLocation
const AnalyticsProvider = ({ children }: { children: React.ReactNode }) => {
  usePageView();
  useScrollDepth();
  useSessionDuration();
  useClickTracking();
  return <>{children}</>;
};

const AppRouter = () => {
  const { user, profile, profileError, loading, logout } = useAuth();

  if (loading) return <CyberDashboardLoader />;

  return (
    <BrowserRouter>
      <AnalyticsProvider>
        <Suspense fallback={<CyberDashboardLoader />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/solutions" element={<SolutionsPage />} />
            <Route path="/billing" element={<BillingPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/contribution" element={<Contribution />} />
            <Route path="/demo-health" element={<DemoHealth />} />
            <Route path="/threat-detection" element={<ThreatDetectionPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/book-demo" element={<BookDemo />} />
            <Route path="/legal" element={<LegalProtocol />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/cookies" element={<CookieNotice />} />
            <Route path="/trust-center" element={<TrustCenter />} />
            <Route path="/" element={<Index />} />
            <Route path="/labs" element={<Labs />} />

            {/* Protected Routes */}
            <Route
              path="/client-portal"
              element={
                <ProtectedRoute
                  user={user}
                  profile={profile}
                  profileError={profileError}
                  requireActiveBilling={true}
                >
                  <ClientPortal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/identity-records"
              element={
                <ProtectedRoute
                  user={user}
                  profile={profile}
                  profileError={profileError}
                  requireActiveBilling={true}
                >
                  <IdentityRecords />
                </ProtectedRoute>
              }
            />
            <Route
              path="/billing"
              element={
                <ProtectedRoute
                  user={user}
                  profile={profile}
                  profileError={profileError}
                >
                  <BillingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/support"
              element={
                <ProtectedRoute
                  user={user}
                  profile={profile}
                  profileError={profileError}
                >
                  <SupportPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute
                  user={user}
                  profile={profile}
                  profileError={profileError}
                  requireActiveBilling={true}
                >
                  <Dashboard onLogout={logout} />
                </ProtectedRoute>
              }
            />

            {/* Auth Route */}
            <Route
              path="/auth"
              element={
                user ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <AuthPage onAuth={() => {}} />
                )
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AnalyticsProvider>
    </BrowserRouter>
  );
};

import { SimulationProvider } from "@/providers/SimulationProvider";

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <SimulationProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppRouter />
          <FeedbackWidget />
        </TooltipProvider>
      </SimulationProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
