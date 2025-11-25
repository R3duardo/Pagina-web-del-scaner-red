// Clasificación de seguridad de puertos
export type SecurityLevel = 'secure' | 'caution' | 'warning' | 'insecure';

export interface PortSecurityInfo {
  port: number;
  service: string;
  level: SecurityLevel;
  description: string;
  recommendation: string;
}

// Puertos seguros (verde)
export const SECURE_PORTS: PortSecurityInfo[] = [
  { port: 22, service: 'SSH', level: 'secure', description: 'Secure Shell - Conexión encriptada', recommendation: 'Mantener actualizado y usar autenticación por clave' },
  { port: 443, service: 'HTTPS', level: 'secure', description: 'HTTP Seguro con SSL/TLS', recommendation: 'Puerto estándar para tráfico web seguro' },
  { port: 993, service: 'IMAPS', level: 'secure', description: 'IMAP sobre SSL', recommendation: 'Correo seguro' },
  { port: 995, service: 'POP3S', level: 'secure', description: 'POP3 sobre SSL', recommendation: 'Correo seguro' },
  { port: 587, service: 'SMTPS', level: 'secure', description: 'SMTP seguro', recommendation: 'Envío de correo seguro' },
];

// Puertos de precaución (amarillo)
export const CAUTION_PORTS: PortSecurityInfo[] = [
  { port: 80, service: 'HTTP', level: 'caution', description: 'HTTP sin encriptar', recommendation: 'Considerar migrar a HTTPS' },
  { port: 3306, service: 'MySQL', level: 'caution', description: 'Base de datos MySQL', recommendation: 'No exponer a internet, usar firewall' },
  { port: 5432, service: 'PostgreSQL', level: 'caution', description: 'Base de datos PostgreSQL', recommendation: 'No exponer a internet, usar firewall' },
  { port: 3389, service: 'RDP', level: 'caution', description: 'Remote Desktop Protocol', recommendation: 'Usar VPN, no exponer directamente' },
  { port: 445, service: 'SMB', level: 'caution', description: 'Server Message Block', recommendation: 'Vulnerable a ataques, restringir acceso' },
  { port: 139, service: 'NetBIOS', level: 'caution', description: 'NetBIOS Session Service', recommendation: 'Deshabilitar si no es necesario' },
];

// Puertos de advertencia (naranja)
export const WARNING_PORTS: PortSecurityInfo[] = [
  { port: 21, service: 'FTP', level: 'warning', description: 'File Transfer Protocol', recommendation: 'Usar SFTP en su lugar' },
  { port: 25, service: 'SMTP', level: 'warning', description: 'Simple Mail Transfer Protocol', recommendation: 'Puede ser usado para spam' },
  { port: 110, service: 'POP3', level: 'warning', description: 'Post Office Protocol', recommendation: 'Usar POP3S (puerto 995)' },
  { port: 143, service: 'IMAP', level: 'warning', description: 'Internet Message Access Protocol', recommendation: 'Usar IMAPS (puerto 993)' },
  { port: 8080, service: 'HTTP-Alt', level: 'warning', description: 'Puerto HTTP alternativo', recommendation: 'Verificar si es necesario' },
  { port: 8443, service: 'HTTPS-Alt', level: 'warning', description: 'Puerto HTTPS alternativo', recommendation: 'Verificar configuración SSL' },
];

// Puertos inseguros (rojo)
export const INSECURE_PORTS: PortSecurityInfo[] = [
  { port: 23, service: 'Telnet', level: 'insecure', description: 'Telnet - Sin encriptación', recommendation: 'CERRAR INMEDIATAMENTE - Usar SSH' },
  { port: 19, service: 'Chargen', level: 'insecure', description: 'Character Generator', recommendation: 'CERRAR - Usado en ataques DDoS' },
  { port: 69, service: 'TFTP', level: 'insecure', description: 'Trivial FTP - Sin autenticación', recommendation: 'CERRAR - Muy inseguro' },
  { port: 111, service: 'RPCbind', level: 'insecure', description: 'RPC Port Mapper', recommendation: 'CERRAR - Vector de ataque conocido' },
  { port: 512, service: 'rexec', level: 'insecure', description: 'Remote Execution', recommendation: 'CERRAR - Sin encriptación' },
  { port: 513, service: 'rlogin', level: 'insecure', description: 'Remote Login', recommendation: 'CERRAR - Usar SSH' },
  { port: 514, service: 'rsh', level: 'insecure', description: 'Remote Shell', recommendation: 'CERRAR - Usar SSH' },
  { port: 1433, service: 'MSSQL', level: 'insecure', description: 'Microsoft SQL Server', recommendation: 'No exponer a internet' },
  { port: 1521, service: 'Oracle', level: 'insecure', description: 'Oracle Database', recommendation: 'No exponer a internet' },
];

// Mapa completo de todos los puertos
export const ALL_PORTS_MAP: Map<number, PortSecurityInfo> = new Map([
  ...SECURE_PORTS.map(p => [p.port, p] as [number, PortSecurityInfo]),
  ...CAUTION_PORTS.map(p => [p.port, p] as [number, PortSecurityInfo]),
  ...WARNING_PORTS.map(p => [p.port, p] as [number, PortSecurityInfo]),
  ...INSECURE_PORTS.map(p => [p.port, p] as [number, PortSecurityInfo]),
]);

// Obtener nivel de seguridad de un puerto
export function getPortSecurityLevel(port: number): SecurityLevel {
  const info = ALL_PORTS_MAP.get(port);
  if (info) return info.level;
  
  // Puertos desconocidos: clasificar por rango
  if (port < 1024) return 'caution'; // Puertos privilegiados
  if (port >= 49152) return 'secure'; // Puertos dinámicos/privados
  return 'caution'; // Puertos registrados
}

// Obtener información de seguridad de un puerto
export function getPortSecurityInfo(port: number, serviceName?: string): PortSecurityInfo {
  const info = ALL_PORTS_MAP.get(port);
  if (info) return info;
  
  return {
    port,
    service: serviceName || 'Unknown',
    level: getPortSecurityLevel(port),
    description: 'Puerto no clasificado',
    recommendation: 'Verificar si es necesario mantenerlo abierto'
  };
}

// Colores por nivel de seguridad
export const SECURITY_COLORS: Record<SecurityLevel, { bg: string; text: string; border: string; fill: string }> = {
  secure: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', fill: '#10b981' },
  caution: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', fill: '#f59e0b' },
  warning: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30', fill: '#f97316' },
  insecure: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', fill: '#ef4444' },
};

// Labels en español
export const SECURITY_LABELS: Record<SecurityLevel, string> = {
  secure: 'Seguro',
  caution: 'Precaución',
  warning: 'Advertencia',
  insecure: 'Inseguro',
};

