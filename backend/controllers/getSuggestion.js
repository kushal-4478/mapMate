import axios from "axios";
import asyncHandler from "../utils/asyncHandler.js";

// Google Places API Key (add this to your .env file)
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || "your_google_places_api_key";

// Function to calculate the midpoint between two locations
const calculateMidpoint = (location1, location2) => {
    const lat = (location1.lat + location2.lat) / 2;
    const lng = (location1.lng + location2.lng) / 2;
    return { lat, lng };
};

// Controller to fetch location-based suggestions
export const getSuggestions = asyncHandler(async (req, res) => {
    const { location1, location2, type, radius = 5000 } = req.body;

    if (!location1 || !location2 || !type) {
        res.status(400);
        throw new Error("Please provide both locations and a venue type");
    }

    // Calculate the midpoint between the two locations
    const midpoint = calculateMidpoint(location1, location2);

    // Fetch nearby venues using Google Places API
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${midpoint.lat},${midpoint.lng}&radius=${radius}&type=${type}&key=${GOOGLE_PLACES_API_KEY}`;

    const response = await axios.get(url);

    if (response.data.status !== "OK") {
        res.status(500);
        throw new Error("Failed to fetch suggestions from Google Places API");
    }

    // Filter and format the results
    const suggestions = response.data.results.map((place) => ({
        name: place.name,
        address: place.vicinity,
        rating: place.rating || "No rating",
        location: place.geometry.location,
        types: place.types,
    }));

    res.status(200).json({
        midpoint,
        suggestions,
    });
});