"use client"; // Ensure the directive is in lowercase

import React, { useState, useEffect, useContext } from "react";
import {
    Box,
    FormControl,
    InputLabel,
    TextField,
    InputAdornment,
    Button,
    MenuItem,
    Select,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import PeopleIcon from "@mui/icons-material/People";
import PlaceIcon from "@mui/icons-material/Place";
import SearchIcon from "@mui/icons-material/Search";
import { useMediaQuery, useTheme } from "@mui/material";
import { AuthContext } from "@/context/AuthContext";
import { getVenues } from "@/utils/firestore";

export default function CategorySelect() {
    const [venueType, setVenueType] = useState(""); // Changed from eventType to venueType
    const [guests, setGuests] = useState("");
    const [location, setLocation] = useState("");
    const [cities, setCities] = useState([]);
    const [venueTypes, setVenueTypes] = useState([]); // Changed from eventTypes to venueTypes
    const [openDialog, setOpenDialog] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchCitiesAndVenueTypes = async () => { // Updated naming
            try {
                const venues = await getVenues();
                const uniqueCities = new Set();
                const uniqueVenueTypes = new Set(); // Changed from uniqueEventTypes

                for (const venue of venues) {
                    if (venue.location) {
                        uniqueCities.add(venue.location);
                    }
                    if (venue.venueType) { // Changed from seatingType to venueType
                        uniqueVenueTypes.add(venue.venueType); // Changed from eventType
                    }
                }

                setCities(Array.from(uniqueCities));
                setVenueTypes(Array.from(uniqueVenueTypes)); // Changed from setEventTypes
            } catch (error) {
                console.error("Error fetching venues:", error);
            }
        };

        fetchCitiesAndVenueTypes(); // Updated function name
    }, []);

    const handleVenueTypeChange = (event) => { // Changed from handleEventTypeChange
        setVenueType(event.target.value); // Changed to venueType
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
            // Construct the URL with query parameters
            const queryParams = new URLSearchParams({
                venueType, // Changed from eventType
                guests,
                location,
            }).toString();
            window.location.href = `/results?${queryParams}`;
        } else {
            setOpenDialog(true); // Show popup if user is not logged in
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
        <>
            <Box
                sx={{
                    backgroundColor: "#fafafa",
                    borderRadius: "8px",
                    boxShadow: "0 1px 40px rgba(0,0,0,0.1)",
                    padding: "16px",
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    gap: 2,
                    marginBottom: 4,
                }}
            >
                <FormControl
                    variant="outlined"
                    sx={{ flex: 1 }}
                    onMouseDown={handleInteraction}
                    disabled={venueTypes.length === 0} // Changed from eventTypes
                >
                    <InputLabel>Venue Type</InputLabel> {/* Updated label */}
                    <Select
                        value={venueType} // Changed to venueType
                        onChange={handleVenueTypeChange}
                        label="Venue Type" // Updated label
                        startAdornment={
                            <InputAdornment position="start">
                                <EventIcon style={{ color: "gray" }} />
                            </InputAdornment>
                        }
                        sx={{ color: "black" }}
                    >
                        {venueTypes.map((type, index) => ( // Changed from eventTypes
                            <MenuItem key={index} value={type}>
                                {type}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl variant="outlined" sx={{ flex: 1 }} onMouseDown={handleInteraction}>
                    <TextField
                        value={guests}
                        onChange={handleGuestsChange}
                        label="Number of Guests"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PeopleIcon style={{ color: "gray" }} />
                                </InputAdornment>
                            ),
                            style: { color: "black" },
                        }}
                        fullWidth
                    />
                </FormControl>

                <FormControl
                    variant="outlined"
                    sx={{ flex: 1 }}
                    onMouseDown={handleInteraction}
                    disabled={cities.length === 0}
                >
                    <InputLabel>Location</InputLabel>
                    <Select
                        value={location}
                        onChange={handleLocationChange}
                        label="Location"
                        startAdornment={
                            <InputAdornment position="start">
                                <PlaceIcon style={{ color: "gray" }} />
                            </InputAdornment>
                        }
                        sx={{ color: "black" }}
                    >
                        {cities.map((city, index) => (
                            <MenuItem key={index} value={city}>
                                {city}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button
                    variant="contained"
                    sx={{
                        height: "56px",
                        marginTop: isMobile ? "16px" : "0px",
                        borderRadius: 3,
                        backgroundColor: "#5fa7d9",
                        color: "#fff",
                    }}
                    startIcon={<SearchIcon />}
                    onClick={handleSearch}
                    disabled={isSearchDisabled}
                >
                    Search
                </Button>
            </Box>

            {/* Dialog popup for unauthenticated users */}
            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>
                    <Typography variant="h4" sx={{ fontWeight: "bold", color: "#000" }}>
                        Oops!
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ marginBottom: 2 }}>
                        Looks like you're not logged in yet! But no worries, we’ve got you covered. Hit the "Get
                        Started" button and make magic happen!
                    </Typography>
                    <Typography variant="body2" sx={{ fontStyle: "italic", color: "#757575" }}>
                        (It only takes a few seconds, and we promise it’s worth it!)
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}