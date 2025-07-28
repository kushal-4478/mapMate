const config = {
    apiBaseUrl: process.env.NODE_ENV === 'production' 
        ? 'https://meetpoint-pro.onrender.com'
        : 'http://localhost:5000',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    cloudinaryName: process.env.CLOUDINARY_CLOUD_NAME,
    stripePublicKey: process.env.STRIPE_API_KEY
};

export default config;