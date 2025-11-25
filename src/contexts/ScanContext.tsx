'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import api from '@/services/api';

interface ScanConfig {
  network?: string;
  timeout?: number;
  concurrency?: number;
  ports?: string;
}

interface ScanContextType {
  isScanning: boolean;
  lastScanTime: Date | null;
  startScan: (config?: ScanConfig) => Promise<boolean>;
  checkScanStatus: () => Promise<boolean>;
  onScanComplete: (callback: () => void) => void;
}

const ScanContext = createContext<ScanContextType | undefined>(undefined);

export function ScanProvider({ children }: { children: ReactNode }) {
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanTime, setLastScanTime] = useState<Date | null>(null);
  const [completionCallbacks, setCompletionCallbacks] = useState<(() => void)[]>([]);
  const [pollInterval, setPollInterval] = useState<NodeJS.Timeout | null>(null);

  // Verificar estado del escaneo en el backend
  const checkScanStatus = useCallback(async (): Promise<boolean> => {
    try {
      const status = await api.getScanStatus();
      const scanning = status.scanning === true;
      setIsScanning(scanning);
      return scanning;
    } catch {
      return false;
    }
  }, []);

  // Iniciar polling cuando se está escaneando
  const startPolling = useCallback(() => {
    if (pollInterval) return;

    const interval = setInterval(async () => {
      const stillScanning = await checkScanStatus();
      
      if (!stillScanning) {
        // Escaneo terminó - ejecutar callbacks
        setLastScanTime(new Date());
        completionCallbacks.forEach(cb => cb());
        setCompletionCallbacks([]);
        
        // Detener polling
        clearInterval(interval);
        setPollInterval(null);
      }
    }, 2000); // Verificar cada 2 segundos

    setPollInterval(interval);
  }, [pollInterval, checkScanStatus, completionCallbacks]);

  // Limpiar interval al desmontar
  useEffect(() => {
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [pollInterval]);

  // Verificar estado inicial
  useEffect(() => {
    checkScanStatus().then(scanning => {
      if (scanning) {
        startPolling();
      }
    });
  }, [checkScanStatus, startPolling]);

  const startScan = useCallback(async (config?: ScanConfig): Promise<boolean> => {
    // Primero verificar si ya hay un escaneo en progreso
    const alreadyScanning = await checkScanStatus();
    
    if (alreadyScanning) {
      return false; // No iniciar nuevo escaneo
    }

    try {
      setIsScanning(true);
      const result = await api.startScan(config);
      
      // Si requiere configuración, no iniciar polling
      if (!result.success) {
        setIsScanning(false);
        return false;
      }
      
      startPolling();
      return true;
    } catch {
      setIsScanning(false);
      return false;
    }
  }, [checkScanStatus, startPolling]);

  const onScanComplete = useCallback((callback: () => void) => {
    setCompletionCallbacks(prev => [...prev, callback]);
  }, []);

  return (
    <ScanContext.Provider
      value={{
        isScanning,
        lastScanTime,
        startScan,
        checkScanStatus,
        onScanComplete,
      }}
    >
      {children}
    </ScanContext.Provider>
  );
}

export function useScan() {
  const context = useContext(ScanContext);
  if (context === undefined) {
    throw new Error('useScan must be used within a ScanProvider');
  }
  return context;
}

