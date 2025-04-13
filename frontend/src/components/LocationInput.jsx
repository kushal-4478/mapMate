import React from "react";

const LocationInput = ({
  location1,
  setLocation1,
  location2,
  setLocation2,
  type,
  setType,
  radius,
  setRadius,
  onSearch,
}) => {
  return (
    <div className="location-input-container">
      <label>
        User 1 Location (lat,lng):
        <input
          type="text"
          value={location1}
          onChange={(e) => setLocation1(e.target.value)}
          placeholder="e.g., 40.7128,-74.0060"
        />
      </label>
      <label>
        User 2 Location (lat,lng):
        <input
          type="text"
          value={location2}
          onChange={(e) => setLocation2(e.target.value)}
          placeholder="e.g., 40.7306,-73.9352"
        />
      </label>
      <label>
        Type of Place:
        <input
          type="text"
          value={type}
          onChange={(e) => setType(e.target.value)}
          placeholder="e.g., museum, cafe"
        />
      </label>
      <label>
        Search Radius (meters):
        <input
          type="number"
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
          placeholder="e.g., 5000"
        />
      </label>
      <button onClick={onSearch}>Find Meeting Places</button>
    </div>
  );
};

export default LocationInput;