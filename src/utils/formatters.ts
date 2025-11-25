// Formatear fecha en español
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Formatear fecha corta
export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('es-ES', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Formatear tiempo relativo
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Ahora';
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours}h`;
  if (diffDays < 7) return `Hace ${diffDays}d`;
  return formatDateShort(dateString);
}

// Formatear dirección MAC
export function formatMacAddress(mac: string | null): string {
  if (!mac) return 'N/A';
  return mac.toUpperCase();
}

// Formatear IP
export function formatIP(ip: string): string {
  return ip;
}

// Formatear tiempo de respuesta
export function formatResponseTime(ms: number | null): string {
  if (ms === null) return 'N/A';
  if (ms < 1) return '<1ms';
  return `${ms}ms`;
}

// Obtener iniciales de hostname
export function getHostInitials(hostname: string | null, ip: string): string {
  if (hostname) {
    return hostname.substring(0, 2).toUpperCase();
  }
  const parts = ip.split('.');
  return parts[parts.length - 1];
}

// Formatear número con separador de miles
export function formatNumber(num: number): string {
  return num.toLocaleString('es-ES');
}

// Formatear porcentaje
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

