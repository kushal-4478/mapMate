const config = {
    apiUrl: process.env.NODE_ENV === 'production'
        ? 'https://meet-point-pro-63-3.onrender.com'
        : 'http://localhost:5000',
    appName: 'MeetPoint Pro'
};

export default config;