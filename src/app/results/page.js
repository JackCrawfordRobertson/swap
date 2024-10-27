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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getVenues } from "../../utils/firestore";
import NavigationLogic from "@/app/components/NavBar/NavigationLogic";
import { AuthContext, AuthProvider } from "../../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useSearchParams } from "next/navigation";

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
                const allVenues = await getVenues();
                const venuesWithCities = allVenues.map((venue) => ({
                    ...venue,
                    city: venue.location,
                }));

                let filtered = venuesWithCities;
                const safeCompare = (str1, str2) => str1?.trim().toLowerCase() === str2?.trim().toLowerCase();

                if (eventType) filtered = filtered.filter((venue) => safeCompare(venue.eventType, eventType));
                if (location) filtered = filtered.filter((venue) => safeCompare(venue.location, location));
                if (squareFootage) {
                    filtered = filtered.filter(
                        (venue) => Number(venue.squareFootage) === parseInt(squareFootage, 10)
                    );
                }
                if (guests) {
                    filtered = filtered.filter(
                        (venue) => Number(venue.capacity?.seated) >= parseInt(guests, 10)
                    );
                }

                setFilteredVenues(filtered);
            } catch (error) {
                toast.error("Failed to fetch venues.");
            }
        };

        fetchVenues();
    }, [eventType, location, squareFootage, guests]);

    const handleCardClick = (venue) => {
        setSelectedVenue(venue);
    };

    const handleClose = () => {
        setSelectedVenue(null);
    };

    return (
        <>
            <Box sx={{ margin: "1em" }}>
                <NavigationLogic user={user} />
            </Box>

            <Box sx={{ paddingLeft: "1em", paddingRight: "1em", marginTop: "1em" }}>
                <Typography variant="h4" gutterBottom>
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
                                            Event Type: {venue.eventType}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Capacity: {venue.capacity.seated} seated
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
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
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