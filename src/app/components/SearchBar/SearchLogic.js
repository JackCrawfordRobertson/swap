
"use client";

import React, { useState, useEffect, useContext } from "react";
import { getVenues } from "@/utils/firestore";
import { AuthContext } from "@/context/AuthContext";
import SearchUI from "./SearchUI"; // Import the UI component

export default function SearchLogic() {
    const [venueType, setVenueType] = useState("");
    const [guests, setGuests] = useState("");
    const [location, setLocation] = useState("");
    const [cities, setCities] = useState([]);
    const [venueTypes, setVenueTypes] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchCitiesAndVenueTypes = async () => {
            try {
                const venues = await getVenues();
                const uniqueCities = new Set();
                const uniqueVenueTypes = new Set();

                for (const venue of venues) {
                    if (venue.location) {
                        uniqueCities.add(venue.location);
                    }
                    if (venue.venueType) {
                        uniqueVenueTypes.add(venue.venueType);
                    }
                }

                setCities(Array.from(uniqueCities));
                setVenueTypes(Array.from(uniqueVenueTypes));
            } catch (error) {
                console.error("Error fetching venues:", error);
            }
        };

        fetchCitiesAndVenueTypes();
    }, []);

    const handleVenueTypeChange = (event) => {
        setVenueType(event.target.value);
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
                venueType,
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

    const isSearchDisabled = !venueType && !guests && !location;

    return (
        <SearchUI
            venueType={venueType}
            guests={guests}
            location={location}
            cities={cities}
            venueTypes={venueTypes}
            openDialog={openDialog}
            isSearchDisabled={isSearchDisabled}
            handleVenueTypeChange={handleVenueTypeChange}
            handleGuestsChange={handleGuestsChange}
            handleLocationChange={handleLocationChange}
            handleSearch={handleSearch}
            handleInteraction={handleInteraction}
            handleDialogClose={handleDialogClose}
        />
    );
}