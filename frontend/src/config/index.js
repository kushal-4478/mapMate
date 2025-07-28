const config = {
    apiBaseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000',
    endpoints: {
        profile: '/api/users/profile',
        updateProfile: '/api/users/update-personal-details'
    },
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

export default config;