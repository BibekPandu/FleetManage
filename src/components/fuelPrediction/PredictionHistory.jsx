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
  const API_BASE =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

  const safeParseFactors = (raw) => {
    try {
      return typeof raw === "string" ? JSON.parse(raw) : raw || {};
    } catch (_) {
      return {};
    }
  };

  const handleReset = async () => {
    setResetting(true);
    setResetError(null);
    try {
      const token = localStorage.getItem("fleetfox_token");
      const res = await fetch(`${API_BASE}/fuel-prediction/reset-history`, {
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
    <div className="charts-container" style={{ marginTop: 16 }}>
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 12,
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 8,
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 600,
              color: "#111827",
            }}
          >
            Recent Fuel Predictions
          </h3>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#6b7280" }}>
              {items.length} total
            </span>
            <button
              className="form-button"
              style={{ maxWidth: 150, fontSize: "0.9rem", padding: "7px" }}
              onClick={handleReset}
              disabled={resetting}
            >
              {resetting ? "Resetting..." : "Reset History"}
            </button>
          </div>
        </div>
        {resetError && (
          <div
            style={{
              color: "#c62828",
              fontSize: "0.95rem",
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            {resetError}
          </div>
        )}
        <div
          style={{
            overflowX: "auto",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
          }}
        >
          <table
            style={{
              width: "100%",
              minWidth: 760,
              borderCollapse: "separate",
              borderSpacing: 0,
              fontSize: "0.96rem",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    position: "sticky",
                    top: 0,
                    background: "#f9fafb",
                    padding: "10px 10px",
                    borderBottom: "1px solid #e5e7eb",
                    textAlign: "left",
                    fontWeight: 700,
                  }}
                >
                  Date
                </th>
                <th
                  style={{
                    position: "sticky",
                    top: 0,
                    background: "#f9fafb",
                    padding: "10px 10px",
                    borderBottom: "1px solid #e5e7eb",
                    textAlign: "left",
                    fontWeight: 700,
                  }}
                >
                  Vehicle Type
                </th>
                <th
                  style={{
                    position: "sticky",
                    top: 0,
                    background: "#f9fafb",
                    padding: "10px 10px",
                    borderBottom: "1px solid #e5e7eb",
                    textAlign: "left",
                    fontWeight: 700,
                  }}
                >
                  Engine
                </th>
                <th
                  style={{
                    position: "sticky",
                    top: 0,
                    background: "#f9fafb",
                    padding: "10px 10px",
                    borderBottom: "1px solid #e5e7eb",
                    textAlign: "right",
                    fontWeight: 700,
                  }}
                >
                  Distance (km)
                </th>
                <th
                  style={{
                    position: "sticky",
                    top: 0,
                    background: "#f9fafb",
                    padding: "10px 10px",
                    borderBottom: "1px solid #e5e7eb",
                    textAlign: "right",
                    fontWeight: 700,
                  }}
                >
                  Fuel/100km
                </th>
                <th
                  style={{
                    position: "sticky",
                    top: 0,
                    background: "#f9fafb",
                    padding: "10px 10px",
                    borderBottom: "1px solid #e5e7eb",
                    textAlign: "right",
                    fontWeight: 700,
                  }}
                >
                  Total Fuel
                </th>
                <th
                  style={{
                    position: "sticky",
                    top: 0,
                    background: "#f9fafb",
                    padding: "10px 10px",
                    borderBottom: "1px solid #e5e7eb",
                    textAlign: "right",
                    fontWeight: 700,
                  }}
                >
                  Cost (NPR)
                </th>
                <th
                  style={{
                    position: "sticky",
                    top: 0,
                    background: "#f9fafb",
                    padding: "10px 10px",
                    borderBottom: "1px solid #e5e7eb",
                    textAlign: "right",
                    fontWeight: 700,
                  }}
                >
                  Efficiency (km/l)
                </th>
              </tr>
            </thead>
            <tbody>
              {!items || items.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      textAlign: "center",
                      padding: 24,
                      color: "#6b7280",
                      fontSize: "1.02rem",
                    }}
                  >
                    No predictions yet.
                  </td>
                </tr>
              ) : (
                items.map((p, index) => {
                  const factors = safeParseFactors(p.factors_considered);
                  const created = p.created_at
                    ? new Date(p.created_at)
                    : new Date(p.predicted_date || Date.now());
                  const distance = Number(factors.distance) || 0;
                  const engine = (factors.engineType || "").toLowerCase();
                  const totalFuel = Number(
                    p.predicted_consumption || p.totalFuelNeeded || 0
                  );
                  const per100 =
                    distance > 0 && totalFuel > 0
                      ? (totalFuel / distance) * 100
                      : null;
                  const efficiency =
                    distance > 0 && totalFuel > 0 ? distance / totalFuel : null;
                  const price =
                    typeof factors.fuelPriceNPR === "number"
                      ? factors.fuelPriceNPR
                      : DEFAULT_PRICES[engine] ?? DEFAULT_PRICES.diesel;
                  const cost = totalFuel > 0 ? totalFuel * price : null;
                  return (
                    <tr key={p.id} style={{ background: index % 2 ? "#fcfcfd" : "#fff" }}>
                      <td style={{ padding: 10, borderBottom: "1px solid #eef2f7" }}>
                        {created.toLocaleString()}
                      </td>
                      <td style={{ padding: 10, borderBottom: "1px solid #eef2f7" }}>
                        {factors.vehicleType || "-"}
                      </td>
                      <td style={{ padding: 10, borderBottom: "1px solid #eef2f7" }}>
                        {factors.engineType || "-"}
                      </td>
                      <td style={{ padding: 10, borderBottom: "1px solid #eef2f7", textAlign: "right" }}>
                        {distance || "-"}
                      </td>
                      <td style={{ padding: 10, borderBottom: "1px solid #eef2f7", textAlign: "right" }}>
                        {fmt(per100)}
                      </td>
                      <td style={{ padding: 10, borderBottom: "1px solid #eef2f7", textAlign: "right" }}>
                        {fmt(totalFuel)}
                      </td>
                      <td style={{ padding: 10, borderBottom: "1px solid #eef2f7", textAlign: "right" }}>
                        {fmt(cost)}
                      </td>
                      <td style={{ padding: 10, borderBottom: "1px solid #eef2f7", textAlign: "right" }}>
                        {fmt(efficiency)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
