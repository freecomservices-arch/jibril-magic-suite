import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import Login from "@/pages/Login";

// Lazy-loaded pages — each gets its own chunk
const Dashboard = React.lazy(() => import("@/pages/Dashboard"));
const Properties = React.lazy(() => import("@/pages/Properties"));
const Contacts = React.lazy(() => import("@/pages/Contacts"));
const Transactions = React.lazy(() => import("@/pages/Transactions"));
const RentalManagement = React.lazy(() => import("@/pages/RentalManagement"));
const Documents = React.lazy(() => import("@/pages/Documents"));
const AIVision = React.lazy(() => import("@/pages/AIVision"));
const Scraping = React.lazy(() => import("@/pages/Scraping"));
const Communication = React.lazy(() => import("@/pages/Communication"));
const Statistics = React.lazy(() => import("@/pages/Statistics"));
const Administration = React.lazy(() => import("@/pages/Administration"));
const SettingsPage = React.lazy(() => import("@/pages/Settings"));
const NotFound = React.lazy(() => import("@/pages/NotFound"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="flex h-screen items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <p className="text-sm text-muted-foreground">Chargement…</p>
    </div>
  </div>
);

const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ children, adminOnly }) => {
  const { user, isAdmin } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" replace />;
  return <Layout>{children}</Layout>;
};

const AppRoutes = () => {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/biens" element={<ProtectedRoute><Properties /></ProtectedRoute>} />
        <Route path="/contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
        <Route path="/gestion-locative" element={<ProtectedRoute><RentalManagement /></ProtectedRoute>} />
        <Route path="/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
        <Route path="/ia-vision" element={<ProtectedRoute><AIVision /></ProtectedRoute>} />
        <Route path="/scraping" element={<ProtectedRoute><Scraping /></ProtectedRoute>} />
        <Route path="/communication" element={<ProtectedRoute><Communication /></ProtectedRoute>} />
        <Route path="/statistiques" element={<ProtectedRoute><Statistics /></ProtectedRoute>} />
        <Route path="/administration" element={<ProtectedRoute adminOnly><Administration /></ProtectedRoute>} />
        <Route path="/parametres" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <AppRoutes />
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
