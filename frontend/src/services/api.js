import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/users"; // Backend base URL

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