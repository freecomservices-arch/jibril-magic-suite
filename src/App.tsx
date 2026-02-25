import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Properties from "@/pages/Properties";
import Contacts from "@/pages/Contacts";
import Transactions from "@/pages/Transactions";
import RentalManagement from "@/pages/RentalManagement";
import Documents from "@/pages/Documents";
import AIVision from "@/pages/AIVision";
import Scraping from "@/pages/Scraping";
import Communication from "@/pages/Communication";
import Statistics from "@/pages/Statistics";
import Administration from "@/pages/Administration";
import SettingsPage from "@/pages/Settings";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ children, adminOnly }) => {
  const { user, isAdmin } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" replace />;
  return <Layout>{children}</Layout>;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
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
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
