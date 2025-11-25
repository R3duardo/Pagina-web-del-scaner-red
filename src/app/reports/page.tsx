'use client';

import { MainLayout, Header } from '@/components/layout';
import { SecurityPieChart, ProtocolsChart, ServicesChart } from '@/components/charts';
import { Card, CardHeader, CardTitle, SecurityBadge } from '@/components/common';
import { useHosts } from '@/hooks/useHosts';
import { 
  calculateSecurityStats, 
  calculateProtocolStats, 
  calculateServiceStats 
} from '@/utils/security';
import { getPortSecurityInfo } from '@/constants/ports';
import { CheckIcon, XIcon, AlertIcon } from '@/components/icons';

export default function ReportsPage() {
  const { hosts, refetch } = useHosts();
  
  const securityStats = calculateSecurityStats(hosts);
  const protocolStats = calculateProtocolStats(hosts);
  const serviceStats = calculateServiceStats(hosts);

  // Separar puertos seguros e inseguros
  const allPorts = hosts.flatMap(h => h.puertos);
  const securePorts = allPorts.filter(p => 
    getPortSecurityInfo(p.numero_puerto).level === 'secure'
  );
  const insecurePorts = allPorts.filter(p => 
    ['insecure', 'warning'].includes(getPortSecurityInfo(p.numero_puerto).level)
  );

  return (
    <MainLayout>
      <Header
        title="Reportes"
        subtitle="Análisis de seguridad de la red"
        onRefresh={refetch}
        showScan={false}
      />

      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-emerald-500/5 border-emerald-500/20">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-emerald-500/10">
                <CheckIcon className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-400">{securePorts.length}</p>
                <p className="text-sm text-neutral-400">Puertos Seguros</p>
              </div>
            </div>
          </Card>

          <Card className="bg-amber-500/5 border-amber-500/20">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-amber-500/10">
                <AlertIcon className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-400">
                  {allPorts.filter(p => 
                    ['caution', 'warning'].includes(getPortSecurityInfo(p.numero_puerto).level)
                  ).length}
                </p>
                <p className="text-sm text-neutral-400">Requieren Atención</p>
              </div>
            </div>
          </Card>

          <Card className="bg-red-500/5 border-red-500/20">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-red-500/10">
                <XIcon className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-400">
                  {allPorts.filter(p => 
                    getPortSecurityInfo(p.numero_puerto).level === 'insecure'
                  ).length}
                </p>
                <p className="text-sm text-neutral-400">Puertos Inseguros</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SecurityPieChart
            data={securityStats}
            title="Distribución General de Seguridad"
          />
          <ProtocolsChart
            data={protocolStats}
            title="Uso de Protocolos"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ServicesChart
            data={serviceStats}
            title="Servicios por Nivel de Seguridad"
          />
          
          {/* Detailed List */}
          <Card>
            <CardHeader>
              <CardTitle>Detalle de Puertos por Seguridad</CardTitle>
            </CardHeader>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {serviceStats.slice(0, 10).map((service, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg bg-neutral-800/50"
                >
                  <div className="flex items-center gap-3">
                    <SecurityBadge level={service.level} showLabel={false} />
                    <span className="text-sm text-neutral-200">{service.servicio}</span>
                  </div>
                  <span className="text-sm text-neutral-400">{service.count} instancias</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Recomendaciones de Seguridad</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {insecurePorts.length > 0 && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="flex items-start gap-3">
                  <XIcon className="w-5 h-5 text-red-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-400">Puertos Críticos Detectados</p>
                    <p className="text-sm text-neutral-400 mt-1">
                      Se encontraron {insecurePorts.length} puertos con riesgo de seguridad alto.
                      Revise los puertos Telnet (23), TFTP (69) y otros servicios sin encriptación.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {securePorts.length > insecurePorts.length && (
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-emerald-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-emerald-400">Buenas Prácticas</p>
                    <p className="text-sm text-neutral-400 mt-1">
                      La mayoría de los puertos detectados ({securePorts.length}) utilizan protocolos seguros.
                      Continúe manteniendo servicios como SSH y HTTPS.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
