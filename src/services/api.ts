import { Host, HostsResponse, StatsResponse, ActivityResponse, ScanStatusResponse } from '@/types/network';

const API_BASE_URL = 'http://localhost:3000/api';

interface HostResponse {
  success: boolean;
  equipo: Host;
}

interface TopPortsResponse {
  success: boolean;
  puertos: {
    numero_puerto: number;
    nombre_servicio: string;
    veces_detectado: number;
    equipos_unicos: number;
  }[];
}

interface ConflictsResponse {
  success: boolean;
  conflictos: {
    ip: { direccion_ip: string; count: number; hostnames: string }[];
    mac: { mac_address: string; count: number; hostnames: string }[];
  };
}

interface ScanResponse {
  success: boolean;
  message: string;
  network: string;
  timeout: number;
  concurrency: number;
  ports?: number;
  portsList?: number[];
}

interface PortInfo {
  port: number;
  service: string;
  protocol: 'TCP' | 'UDP' | 'TCP/UDP';
  category: string;
  security: 'secure' | 'caution' | 'warning' | 'insecure' | 'unknown';
}

interface PortsResponse {
  success: boolean;
  commonPorts: number[];
  portsWithInfo: PortInfo[];
  total: number;
  hint: string;
}

interface ScanIPResponse {
  success: boolean;
  equipo?: Host;
  message?: string;
  puertos?: {
    registrados: number;
    omitidos: number;
  };
}

interface CleanupResponse {
  success: boolean;
  message: string;
  resultado: {
    registros_puertos_eliminados: number;
    equipos_marcados_inactivos: number;
    dias_antiguedad: number;
  };
}

// Tipos de autenticación
export interface LoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  usuario?: {
    id: number;
    username: string;
    nombreCompleto: string | null;
    rol: string;
  };
}

export interface UserResponse {
  success: boolean;
  usuario: {
    id: number;
    username: string;
    nombreCompleto: string | null;
    rol: string;
    ultimoAcceso: string | null;
  };
  configuracion: UserConfig;
}

export interface UserConfig {
  id: number;
  usuario_id: number;
  red_escaneo: string;
  timeout_ms: number;
  concurrencia: number;
  escaneo_automatico: boolean;
  intervalo_escaneo: number;
  alertas_activas: boolean;
  tema: string;
  sidebar_colapsado: boolean;
}

export interface DeviceNameData {
  nombre: string;
  descripcion?: string;
  icono?: string;
  color?: string;
  favorito?: boolean;
}

export interface UserDevice {
  id: number;
  usuario_id: number;
  equipo_id: number;
  nombre_personalizado: string;
  descripcion: string | null;
  icono: string;
  color: string;
  favorito: boolean;
  direccion_ip: string;
  hostname: string | null;
  mac_address: string | null;
}

