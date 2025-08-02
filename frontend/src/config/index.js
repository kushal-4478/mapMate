const config = {
    api: {
        baseUrl: process.env.NODE_ENV === 'production' 
            ? process.env.BACKEND_API_URL
            : "http://localhost:5000",
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            location: '/api/location',
            payment: '/api/payment'
        }
    },
    googleMaps: {
        apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        defaultZoom: parseInt(process.env.REACT_APP_MAP_ZOOM) || 12,
        mapHeight: parseInt(process.env.REACT_APP_MAP_HEIGHT) || 400
    },
    stripe: {
        publicKey: process.env.REACT_APP_STRIPE_PUBLIC_KEY
    },
    cloudinary: {
        cloudName: process.env.REACT_APP_CLOUDINARY_NAME
    },
    socket: {
        url: process.env.NODE_ENV === 'production'
            ? process.env.REACT_APP_PRODUCTION_URL
            : process.env.REACT_APP_SOCKET_URL
    }
};

export default config;