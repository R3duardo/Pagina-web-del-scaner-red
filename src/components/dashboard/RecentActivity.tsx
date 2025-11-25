'use client';

import { Card, CardHeader, CardTitle, Badge } from '@/components/common';
import { formatRelativeTime } from '@/utils/formatters';
import { getPortSecurityLevel, SECURITY_COLORS } from '@/constants/ports';

interface ActivityItem {
  hostname: string;
  direccion_ip: string;
  numero_puerto: number;
  nombre_servicio: string;
  protocolo: string;
  fecha_deteccion: string;
}

interface RecentActivityProps {
  activity: ActivityItem[];
}

export function RecentActivity({ activity }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad Reciente</CardTitle>
      </CardHeader>
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {activity.length === 0 ? (
          <p className="text-sm text-neutral-500 text-center py-4">
            No hay actividad reciente
          </p>
        ) : (
          activity.slice(0, 10).map((item, index) => {
            const level = getPortSecurityLevel(item.numero_puerto);
            const colors = SECURITY_COLORS[level];
            
            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full`}
                    style={{ backgroundColor: colors.fill }}
                  />
                  <div>
                    <p className="text-sm text-neutral-200">
                      {item.hostname || item.direccion_ip}
                    </p>
                    <p className="text-xs text-neutral-500">
                      Puerto {item.numero_puerto} ({item.nombre_servicio})
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="default" size="sm">
                    {item.protocolo}
                  </Badge>
                  <p className="text-xs text-neutral-500 mt-1">
                    {formatRelativeTime(item.fecha_deteccion)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}

export default RecentActivity;
