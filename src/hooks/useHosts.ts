'use client';

import { useState, useEffect, useCallback } from 'react';
import { Host } from '@/types/network';
import api from '@/services/api';

export function useHosts() {
  const [hosts, setHosts] = useState<Host[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getHosts();
      setHosts(data.equipos || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener hosts');
      // Silenciado
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHosts();
  }, [fetchHosts]);

  return {
    hosts,
    loading,
    error,
    refetch: fetchHosts,
  };
}

export function useHostSearch(hosts: Host[], query: string) {
  const [filteredHosts, setFilteredHosts] = useState<Host[]>(hosts);

  useEffect(() => {
    if (!query.trim()) {
      setFilteredHosts(hosts);
      return;
    }

    const q = query.toLowerCase();
    const filtered = hosts.filter(host =>
      host.direccion_ip.toLowerCase().includes(q) ||
      host.hostname?.toLowerCase().includes(q) ||
      host.mac_address?.toLowerCase().includes(q) ||
      host.fabricante?.toLowerCase().includes(q) ||
      host.sistema_operativo?.toLowerCase().includes(q) ||
      host.tipo_dispositivo?.toLowerCase().includes(q)
    );
    setFilteredHosts(filtered);
  }, [hosts, query]);

  return filteredHosts;
}

