import React, { useState } from "react";
import { getSuggestions } from "../services/api";
import SuggestionsList from "./SuggestionsList";
import Map from "./Map";
import "./Dashboard.css";
impo
const Dashboard = () => {
  const [location1, setLocation1] = useState("");
  const [location2, setLocation2] = useState("");
  const [type, setType] = useState("museum");
  const [radius, setRadius] = useState(5000);
  const [suggestions, setSuggestions] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });

  const handleSearch = async () => {
    try {
      const requestData = {
        location1: { lat: parseFloat(location1.split(",")[0]), lng: parseFloat(location1.split(",")[1]) },
        location2: { lat: parseFloat(location2.split(",")[0]), lng: parseFloat(location2.split(",")[1]) },
        type,
        radius,
      };

      const { midpoint, suggestions } = await getSuggestions(requestData);
      setSuggestions(suggestions);
      setMapCenter(midpoint);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <div className="input-container">
        <label>
          Location 1 (lat,lng):
          <input
            type="text"
            value={location1}
            onChange={(e) => setLocation1(e.target.value)}
            placeholder="e.g., 40.7128,-74.0060"
          />
        </label>
        <label>
          Location 2 (lat,lng):
          <input
            type="text"
            value={location2}
            onChange={(e) => setLocation2(e.target.value)}
            placeholder="e.g., 40.7306,-73.9352"
          />
        </label>
        <label>
          Interest Type:
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="e.g., museum, cafe"
          />
        </label>
        <label>
          Radius (meters):
          <input
            type="number"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            placeholder="e.g., 5000"
          />
        </label>
        <button onClick={handleSearch}>Search</button>
      </div>
      <SuggestionsList suggestions={suggestions} />
      <Map suggestions={suggestions} mapCenter={mapCenter} />
    </div>
  );
};

export default Dashboard;