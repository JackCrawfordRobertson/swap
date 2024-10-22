"use client";

import React, { useEffect, useState, useContext } from "react";
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getVenues } from "../../utils/firestore";
import NavigationBar from "../components/NavigationBar";
import { AuthContext, AuthProvider } from "../../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useSearchParams } from "next/navigation"; // Import useSearchParams

const theme = createTheme({
    palette: {
        primary: {
            main: "#5fa7d9",
        },
        secondary: {
            main: "#ffffff",
        },
    },
});

const ResultsContent = () => {
    const searchParams = useSearchParams(); // Use useSearchParams to get query parameters
    const venueType = searchParams.get("venueType"); // Changed from eventType to venueType
    const guests = searchParams.get("guests");
    const location = searchParams.get("location");
    const squareFootage = searchParams.get("squareFootage");

    const [filteredVenues, setFilteredVenues] = useState([]);
    const [selectedVenue, setSelectedVenue] = useState(null);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchVenues = async () => {
            try {
                const allVenues = await getVenues();
                console.log("Fetched Venues:", allVenues);

                const venuesWithCities = allVenues.map((venue) => ({
                    ...venue,
                    city: venue.location,
                }));

                let filtered = venuesWithCities;
                console.log("Initial Venues:", filtered);

                // Helper function to safely compare strings
                const safeCompare = (str1, str2) => {
                    if (!str1 || !str2) return false;
                    return str1.trim().toLowerCase() === str2.trim().toLowerCase();
                };

                if (venueType) {
                    filtered = filtered.filter((venue) => safeCompare(venue.venueType, venueType)); // Changed to venueType
                    console.log("After venueType filter:", filtered);
                }
                if (location) {
                    filtered = filtered.filter((venue) => safeCompare(venue.location, location));
                    console.log("After location filter:", filtered);
                }
                if (squareFootage) {
                    filtered = filtered.filter((venue) => {
                        const venueSqFt = Number(venue.squareFootage);
                        const targetSqFt = parseInt(squareFootage, 10);
                        return !isNaN(venueSqFt) && venueSqFt === targetSqFt;
                    });
                    console.log("After squareFootage filter:", filtered);
                }
                if (guests) {
                    filtered = filtered.filter((venue) => {
                        const seatedCapacity = Number(venue.capacity?.seated);
                        const standingCapacity = Number(venue.capacity?.standing);
                        const guestCount = parseInt(guests, 10);
                        return (
                            (!isNaN(seatedCapacity) && seatedCapacity >= guestCount) ||
                            (!isNaN(standingCapacity) && standingCapacity >= guestCount)
                        );
                    });
                    console.log("After guests filter:", filtered);
                }

                console.log("Final Filtered Venues:", filtered);
                setFilteredVenues(filtered);
            } catch (error) {
                console.error("Error fetching venues:", error);
                toast.error("Failed to fetch venues.");
            }
        };

        fetchVenues();
    }, [venueType, location, squareFootage, guests]); // Updated dependency to venueType

    const handleCardClick = (venue) => {
        setSelectedVenue(venue);
    };

    const handleClose = () => {
        setSelectedVenue(null);
    };

    const handleCopyEmail = () => {
        if (selectedVenue && selectedVenue.bookingEmail) {
            navigator.clipboard
            .writeText(selectedVenue.bookingEmail)
            .then(() => {
                toast.success("Booking email copied to clipboard!");
            })
            .catch((err) => {
                toast.error("Failed to copy email.");
                console.error("Error copying email: ", err);
            });
        }
    };

    return (
        <>
            <div style={{ margin: "1em" }}>
                <NavigationBar user={user} />
            </div>

            {/* Results Grid */}
            <Box sx={{ paddingLeft: "1em", paddingRight: "1em", marginTop: "1em" }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Search Results
                </Typography>
                <Grid container spacing={3}>
                    {filteredVenues.length > 0 ? (
                        filteredVenues.map((venue) => (
                            <Grid item key={venue.id} xs={12} sm={6} md={4} lg={3}>
                                <Card
                                    onClick={() => handleCardClick(venue)}
                                    sx={{
                                        cursor: "pointer",
                                        transition: "transform 0.3s",
                                        "&:hover": { transform: "scale(1.02)" },
                                        boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
                                        borderRadius: "8px",
                                    }}
                                >
                                    {venue.images.length > 0 && (
                                        <CardMedia
                                            component="img"
                                            height="120px"
                                            image={venue.images[0]}
                                            alt={venue.name}
                                            sx={{
                                                objectFit: "cover",
                                                borderTopLeftRadius: "8px",
                                                borderTopRightRadius: "8px",
                                            }}
                                            onError={() =>
                                                console.error(`Failed to load image: ${venue.images[0]}`)
                                            }
                                        />
                                    )}
                                    <CardContent>
                                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                            {venue.name}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Location: {venue.city}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Venue Type: {venue.venueType} {/* Changed from seatingType */}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Capacity: {venue.capacity.seated} seated,{" "}
                                            {venue.capacity.standing} standing
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Square Footage: {venue.squareFootage} sq ft
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Typography variant="body1" sx={{ margin: "2em" }}>
                            No venues found.
                        </Typography>
                    )}
                </Grid>
            </Box>

            {selectedVenue && (
                <Dialog open={true} onClose={handleClose} maxWidth="md" fullWidth>
                    <DialogTitle>
                        <Typography variant="h6" component="h2" sx={{ fontWeight: "bold" }}>
                            {selectedVenue.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ marginTop: 0.5 }}>
                            {selectedVenue.location}
                        </Typography>
                        <IconButton
                            aria-label="close"
                            onClick={handleClose}
                            sx={{ position: "absolute", right: 8, top: 8 }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>{/* Detailed venue content goes here */}</DialogContent>
                </Dialog>
            )}
            <ToastContainer />
        </>
    );
};

export default function Results() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <ResultsContent />
            </AuthProvider>
        </ThemeProvider>
    );
}