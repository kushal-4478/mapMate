import React from "react";
import "./SuggestionsList.css";

const SuggestionsList = ({ suggestions }) => {
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
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SuggestionsList;