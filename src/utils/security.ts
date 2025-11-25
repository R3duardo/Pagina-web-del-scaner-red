import { Port, Host, SecurityStats } from '@/types/network';
import { 
  getPortSecurityLevel, 
  getPortSecurityInfo, 
  SecurityLevel, 
  SECURITY_COLORS,
  SECURITY_LABELS 
} from '@/constants/ports';

// Analizar seguridad de un host
export function analyzeHostSecurity(host: Host): {
  level: SecurityLevel;
  score: number;
  issues: string[];
} {
  const issues: string[] = [];
  let secureCount = 0;
  let cautionCount = 0;
  let warningCount = 0;
  let insecureCount = 0;

  host.puertos.forEach(port => {
    const level = getPortSecurityLevel(port.numero_puerto);
    const info = getPortSecurityInfo(port.numero_puerto, port.nombre_servicio);
    
    switch (level) {
      case 'secure':
        secureCount++;
        break;
      case 'caution':
        cautionCount++;
        issues.push(`Puerto ${port.numero_puerto} (${port.nombre_servicio}): ${info.recommendation}`);
        break;
      case 'warning':
        warningCount++;
        issues.push(`Puerto ${port.numero_puerto} (${port.nombre_servicio}): ${info.recommendation}`);
        break;
      case 'insecure':
        insecureCount++;
        issues.push(`CRÍTICO - Puerto ${port.numero_puerto} (${port.nombre_servicio}): ${info.recommendation}`);
        break;
    }
  });

  // Calcular nivel general
  let level: SecurityLevel = 'secure';
  if (insecureCount > 0) level = 'insecure';
  else if (warningCount > 0) level = 'warning';
  else if (cautionCount > 0) level = 'caution';

  // Calcular score (0-100)
  const total = host.puertos.length || 1;
  const score = Math.max(0, 100 - (insecureCount * 25) - (warningCount * 15) - (cautionCount * 5));

  return { level, score, issues };
}

// Calcular estadísticas de seguridad de todos los hosts
export function calculateSecurityStats(hosts: Host[]): SecurityStats[] {
  const counts: Record<SecurityLevel, number> = {
    secure: 0,
    caution: 0,
    warning: 0,
    insecure: 0,
  };

  hosts.forEach(host => {
    host.puertos.forEach(port => {
      const level = getPortSecurityLevel(port.numero_puerto);
      counts[level]++;
    });
  });

  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;

  return Object.entries(counts).map(([level, count]) => ({
    level: level as SecurityLevel,
    count,
    percentage: (count / total) * 100,
  }));
}

// Obtener color de seguridad
export function getSecurityColor(level: SecurityLevel) {
  return SECURITY_COLORS[level];
}

// Obtener label de seguridad
export function getSecurityLabel(level: SecurityLevel): string {
  return SECURITY_LABELS[level];
}

// Calcular estadísticas de protocolos
export function calculateProtocolStats(hosts: Host[]): { protocolo: string; count: number; percentage: number }[] {
  const counts: Record<string, number> = {};

  hosts.forEach(host => {
    host.puertos.forEach(port => {
      const proto = port.protocolo || 'TCP';
      counts[proto] = (counts[proto] || 0) + 1;
    });
  });

  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;

  return Object.entries(counts)
    .map(([protocolo, count]) => ({
      protocolo,
      count,
      percentage: (count / total) * 100,
    }))
    .sort((a, b) => b.count - a.count);
}

// Calcular estadísticas de servicios
export function calculateServiceStats(hosts: Host[]): { servicio: string; count: number; level: SecurityLevel }[] {
  const counts: Record<string, { count: number; level: SecurityLevel }> = {};

  hosts.forEach(host => {
    host.puertos.forEach(port => {
      const servicio = port.nombre_servicio || 'Unknown';
      const level = getPortSecurityLevel(port.numero_puerto);
      
      if (!counts[servicio]) {
        counts[servicio] = { count: 0, level };
      }
      counts[servicio].count++;
    });
  });

  return Object.entries(counts)
    .map(([servicio, data]) => ({
      servicio,
      count: data.count,
      level: data.level,
    }))
    .sort((a, b) => b.count - a.count);
}

