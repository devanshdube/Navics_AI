import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function GeoCouAnalytics({ filters }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5555/auth/navics/auth/getGeoByCountry", {
        params: filters,
      })
      .then((res) => setData(res.data))
      .catch(console.error);
  }, [filters]);

  // 🌍 Country → Coordinates
  const countryCoords = {
    China: [35, 103],
    Germany: [51, 10],
    Canada: [56, -106],
    "United States": [37, -95],
    Turkey: [39, 35],
    Spain: [40, -4],
    Italy: [42, 12],
    Netherlands: [52, 5],
    Indonesia: [-5, 120],
    Thailand: [15, 101],
    Korea: [36, 128],
    Vietnam: [16, 107],
  };

  return (
    <div className="bg-white p-4 rounded shadow col-span-2">
      <h3 className="mb-2 font-semibold">🌍 Country Revenue Analysis</h3>

      <MapContainer center={[20, 0]} zoom={2} style={{ height: "400px" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {data.map((item, index) => {
          const coords = countryCoords[item.country_name];

          if (!coords) return null;

          return (
            <CircleMarker
              key={index}
              center={coords}
              radius={Math.sqrt(item.revenue) / 1000}
              pathOptions={{ color: "#3b82f6", fillColor: "#3b82f6" }}
            >
              <Popup>
                <strong>{item.country_name}</strong>
                <br />
                Revenue: {item.revenue.toLocaleString()}
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}