import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';

export interface User {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'agent';
  email?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  allUsers: User[];
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const fallbackUsers: User[] = [
  {
    id: 'admin-jibril',
    username: 'admin',
    name: 'Admin Jibril',
    role: 'admin',
    email: 'admin@jibrilimmo.ma',
    phone: '+212 6 00 00 00 01',
  },
  {
    id: 'directeur',
    username: 'directeur',
    name: 'Directeur Agence',
    role: 'admin',
    email: 'directeur@jibrilimmo.ma',
    phone: '+212 6 00 00 00 02',
  },
  {
    id: 'amin',
    username: 'amin',
    name: 'Amin Belhaj',
    role: 'agent',
    email: 'amin@jibrilimmo.ma',
    phone: '+212 6 00 00 00 03',
  },
  {
    id: 'sarah',
    username: 'sarah',
    name: 'Sarah Idrissi',
    role: 'agent',
    email: 'sarah@jibrilimmo.ma',
    phone: '+212 6 00 00 00 04',
  },
  {
    id: 'youssef',
    username: 'youssef',
    name: 'Youssef El Mansouri',
    role: 'agent',
    email: 'youssef@jibrilimmo.ma',
    phone: '+212 6 00 00 00 05',
  },
  {
    id: 'fatima',
    username: 'fatima',
    name: 'Fatima Zahra',
    role: 'agent',
    email: 'fatima@jibrilimmo.ma',
    phone: '+212 6 00 00 00 06',
  },
  {
    id: 'karim',
    username: 'karim',
    name: 'Karim Bennis',
    role: 'agent',
    email: 'karim@jibrilimmo.ma',
    phone: '+212 6 00 00 00 07',
  },
  {
    id: 'nadia',
    username: 'nadia',
    name: 'Nadia Alaoui',
    role: 'agent',
    email: 'nadia@jibrilimmo.ma',
    phone: '+212 6 00 00 00 08',
  },
];

const resolveFallbackUser = (username: string) => {
  const lower = username.trim().toLowerCase();
  return fallbackUsers.find(
    (u) => u.username.toLowerCase() === lower || u.email?.toLowerCase() === lower,
  ) ?? null;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier si un utilisateur est déjà stocké
    const storedUser = localStorage.getItem('jibril_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const DEMO_CREDENTIALS: Record<string, string> = {
    admin: 'Admin@2025',
    directeur: 'Dir@2025!',
    amin: 'Amin@2025',
    sarah: 'Sarah@2025',
    youssef: 'Youssef@2025',
    fatima: 'Fatima@2025',
    karim: 'Karim@2025',
    nadia: 'Nadia@2025',
  };

  const login = async (username: string, password: string) => {
    const trimmed = username.trim().toLowerCase();

    // 1) Try the real backend first
    try {
      const response = await api.auth.login(trimmed, password);
      const token = response?.token || response?.access || response?.access_token;
      const profile = response?.user ?? response?.data ?? response ?? {};
      const fallback = resolveFallbackUser(profile.username ?? profile.email ?? trimmed);

      const normalizedUser: User = {
        id: String(profile.id ?? profile.user_id ?? fallback?.id ?? trimmed),
        username: profile.username ?? fallback?.username ?? trimmed,
        name: profile.name ?? profile.full_name ?? profile.display_name ?? fallback?.name ?? trimmed,
        role: profile.role === 'admin' || fallback?.role === 'admin' ? 'admin' : 'agent',
        email: profile.email ?? fallback?.email,
        phone: profile.phone ?? profile.telephone ?? profile.mobile ?? fallback?.phone,
      };

      if (token) {
        localStorage.setItem('token', token);
      }

      setUser(normalizedUser);
      localStorage.setItem('jibril_user', JSON.stringify(normalizedUser));
      return true;
    } catch (error) {
      console.warn('Backend indisponible, tentative login local…', error);
    }

    // 2) Fallback: demo credentials
    const expectedPwd = DEMO_CREDENTIALS[trimmed];

    if (expectedPwd && password === expectedPwd) {
      const demoUser = resolveFallbackUser(trimmed);
      if (demoUser) {
        setUser(demoUser);
        localStorage.setItem('jibril_user', JSON.stringify(demoUser));
        return true;
      }
    }

    throw new Error('Identifiants incorrects. Veuillez réessayer.');
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch (e) {
      console.warn('Erreur logout API', e);
    } finally {
      setUser(null);
      localStorage.removeItem('jibril_user');
      localStorage.removeItem('token'); // Nettoyage du token
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        allUsers: fallbackUsers,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
