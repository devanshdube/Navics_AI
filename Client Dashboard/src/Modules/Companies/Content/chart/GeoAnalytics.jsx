import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useSelector } from "react-redux";

export default function GeoAnalytics() {
  const [data, setData] = useState([]);

  const company_id = useSelector((state) => state.user?.currentUser?.company_id);

  useEffect(() => {
    console.log(company_id);
    if (!company_id) return;
    axios
      .get(`http://localhost:5555/auth/navics/companies/charts/getGeoByCity/${company_id}`)
      .then((res) => setData(res.data))
      .catch(console.error);
  }, [company_id]);

  // 🏙️ City coordinates
  const cityCoords = {
    indore: [22.7196, 75.8577],
    delhi: [28.6139, 77.209],
    jabalpur: [23.1815, 79.9864],
    bhopal: [23.2599, 77.4126],
  };

  return (
    <div className="bg-white p-4 rounded shadow col-span-2">
      <h3 className="mb-2 font-semibold">🏙️ City Target Analysis</h3>

      <MapContainer center={[23, 78]} zoom={4} style={{ height: "400px" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {data.map((item, index) => {
          const coords = cityCoords[item.city?.toLowerCase()];
          if (!coords) return null;

          return (
            <CircleMarker
              key={index}
              center={coords}
              radius={Math.sqrt(item.target) / 500} // 🔥 size dynamic
              pathOptions={{
                color: "#2563eb",   // 🔵 blue border
                // fillColor: "#3b82f6",
                fillOpacity: 0,     // ❌ no fill (hollow)
                weight: 7,          // border thickness
              }}
            >
              <Popup>
                <strong>{item.city}</strong>
                <br />
                Target: {item.target}
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}