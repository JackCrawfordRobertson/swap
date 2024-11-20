"use client";

import React, { useState, useEffect, useContext } from "react";
import { getVenues } from "@/utils/firestore";
import { AuthContext } from "@/context/AuthContext";
import SearchUI from "./SearchUI"; // Import the UI component
import { toast } from "react-toastify";

export default function SearchLogic() {
    const [eventType, setEventType] = useState("");
    const [guests, setGuests] = useState("");
    const [location, setLocation] = useState("");
    const [cities, setCities] = useState([]);
    const [eventTypes, setEventTypes] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchCitiesAndEventTypes = async () => {
            try {
                const venues = await getVenues();
                const citySet = new Set();
                const eventTypeSet = new Set();

                for (const venue of venues) {
                    if (venue.location) {
                        const cityName = await extractCityFromAddress(venue.location);
                        if (cityName) {
                            citySet.add(cityName);
                        }
                    }
                    if (venue.eventType) {
                        eventTypeSet.add(venue.eventType);
                    }
                }

                setCities(Array.from(citySet));
                setEventTypes(Array.from(eventTypeSet));
            } catch (error) {
                toast.error("Error fetching data. Please try again.");
            }
        };

        fetchCitiesAndEventTypes();
    }, []);

    const extractCityFromAddress = async (address) => {
        if (!window.google || !window.google.maps) {
            return null;
        }

        const geocoder = new window.google.maps.Geocoder();

        return new Promise((resolve) => {
            geocoder.geocode({ address }, (results, status) => {
                if (status === "OK" && results.length > 0) {
                    const addressComponents = results[0].address_components;
                    const cityComponent = addressComponents.find((component) =>
                        component.types.includes("locality") || component.types.includes("postal_town")
                    );
                    const cityName = cityComponent ? cityComponent.long_name : null;
                    const countryComponent = addressComponents.find((component) =>
                        component.types.includes("country")
                    );
                    const countryCode = countryComponent ? countryComponent.short_name : null;
                    let suffix = "";
                    if (countryCode === "GB") {
                        suffix = "UK";
                    } else if (["FR", "DE", "ES", "IT", "NL", "BE", "LU", "AT", "PT", "FI", "IE", "GR"].includes(countryCode)) {
                        suffix = "EU";
                    } else {
                        suffix = countryCode;
                    }
                    const cityWithSuffix = cityName && suffix ? `${cityName}, ${suffix}` : cityName;
                    resolve(cityWithSuffix);
                } else {
                    resolve(null);
                }
            });
        });
    };

    const handleEventTypeChange = (event) => {
        setEventType(event.target.value);
    };

    const handleGuestsChange = (event) => {
        const value = event.target.value;
        if (value === "" || /^\d*$/.test(value)) {
            setGuests(value);
        }
    };

    const handleLocationChange = (event) => {
        setLocation(event.target.value);
    };

    const handleSearch = () => {
        if (user) {
            const queryParams = new URLSearchParams({
                eventType,
                guests,
                location,
            }).toString();
            window.location.href = `/results?${queryParams}`;
        } else {
            setOpenDialog(true);
        }
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    const handleInteraction = (event) => {
        if (!user) {
            event.preventDefault();
            setOpenDialog(true);
        }
    };

    const isSearchDisabled = !eventType && !guests && !location;

    return (
        <SearchUI
            eventType={eventType}
            guests={guests}
            location={location}
            cities={cities}
            eventTypes={eventTypes}
            openDialog={openDialog}
            isSearchDisabled={isSearchDisabled}
            handleEventTypeChange={handleEventTypeChange}
            handleGuestsChange={handleGuestsChange}
            handleLocationChange={handleLocationChange}
            handleSearch={handleSearch}
            handleInteraction={handleInteraction}
            handleDialogClose={handleDialogClose}
        />
    );
}