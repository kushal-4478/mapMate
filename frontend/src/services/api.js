import axios from 'axios';
import config from '../config';

const api = axios.create({
    baseURL: config.apiUrl,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;

const API_BASE_URL = `/api/users`; // Backend base URL

// Function to call the /getsuggestions route
export const getSuggestions = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/getsuggestions`, data);
    return response.data; // Return the response data (midpoint and suggestions)
  } catch (error) {
    console.error("Error fetching suggestions:", error.message);
    throw error; // Throw the error to handle it in the frontend
  }
};

// Create a new booking
export const createBooking = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/book`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating booking:", error.message);
    throw error;
  }
};

// Create a payment for a booking
export const createPayment = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/create-payment`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating payment:", error.message);
    throw error;
  }
};