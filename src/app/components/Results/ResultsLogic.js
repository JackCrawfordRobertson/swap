// ResultsLogic.js
"use client";

import { useEffect, useState, useContext } from "react";
import { useSearchParams } from "next/navigation";
import { getVenues } from "@/utils/firestore";
import { AuthContext } from "@/context/AuthContext";
import { toast } from "react-toastify";

export const useResultsLogic = () => {
    const searchParams = useSearchParams();
    const eventType = searchParams.get("eventType");
    const guests = searchParams.get("guests");
    const location = searchParams.get("location");
    const squareFootage = searchParams.get("squareFootage");

    const [filteredVenues, setFilteredVenues] = useState([]);
    const [selectedVenue, setSelectedVenue] = useState(null);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchVenues = async () => {
            try {
                console.log("Fetching venues with parameters:", { eventType, guests, location, squareFootage });
                
                const allVenues = await getVenues();
                console.log("All venues retrieved:", allVenues);

                const filterVenueData = (venues) => {
                    let filtered = venues;
                    const safeCompare = (str1, str2) => str1?.trim().toLowerCase() === str2?.trim().toLowerCase();

                    if (eventType) {
                        filtered = filtered.filter((venue) => safeCompare(venue.eventType, eventType));
                    }

                    if (location) {
    const [searchCity, searchCountry] = location.split(",").map((part) => part.trim().toLowerCase());

    filtered = filtered.filter((venue) => {
        const venueLocationLower = venue.location.toLowerCase();

        // Debug logs to check the presence of city and country
        console.log(`Checking venue "${venue.name}" with location "${venue.location}" against city "${searchCity}" and country "${searchCountry}"`);

        // Check if the city matches
        const cityMatch = venueLocationLower.includes(searchCity);

        // Check for flexible country match
        const countryMatch = venueLocationLower.includes(searchCountry) || 
                             (searchCountry === "us" && venueLocationLower.includes("united states"));

        if (cityMatch && countryMatch) {
            console.log(`Venue "${venue.name}" with location "${venue.location}" matches "${location}" and is included.`);
            return true;
        } else {
            console.log(`Venue "${venue.name}" with location "${venue.location}" does not match "${location}" and is filtered out.`);
            return false;
        }
    });

    console.log(`Filtered by location (${location}):`, filtered);
}

                    if (guests) {
                        filtered = filtered.filter(
                            (venue) => Number(venue.capacity?.seated) >= parseInt(guests, 10)
                        );
                    }

                    return filtered;
                };

                const filtered = filterVenueData(allVenues);
                setFilteredVenues(filtered);
            } catch (error) {
                console.error("Error fetching venues:", error);
                toast.error("Failed to fetch venues.");
            }
        };

        fetchVenues();
    }, [eventType, location, squareFootage, guests]);

    const handleCardClick = (venue) => setSelectedVenue(venue);

    const handleClose = () => setSelectedVenue(null);

    const handleCopyEmail = () => {
        if (selectedVenue?.bookingEmail) {
            navigator.clipboard.writeText(selectedVenue.bookingEmail);
            toast.success("Email copied to clipboard!");
        }
    };

    return {
        user,
        filteredVenues,
        selectedVenue,
        handleCardClick,
        handleClose,
        handleCopyEmail,
    };
};