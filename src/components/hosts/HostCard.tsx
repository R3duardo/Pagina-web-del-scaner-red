'use client';

import { useState, useEffect } from 'react';
import { Host } from '@/types/network';
import { Card, StatusBadge, SecurityBadge, Button, Badge } from '@/components/common';
import { PortsList } from './PortsList';
import { EditNameButton } from './DeviceNameEditor';
import { formatDate, formatRelativeTime } from '@/utils/formatters';
import { analyzeHostSecurity } from '@/utils/security';
import { ComputerIcon, ServerIcon, RouterIcon, WindowsIcon, LinuxIcon, AppleIcon, StarIcon } from '@/components/icons';
import api from '@/services/api';

interface HostCardProps {
  host: Host;
  compact?: boolean;
  customName?: string | null;
  isFavorite?: boolean;
  onNameChange?: (name: string) => void;
  onFavoriteChange?: (isFavorite: boolean) => void;
  onSelect?: (host: Host) => void;
}

export function HostCard({ 
  host, 
  compact = false, 
  customName,
  isFavorite = false,
  onNameChange,
  onFavoriteChange,
  onSelect
}: HostCardProps) {
  const security = analyzeHostSecurity(host);
  const [favorite, setFavorite] = useState(isFavorite);
  const [togglingFavorite, setTogglingFavorite] = useState(false);
  const openCount = host.puertos.filter(p => p.estado === 'abierto').length;
  const filteredCount = host.puertos.filter(p => p.estado === 'filtrado').length;

  useEffect(() => {
    setFavorite(isFavorite);
  }, [isFavorite]);

  const displayName = customName || host.hostname;

  const getDeviceIcon = () => {
    const type = host.tipo_dispositivo?.toLowerCase() || '';
    if (type.includes('router') || type.includes('switch')) {
      return <RouterIcon className="w-5 h-5" />;
    }
    if (type.includes('servidor') || type.includes('server')) {
      return <ServerIcon className="w-5 h-5" />;
    }
    return <ComputerIcon className="w-5 h-5" />;
  };

  const getOSIcon = () => {
    const os = host.sistema_operativo?.toLowerCase() || '';
    if (os.includes('windows')) return <WindowsIcon className="w-4 h-4" />;
    if (os.includes('linux')) return <LinuxIcon className="w-4 h-4" />;
    if (os.includes('mac') || os.includes('apple') || os.includes('ios')) return <AppleIcon className="w-4 h-4" />;
    return null;
  };

  const handleToggleFavorite = async () => {
    setTogglingFavorite(true);
    try {
      const result = await api.toggleFavorite(host.id);
      if (result.success) {
        setFavorite(result.favorito);
        onFavoriteChange?.(result.favorito);
      }
    } catch {
      // Error
    } finally {
      setTogglingFavorite(false);
    }
  };

  return (
    <Card
      className="hover:border-neutral-700 transition-all duration-200"
      onClick={() => onSelect?.(host)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-400">
            {getDeviceIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-mono font-semibold text-neutral-100">
                {host.direccion_ip}
              </h3>
              <StatusBadge status={host.estado} />
            </div>
            {displayName ? (
              <p className="text-sm text-blue-400">{displayName}</p>
            ) : (
              <EditNameButton
                equipoId={host.id}
                currentName={host.hostname}
                customName={customName || null}
                onNameChange={onNameChange}
              />
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); handleToggleFavorite(); }}
            disabled={togglingFavorite}
            className={`p-1.5 rounded transition-colors ${
              favorite 
                ? 'text-amber-400 bg-amber-500/10' 
                : 'text-neutral-500 hover:text-amber-400 hover:bg-neutral-800'
            }`}
            title={favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            <StarIcon className="w-4 h-4" fill={favorite ? 'currentColor' : 'none'} />
          </button>
          <SecurityBadge level={security.level} />
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Badge variant="success" size="sm">Abiertos {openCount}</Badge>
        <Badge variant="warning" size="sm">Filtrados {filteredCount}</Badge>
      </div>

      {/* Info Grid */}
      {!compact && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <InfoItem label="MAC Address" value={host.mac_address || 'N/A'} mono />
          <InfoItem 
            label="Fabricante" 
            value={host.fabricante || 'Desconocido'} 
          />
          <InfoItem
            label="Sistema Operativo"
            value={host.sistema_operativo || 'Desconocido'}
            icon={getOSIcon()}
          />
          <InfoItem
            label="Tipo"
            value={host.tipo_dispositivo || 'Desconocido'}
          />
        </div>
      )}

      {/* Edit name if has displayName */}
      {displayName && (
        <div className="mb-4">
          <EditNameButton
            equipoId={host.id}
            currentName={host.hostname}
            customName={customName || null}
            onNameChange={onNameChange}
          />
        </div>
      )}

      {/* Timestamps */}
      <div className="flex items-center justify-between text-xs text-neutral-500 mb-4 pb-4 border-b border-neutral-800">
        <span>Primera detección: {formatDate(host.primera_deteccion)}</span>
        <span>Última: {formatRelativeTime(host.ultima_deteccion)}</span>
      </div>

      {/* Ports */}
      <PortsList ports={host.puertos.filter(p => p.estado === 'abierto' || p.estado === 'filtrado')} />
    </Card>
  );
}

function InfoItem({ 
  label, 
  value, 
  mono = false,
  icon 
}: { 
  label: string; 
  value: string; 
  mono?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className="bg-neutral-800/50 rounded-lg p-3">
      <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">
        {label}
      </p>
      <div className="flex items-center gap-2">
        {icon && <span className="text-neutral-400">{icon}</span>}
        <p className={`text-sm text-neutral-200 truncate ${mono ? 'font-mono' : ''}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

export default HostCard;
