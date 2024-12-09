import React from "react";
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
import {useMediaQuery, useTheme} from "@mui/material";

const SearchUI = ({
    eventType,
    guests,
    location,
    cities = [],
    eventTypes = [],
    openDialog,
    isSearchDisabled,
    handleEventTypeChange, // Corrected handler name
    handleGuestsChange,
    handleLocationChange,
    handleSearch,
    handleInteraction,
    handleDialogClose,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
                    marginBottom: isMobile ? "0" : "4",
                }}
            >
                {/* Event Type Dropdown */}
                <FormControl
                    variant="outlined"
                    sx={{flex: 1, width: isMobile ? "100%" : "auto"}}
                    onMouseDown={handleInteraction}
                    disabled={eventTypes.length === 0}
                >
                    <InputLabel>Event Layout</InputLabel>
                    <Select
                        value={eventType}
                        onChange={handleEventTypeChange} // Updated handler
                        label="Event Type"
                        startAdornment={
                            <InputAdornment position="start">
                                <EventIcon style={{color: "gray"}} />
                            </InputAdornment>
                        }
                        sx={{color: "black"}}
                    >
                        {eventTypes.map((type, index) => (
                            <MenuItem key={index} value={type}>
                                {type}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Guests Input */}
                <FormControl
                    variant="outlined"
                    sx={{flex: 1, width: isMobile ? "100%" : "auto"}}
                    onMouseDown={handleInteraction}
                >
                    <TextField
                        value={guests}
                        onChange={handleGuestsChange}
                        label="Number of Guests"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PeopleIcon style={{color: "gray"}} />
                                </InputAdornment>
                            ),
                            style: {color: "black"},
                        }}
                        fullWidth
                    />
                </FormControl>

                {/* Location Dropdown */}
                <FormControl
                    variant="outlined"
                    sx={{flex: 1, width: isMobile ? "100%" : "auto"}}
                    onMouseDown={handleInteraction}
                    disabled={cities.length === 0}
                >
                    <InputLabel>Location</InputLabel>
                    <Select
                        value={location}
                        onChange={handleLocationChange} // Updated handler
                        label="Location"
                        startAdornment={
                            <InputAdornment position="start">
                                <PlaceIcon style={{color: "gray"}} />
                            </InputAdornment>
                        }
                        sx={{color: "black"}}
                    >
                        {cities.map((city, index) => (
                            <MenuItem key={index} value={city}>
                                {city}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Search Button */}
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

            {/* Dialog */}
            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle sx={{fontWeight: "bold", color: "#000"}}>Oops!</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{marginBottom: 2}}>
                        Looks like you're not logged in yet! But no worries, we’ve got you covered. Hit the "Login"
                        button and make magic happen!
                    </Typography>
                    <Typography variant="body2" sx={{fontStyle: "italic", color: "#757575"}}>
                        (It only takes a few seconds, and we promise it’s worth it!)
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleDialogClose}
                        sx={{
                            backgroundColor: "#5fa7d9", // HEC Blue
                            color: "#fff", // White text
                            "&:hover": {
                                backgroundColor: "#5fa7d9", // Darker shade for hover
                            },
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default SearchUI;
