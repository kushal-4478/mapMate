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