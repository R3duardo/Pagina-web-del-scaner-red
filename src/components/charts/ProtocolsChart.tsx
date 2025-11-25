'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardHeader, CardTitle } from '@/components/common';

interface ProtocolData {
  protocolo: string;
  count: number;
  percentage: number;
}

interface ProtocolsChartProps {
  data: ProtocolData[];
  title: string;
}

interface TooltipPayload {
  protocolo: string;
  count: number;
  percentage: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { payload: TooltipPayload }[];
}

const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];

export function ProtocolsChart({ data, title }: ProtocolsChartProps) {
  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 shadow-xl">
          <p className="text-sm font-medium text-neutral-200">{data.protocolo}</p>
          <p className="text-xs text-neutral-400">
            {data.count} conexiones ({data.percentage.toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20 }}>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="protocolo"
              tick={{ fill: '#a3a3a3', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default ProtocolsChart;
