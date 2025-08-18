import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

import './FindVenue.css';
import api from '../services/api.js';

// const GOOGLE_MAPS_API_KEY = "AIzaSyE3D3KsBQ3rigY87df-KmliSzorSJ2YKyN";

const FindVenue = () => {
  const [location1, setLocation1] = useState('');
  const [location2, setLocation2] = useState('');
  const [type, setType] = useState('restaurant');
  const [radius, setRadius] = useState(5000);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState({
    lat: 28.6139,
    lng: 77.2090
  });

  const navigate = useNavigate();

  const venueTypes = [
    { value: 'restaurant', label: 'Restaurants' },
    { value: 'cafe', label: 'Cafes' },
    { value: 'bar', label: 'Bars' },
    { value: 'park', label: 'Parks' },
    { value: 'movie_theater', label: 'Movie Theaters' },
    { value: 'museum', label: 'Museums' }
  ];

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('authToken');
   
      const response = await api.post(
        `/api/users/getsuggestions`,
        {
          location1: { 
            lat: parseFloat(location1.split(',')[0]), 
            lng: parseFloat(location1.split(',')[1]) 
          },
          location2: { 
            lat: parseFloat(location2.split(',')[0]), 
            lng: parseFloat(location2.split(',')[1]) 
          },
          type,
          radius
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setSuggestions(response.data.suggestions);
    } catch (error) {
      setError('Failed to fetch venues. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookVenue = (venue) => {
    const coordinates = {
      lat: venue.geometry?.location?.lat?.() || venue.geometry?.location?.lat || 0,
      lng: venue.geometry?.location?.lng?.() || venue.geometry?.location?.lng || 0
    };

    const safeVenue = {
      name: venue.name || 'Unknown Venue',
      location: venue.vicinity || venue.formatted_address || 'Address not available',
      placeId: venue.place_id || `temp-${Date.now()}`,
      rating: venue.rating || 0,
      price_level: venue.price_level || 1,
      coordinates: coordinates,
      photos: venue.photos || []
    };

    navigate('/booking', {
      state: { venue: safeVenue }
    });
  };

  const getCurrentLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Use Google's Geocoding API instead of GoMaps
            const response = await fetch(
              `https://maps.gomaps.pro/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${"AIzaSyE3D3KsBQ3rigY87df-KmliSzorSJ2YKyN"}`
              
                
              
  
            );
            const data = await response.json();
            
            if (data.status === "OK" && data.results[0]) {
              // Filter for more accurate address components
              const addressComponents = data.results[0].address_components;
              const formattedAddress = data.results[0].formatted_address;
              
              // Log for debugging
              console.log('Current coordinates:', { latitude, longitude });
              console.log('Geocoding response:', data.results[0]);

              setCurrentLocation({
                coordinates: `${latitude},${longitude}`,
                address: formattedAddress
              });
              setLocation1(`${latitude},${longitude}`);
              setMapCenter({ lat: latitude, lng: longitude });
            } else {
              throw new Error('Failed to get address from coordinates');
            }
          } catch (error) {
            console.error('Geocoding error:', error);
            // Fallback to just coordinates
            setLocation1(`${latitude},${longitude}`);
            setCurrentLocation({
              coordinates: `${latitude},${longitude}`,
              address: `Lat: ${latitude}, Lng: ${longitude}`
            });
          }
          setIsLocating(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setError('Unable to fetch your location. Please enter manually.');
          setIsLocating(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000, // Increased timeout
          maximumAge: 0,
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
      setIsLocating(false);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const mapContainerStyle = {
    width: '100%',
    height: '300px',
    marginBottom: '20px'
  };

  return (
    <div className="find-venue-container">
      <h1>Find Your Perfect Meeting Point</h1>
      
      {/* <LoadScript googleMapsApiKey={"AlzaSye80jUDJ5M5gxMy9QecCvzBlrIvaXZmtNY"}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={13}
        >
          {location1 && (
            <Marker
              position={{
                lat: parseFloat(location1.split(',')[0]),
                lng: parseFloat(location1.split(',')[1])
              }}
              icon={{
                url: 'http://maps.gomaps.pro/mapfiles/ms/icons/blue-dot.png'
              }}
            />
          )}
          {location2 && (
            <Marker
              position={{
                lat: parseFloat(location2.split(',')[0]),
                lng: parseFloat(location2.split(',')[1])
              }}
              icon={{
                url: 'http://maps.gomaps.pro/mapfiles/ms/icons/red-dot.png'
              }}
            />
          )}
        </GoogleMap>
      </LoadScript> */}

      <div className="search-form">
        <div className="form-group">
          <label>Your Location (lat,lng)</label>
          <div className="location-input-group">
            <input
              type="text"
              value={location1}
              onChange={(e) => setLocation1(e.target.value)}
              placeholder="e.g. 40.7128,-74.0060"
            />
            <button 
              onClick={getCurrentLocation}
              disabled={isLocating}
              className="locate-me-btn"
            >
              {isLocating ? 'Locating...' : '📍 My Location'}
            </button>
          </div>
          {currentLocation?.address && (
            <small className="address-text">{currentLocation.address}</small>
          )}
        </div>

        <div className="form-group">
          <label>Their Location (lat,lng)</label>
          <input
            type="text"
            value={location2}
            onChange={(e) => setLocation2(e.target.value)}
            placeholder="e.g. 40.7306,-73.9352"
          />
        </div>

        <div className="form-group">
          <label>Venue Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            {venueTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Search Radius (meters)</label>
          <input
            type="range"
            min="1000"
            max="10000"
            step="500"
            value={radius}
            onChange={(e) => setRadius(parseInt(e.target.value))}
          />
          <span>{radius}m</span>
        </div>

        <button 
          onClick={handleSearch}
          disabled={loading}
          className="search-button"
        >
          {loading ? 'Searching...' : 'Find Venues'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="suggestions-grid">
        {suggestions.map((venue) => (
          <div 
            key={venue.place_id || `temp-${Date.now()}`} 
            className="venue-card"
          >
            <h3>{venue.name || 'Unnamed Venue'}</h3>
            <p className="venue-address">
              {venue.vicinity || venue.formatted_address || 'Address not available'}
            </p>
            <div className="venue-details">
              {venue.rating && (
                <div className="venue-rating">
                  <span>Rating: {venue.rating} ⭐</span>
                  <span>({venue.user_ratings_total || 0} reviews)</span>
                </div>
              )}
              {venue.opening_hours?.open_now !== undefined && (
                <span className="open-now">
                  {venue.opening_hours.open_now ? 'Open Now' : 'Closed'}
                </span>
              )}
              {venue.price_level && (
                <span className="price-level">
                  {'₹'.repeat(venue.price_level)}
                </span>
              )}
            </div>
            <button 
              className="book-venue-btn"
              onClick={() => handleBookVenue(venue)}
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FindVenue;