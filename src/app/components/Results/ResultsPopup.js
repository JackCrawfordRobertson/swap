import React from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
    Grid,
    CardMedia,
    Box,
    Card,
    Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DescriptionIcon from "@mui/icons-material/Description";
import EventIcon from "@mui/icons-material/Event";
import PeopleIcon from "@mui/icons-material/People";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import AvTimerIcon from "@mui/icons-material/AvTimer";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const ResultsPopup = ({ selectedVenue, handleClose, handleCopyEmail }) => {
    return (
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
    );
};

export default ResultsPopup;