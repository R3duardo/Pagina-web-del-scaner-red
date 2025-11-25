'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardHeader, CardTitle } from '@/components/common';
import { SECURITY_COLORS, SecurityLevel } from '@/constants/ports';

interface ServiceData {
  servicio: string;
  count: number;
  level: SecurityLevel;
}

interface ServicesChartProps {
  data: ServiceData[];
  title: string;
}

interface ChartData {
  name: string;
  value: number;
  level: SecurityLevel;
}

interface TooltipPayload {
  name: string;
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { payload: TooltipPayload }[];
}

interface LegendPayload {
  color: string;
  value: string;
}

interface CustomLegendProps {
  payload?: LegendPayload[];
}

export function ServicesChart({ data, title }: ServicesChartProps) {
  const chartData: ChartData[] = data.map(item => ({
    name: item.servicio,
    value: item.count,
    level: item.level,
  }));

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 shadow-xl">
          <p className="text-sm font-medium text-neutral-200">{data.name}</p>
          <p className="text-xs text-neutral-400">{data.value} instancias</p>
        </div>
      );
    }
    return null;
  };

  const renderLegend = (props: CustomLegendProps) => {
    const { payload } = props;
    return (
      <ul className="flex flex-wrap justify-center gap-3 mt-4 max-h-28 overflow-y-auto">
        {payload?.map((entry, index) => (
          <li key={`legend-${index}`} className="flex items-center gap-1.5 text-[10px] text-neutral-400">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            {entry.value}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={1}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={SECURITY_COLORS[entry.level].fill}
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={renderLegend} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default ServicesChart;
