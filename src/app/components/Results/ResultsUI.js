import React from "react";
import {Box, Typography, Grid, Card, CardContent, CardMedia} from "@mui/material";
import NavigationLogic from "@/app/components/NavBar/NavigationLogic";
import ResultsPopup from "./ResultsPopup";

const ResultsUI = ({user, filteredVenues, selectedVenue, handleCardClick, handleClose, handleCopyEmail}) => {
    return (
        <>
            <Box sx={{margin: "1em"}}>
                <NavigationLogic user={user} />
            </Box>

            <Box sx={{paddingLeft: "1em", paddingRight: "1em", marginTop: "1em", height: "80vh"}}>
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
                                        "&:hover": {transform: "scale(1.02)"},
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
                                        <Typography variant="h6" sx={{fontWeight: "bold"}}>
                                            {venue.name}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                           <b> Location: </b>{venue.location || "Location not available"}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                           <b> Event Layout:</b> {venue.eventType}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                           <b> Capacity: </b>{venue.capacity.seated} seated
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                           <b>Square Footage:</b> {venue.squareFootage} sq ft
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Typography variant="body1" sx={{margin: "2em"}}>
                            No venues found.
                        </Typography>
                    )}
                </Grid>
            </Box>

            {selectedVenue && (
                <ResultsPopup
                    selectedVenue={selectedVenue}
                    handleClose={handleClose}
                    handleCopyEmail={handleCopyEmail}
                />
            )}
        </>
    );
};

export default ResultsUI;
