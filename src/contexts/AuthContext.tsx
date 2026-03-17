import React, { createContext, useContext, useState, useCallback } from 'react';

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

const API_URL = import.meta.env.VITE_API_URL || 'https://api.jibrilimmo.cloud';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('jibril-user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/api/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const userData: User = {
          id: String(data.user.id),
          username: data.user.username,
          name: data.user.username,
          role: data.user.is_superuser ? 'admin' : 'agent',
          email: data.user.email,
        };
        setUser(userData);
        localStorage.setItem('jibril-user', JSON.stringify(userData));
        localStorage.setItem('token', data.token);
        return true;
      }
      return false;
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
