'use client';

import { Card, CardHeader, CardTitle } from '@/components/common';
import { SecurityStats } from '@/types/network';
import { SECURITY_COLORS, SECURITY_LABELS, SecurityLevel } from '@/constants/ports';
import { CheckIcon, AlertIcon, XIcon } from '@/components/icons';

interface SecurityOverviewProps {
  stats: SecurityStats[];
  totalPorts: number;
}

export function SecurityOverview({ stats, totalPorts }: SecurityOverviewProps) {
  const getIcon = (level: SecurityLevel) => {
    switch (level) {
      case 'secure':
        return <CheckIcon className="w-4 h-4" />;
      case 'caution':
      case 'warning':
        return <AlertIcon className="w-4 h-4" />;
      case 'insecure':
        return <XIcon className="w-4 h-4" />;
    }
  };

  // Calcular score de seguridad
  const secureCount = stats.find(s => s.level === 'secure')?.count || 0;
  const insecureCount = stats.find(s => s.level === 'insecure')?.count || 0;
  const warningCount = stats.find(s => s.level === 'warning')?.count || 0;
  
  const securityScore = totalPorts > 0
    ? Math.round(((secureCount * 100) - (insecureCount * 50) - (warningCount * 20)) / totalPorts)
    : 100;
  
  const clampedScore = Math.max(0, Math.min(100, securityScore));

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen de Seguridad</CardTitle>
      </CardHeader>
      
      {/* Score */}
      <div className="text-center mb-6">
        <div className={`text-5xl font-bold ${getScoreColor(clampedScore)}`}>
          {clampedScore}
        </div>
        <p className="text-xs text-neutral-500 mt-1">Puntuación de Seguridad</p>
      </div>

      {/* Breakdown */}
      <div className="space-y-3">
        {stats.map((stat) => {
          const colors = SECURITY_COLORS[stat.level];
          return (
            <div key={stat.level} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={colors.text}>
                  {getIcon(stat.level)}
                </span>
                <span className="text-sm text-neutral-300">
                  {SECURITY_LABELS[stat.level]}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-24 h-2 bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${stat.percentage}%`,
                      backgroundColor: colors.fill,
                    }}
                  />
                </div>
                <span className="text-sm text-neutral-400 w-12 text-right">
                  {stat.count}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export default SecurityOverview;
