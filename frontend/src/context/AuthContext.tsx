import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Usuario } from '../types';
import api from '../api/axios';

interface AuthContextType {
  user: Usuario | null;
  token: string | null;
  login: (usuario: string, password: string) => Promise<Usuario>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isVendedor: boolean;
  homePath: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  const isAdmin = user?.rol?.nombre === 'Administrador';
  const isVendedor = user?.rol?.nombre === 'Vendedor';
  const homePath = isAdmin ? '/admin/dashboard' : '/admin/ventas';

  const login = async (usuario: string, password: string): Promise<Usuario> => {
    const res = await api.post('/auth/login', { usuario, password });
    const { access_token, user: userData } = res.data;
    localStorage.setItem('token', access_token);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(access_token);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token && !!user,
        isAdmin,
        isVendedor,
        homePath,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
}
