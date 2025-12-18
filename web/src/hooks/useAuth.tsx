'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '@/lib/api-client';

interface User {
  id: number;
  fullName: string;
  email: string;
  role: 'customer' | 'admin';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          const response = await apiClient.getMe() as any;
          if (response.success) {
            setUser(response.data);
          }
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        localStorage.removeItem('accessToken');
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.login({ email, password }) as any;
      if (response.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (fullName: string, email: string, password: string) => {
    try {
      const response = await apiClient.register({
        full_name: fullName,
        email,
        password,
      }) as any;
      if (response.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('accessToken');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
