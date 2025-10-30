import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function PredictionMiniChart({ items }) {
  if (!items || items.length === 0) return null;
  const data = items.slice(0, 12).map((p, idx) => {
    const factors = typeof p.factors_considered === 'string' ? JSON.parse(p.factors_considered) : p.factors_considered || {};
    const distance = Number(factors.distance) || 0;
    const totalFuel = Number(p.predicted_consumption || p.totalFuelNeeded || 0);
    const efficiency = distance > 0 && totalFuel > 0 ? distance / totalFuel : 0;
    return {
      idx: idx + 1,
      load: Number(factors.averageLoad) || 0,
      efficiency,
      distance,
    };
  }).filter(d => d.load > 0 && d.efficiency > 0);

  if (data.length === 0) return null;

  return (
    <div className="charts-container" style={{ marginTop: 12 }}>
      <h2>Efficiency vs Load (last 12)</h2>
      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="load" tickFormatter={(v) => `${v} kg`} />
            <YAxis yAxisId="left" tickFormatter={(v) => `${v.toFixed ? v.toFixed(1) : v} km/l`} />
            <Tooltip />
            <Line yAxisId="left" type="monotone" dataKey="efficiency" stroke="#22c55e" dot={false} name="Efficiency (km/l)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}


