'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api, { UserConfig } from '@/services/api';

interface User {
  id: number;
  username: string;
  nombreCompleto: string | null;
  rol: string;
}

interface AuthContextType {
  user: User | null;
  config: UserConfig | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  updateConfig: (config: Partial<UserConfig>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [config, setConfig] = useState<UserConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar usuario al iniciar
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('netscanner_token');
      const savedUser = localStorage.getItem('netscanner_user');

      if (token && savedUser) {
        try {
          // Verificar token con el backend
          const response = await api.getMe();
          if (response.success) {
            setUser(response.usuario);
            setConfig(response.configuracion);
          } else {
            // Token inválido
            localStorage.removeItem('netscanner_token');
            localStorage.removeItem('netscanner_user');
          }
        } catch {
          // Error de conexión - usar datos locales temporalmente
          try {
            setUser(JSON.parse(savedUser));
          } catch {
            localStorage.removeItem('netscanner_token');
            localStorage.removeItem('netscanner_user');
          }
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await api.login(username, password);

      if (response.success && response.usuario) {
        setUser(response.usuario);
        
        // Cargar configuración
        try {
          const configResponse = await api.getConfig();
          if (configResponse.success) {
            setConfig(configResponse.configuracion);
          }
        } catch {
          // Config no disponible
        }

        return { success: true };
      }

      return { success: false, message: response.message || 'Error al iniciar sesión' };
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Error de conexión' 
      };
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      // Ignorar errores de logout
    } finally {
      setUser(null);
      setConfig(null);
      localStorage.removeItem('netscanner_token');
      localStorage.removeItem('netscanner_user');
    }
  };

  const updateConfig = async (newConfig: Partial<UserConfig>) => {
    try {
      await api.updateConfig(newConfig);
      if (config) {
        setConfig({ ...config, ...newConfig });
      }
    } catch (error) {
      // Error silenciado - se maneja visualmente
    }
  };

  const refreshUser = async () => {
    try {
      const response = await api.getMe();
      if (response.success) {
        setUser(response.usuario);
        setConfig(response.configuracion);
      }
    } catch {
      // Error al refrescar
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        config,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateConfig,
        refreshUser,
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
