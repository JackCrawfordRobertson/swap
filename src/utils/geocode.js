import { geocodeByAddress } from "react-places-autocomplete";

export const getCityFromAddress = async (address) => {
  try {
    const results = await geocodeByAddress(address);
    if (results && results.length > 0) {
      const addressComponents = results[0].address_components;
      const cityComponent = addressComponents.find(component =>
        component.types.includes("locality") || component.types.includes("administrative_area_level_1")
      );
      return cityComponent ? cityComponent.long_name : "Unknown City";
    } else {
      throw new Error("No results found for the provided address");
    }
  } catch (error) {
    console.error("Geocoding API error:", error);
    return "Unknown City"; // Return a fallback value
  }
};