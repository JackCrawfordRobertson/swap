// ResultsUI.js
import React from "react";
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
import EventIcon from "@mui/icons-material/Event";
import PeopleIcon from "@mui/icons-material/People";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import DescriptionIcon from "@mui/icons-material/Description";
import AvTimerIcon from "@mui/icons-material/AvTimer";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import NavigationLogic from "@/app/components/NavBar/NavigationLogic";

const ResultsUI = ({ user, filteredVenues, selectedVenue, handleCardClick, handleClose, handleCopyEmail }) => {
    return (
        <>
            <Box sx={{ margin: "1em" }}>
                <NavigationLogic user={user} />
            </Box>

            <Box sx={{ paddingLeft: "1em", paddingRight: "1em", marginTop: "1em", height: '80vh' }}>
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
                    <DialogContent>
                        <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                            {selectedVenue.images.slice(0, 3).map((image, index) => (
                                <Grid item xs={4} key={index}>
                                    <CardMedia
                                        component="img"
                                        image={image}
                                        alt={`Venue Image ${index + 1}`}
                                        sx={{ width: "100%", height: "100%", borderRadius: 2, objectFit: "cover" }}
                                    />
                                </Grid>
                            ))}
                        </Grid>

                        <Box sx={{ width: "100%", marginBottom: 2 }}>
                            <Card sx={{ padding: 2, display: "flex", alignItems: "center" }}>
                                <DescriptionIcon color="primary" />
                                <Typography variant="body1" sx={{ marginLeft: 1 }}>
                                    {selectedVenue.description}
                                </Typography>
                            </Card>
                        </Box>

                        <Grid container spacing={2}>
                            <Grid item xs={6} md={4}>
                                <Card sx={{ padding: 2, display: "flex", alignItems: "center" }}>
                                    <EventIcon color="primary" />
                                    <Typography variant="body1" sx={{ marginLeft: 1 }}>
                                        {selectedVenue.eventType}
                                    </Typography>
                                </Card>
                            </Grid>
                            <Grid item xs={6} md={4}>
                                <Card sx={{ padding: 2, display: "flex", alignItems: "center" }}>
                                    <PeopleIcon color="primary" />
                                    <Typography variant="body1" sx={{ marginLeft: 1 }}>
                                        {selectedVenue.capacity.seated} seated
                                    </Typography>
                                </Card>
                            </Grid>
                            <Grid item xs={6} md={4}>
                                <Card sx={{ padding: 2, display: "flex", alignItems: "center" }}>
                                    <SquareFootIcon color="primary" />
                                    <Typography variant="body1" sx={{ marginLeft: 1 }}>
                                        {selectedVenue.squareFootage} sq ft
                                    </Typography>
                                </Card>
                            </Grid>
                            <Grid item xs={6} md={4}>
                                <Card sx={{ padding: 2, display: "flex", alignItems: "center" }}>
                                    <AvTimerIcon color="primary" />
                                    <Typography variant="body1" sx={{ marginLeft: 1 }}>
                                        AV: {selectedVenue.hasAVFacilities ? "Available" : "Not Available"}
                                    </Typography>
                                </Card>
                            </Grid>
                            <Grid item xs={6} md={4}>
                                <Card sx={{ padding: 2, display: "flex", alignItems: "center" }}>
                                    <RestaurantIcon color="primary" />
                                    <Typography variant="body1" sx={{ marginLeft: 1 }}>
                                        Catering: {selectedVenue.hasCatering?.onSite ? "On-site" : "External only"}
                                    </Typography>
                                </Card>
                            </Grid>
                            <Grid item xs={6} md={4}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<ContentCopyIcon />}
                                    onClick={handleCopyEmail}
                                    sx={{ width: '100%', height: '100%' }}
                                >
                                    Copy Contact Details
                                </Button>
                            </Grid>
                        </Grid>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};

export default ResultsUI;