import React from "react";

const DEFAULT_PRICES = {
  diesel: 175,
  gasoline: 190,
  electric: 0,
  hybrid: 185,
};

function fmt(n) {
  if (n === null || n === undefined || Number.isNaN(Number(n))) return "-";
  return Number(n).toFixed(2);
}

export default function PredictionHistory({ items }) {
  if (!items || items.length === 0) {
    return null;
  }
  return (
    <div className="charts-container" style={{ marginTop: 16 }}>
      <h2>Recent Fuel Predictions</h2>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: 8 }}>Date</th>
              <th style={{ textAlign: "left", padding: 8 }}>Vehicle Type</th>
              <th style={{ textAlign: "left", padding: 8 }}>Engine</th>
              <th style={{ textAlign: "right", padding: 8 }}>Distance (km)</th>
              <th style={{ textAlign: "right", padding: 8 }}>Fuel/100km</th>
              <th style={{ textAlign: "right", padding: 8 }}>Total Fuel</th>
              <th style={{ textAlign: "right", padding: 8 }}>Cost (NPR)</th>
              <th style={{ textAlign: "right", padding: 8 }}>Efficiency (km/l)</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => {
              const factors = typeof p.factors_considered === "string" ? JSON.parse(p.factors_considered) : p.factors_considered || {};
              const created = p.created_at ? new Date(p.created_at) : new Date(p.predicted_date || Date.now());
              const distance = Number(factors.distance) || 0;
              const engine = (factors.engineType || "").toLowerCase();
              const totalFuel = Number(p.predicted_consumption || p.totalFuelNeeded || 0);
              const per100 = distance > 0 && totalFuel > 0 ? (totalFuel / distance) * 100 : null;
              const efficiency = distance > 0 && totalFuel > 0 ? distance / totalFuel : null;
              const price = typeof factors.fuelPriceNPR === "number" ? factors.fuelPriceNPR : (DEFAULT_PRICES[engine] ?? DEFAULT_PRICES.diesel);
              const cost = totalFuel > 0 ? totalFuel * price : null;
              return (
                <tr key={p.id}>
                  <td style={{ padding: 8 }}>{created.toLocaleString()}</td>
                  <td style={{ padding: 8 }}>{factors.vehicleType || "-"}</td>
                  <td style={{ padding: 8 }}>{factors.engineType || "-"}</td>
                  <td style={{ padding: 8, textAlign: "right" }}>{distance || "-"}</td>
                  <td style={{ padding: 8, textAlign: "right" }}>{fmt(per100)}</td>
                  <td style={{ padding: 8, textAlign: "right" }}>{fmt(totalFuel)}</td>
                  <td style={{ padding: 8, textAlign: "right" }}>{fmt(cost)}</td>
                  <td style={{ padding: 8, textAlign: "right" }}>{fmt(efficiency)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}


