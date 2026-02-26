import React, { useState, useEffect, useCallback, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import AvatarInitials from '@/components/AvatarInitials';
import GlobalSearch from '@/components/GlobalSearch';
import {
  LayoutDashboard, Building2, Users, FileText, Home, PenTool,
  Bot, Globe, MessageSquare, BarChart3, Settings, Shield,
  Bell, Search, LogOut, Menu, X, ChevronDown
} from 'lucide-react';
import { mockNotifications } from '@/data/mockData';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/biens', label: 'Biens Immobiliers', icon: Building2 },
  { path: '/contacts', label: 'CRM Contacts', icon: Users },
  { path: '/transactions', label: 'Transactions', icon: FileText },
  { path: '/gestion-locative', label: 'Gestion Locative', icon: Home },
  { path: '/documents', label: 'Documents', icon: PenTool },
  { path: '/ia-vision', label: 'IA & Vision', icon: Bot },
  { path: '/scraping', label: 'Scraping', icon: Globe },
  { path: '/communication', label: 'Communication', icon: MessageSquare },
  { path: '/statistiques', label: 'Statistiques', icon: BarChart3 },
];

const adminItems = [
  { path: '/administration', label: 'Administration', icon: Shield },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  // Swipe to close
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 80) setMobileOpen(false);  // swipe left to close
    touchStartX.current = null;
  }, []);

  // ⌘K shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen(prev => !prev);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const allItems = [...navItems, ...(isAdmin ? adminItems : []), { path: '/parametres', label: 'Paramètres', icon: Settings }];

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-heading font-bold text-sm">
          JI
        </div>
        {(sidebarOpen || mobileOpen) && (
          <div className="animate-fade-in">
            <h1 className="font-heading text-base font-bold text-sidebar-foreground">Jibril Immo</h1>
            <p className="text-[10px] text-muted-foreground font-medium">PRO — Agadir</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        <div className="space-y-0.5">
          {allItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all min-h-[44px] ${
                  isActive
                    ? 'bg-sidebar-accent text-primary'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                }`}
              >
                <item.icon className={`h-[18px] w-[18px] shrink-0 ${isActive ? 'text-primary' : ''}`} />
                {(sidebarOpen || mobileOpen) && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* User info at bottom */}
      {user && (sidebarOpen || mobileOpen) && (
        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/50 px-3 py-2.5">
            <AvatarInitials name={user.name} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</p>
              <p className="text-[10px] text-muted-foreground capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-screen bg-background-secondary overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col border-r border-sidebar-border/50 transition-all duration-300 backdrop-blur-xl bg-sidebar/80 ${sidebarOpen ? 'w-60' : 'w-16'}`}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay with animation */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute left-0 top-0 h-full w-72 backdrop-blur-xl bg-sidebar/90 border-r border-sidebar-border/50 shadow-2xl"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <SidebarContent />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Main Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-border/50 backdrop-blur-xl bg-card/80 px-4 py-3 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => { if (window.innerWidth < 1024) setMobileOpen(!mobileOpen); else setSidebarOpen(!sidebarOpen); }}
              className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center active:scale-95"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Search — opens ⌘K */}
            <button
              onClick={() => setCommandOpen(true)}
              className="hidden md:flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 w-80 text-sm text-muted-foreground hover:border-primary/30 hover:bg-muted/30 transition-all min-h-[44px]"
            >
              <Search className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left">Rechercher…</span>
              <kbd className="hidden lg:inline-flex h-5 items-center rounded border border-border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground shrink-0">
                ⌘K
              </kbd>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <ThemeSwitcher />

            {/* Mobile search button */}
            <button
              onClick={() => setCommandOpen(true)}
              className="md:hidden rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center active:scale-95"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center active:scale-95"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                    {unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-12 z-50 w-80 rounded-lg border border-border/50 backdrop-blur-xl bg-card/90 modal-shadow animate-scale-in">
                  <div className="border-b border-border/50 px-4 py-3">
                    <h3 className="font-heading text-sm font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {mockNotifications.map(n => (
                      <div key={n.id} className={`flex gap-3 px-4 py-3 border-b border-border/30 last:border-0 ${!n.read ? 'bg-primary/5' : ''}`}>
                        <div className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${
                          n.type === 'success' ? 'bg-success' : n.type === 'warning' ? 'bg-warning' : n.type === 'urgent' ? 'bg-destructive' : 'bg-info'
                        }`} />
                        <div>
                          <p className="text-sm font-medium text-card-foreground">{n.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-muted transition-colors min-h-[44px] active:scale-95"
              >
                <AvatarInitials name={user?.name || 'U'} size="sm" />
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-12 z-50 w-56 rounded-lg border border-border/50 backdrop-blur-xl bg-card/90 modal-shadow animate-scale-in">
                  <div className="px-4 py-3 border-b border-border/50">
                    <p className="text-sm font-medium text-card-foreground">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <NavLink to="/parametres" className="flex items-center gap-2 px-4 py-2 text-sm text-card-foreground hover:bg-muted transition-colors min-h-[44px]" onClick={() => setProfileOpen(false)}>
                      <Settings className="h-4 w-4" /> Paramètres
                    </NavLink>
                    <button onClick={logout} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-muted transition-colors min-h-[44px]">
                      <LogOut className="h-4 w-4" /> Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6" onClick={() => { setNotifOpen(false); setProfileOpen(false); }}>
          {children}
        </main>
      </div>
      <GlobalSearch open={commandOpen} onOpenChange={setCommandOpen} />
    </div>
  );
};

export default Layout;
