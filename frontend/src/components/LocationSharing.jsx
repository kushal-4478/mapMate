import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import api from '../services/api';
import './LocationSharing.css';
import UserSearch from './UserSearch';
import config from '../config';

const LocationSharing = () => {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [sharedLocations, setSharedLocations] = useState([]);
    const [targetUserId, setTargetUserId] = useState('');
    const [midpoint, setMidpoint] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        // Get user's current location
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    setCurrentLocation({ lat: latitude, lng: longitude });
                    updateLocation(latitude, longitude);
                },
                error => console.error(error),
                { enableHighAccuracy: true }
            );
        }

        // Fetch shared locations periodically
        const interval = setInterval(fetchSharedLocations, config.updateInterval);
        return () => clearInterval(interval);
    }, []);

    const updateLocation = async (latitude, longitude) => {
        try {
            await api.put(config.api.endpoints.location + '/update', {
                latitude,
                longitude
            });
        } catch (error) {
            console.error('Location update failed:', error);
        }
    };

    const handleShareLocation = async () => {
        try {
            await axios.post(`${config.apiBaseUrl}/api/location/share`,
                { targetUserId },
                { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }}
            );
            alert('Location shared successfully!');
        } catch (error) {
            console.error('Error sharing location:', error);
        }
    };

    const fetchSharedLocations = async () => {
        try {
            const { data } = await axios.get(`${config.apiBaseUrl}/api/location/shared`,
                { 
                    headers: { 
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                }
            );
            setSharedLocations(data.locations);
        } catch (error) {
            console.error('Error fetching shared locations:', error);
        }
    };

    const calculateMidpoint = async (userId) => {
        try {
            const { data } = await axios.get(`${config.apiBaseUrl}/api/location/midpoint/${userId}`,
                { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }}
            );
            setMidpoint(data.midpoint);
        } catch (error) {
            console.error('Error calculating midpoint:', error);
        }
    };

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        setTargetUserId(user._id);
    };

    return (
        <div className="location-sharing">
            <div className="search-section">
                <h2>Share Your Location</h2>
                <UserSearch onUserSelect={handleUserSelect} />
                {selectedUser && (
                    <div className="selected-user">
                        <p>Selected user: {selectedUser.username}</p>
                        <button onClick={handleShareLocation}>
                            Share Location
                        </button>
                    </div>
                )}
            </div>

            <LoadScript googleMapsApiKey={config.googleMaps.apiKey}>
                <GoogleMap
                    center={currentLocation || { lat: 0, lng: 0 }}
                    zoom={config.googleMaps.defaultZoom}
                    mapContainerStyle={{ 
                        width: '100%', 
                        height: `${config.googleMaps.mapHeight}px` 
                    }}
                >
                    {currentLocation && (
                        <Marker
                            position={currentLocation}
                            label="You"
                        />
                    )}
                    {sharedLocations.map(loc => (
                        <Marker
                            key={loc.userId}
                            position={{
                                lat: loc.location.coordinates[1],
                                lng: loc.location.coordinates[0]
                            }}
                            label={loc.username}
                            onClick={() => calculateMidpoint(loc.userId)}
                        />
                    ))}
                    {midpoint && (
                        <Marker
                            position={{
                                lat: midpoint.coordinates[1],
                                lng: midpoint.coordinates[0]
                            }}
                            label="Meet"
                            icon={config.googleMaps.meetpointIcon}
                        />
                    )}
                </GoogleMap>
            </LoadScript>
        </div>
    );
};

export default LocationSharing;