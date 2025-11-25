'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { SecurityStats } from '@/types/network';
import { SECURITY_COLORS, SECURITY_LABELS, SecurityLevel } from '@/constants/ports';
import { Card, CardHeader, CardTitle } from '@/components/common';

interface SecurityPieChartProps {
  data: SecurityStats[];
  title: string;
  showLegend?: boolean;
}

interface TooltipPayload {
  name: string;
  value: number;
  level: SecurityLevel;
  percentage: number;
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

export function SecurityPieChart({ data, title, showLegend = true }: SecurityPieChartProps) {
  const chartData = data.map(item => ({
    name: SECURITY_LABELS[item.level],
    value: item.count,
    level: item.level,
    percentage: item.percentage,
  }));

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 shadow-xl">
          <p className="text-sm font-medium text-neutral-200">{data.name}</p>
          <p className="text-xs text-neutral-400">
            {data.value} puertos ({data.percentage.toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const renderLegend = (props: CustomLegendProps) => {
    const { payload } = props;
    return (
      <ul className="flex flex-wrap justify-center gap-4 mt-4">
        {payload?.map((entry, index) => (
          <li key={`legend-${index}`} className="flex items-center gap-2 text-xs text-neutral-400">
            <span
              className="w-3 h-3 rounded-full"
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
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={SECURITY_COLORS[entry.level as SecurityLevel].fill}
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            {showLegend && <Legend content={renderLegend} />}
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default SecurityPieChart;