class ApiService {
  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('netscanner_token');
    }
    return null;
  }

  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers,
      ...options,
    });

    if (response.status === 401) {
      // Token inválido - limpiar sesión
      if (typeof window !== 'undefined') {
        localStorage.removeItem('netscanner_token');
        localStorage.removeItem('netscanner_user');
        window.location.href = '/login';
      }
      throw new Error('Sesión expirada');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `API Error: ${response.status}`);
    }

    return response.json();
  }

  // ============================================================
  // AUTENTICACIÓN
  // ============================================================

  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await this.fetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    if (response.success && response.token) {
      localStorage.setItem('netscanner_token', response.token);
      localStorage.setItem('netscanner_user', JSON.stringify(response.usuario));
    }

    return response;
  }

  async logout(): Promise<void> {
    try {
      await this.fetch('/auth/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem('netscanner_token');
      localStorage.removeItem('netscanner_user');
    }
  }

  async getMe(): Promise<UserResponse> {
    return this.fetch<UserResponse>('/auth/me');
  }

  async updateProfile(nombreCompleto: string): Promise<{ success: boolean }> {
    return this.fetch('/auth/me', {
      method: 'PUT',
      body: JSON.stringify({ nombreCompleto }),
    });
  }

  async changePassword(passwordActual: string, passwordNueva: string): Promise<{ success: boolean; message: string }> {
    return this.fetch('/auth/password', {
      method: 'PUT',
      body: JSON.stringify({ passwordActual, passwordNueva }),
    });
  }

  // ============================================================
  // CONFIGURACIÓN DE USUARIO
  // ============================================================

  async getConfig(): Promise<{ success: boolean; configuracion: UserConfig }> {
    return this.fetch('/auth/config');
  }

  async updateConfig(config: Partial<UserConfig>): Promise<{ success: boolean }> {
    return this.fetch('/auth/config', {
      method: 'PUT',
      body: JSON.stringify(config),
    });
  }

  // ============================================================
  // NOMBRES PERSONALIZADOS DE DISPOSITIVOS
  // ============================================================

  async getUserDevices(): Promise<{ success: boolean; dispositivos: UserDevice[] }> {
    return this.fetch('/auth/dispositivos');
  }

  async getFavoriteDevices(): Promise<{ success: boolean; favoritos: UserDevice[] }> {
    return this.fetch('/auth/dispositivos/favoritos');
  }

  async saveDeviceName(equipoId: number, data: DeviceNameData): Promise<{ success: boolean }> {
    return this.fetch(`/auth/dispositivos/${equipoId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteDeviceName(equipoId: number): Promise<{ success: boolean }> {
    return this.fetch(`/auth/dispositivos/${equipoId}`, { method: 'DELETE' });
  }

  async toggleFavorite(equipoId: number): Promise<{ success: boolean; favorito: boolean }> {
    return this.fetch(`/auth/dispositivos/${equipoId}/favorito`, { method: 'POST' });
  }

  // ============================================================
  // ACTIVIDAD DEL USUARIO
  // ============================================================

  async getUserActivity(limite: number = 50): Promise<{ success: boolean; actividad: Array<{ accion: string; detalle: string; created_at: string }> }> {
    return this.fetch(`/auth/actividad?limite=${limite}`);
  }

  // ============================================================
  // HOSTS
  // ============================================================

  async getHosts(): Promise<HostsResponse> {
    return this.fetch<HostsResponse>('/hosts');
  }

  async getHostByIP(ip: string): Promise<HostResponse> {
    return this.fetch<HostResponse>(`/hosts/${ip}`);
  }

  async getHostByMAC(mac: string): Promise<HostResponse> {
    return this.fetch<HostResponse>(`/hosts/mac/${encodeURIComponent(mac)}`);
  }

  // Estadísticas
  async getStats(): Promise<StatsResponse> {
    return this.fetch<StatsResponse>('/hosts/stats/all');
  }

  // Actividad
  async getRecentActivity(hours: number = 24): Promise<ActivityResponse> {
    return this.fetch<ActivityResponse>(`/hosts/actividad/reciente?horas=${hours}`);
  }

  // Puertos más usados
  async getTopPorts(limit: number = 10): Promise<TopPortsResponse> {
    return this.fetch<TopPortsResponse>(`/hosts/puertos/top?limite=${limit}`);
  }

  // Conflictos
  async getConflicts(): Promise<ConflictsResponse> {
    return this.fetch<ConflictsResponse>('/hosts/conflictos/all');
  }

  // ============================================================
  // ESCANEO
  // ============================================================

  async getAvailablePorts(): Promise<PortsResponse> {
    return this.fetch<PortsResponse>('/scan/ports');
  }

  async startScan(config?: { 
    network?: string; 
    timeout?: number; 
    concurrency?: number;
    ports?: string; // "22,80,443" o "20-25" o "22,80,100-110,443"
  }): Promise<ScanResponse> {
    return this.fetch<ScanResponse>('/scan', {
      method: 'POST',
      body: JSON.stringify(config || {}),
    });
  }

  async getScanStatus(): Promise<ScanStatusResponse> {
    return this.fetch<ScanStatusResponse>('/scan/status');
  }

  async scanIP(ip: string): Promise<ScanIPResponse> {
    return this.fetch<ScanIPResponse>(`/scan/ip/${ip}`, { method: 'POST' });
  }

  // Limpieza
  async cleanup(days: number = 30): Promise<CleanupResponse> {
    return this.fetch<CleanupResponse>(`/scan/cleanup?dias=${days}`, { method: 'DELETE' });
  }
}

export const api = new ApiService();
export default api;
