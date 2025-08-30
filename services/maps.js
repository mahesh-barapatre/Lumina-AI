// services/maps.js
const axios = require("axios");

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const GEOCODE_URL = "https://maps.googleapis.com/maps/api/geocode/json";
const PLACES_URL =
  "https://maps.googleapis.com/maps/api/place/nearbysearch/json";

/**
 * Convert a location string (e.g., "Delhi") into lat/lng
 */
async function geocodeLocation(location) {
  const res = await axios.get(GEOCODE_URL, {
    params: {
      address: location,
      key: API_KEY,
    },
  });
  //   console.log(res);

  if (!res.data.results.length) throw new Error("Location not found");
  return res.data.results[0].geometry.location; // { lat, lng }
}

/**
 * Find places nearby a lat/lng with given type
 */
async function findPlaces(lat, lng, type) {
  const res = await axios.get(PLACES_URL, {
    params: {
      location: `${lat},${lng}`,
      radius: 2000, // 2km radius
      type,
      key: API_KEY,
    },
  });

  return res.data.results
    .sort((a, b) => (b.rating || 0) - (a.rating || 0)) // sort by rating
    .slice(0, 3) // top 3
    .map((place) => ({
      name: place.name,
      rating: place.rating || "N/A",
      openNow: place.opening_hours?.open_now ?? "unknown",
      link: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
    }));
}

module.exports = { geocodeLocation, findPlaces };
