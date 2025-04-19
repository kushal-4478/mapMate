import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  InfoWindow,
  DirectionsRenderer
} from "@react-google-maps/api";
import "./Location.css";

const socket = io("http://localhost:5000");

const containerStyle = {
  width: "100%",
  height: "calc(100vh - 200px)",
  borderRadius: "12px"
};

function LocationTracker() {
  const [myCoords, setMyCoords] = useState(null);
  const [userId] = useState(`user-${Math.random().toString(36).substr(2, 9)}`);
  const [friendId, setFriendId] = useState('');
  const [friendLocation, setFriendLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
    libraries: ["places", "geometry"]
  });

  const handleStartTracking = () => {
    if (!friendId) {
      setError('Please enter friend\'s ID');
      return;
    }
    setIsTracking(true);
    socket.emit('startTracking', { userId, friendId });
    setError(null);
  };

  const handleStopTracking = () => {
    setIsTracking(false);
    socket.emit('stopTracking', { userId, friendId });
    setFriendId('');
    setFriendLocation(null);
    setDirections(null);
    setDistance(null);
  };

  useEffect(() => {
    socket.emit('register', userId);

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setMyCoords(location);
        if (isTracking) {
          socket.emit('updateLocation', { userId, location });
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setError("Unable to get location. Please enable location services.");
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );

    socket.on('locationUpdated', (data) => {
      if (data.userId === friendId) {
        setFriendLocation(data.location);
        // Calculate distance when friend's location updates
        if (myCoords) {
          const directionsService = new window.google.maps.DirectionsService();
          directionsService.route(
            {
              origin: myCoords,
              destination: data.location,
              travelMode: window.google.maps.TravelMode.DRIVING
            },
            (result, status) => {
              if (status === "OK") {
                setDirections(result);
                setDistance(result.routes[0].legs[0].distance.text);
              }
            }
          );
        }
      }
    });

    socket.on('userDisconnected', (disconnectedId) => {
      if (disconnectedId === friendId) {
        setError("Friend disconnected");
        handleStopTracking();
      }
    });

    return () => {
      navigator.geolocation.clearWatch(watchId);
      socket.off('locationUpdated');
      socket.off('userDisconnected');
    };
  }, [userId, friendId, isTracking, myCoords]);

  return (
    <div className="location-tracker-container">
      <header className="tracker-header">
        <h1>Real-Time Location Tracker</h1>
        <div className="user-info">
          <span>Your ID: <strong>{userId}</strong></span>
          <button 
            className="copy-button"
            onClick={() => {
              navigator.clipboard.writeText(userId);
              setShowInfo(true);
              setTimeout(() => setShowInfo(false), 2000);
            }}
          >
            Copy ID
          </button>
          {showInfo && <div className="copy-info">ID copied!</div>}
        </div>
      </header>

      <div className="friend-tracker">
        <input
          type="text"
          value={friendId}
          onChange={(e) => setFriendId(e.target.value)}
          placeholder="Enter friend's ID"
          disabled={isTracking}
          className="friend-input"
        />
        <button
          onClick={isTracking ? handleStopTracking : handleStartTracking}
          className={`track-button ${isTracking ? 'stop' : 'start'}`}
        >
          {isTracking ? 'Stop Tracking' : 'Start Tracking'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="stats-panel">
        {myCoords && (
          <>
            <div className="stat-item">
              <span className="stat-label">Your Location</span>
              <span className="stat-value">
                {myCoords.lat.toFixed(6)}, {myCoords.lng.toFixed(6)}
              </span>
            </div>
            {distance && (
              <div className="stat-item">
                <span className="stat-label">Distance to Friend</span>
                <span className="stat-value">{distance}</span>
              </div>
            )}
          </>
        )}
      </div>

      <div className="map-container">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={myCoords || { lat: 0, lng: 0 }}
            zoom={14}
            options={{
              zoomControl: true,
              streetViewControl: false,
              mapTypeControl: true,
              fullscreenControl: true,
            }}
          >
            {myCoords && (
              <Marker
                position={myCoords}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                  scaledSize: new window.google.maps.Size(40, 40)
                }}
                title="Your Location"
              />
            )}
            
            {friendLocation && (
              <Marker
                position={friendLocation}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                  scaledSize: new window.google.maps.Size(40, 40)
                }}
                title="Friend's Location"
              />
            )}

            {directions && <DirectionsRenderer directions={directions} />}
          </GoogleMap>
        ) : (
          <div className="loading-container">
            <div className="loader"></div>
            <p>Loading map...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LocationTracker;