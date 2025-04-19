import React from "react";
import "./suggestionsList.css";
import { useNavigate } from "react-router-dom";

const SuggestionsList = ({ suggestions }) => {
  const navigate = useNavigate();

  const handleSelect = (place) => {
    navigate("/booking", { state: { place } }); // Pass the selected place to the booking page
  };

  return (
    <div className="suggestions-container">
      {suggestions.length > 0 && (
        <>
          <h2>Suggested Meeting Places</h2>
          <div className="cards-container">
            {suggestions.map((place, index) => (
              <div className="card" key={index}>
                <h3 className="place-name">{place.name}</h3>
                <p className="place-address">{place.address}</p>
                <p className="place-rating">
                  <strong>Rating:</strong> {place.rating || "N/A"} ★
                </p>
                <p className="place-types">
                  <strong>Types:</strong> {place.types.join(", ")}
                </p>
                <button
                  className="select-button"
                  onClick={() => handleSelect(place)}
                >
                  Select
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SuggestionsList;