'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/services/api';

interface Stats {
  total_equipos: number;
  equipos_activos: number;
  total_registros_puertos: number;
  registros_hoy: number;
  puertos_unicos: number;
  fabricantes_top: { nombre: string; cantidad: number }[];
  sistemas_operativos: { sistema_operativo: string; cantidad: number }[];
}

export function useStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getStats();
      setStats(data.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener estadísticas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}

export function useScanStatus() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getScanStatus();
      setStatus(data.status);
    } catch {
      // Silenciado
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return {
    status,
    loading,
    refetch: fetchStatus,
  };
}

export function useRecentActivity(hours: number = 24) {
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivity = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getRecentActivity(hours);
      setActivity(data.actividad || []);
    } catch {
      // Silenciado
    } finally {
      setLoading(false);
    }
  }, [hours]);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  return {
    activity,
    loading,
    refetch: fetchActivity,
  };
}

