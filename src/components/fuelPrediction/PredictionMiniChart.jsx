import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function PredictionMiniChart({ items }) {
  if (!items || items.length === 0) return null;

  const safeParseFactors = (raw) => {
    try {
      return typeof raw === 'string' ? JSON.parse(raw) : (raw || {});
    } catch (_) {
      return {};
    }
  };

  const data = items
    .slice(-12)
    .map((p, idx) => {
      const factors = safeParseFactors(p.factors_considered);
      const distance = Number(factors.distance) || 0;
      const totalFuel = Number(p.predicted_consumption || p.totalFuelNeeded || 0);
      const efficiency = distance > 0 && totalFuel > 0 ? distance / totalFuel : 0;
      return {
        idx: idx + 1,
        load: Number(factors.averageLoad) || 0,
        efficiency,
        distance,
      };
    })
    .filter((d) => d.load > 0 && d.efficiency > 0)
    .sort((a, b) => a.load - b.load);

  if (data.length === 0) return null;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const entry = payload[0];
      const { payload: row } = entry;
      return (
        <div style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
          borderRadius: 8,
          padding: '8px 10px',
          fontSize: 12,
          color: '#111827'
        }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Load: {row.load} kg</div>
          <div style={{ color: '#047857' }}>Efficiency: {row.efficiency.toFixed ? row.efficiency.toFixed(2) : row.efficiency} km/l</div>
          {row.distance > 0 && (
            <div style={{ marginTop: 2, color: '#6b7280' }}>Distance: {row.distance}</div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="charts-container" style={{ marginTop: 16 }}>
      <div style={{
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        padding: 12,
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#111827' }}>Efficiency vs Load</h3>
          <span style={{ fontSize: 12, color: '#6b7280' }}>last 12 valid entries</span>
        </div>
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="load"
                tickFormatter={(v) => `${v} kg`}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <YAxis
                yAxisId="left"
                tickFormatter={(v) => `${v.toFixed ? v.toFixed(1) : v} km/l`}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="efficiency"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
                name="Efficiency (km/l)"
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}


