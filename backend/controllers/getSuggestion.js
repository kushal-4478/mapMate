import axios from "axios";
import asyncHandler from "../utils/asyncHandler.js";

// GoMaps API Key (add this to your .env file)
const GOMAPS_API_KEY = process.env.GOMAPS_API_KEY || "your_gomaps_api_key";

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
        res.status(400);
        throw new Error("Please provide both locations and a venue type");
    }

    // Calculate the midpoint between the two locations
    const midpoint = calculateMidpoint(location1, location2);

    // Construct the API URL
    //const url = `https://api.gomaps.com/nearbysearch?location=${midpoint.lat},${midpoint.lng}&radius=${radius}&type=${type}&key=${GOMAPS_API_KEY}`;

    const url=`https://maps.gomaps.pro/maps/api/place/nearbysearch/json?location=${midpoint.lat},${midpoint.lng}&radius=${radius}&type=${type}&language=en&key=${GOMAPS_API_KEY}`
    console.log("Request URL:", url);

    try {
        // Make the API request
        const response = await axios.get(url);
        console.log("API Response:", response.data);

        // Check if the API response indicates success
        if (!response.data.success) {
            res.status(500);
            throw new Error("Failed to fetch suggestions from GoMaps API");
        }

        // Filter and format the results
        const suggestions = response.data.places.map((place) => ({
            name: place.name,
            address: place.address,
            rating: place.rating || "No rating",
            location: { lat: place.latitude, lng: place.longitude },
            types: place.categories,
        }));

        // Send the response
        res.status(200).json({
            midpoint,
            suggestions,
        });
    } catch (error) {
        // Log and handle errors
        console.error("Error fetching suggestions:", error.message);
        res.status(500);
        throw new Error("Failed to fetch suggestions from GoMaps API");
    }
});