import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function GeoAnalytics({ filters }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5555/auth/navics/auth/getGeoTargetByRegion", {
        params: filters,
      })
      .then((res) => setData(res.data))
      .catch(console.error);
  }, [filters]);

  // 🌍 Region → Coordinates (center points)
  const regionCoords = {
    "Asia Pacific Region": [20, 100],
    "Europe Region": [50, 10],
    "North America Region": [40, -100],
  };

  return (
    <div className="bg-white p-4 rounded shadow col-span-2">
      <h3 className="mb-2 font-semibold">🌍 Geo Target Analysis</h3>

      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {data.map((item, index) => {
          const coords = regionCoords[item.region_name];

          if (!coords) return null;

          return (
            <CircleMarker
              key={index}
              center={coords}
              radius={Math.sqrt(item.target) / 500} // size based on value
              pathOptions={{ color: "#2bc155", fillColor: "#2bc155" }}
            >
              <Popup>
                <strong>{item.region_name}</strong>
                <br />
                Target: {item.target.toLocaleString()}
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}