'use client';

import { useState, useEffect } from 'react';
import { MainLayout, Header } from '@/components/layout';
import { Card, CardHeader, CardTitle, SecurityBadge } from '@/components/common';
import { SecurityPieChart } from '@/components/charts';
import { EditNameButton } from '@/components/hosts/DeviceNameEditor';
import { useHosts } from '@/hooks/useHosts';
import { useDeviceNames } from '@/hooks/useDeviceNames';
import { calculateSecurityStats, analyzeHostSecurity } from '@/utils/security';
import { 
  SECURITY_COLORS, 
  SECURE_PORTS,
  CAUTION_PORTS,
  WARNING_PORTS,
  INSECURE_PORTS,
  SecurityLevel 
} from '@/constants/ports';
import { CheckIcon, XIcon, AlertIcon, ChevronDownIcon } from '@/components/icons';

function SecurityContent() {
  const { hosts, refetch } = useHosts();
  const { getDisplayName, refetch: refetchNames } = useDeviceNames();
  const securityStats = calculateSecurityStats(hosts);

  // Analizar cada host
  const hostAnalysis = hosts.map(host => ({
    host,
    analysis: analyzeHostSecurity(host),
    displayName: getDisplayName(host.id, host.hostname)
  })).sort((a, b) => a.analysis.score - b.analysis.score);

  // Hosts con problemas
  const hostsWithIssues = hostAnalysis.filter(h => h.analysis.level !== 'secure');

  const handleRefresh = () => {
    refetch();
    refetchNames();
  };

  return (
    <>
      <Header
        title="Seguridad"
        subtitle="Análisis de vulnerabilidades y riesgos"
        onRefresh={handleRefresh}
        showScan={false}
      />

      <div className="p-6 space-y-6">
        {/* Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SecurityPieChart
            data={securityStats}
            title="Estado de Seguridad"
          />
          
          {/* Hosts at Risk */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Dispositivos con Alertas</CardTitle>
            </CardHeader>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {hostsWithIssues.length === 0 ? (
                <div className="text-center py-8">
                  <CheckIcon className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                  <p className="text-emerald-400 font-medium">Red Segura</p>
                  <p className="text-sm text-neutral-500">No se detectaron vulnerabilidades críticas</p>
                </div>
              ) : (
                hostsWithIssues.map(({ host, analysis, displayName }) => (
                  <HostAlertItem 
                    key={host.id}
                    host={host}
                    analysis={analysis}
                    displayName={displayName}
                    onNameChange={() => refetchNames()}
                  />
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Port Security Reference */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <PortCategoryCard
            title="Puertos Seguros"
            level="secure"
            ports={SECURE_PORTS}
            icon={<CheckIcon className="w-5 h-5" />}
          />
          <PortCategoryCard
            title="Precaución"
            level="caution"
            ports={CAUTION_PORTS}
            icon={<AlertIcon className="w-5 h-5" />}
          />
          <PortCategoryCard
            title="Advertencia"
            level="warning"
            ports={WARNING_PORTS}
            icon={<AlertIcon className="w-5 h-5" />}
          />
          <PortCategoryCard
            title="Inseguros"
            level="insecure"
            ports={INSECURE_PORTS}
            icon={<XIcon className="w-5 h-5" />}
          />
        </div>

        {/* Detailed Issues */}
        {hostsWithIssues.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Detalle de Problemas Detectados</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              {hostsWithIssues.slice(0, 10).map(({ host, analysis, displayName }) => (
                <ExpandableIssueCard 
                  key={host.id}
                  host={host}
                  analysis={analysis}
                  displayName={displayName}
                  onNameChange={() => refetchNames()}
                />
              ))}
            </div>
          </Card>
        )}
      </div>
    </>
  );
}

// Componente para cada host con alertas
function HostAlertItem({ 
  host, 
  analysis, 
  displayName,
  onNameChange 
}: { 
  host: any; 
  analysis: any; 
  displayName: string;
  onNameChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-colors">
      <div className="flex items-center gap-3">
        <SecurityBadge level={analysis.level} showLabel={false} />
        <div>
          <p className="font-mono text-sm text-neutral-200">{host.direccion_ip}</p>
          {displayName ? (
            <p className="text-xs text-blue-400">{displayName}</p>
          ) : (
            <EditNameButton
              equipoId={host.id}
              currentName={host.hostname}
              customName={null}
              onNameChange={onNameChange}
            />
          )}
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm text-neutral-400">Score: {analysis.score}</p>
        <p className="text-xs text-neutral-500">{analysis.issues.length} alertas</p>
      </div>
    </div>
  );
}

// Componente expandible para ver todos los issues
function ExpandableIssueCard({ 
  host, 
  analysis, 
  displayName,
  onNameChange 
}: { 
  host: any; 
  analysis: any; 
  displayName: string;
  onNameChange: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const visibleIssues = expanded ? analysis.issues : analysis.issues.slice(0, 3);
  const hasMore = analysis.issues.length > 3;

  return (
    <div className="p-4 rounded-lg bg-neutral-800/30">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <SecurityBadge level={analysis.level} />
          <span className="font-mono text-neutral-200">{host.direccion_ip}</span>
          {displayName ? (
            <span className="text-blue-400 text-sm">({displayName})</span>
          ) : (
            <EditNameButton
              equipoId={host.id}
              currentName={host.hostname}
              customName={null}
              onNameChange={onNameChange}
            />
          )}
        </div>
        {hasMore && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            {expanded ? 'Ver menos' : `+${analysis.issues.length - 3} más`}
            <ChevronDownIcon className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>
      <ul className="space-y-1">
        {visibleIssues.map((issue: string, idx: number) => (
          <li key={idx} className="text-sm text-neutral-400 flex items-start gap-2">
            <span className="text-neutral-600 mt-0.5">•</span>
            {issue}
          </li>
        ))}
      </ul>
    </div>
  );
}

function PortCategoryCard({
  title,
  level,
  ports,
  icon
}: {
  title: string;
  level: SecurityLevel;
  ports: { port: number; service: string }[];
  icon: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  const colors = SECURITY_COLORS[level];
  const visiblePorts = expanded ? ports : ports.slice(0, 5);
  const hasMore = ports.length > 5;

  return (
    <Card className={`${colors.bg} ${colors.border} border`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={colors.text}>{icon}</span>
          <h3 className={`font-medium ${colors.text}`}>{title}</h3>
        </div>
        <span className="text-xs text-neutral-500">{ports.length}</span>
      </div>
      <div className="space-y-1">
        {visiblePorts.map(p => (
          <div key={p.port} className="flex items-center justify-between text-sm">
            <span className="font-mono text-neutral-300">{p.port}</span>
            <span className="text-neutral-500 text-xs">{p.service}</span>
          </div>
        ))}
        {hasMore && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full text-xs text-blue-400 hover:text-blue-300 pt-2 transition-colors flex items-center justify-center gap-1"
          >
            {expanded ? 'Ver menos' : `+${ports.length - 5} más`}
            <ChevronDownIcon className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>
    </Card>
  );
}

export default function SecurityPage() {
  return (
    <MainLayout>
      <SecurityContent />
    </MainLayout>
  );
}
