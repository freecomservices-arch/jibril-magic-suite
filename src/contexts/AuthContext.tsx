import React, { createContext, useContext, useState, useCallback } from 'react';
import { api } from '@/lib/api';

export interface User {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'agent';
  avatar?: string;
  phone?: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
  allUsers: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('jibril-user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    try {
      const data = await api.auth.login(username, password);
      const token = data.token || data.access || data.access_token;
      const backendUser = data.user;

      if (!token || !backendUser) {
        return false;
      }

      const userData: User = {
        id: String(backendUser.id),
        username: backendUser.username,
        name: backendUser.name || backendUser.full_name || backendUser.username,
        role: backendUser.is_superuser || backendUser.role === 'admin' ? 'admin' : 'agent',
        email: backendUser.email,
        phone: backendUser.phone,
        avatar: backendUser.avatar,
      };

      setUser(userData);
      localStorage.setItem('jibril-user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('jibril-user');
    localStorage.removeItem('token');
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin: user?.role === 'admin', allUsers: [] }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
