import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const Map = ({ suggestions, mapCenter }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AlzaSyE3D3KsBQ3rigY87df-KmliSzorSJ2YKyN", // Replace with your Google Maps API key
  });

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <GoogleMap
      center={mapCenter}
      zoom={12}
      mapContainerStyle={{ width: "100%", height: "400px" }}
    >
      {suggestions.map((place, index) => (
        <Marker
          key={index}
          position={{ lat: place.location.lat, lng: place.location.lng }}
          title={place.name}
        />
      ))}
    </GoogleMap>
  );
};

export default Map;