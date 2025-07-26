const config = {
    apiUrl: process.env.NODE_ENV === 'production'
        ? 'https://meetpoint-pro.onrender.com'
        : 'http://localhost:5000',
    appName: 'MeetPoint Pro'
};

export default config;