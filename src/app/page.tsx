'use client';

import { useState } from 'react';
import { MainLayout, Header } from '@/components/layout';
import { StatsCards, RecentActivity, SecurityOverview } from '@/components/dashboard';
import { SecurityPieChart, ProtocolsChart, ServicesChart } from '@/components/charts';
import { HostList } from '@/components/hosts';
import { LoadingOverlay } from '@/components/common';
import { useHosts, useHostSearch } from '@/hooks/useHosts';
import { useStats, useRecentActivity } from '@/hooks/useStats';
import { calculateSecurityStats, calculateProtocolStats, calculateServiceStats } from '@/utils/security';
import { getPortSecurityLevel } from '@/constants/ports';

export default function Dashboard() {
  const { hosts, loading: hostsLoading, refetch: refetchHosts } = useHosts();
  const { stats, refetch: refetchStats } = useStats();
  const { activity, refetch: refetchActivity } = useRecentActivity(24);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHosts = useHostSearch(hosts, searchQuery);
  const securityStats = calculateSecurityStats(hosts);
  const protocolStats = calculateProtocolStats(hosts);
  const serviceStats = calculateServiceStats(hosts);

  // Calcular alertas de seguridad
  const securityIssues = hosts.reduce((acc, host) => {
    return acc + host.puertos.filter(p => 
      getPortSecurityLevel(p.numero_puerto) === 'insecure'
    ).length;
  }, 0);

  const handleRefresh = () => {
    refetchHosts();
    refetchStats();
    refetchActivity();
  };

  if (hostsLoading && hosts.length === 0) {
    return (
      <MainLayout>
        <div className="h-screen flex items-center justify-center">
          <LoadingOverlay message="Cargando dashboard..." />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Header
        title="Dashboard"
        subtitle="Monitoreo de red en tiempo real"
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
        onRefresh={handleRefresh}
      />

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <StatsCards
          totalHosts={stats?.total_equipos || hosts.length}
          activeHosts={stats?.equipos_activos || hosts.filter(h => h.estado === 'activo').length}
          totalPorts={stats?.total_registros_puertos || hosts.reduce((acc, h) => acc + h.puertos.length, 0)}
          securityIssues={securityIssues}
        />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SecurityPieChart
            data={securityStats}
            title="Distribución de Seguridad"
          />
          <ProtocolsChart
            data={protocolStats}
            title="Protocolos Utilizados"
          />
          <SecurityOverview
            stats={securityStats}
            totalPorts={hosts.reduce((acc, h) => acc + h.puertos.length, 0)}
          />
        </div>

        {/* Activity and Services */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivity activity={activity} />
          <ServicesChart
            data={serviceStats}
            title="Servicios Detectados"
          />
        </div>

        {/* Hosts List */}
        <div>
          <h2 className="text-lg font-semibold text-neutral-200 mb-4">
            Dispositivos Recientes
          </h2>
          <HostList
            hosts={filteredHosts.slice(0, 4)}
            loading={hostsLoading}
            emptyMessage="No se han detectado dispositivos. Inicia un escaneo."
          />
        </div>
    </div>
    </MainLayout>
  );
}
