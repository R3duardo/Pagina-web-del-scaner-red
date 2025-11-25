import { HTMLAttributes } from 'react';
import { SecurityLevel, SECURITY_COLORS, SECURITY_LABELS } from '@/constants/ports';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | SecurityLevel;
  size?: 'sm' | 'md';
}

const baseVariants = {
  default: 'bg-neutral-800 text-neutral-300 border-neutral-700',
  success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  danger: 'bg-red-500/10 text-red-400 border-red-500/30',
  info: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
};

const sizes = {
  sm: 'px-1.5 py-0.5 text-[10px]',
  md: 'px-2 py-1 text-xs',
};

export function Badge({ variant = 'default', size = 'md', className = '', children, ...props }: BadgeProps) {
  // Check if variant is a security level
  const isSecurityLevel = ['secure', 'caution', 'warning', 'insecure'].includes(variant);
  
  let variantClasses: string;
  if (isSecurityLevel) {
    const colors = SECURITY_COLORS[variant as SecurityLevel];
    variantClasses = `${colors.bg} ${colors.text} ${colors.border}`;
  } else {
    variantClasses = baseVariants[variant as keyof typeof baseVariants];
  }

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded border
        ${variantClasses}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
}

// Badge específico para nivel de seguridad
export function SecurityBadge({ level, showLabel = true }: { level: SecurityLevel; showLabel?: boolean }) {
  const colors = SECURITY_COLORS[level];
  const label = SECURITY_LABELS[level];

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded border
        ${colors.bg} ${colors.text} ${colors.border}
      `}
    >
      <span className={`w-2 h-2 rounded-full`} style={{ backgroundColor: colors.fill }} />
      {showLabel && label}
    </span>
  );
}

// Badge para estado de host
export function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    activo: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    inactivo: 'bg-red-500/10 text-red-400 border-red-500/30',
    desconocido: 'bg-neutral-800 text-neutral-400 border-neutral-700',
  };

  const dotColors: Record<string, string> = {
    activo: 'bg-emerald-400',
    inactivo: 'bg-red-400',
    desconocido: 'bg-neutral-400',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded border
        ${variants[status] || variants.desconocido}
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColors[status] || dotColors.desconocido}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default Badge;
