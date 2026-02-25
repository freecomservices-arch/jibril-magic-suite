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
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAdmin: boolean;
  allUsers: User[];
}

const MOCK_USERS: { username: string; password: string; user: User }[] = [
  { username: 'admin', password: 'admin123', user: { id: '1', username: 'admin', name: 'Admin Jibril', role: 'admin', phone: '+212 6 00 00 00 00', email: 'admin@jibrilimmo.ma' } },
  { username: 'amin', password: 'agent123', user: { id: '2', username: 'amin', name: 'Amin Belhaj', role: 'agent', phone: '+212 6 11 22 33 44', email: 'amin@jibrilimmo.ma' } },
  { username: 'sarah', password: 'agent123', user: { id: '3', username: 'sarah', name: 'Sarah Idrissi', role: 'agent', phone: '+212 6 22 33 44 55', email: 'sarah@jibrilimmo.ma' } },
  { username: 'khalil', password: 'agent123', user: { id: '4', username: 'khalil', name: 'Khalil Amrani', role: 'agent', phone: '+212 6 33 44 55 66', email: 'khalil@jibrilimmo.ma' } },
  { username: 'agent4', password: 'agent123', user: { id: '5', username: 'agent4', name: 'Fatima Zahra', role: 'agent', phone: '+212 6 44 55 66 77', email: 'fatima@jibrilimmo.ma' } },
  { username: 'agent5', password: 'agent123', user: { id: '6', username: 'agent5', name: 'Youssef Tazi', role: 'agent', phone: '+212 6 55 66 77 88', email: 'youssef@jibrilimmo.ma' } },
  { username: 'agent6', password: 'agent123', user: { id: '7', username: 'agent6', name: 'Nadia Benali', role: 'agent', phone: '+212 6 66 77 88 99', email: 'nadia@jibrilimmo.ma' } },
  { username: 'agent7', password: 'agent123', user: { id: '8', username: 'agent7', name: 'Omar Fassi', role: 'agent', phone: '+212 6 77 88 99 00', email: 'omar@jibrilimmo.ma' } },
  { username: 'agent8', password: 'agent123', user: { id: '9', username: 'agent8', name: 'Leila Chraibi', role: 'agent', phone: '+212 6 88 99 00 11', email: 'leila@jibrilimmo.ma' } },
  { username: 'agent9', password: 'agent123', user: { id: '10', username: 'agent9', name: 'Rachid Alaoui', role: 'agent', phone: '+212 6 99 00 11 22', email: 'rachid@jibrilimmo.ma' } },
  { username: 'agent10', password: 'agent123', user: { id: '11', username: 'agent10', name: 'Salma Kettani', role: 'agent', phone: '+212 6 00 11 22 33', email: 'salma@jibrilimmo.ma' } },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('jibril-user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback((username: string, password: string): boolean => {
    const found = MOCK_USERS.find(u => u.username === username && u.password === password);
    if (found) {
      setUser(found.user);
      localStorage.setItem('jibril-user', JSON.stringify(found.user));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('jibril-user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin: user?.role === 'admin', allUsers: MOCK_USERS.map(u => u.user) }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
