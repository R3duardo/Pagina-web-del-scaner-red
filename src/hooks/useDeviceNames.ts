'use client';

import { useState, useEffect, useCallback } from 'react';
import api, { UserDevice } from '@/services/api';

export function useDeviceNames() {
  const [deviceNames, setDeviceNames] = useState<Map<number, UserDevice>>(new Map());
  const [loading, setLoading] = useState(true);

  const fetchNames = useCallback(async () => {
    try {
      const response = await api.getUserDevices();
      if (response.success) {
        const map = new Map<number, UserDevice>();
        response.dispositivos.forEach(d => map.set(d.equipo_id, d));
        setDeviceNames(map);
      }
    } catch (error) {
      // Error silenciado - se maneja visualmente
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNames();
  }, [fetchNames]);

  const getDeviceName = (equipoId: number): UserDevice | undefined => {
    return deviceNames.get(equipoId);
  };

  const getDisplayName = (equipoId: number, hostname: string | null): string => {
    const device = deviceNames.get(equipoId);
    if (device?.nombre_personalizado) {
      return device.nombre_personalizado;
    }
    return hostname || '';
  };

  const updateDeviceName = async (equipoId: number, nombre: string, descripcion?: string) => {
    try {
      await api.saveDeviceName(equipoId, { nombre, descripcion });
      await fetchNames();
      return true;
    } catch {
      return false;
    }
  };

  const toggleFavorite = async (equipoId: number) => {
    try {
      const result = await api.toggleFavorite(equipoId);
      if (result.success) {
        await fetchNames();
      }
      return result;
    } catch {
      return { success: false, favorito: false };
    }
  };

  return {
    deviceNames,
    loading,
    getDeviceName,
    getDisplayName,
    updateDeviceName,
    toggleFavorite,
    refetch: fetchNames
  };
}

export default useDeviceNames;

