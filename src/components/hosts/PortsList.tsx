'use client';

import { useState } from 'react';
import { Port } from '@/types/network';
import { Badge } from '@/components/common';
import { getPortSecurityInfo, SECURITY_COLORS } from '@/constants/ports';
import { CheckIcon, AlertIcon, XIcon } from '@/components/icons';
import { formatResponseTime } from '@/utils/formatters';

interface PortsListProps {
  ports: Port[];
  maxDisplay?: number;
}

export function PortsList({ ports, maxDisplay = 6 }: PortsListProps) {
  if (!ports || ports.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-neutral-500">No se detectaron puertos abiertos</p>
      </div>
    );
  }

  const [showAll, setShowAll] = useState(false);
  const displayPorts = showAll ? ports : ports.slice(0, maxDisplay);
  const remaining = ports.length - maxDisplay;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs text-neutral-400 uppercase tracking-wider">
          Puertos Detectados
        </h4>
        <span className="text-xs text-neutral-500">{ports.length} total</span>
      </div>
      
      <div className="space-y-2">
        {displayPorts.map((port) => (
          <PortItem key={port.id} port={port} />
        ))}
      </div>

      {remaining > 0 && !showAll && (
        <button
          className="text-xs text-blue-400 hover:text-blue-300 text-center w-full mt-3"
          onClick={() => setShowAll(true)}
        >
          +{remaining} puertos más
        </button>
      )}
    </div>
  );
}

function PortItem({ port }: { port: Port }) {
  const info = getPortSecurityInfo(port.numero_puerto, port.nombre_servicio);
  const colors = SECURITY_COLORS[info.level];
  const stateVariant = port.estado === 'abierto' ? 'success' : port.estado === 'filtrado' ? 'warning' : 'default';
  const stateLabel = port.estado === 'abierto' ? 'Abierto' : port.estado === 'filtrado' ? 'Filtrado' : port.estado;

  const getStatusIcon = () => {
    switch (info.level) {
      case 'secure':
        return <CheckIcon className="w-3.5 h-3.5" />;
      case 'insecure':
        return <XIcon className="w-3.5 h-3.5" />;
      default:
        return <AlertIcon className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div
      className={`
        flex items-center justify-between p-2.5 rounded-lg
        bg-neutral-800/50 border ${colors.border}
        hover:bg-neutral-800 transition-colors
      `}
    >
      <div className="flex items-center gap-3">
        <div className={`${colors.text}`}>
          {getStatusIcon()}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-neutral-100">
              {port.numero_puerto}
            </span>
            <span className="text-xs text-neutral-500">
              {port.protocolo}
            </span>
          </div>
          <p className="text-xs text-neutral-400">{port.nombre_servicio}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant={stateVariant} size="sm">{stateLabel}</Badge>
        {port.tiempo_respuesta_ms && (
          <span className="text-xs text-neutral-500">
            {formatResponseTime(port.tiempo_respuesta_ms)}
          </span>
        )}
        <Badge variant={info.level} size="sm">
          {info.level === 'secure' ? 'OK' : info.level === 'insecure' ? 'RIESGO' : 'REVISAR'}
        </Badge>
      </div>
    </div>
  );
}

export default PortsList;
