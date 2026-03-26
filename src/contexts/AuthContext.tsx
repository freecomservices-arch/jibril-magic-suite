import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';

interface User {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'agent';
  email?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

  const login = async (username: string, password: string) => {
    try {
      // Utilise la fonction définie dans api.ts
      const userData = await api.auth.login(username, password);
      
      setUser(userData);
      localStorage.setItem('jibril_user', JSON.stringify(userData));
      
      // Si l'API renvoie un token, on pourrait le stocker ici aussi si besoin
      // Mais api.ts gère déjà le stockage du token s'il est renvoyé par le backend
    } catch (error) {
      console.error('Erreur login:', error);
      throw error;
    }
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
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
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
