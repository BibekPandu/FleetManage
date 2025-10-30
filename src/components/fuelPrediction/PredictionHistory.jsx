import React, { useState } from "react";

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

export default function PredictionHistory({ items = [], reloadHistory }) {
  const [resetting, setResetting] = useState(false);
  const [resetError, setResetError] = useState(null);

  const handleReset = async () => {
    setResetting(true);
    setResetError(null);
    try {
      const token = localStorage.getItem("fleetfox_token");
      const res = await fetch((process.env.REACT_APP_API_BASE_URL || "") + "/fuel-prediction/reset-history", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Reset failed");
      if (reloadHistory) reloadHistory();
    } catch (e) {
      setResetError(e.message);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="charts-container" style={{ marginTop: 16, overflowX: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <h2 style={{ margin: 0 }}>Recent Fuel Predictions</h2>
        <button className="form-button" style={{ maxWidth: 150, fontSize: "0.9rem", padding: "7px" }} onClick={handleReset} disabled={resetting}>{resetting ? "Resetting..." : "Reset History"}</button>
      </div>
      {resetError && <div style={{ color: "#c62828", fontSize: "0.95rem", textAlign: "center", marginBottom: 7 }}>{resetError}</div>}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", minWidth: 700, borderCollapse: "collapse", border: "1px solid #e0e7ef", borderRadius: 8, fontSize: "0.98rem" }}>
          <thead style={{ background: "#e5ecfa" }}>
            <tr>
              <th style={{ padding: "10px 8px", border: "1px solid #e0e7ef", fontWeight: 700 }}>Date</th>
              <th style={{ padding: "10px 8px", border: "1px solid #e0e7ef", fontWeight: 700 }}>Vehicle Type</th>
              <th style={{ padding: "10px 8px", border: "1px solid #e0e7ef", fontWeight: 700 }}>Engine</th>
              <th style={{ padding: "10px 8px", border: "1px solid #e0e7ef", fontWeight: 700 }}>Distance (km)</th>
              <th style={{ padding: "10px 8px", border: "1px solid #e0e7ef", fontWeight: 700 }}>Fuel/100km</th>
              <th style={{ padding: "10px 8px", border: "1px solid #e0e7ef", fontWeight: 700 }}>Total Fuel</th>
              <th style={{ padding: "10px 8px", border: "1px solid #e0e7ef", fontWeight: 700 }}>Cost (NPR)</th>
              <th style={{ padding: "10px 8px", border: "1px solid #e0e7ef", fontWeight: 700 }}>Efficiency (km/l)</th>
            </tr>
          </thead>
          <tbody>
            {(!items || items.length === 0) ? (
              <tr><td colSpan={8} style={{ textAlign: "center", padding: 24, color: "#888", fontSize: "1.1rem" }}>No predictions yet.</td></tr>
            ) : items.map((p) => {
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
                  <td style={{ padding: 8, border: "1px solid #e0e7ef" }}>{created.toLocaleString()}</td>
                  <td style={{ padding: 8, border: "1px solid #e0e7ef" }}>{factors.vehicleType || "-"}</td>
                  <td style={{ padding: 8, border: "1px solid #e0e7ef" }}>{factors.engineType || "-"}</td>
                  <td style={{ padding: 8, border: "1px solid #e0e7ef", textAlign: "right" }}>{distance || "-"}</td>
                  <td style={{ padding: 8, border: "1px solid #e0e7ef", textAlign: "right" }}>{fmt(per100)}</td>
                  <td style={{ padding: 8, border: "1px solid #e0e7ef", textAlign: "right" }}>{fmt(totalFuel)}</td>
                  <td style={{ padding: 8, border: "1px solid #e0e7ef", textAlign: "right" }}>{fmt(cost)}</td>
                  <td style={{ padding: 8, border: "1px solid #e0e7ef", textAlign: "right" }}>{fmt(efficiency)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}


