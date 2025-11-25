'use client';

import { Host } from '@/types/network';
import { StatusBadge, SecurityBadge } from '@/components/common';
import { analyzeHostSecurity } from '@/utils/security';
import { formatRelativeTime } from '@/utils/formatters';
import { useDeviceNames } from '@/hooks/useDeviceNames';

interface HostsTableProps {
  hosts: Host[];
  onSelect?: (host: Host) => void;
}

export function HostsTable({ hosts, onSelect }: HostsTableProps) {
  const { getDeviceName } = useDeviceNames();
  const sortedHosts = [...hosts].sort((a, b) => {
    const aFav = getDeviceName(a.id)?.favorito ? 1 : 0;
    const bFav = getDeviceName(b.id)?.favorito ? 1 : 0;
    if (aFav !== bFav) return bFav - aFav;
    const aName = getDeviceName(a.id)?.nombre_personalizado || a.hostname || '';
    const bName = getDeviceName(b.id)?.nombre_personalizado || b.hostname || '';
    return aName.localeCompare(bName);
  });

  if (sortedHosts.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-500">
        No hay dispositivos para mostrar
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-neutral-800">
            <th className="text-left text-xs font-medium text-neutral-400 uppercase tracking-wider py-3 px-4">
              IP / Hostname
            </th>
            <th className="text-left text-xs font-medium text-neutral-400 uppercase tracking-wider py-3 px-4">
              MAC
            </th>
            <th className="text-left text-xs font-medium text-neutral-400 uppercase tracking-wider py-3 px-4">
              Fabricante
            </th>
            <th className="text-left text-xs font-medium text-neutral-400 uppercase tracking-wider py-3 px-4">
              SO
            </th>
            <th className="text-left text-xs font-medium text-neutral-400 uppercase tracking-wider py-3 px-4">
              Puertos
            </th>
            <th className="text-left text-xs font-medium text-neutral-400 uppercase tracking-wider py-3 px-4">
              Estado
            </th>
            <th className="text-left text-xs font-medium text-neutral-400 uppercase tracking-wider py-3 px-4">
              Seguridad
            </th>
            <th className="text-left text-xs font-medium text-neutral-400 uppercase tracking-wider py-3 px-4">
              Última vez
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedHosts.map((host) => {
            const security = analyzeHostSecurity(host);
            return (
              <tr
                key={host.id}
                className="border-b border-neutral-800/50 hover:bg-neutral-800/30 cursor-pointer transition-colors"
                onClick={() => onSelect?.(host)}
              >
                <td className="py-3 px-4">
                  <div>
                    <p className="font-mono text-sm text-neutral-200">{host.direccion_ip}</p>
                    {host.hostname && (
                      <p className="text-xs text-neutral-500">{host.hostname}</p>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="font-mono text-xs text-neutral-400">
                    {host.mac_address || '-'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-neutral-300">
                    {host.fabricante || '-'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-neutral-300">
                    {host.sistema_operativo || '-'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-neutral-300">
                    {host.puertos?.length || 0}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <StatusBadge status={host.estado} />
                </td>
                <td className="py-3 px-4">
                  <SecurityBadge level={security.level} showLabel={false} />
                </td>
                <td className="py-3 px-4">
                  <span className="text-xs text-neutral-500">
                    {formatRelativeTime(host.ultima_deteccion)}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default HostsTable;
