import React, { useState } from 'react';
import axios from 'axios';
import './UserSearch.css';

const UserSearch = ({ onUserSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (value) => {
        setSearchTerm(value);

        if (!value.trim()) {
            setSearchResults([]);
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('authToken'); // Changed from 'token' to 'authToken'
            
            if (!token) {
                throw new Error('No authentication token found');
            }

            const { data } = await axios.get(
                `/api/users/search?query=${value}`,
                {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (data.success) {
                setSearchResults(data.users);
            }
        } catch (error) {
            console.error('Search error:', error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="user-search-container">
            <input
                type="text"
                placeholder="Search users by username or email"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="search-input"
            />
            
            {loading && <div className="search-loading">Searching...</div>}
            
            {searchResults.length > 0 && (
                <ul className="search-results">
                    {searchResults.map((user) => (
                        <li 
                            key={user._id}
                            onClick={() => {
                                onUserSelect(user);
                                setSearchResults([]);
                                setSearchTerm('');
                            }}
                        >
                            <div className="user-info">
                                <span className="username">{user.username}</span>
                                <span className="email">{user.email}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UserSearch;