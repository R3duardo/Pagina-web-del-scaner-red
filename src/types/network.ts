import { SecurityLevel } from '@/constants/ports';

export interface Port {
  id: number;
  equipo_id: number;
  numero_puerto: number;
  nombre_servicio: string;
  protocolo: string;
  estado: string;
  fecha_deteccion: string;
  tiempo_respuesta_ms: number | null;
  banner: string | null;
}

export interface Host {
  id: number;
  hostname: string | null;
  direccion_ip: string;
  mac_address: string | null;
  fabricante: string | null;
  sistema_operativo: string | null;
  version_so: string | null;
  tipo_dispositivo: string | null;
  estado: string;
  primera_deteccion: string;
  ultima_deteccion: string;
  puertos: Port[];
}

export interface HostsResponse {
  success: boolean;
  count: number;
  equipos: Host[];
}

export interface StatsResponse {
  success: boolean;
  stats: {
    total_equipos: number;
    equipos_activos: number;
    total_registros_puertos: number;
    registros_hoy: number;
    puertos_unicos: number;
    fabricantes_top: { nombre: string; cantidad: number }[];
    sistemas_operativos: { sistema_operativo: string; cantidad: number }[];
  };
}

export interface ActivityResponse {
  success: boolean;
  horas: number;
  count: number;
  actividad: {
    hostname: string;
    direccion_ip: string;
    mac_address: string;
    numero_puerto: number;
    nombre_servicio: string;
    protocolo: string;
    estado: string;
    fecha_deteccion: string;
    tiempo_respuesta_ms: number;
  }[];
}

export interface ScanStatusResponse {
  success: boolean;
  scanning: boolean;
  scanInfo?: {
    startTime: string;
    network: string;
    hostsFound: number;
  };
  status: {
    equipos: {
      total_equipos: number;
      equipos_activos: number;
      ultimo_escaneo: string;
    };
    puertos: {
      total_registros: number;
      equipos_con_puertos: number;
      ultima_deteccion: string;
    };
  };
}

// Tipos para estadísticas de seguridad
export interface SecurityStats {
  level: SecurityLevel;
  count: number;
  percentage: number;
}

export interface ProtocolStats {
  protocolo: string;
  count: number;
  percentage: number;
}
