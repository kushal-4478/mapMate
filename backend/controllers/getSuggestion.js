
import asyncHandler from "../utils/asyncHandler.js";
import dotenv from "dotenv";
dotenv.config();

// GoMaps API Key (add this to your .env file)
const GOMAPS_API_KEY = process.env.GOMAPS_API_KEY || "AlzaSye80jUDJ5M5gxMy9QecCvzBlrIvaXZmtNY";

// Function to calculate the midpoint between two locations
const calculateMidpoint = (location1, location2) => {
    const lat = (location1.lat + location2.lat) / 2;
    const lng = (location1.lng + location2.lng) / 2;
    return { lat, lng };
};

// Controller to fetch location-based suggestions
export const getSuggestions = asyncHandler(async (req, res) => {
    const { location1, location2, type, radius = 5000 } = req.body;

    // Validate input
    if (!location1 || !location2 || !type) {
        return res.status(400).json({ message: "Please provide both locations and a venue type" });
    }

    // Calculate the midpoint between the two locations
    const midpoint = calculateMidpoint(location1, location2);

    // Construct the API URL
    const url = `https://maps.gomaps.pro/maps/api/place/nearbysearch/json?location=${midpoint.lat},${midpoint.lng}&radius=${radius}&type=${type}&language=en&key=${GOMAPS_API_KEY}`;
    console.log("Request URL:", url);

    try {
        // Make the API request
        const response = await axios.get(url);
        console.log("API Response:", response.data);

        // Check if the API response indicates success
        if (response.data.status !== "OK") {
            console.error("API Error Details:", response.data);
            return res.status(500).json({
                message: "Error fetching data from GoMaps API",
                details: response.data,
            });
        }

        // Filter and format the results
        const suggestions = response.data.results.map((place) => ({
            name: place.name,
            address: place.vicinity,
            rating: place.rating || "No rating",
            location: place.geometry.location,
            types: place.types,
        }));

        // Send the response
        res.status(200).json({
            midpoint,
            suggestions,
        });
    } catch (error) {
        // Log and handle errors
        console.error("Error fetching suggestions:", error.message);
        res.status(500).json({
            message: "Failed to fetch suggestions from GoMaps API",
            error: error.message,
        });
    }
});