import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import axios from 'axios';
import './LocationSharing.css';
import UserSearch from './UserSearch';

const BASE_URL = 'http://localhost:5000'; // Add this at the top with your imports

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
                    updateLocationOnServer(latitude, longitude);
                },
                error => console.error(error),
                { enableHighAccuracy: true }
            );
        }

        // Fetch shared locations periodically
        const interval = setInterval(fetchSharedLocations, 10000);
        return () => clearInterval(interval);
    }, []);

    const updateLocationOnServer = async (latitude, longitude) => {
        try {
            await axios.put(`${BASE_URL}/api/location/update`, 
                { latitude, longitude },
                { 
                    headers: { 
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Changed from 'token' to 'authToken'
                        'Content-Type': 'application/json'
                    }
                }
            );
        } catch (error) {
            console.error('Error updating location:', error);
        }
    };

    const handleShareLocation = async () => {
        try {
            await axios.post(`${BASE_URL}/api/location/share`,
                { targetUserId },
                { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }} // Changed from 'token' to 'authToken'
            );
            alert('Location shared successfully!');
        } catch (error) {
            console.error('Error sharing location:', error);
        }
    };

    const fetchSharedLocations = async () => {
        try {
            const { data } = await axios.get(`${BASE_URL}/api/location/shared`,
                { 
                    headers: { 
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Changed from 'token' to 'authToken'
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
            const { data } = await axios.get(`${BASE_URL}/api/location/midpoint/${userId}`,
                { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }} // Changed from 'token' to 'authToken'
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

            <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
                <GoogleMap
                    center={currentLocation || { lat: 0, lng: 0 }}
                    zoom={12}
                    mapContainerStyle={{ width: '100%', height: '400px' }}
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
                            icon="http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                        />
                    )}
                </GoogleMap>
            </LoadScript>
        </div>
    );
};

export default LocationSharing;