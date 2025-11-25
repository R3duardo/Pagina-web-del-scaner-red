'use client';

import { useEffect } from 'react';
import { Button, Input } from '@/components/common';
import { UserMenu } from '@/components/auth';
import { SearchIcon, RefreshIcon, ScanIcon } from '@/components/icons';
import { useScan } from '@/contexts/ScanContext';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  title: string;
  subtitle?: string;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  onRefresh?: () => void;
  showScan?: boolean;
}

export function Header({
  title,
  subtitle,
  searchQuery,
  onSearchChange,
  onRefresh,
  showScan = true,
}: HeaderProps) {
  const { isScanning, startScan, onScanComplete } = useScan();
  const { config } = useAuth();

  // Registrar callback para actualizar cuando termine el escaneo
  useEffect(() => {
    if (onRefresh) {
      onScanComplete(onRefresh);
    }
  }, [onRefresh, onScanComplete]);

  const handleScan = async () => {
    const started = await startScan({
      network: config?.red_escaneo,
      timeout: config?.timeout_ms,
      concurrency: config?.concurrencia,
    });
    if (!started && isScanning) {
      // Ya hay un escaneo en progreso
      // console.log('Ya hay un escaneo en progreso');
    }
  };

  return (
    <header className="h-14 bg-neutral-950 border-b border-neutral-800 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-lg font-semibold text-neutral-100">{title}</h1>
          {subtitle && (
            <p className="text-xs text-neutral-500">{subtitle}</p>
          )}
        </div>
        
        {/* Indicador de escaneo en progreso */}
        {isScanning && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-xs text-blue-400">Escaneando...</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {onSearchChange && (
          <div className="w-64">
            <Input
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              icon={<SearchIcon className="w-4 h-4" />}
            />
          </div>
        )}

        {onRefresh && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            icon={<RefreshIcon className="w-4 h-4" />}
          >
            Actualizar
          </Button>
        )}

        {showScan && (
          <Button
            variant="primary"
            size="sm"
            onClick={handleScan}
            loading={isScanning}
            disabled={isScanning}
            icon={<ScanIcon className="w-4 h-4" />}
          >
            {isScanning ? 'Escaneando...' : 'Escanear'}
          </Button>
        )}

        <div className="w-px h-8 bg-neutral-800 mx-2" />
        
        <UserMenu />
      </div>
    </header>
  );
}

export default Header;
