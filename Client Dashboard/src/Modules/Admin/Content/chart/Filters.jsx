import React from "react";

export default function Filters({ filters, setFilters }) {
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="grid grid-cols-6 gap-4 mb-6">
      <select
        name="country"
        onChange={handleChange}
        className="border p-2 rounded"
      >
        <option value="">Country</option>
        <option>China</option>
        <option>Germany</option>
        <option>Canada</option>
        <option>United States</option>
        <option>Turkey</option>
        <option>Spain</option>
        <option>Italy</option>
        <option>Netherlands</option>
        <option>Indonesia</option>
        <option>Thailand</option>
        <option>Korea</option>
        <option>Vietnam</option>
      </select>

      <select
        name="trade"
        onChange={handleChange}
        className="border p-2 rounded"
      >
        <option value="">Trade</option>
        <option>Asia - Europe</option>
        <option>Asia - North America</option>
      </select>

      <select
        name="channel"
        onChange={handleChange}
        className="border p-2 rounded"
      >
        <option value="">Channel</option>
        <option>Online</option>
        <option>Contract</option>
      </select>

      <select
        name="region"
        onChange={handleChange}
        className="border p-2 rounded"
      >
        <option value="">Region</option>
        <option>Asia Pacific Region</option>
        <option>Europe Region</option>
        <option>North America Region</option>
      </select>
    </div>
  );
}
