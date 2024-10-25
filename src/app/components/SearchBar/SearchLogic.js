
"use client";

import React, { useState, useEffect, useContext } from "react";
import { getVenues } from "@/utils/firestore";
import { AuthContext } from "@/context/AuthContext";
import SearchUI from "./SearchUI"; // Import the UI component

export default function SearchLogic() {
    const [eventType, seteventType] = useState("");
    const [guests, setGuests] = useState("");
    const [location, setLocation] = useState("");
    const [cities, setCities] = useState([]);
    const [eventTypes, seteventTypes] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchCitiesAndeventTypes = async () => {
            try {
                const venues = await getVenues();
                const uniqueCities = new Set();
                const uniqueeventTypes = new Set();

                for (const venue of venues) {
                    if (venue.location) {
                        uniqueCities.add(venue.location);
                    }
                    if (venue.eventType) {
                        uniqueeventTypes.add(venue.eventType);
                    }
                }

                setCities(Array.from(uniqueCities));
                seteventTypes(Array.from(uniqueeventTypes));
            } catch (error) {
                console.error("Error fetching venues:", error);
            }
        };

        fetchCitiesAndeventTypes();
    }, []);

    const handleeventTypeChange = (event) => {
        seteventType(event.target.value);
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
            handleeventTypeChange={handleeventTypeChange}
            handleGuestsChange={handleGuestsChange}
            handleLocationChange={handleLocationChange}
            handleSearch={handleSearch}
            handleInteraction={handleInteraction}
            handleDialogClose={handleDialogClose}
        />
    );
}