'use client';

import { useState, useEffect } from 'react';
import { Host } from '@/types/network';
import { HostCard } from './HostCard';
import { LoadingOverlay, Card } from '@/components/common';
import { useDeviceNames } from '@/hooks/useDeviceNames';
import { XIcon } from '@/components/icons';

interface HostListProps {
  hosts: Host[];
  loading?: boolean;
  emptyMessage?: string;
}

export function HostList({ hosts, loading, emptyMessage = 'No se encontraron dispositivos' }: HostListProps) {
  const { getDeviceName, refetch } = useDeviceNames();
  const [selectedHost, setSelectedHost] = useState<Host | null>(null);

  useEffect(() => {
    if (selectedHost) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [selectedHost]);

  if (loading) {
    return <LoadingOverlay message="Cargando dispositivos..." />;
  }

  if (hosts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500">{emptyMessage}</p>
      </div>
    );
  }

  const sortedHosts = [...hosts].sort((a, b) => {
    const aFav = getDeviceName(a.id)?.favorito ? 1 : 0;
    const bFav = getDeviceName(b.id)?.favorito ? 1 : 0;
    if (aFav !== bFav) return bFav - aFav;
    const aName = getDeviceName(a.id)?.nombre_personalizado || a.hostname || '';
    const bName = getDeviceName(b.id)?.nombre_personalizado || b.hostname || '';
    return aName.localeCompare(bName);
  });

  return (
    <>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {sortedHosts.map((host) => {
        const deviceInfo = getDeviceName(host.id);
        return (
          <HostCard 
            key={host.id} 
            host={host} 
            customName={deviceInfo?.nombre_personalizado}
            isFavorite={deviceInfo?.favorito || false}
            onNameChange={() => refetch()}
            onFavoriteChange={() => refetch()}
            onSelect={(h) => setSelectedHost(h)}
          />
        );
      })}
    </div>
    {selectedHost && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedHost(null)} />
        <Card className="relative max-w-3xl w-[95%] max-h-[85vh] overflow-y-auto" variant="elevated" padding="lg">
          <button
            className="absolute top-3 right-3 p-2 rounded hover:bg-neutral-800 text-neutral-400"
            onClick={() => setSelectedHost(null)}
            aria-label="Cerrar"
          >
            <XIcon className="w-5 h-5" />
          </button>
          <HostCard
            host={selectedHost}
            customName={getDeviceName(selectedHost.id)?.nombre_personalizado}
            isFavorite={getDeviceName(selectedHost.id)?.favorito || false}
            onNameChange={() => refetch()}
            onFavoriteChange={() => refetch()}
          />
        </Card>
      </div>
    )}
    </>
  );
}

export default HostList;
