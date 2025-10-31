import React, { useCallback, useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from "react-leaflet";
import L from "leaflet";

// Fix default marker icons path in CRA
import marker2x from "leaflet/dist/images/marker-icon-2x.png";
import marker1x from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: marker2x,
  iconUrl: marker1x,
  shadowUrl: markerShadow,
});

const ClickHandler = ({ onClick }) => {
  useMapEvents({
    click(e) {
      onClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

const MapPage = () => {
  const [start, setStart] = useState(null); // [lat, lng]
  const [end, setEnd] = useState(null); // [lat, lng]
  const [routeCoords, setRouteCoords] = useState([]); // [[lat, lng], ...]
  const [selecting, setSelecting] = useState("start"); // "start" | "end"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const center = useMemo(() => ({ lat: 27.7172, lng: 85.3240 }), []); // Kathmandu default

  const handleMapClick = useCallback(
    (latlng) => {
      if (selecting === "start") {
        setStart(latlng);
        setSelecting("end");
      } else {
        setEnd(latlng);
      }
      setError("");
      setRouteCoords([]);
    },
    [selecting]
  );

  const swapPoints = () => {
    setStart(end);
    setEnd(start);
    setRouteCoords([]);
    setError("");
  };

  const clearAll = () => {
    setStart(null);
    setEnd(null);
    setRouteCoords([]);
    setSelecting("start");
    setError("");
  };

  const fetchRoute = useCallback(async () => {
    if (!start || !end) return;
    setLoading(true);
    setError("");
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Routing failed: ${res.status}`);
      const data = await res.json();
      if (!data.routes || !data.routes[0]) throw new Error("No route found");
      const coords = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
      setRouteCoords(coords);
    } catch (e) {
      setError(e.message || "Failed to fetch route");
      setRouteCoords([]);
    } finally {
      setLoading(false);
    }
  }, [start, end]);

  useEffect(() => {
    // Auto-fetch when both points chosen
    if (start && end) {
      fetchRoute();
    }
  }, [start, end, fetchRoute]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div className="dashboard-card" style={{ padding: 12 }}>
        <h2 style={{ marginTop: 0 }}>Map Routing</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
          <div>
            <strong>Selection:</strong> {selecting === "start" ? "Click to set Start" : "Click to set End"}
          </div>
          <button className="button" onClick={() => setSelecting("start")}>Set Start</button>
          <button className="button" onClick={() => setSelecting("end")}>Set End</button>
          <button className="button" onClick={swapPoints} disabled={!start || !end}>Swap</button>
          <button className="button" onClick={clearAll}>Clear</button>
          <button className="button" onClick={fetchRoute} disabled={!start || !end || loading}>
            {loading ? "Finding route..." : "Find Optimal Route"}
          </button>
          {error && <span style={{ color: "#c00" }}>{error}</span>}
        </div>
        <div style={{ marginTop: 8, display: "flex", gap: 16, fontSize: 14 }}>
          <div>
            <strong>Start:</strong> {start ? `${start[0].toFixed(5)}, ${start[1].toFixed(5)}` : "—"}
          </div>
          <div>
            <strong>End:</strong> {end ? `${end[0].toFixed(5)}, ${end[1].toFixed(5)}` : "—"}
          </div>
        </div>
      </div>

      <div className="dashboard-card" style={{ overflow: "hidden" }}>
        <div style={{ height: 520, width: "100%" }}>
          <MapContainer center={center} zoom={12} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ClickHandler onClick={handleMapClick} />
            {start && <Marker position={start} />}
            {end && <Marker position={end} />}
            {routeCoords.length > 0 && (
              <Polyline positions={routeCoords} color="#1976d2" weight={5} opacity={0.85} />
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
