'use client';

import { Card } from '@/components/common';
import { HostsIcon, PortIcon, ActivityIcon, AlertIcon } from '@/components/icons';
import { formatNumber } from '@/utils/formatters';

interface StatsCardsProps {
  totalHosts: number;
  activeHosts: number;
  totalPorts: number;
  securityIssues: number;
}

export function StatsCards({ totalHosts, activeHosts, totalPorts, securityIssues }: StatsCardsProps) {
  const stats = [
    {
      name: 'Total Dispositivos',
      value: totalHosts,
      icon: HostsIcon,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      name: 'Activos',
      value: activeHosts,
      icon: ActivityIcon,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
    },
    {
      name: 'Puertos Abiertos',
      value: totalPorts,
      icon: PortIcon,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
    {
      name: 'Alertas Seguridad',
      value: securityIssues,
      icon: AlertIcon,
      color: securityIssues > 0 ? 'text-red-400' : 'text-emerald-400',
      bgColor: securityIssues > 0 ? 'bg-red-500/10' : 'bg-emerald-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.name} padding="md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">
                  {stat.name}
                </p>
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {formatNumber(stat.value)}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

export default StatsCards;
