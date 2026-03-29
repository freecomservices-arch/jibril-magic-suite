import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ScrollToTop from "@/components/ScrollToTop";
import ProtectedLayout from "@/components/ProtectedLayout";
import AdminRoute from "@/components/AdminRoute";
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

const FullPageLoader = () => (
  <div className="flex h-screen items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <p className="text-sm text-muted-foreground">Chargement…</p>
    </div>
  </div>
);

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />

      {/* Protected — Layout rendered ONCE, pages swap inside via <Outlet> */}
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/biens" element={<Properties />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/gestion-locative" element={<RentalManagement />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/ia-vision" element={<AIVision />} />
        <Route path="/scraping" element={<Scraping />} />
        <Route path="/communication" element={<Communication />} />
        <Route path="/statistiques" element={<Statistics />} />
        <Route path="/parametres" element={<SettingsPage />} />

        {/* Admin only */}
        <Route element={<AdminRoute />}>
          <Route path="/administration" element={<Administration />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<Suspense fallback={<FullPageLoader />}><NotFound /></Suspense>} />
    </Routes>
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
            <ScrollToTop />
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
