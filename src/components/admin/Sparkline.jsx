import React, { useMemo } from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

// Données de démo stables (pas de Math.random au render)
const DEMO_DATA = [
  { value: 30 }, { value: 45 }, { value: 28 }, { value: 60 },
  { value: 38 }, { value: 55 }, { value: 42 },
];

const Sparkline = ({ data, color = '#d4af37' }) => {
  const chartData = useMemo(
    () => (Array.isArray(data) && data.length > 1 ? data : DEMO_DATA),
    [data],
  );

  const gradId = `sg-${color.replace('#', '')}`;

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={color} stopOpacity={0.25} />
              <stop offset="95%" stopColor={color} stopOpacity={0}    />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#${gradId})`}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Sparkline;
