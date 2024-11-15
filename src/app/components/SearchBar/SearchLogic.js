"use client";

import React, { useState, useEffect, useContext, useMemo } from "react";
import { onSnapshot, collection, query, where } from "firebase/firestore";
import { db } from "@/config/firebaseConfig"; // Firebase configuration
import { AuthContext } from "@/context/AuthContext";
import SearchUI from "./SearchUI"; // Import the UI component
import { toast } from "react-toastify";

export default function SearchLogic() {
    const [eventType, setEventType] = useState("");
    const [guests, setGuests] = useState("");
    const [location, setLocation] = useState("");
    const [cities, setCities] = useState([]);
    const [eventTypes, setEventTypes] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        // Firestore real-time listeners for dropdown options
        const unsubscribe = onSnapshot(
            collection(db, "venues"), // Firestore collection name
            (snapshot) => {
                const citySet = new Set();
                const eventTypeSet = new Set();

                snapshot.forEach((doc) => {
                    const venue = doc.data();
                    if (venue.location) {
                        citySet.add(venue.location); // Add location to city set
                    }
                    if (venue.eventType) {
                        eventTypeSet.add(venue.eventType); // Add event type to set
                    }
                });

                setCities(Array.from(citySet));
                setEventTypes(Array.from(eventTypeSet));
            },
            (error) => {
                console.error("Error fetching venues:", error);
                toast.error("Error fetching dropdown data. Please try again.");
            }
        );

        return () => unsubscribe(); // Cleanup listener on unmount
    }, []);

    useEffect(() => {
        // Firestore query for filtering results
        const filterQuery = query(collection(db, "venues"));

        const unsubscribe = onSnapshot(
            filterQuery,
            (snapshot) => {
                const filtered = snapshot.docs
                    .map((doc) => doc.data())
                    .filter((venue) => {
                        const matchesEventType = eventType ? venue.eventType === eventType : true;
                        const matchesGuests = guests ? parseInt(venue.capacity, 10) >= parseInt(guests, 10) : true;
                        const matchesLocation = location ? venue.location === location : true;

                        return matchesEventType && matchesGuests && matchesLocation;
                    });

                setFilteredResults(filtered);
            },
            (error) => {
                console.error("Error filtering venues:", error);
                toast.error("Error filtering data. Please try again.");
            }
        );

        return () => unsubscribe(); // Cleanup listener on unmount
    }, [eventType, guests, location]);

    const memoizedCities = useMemo(() => cities, [cities]);
    const memoizedEventTypes = useMemo(() => eventTypes, [eventTypes]);

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
            console.log("Search triggered with:", { eventType, guests, location });
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
        <>
            <SearchUI
                eventType={eventType}
                guests={guests}
                location={location}
                cities={memoizedCities}
                eventTypes={memoizedEventTypes}
                openDialog={openDialog}
                isSearchDisabled={isSearchDisabled}
                handleEventTypeChange={handleEventTypeChange}
                handleGuestsChange={handleGuestsChange}
                handleLocationChange={handleLocationChange}
                handleSearch={handleSearch}
                handleInteraction={handleInteraction}
                handleDialogClose={handleDialogClose}
            />
            <div>
                {/* Display filtered results */}
                <h3>Search Results:</h3>
                {filteredResults.map((venue, index) => (
                    <div key={index}>
                        <p><strong>{venue.name}</strong></p>
                        <p>Location: {venue.location}</p>
                        <p>Capacity: {venue.capacity}</p>
                        <p>Event Type: {venue.eventType}</p>
                    </div>
                ))}
            </div>
        </>
    );
}