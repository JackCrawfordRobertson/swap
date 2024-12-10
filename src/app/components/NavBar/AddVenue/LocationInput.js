import React, { useRef, useEffect, useState } from "react";
import { TextField, List, ListItem, ListItemText, Paper, Box } from "@mui/material";

const LocationInput = ({ location, setLocation, error, setError }) => {
  const locationRef = useRef(null);
  const [suggestions, setSuggestions] = useState([]);
  const [autocompleteService, setAutocompleteService] = useState(null);

  useEffect(() => {
    if (window.google && window.google.maps && !autocompleteService) {
      setAutocompleteService(new window.google.maps.places.AutocompleteService());
    }
  }, []);

  const handleLocationChange = (e) => {
    const input = e.target.value;
    setLocation(input);
    setError(""); // Clear any previous error

    if (autocompleteService && input) {
      autocompleteService.getPlacePredictions(
        {
          input,
          types: ["geocode"],
        },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(predictions);
          } else {
            setSuggestions([]);
          }
        }
      );
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ address: suggestion.description }, (results, status) => {
      if (status === "OK" && results.length > 0) {
        const addressComponents = results[0].address_components;

        const hasCity = addressComponents.some((component) =>
          component.types.includes("locality") || component.types.includes("postal_town")
        );

        if (hasCity) {
          setLocation(suggestion.description);
          setError("");
          setSuggestions([]);
        } else {
          setError("Please select an address that includes a city.");
        }
      } else {
        setError("Unable to validate the selected location. Please try again.");
      }
    });
  };

  return (
    <Box sx={{ position: "relative" }}>
      <TextField
        label="Location"
        value={location}
        onChange={handleLocationChange}
        required
        error={!!error}
        helperText={error}
        fullWidth
        inputRef={locationRef}
      />
      {suggestions.length > 0 && (
        <Paper
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            width: "100%",
            zIndex: 10,
            mt: 1,
          }}
        >
          <List>
            {suggestions.map((suggestion) => (
              <ListItem
                button
                key={suggestion.place_id}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <ListItemText primary={suggestion.description} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default LocationInput;