import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
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
import PeopleIcon from '@mui/icons-material/People';
import StandingIcon from '@mui/icons-material/AccessibilityNew';
import AvIcon from '@mui/icons-material/Videocam';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { getVenues } from "../src/utils/firestore";
import NavigationBar from "../src/app/components/NavigationBar";
import { AuthContext, AuthProvider } from "../src/context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

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
  const router = useRouter();
  const { eventType, guests, location, seatingType, squareFootage } = router.query;
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const { user } = useContext(AuthContext);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchVenues = async () => {
      const allVenues = await getVenues();
      const venuesWithCities = await Promise.all(
        allVenues.map(async (venue) => ({
          ...venue,
          city: venue.location,
        }))
      );
      setFilteredVenues(venuesWithCities);
    };

    fetchVenues();
  }, []);

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
      {isClient && (
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
              {filteredVenues.map((venue) => (
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
                        height="120px" // Reduced height to avoid scroll
                        image={venue.images[0]}
                        alt={venue.name}
                        sx={{ objectFit: "cover", borderTopLeftRadius: "8px", borderTopRightRadius: "8px" }}
                        onError={() => console.error(`Failed to load image: ${venue.images[0]}`)}
                      />
                    )}
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>{venue.name}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Location: {venue.city}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Venue Type: {venue.seatingType}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Capacity: {venue.capacity.seated} seated, {venue.capacity.standing} standing
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Square Footage: {venue.squareFootage} sq ft
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
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
              <DialogContent>
                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, marginBottom: 2 }}>
                  <Box sx={{ display: "flex", flexDirection: "column", flex: 1, gap: 2 }}>
                    {selectedVenue.images.slice(0, 2).map((image, index) => (
                      <CardMedia
                        component="img"
                        key={index}
                        image={image}
                        alt={`${selectedVenue.name}-${index}`}
                        sx={{ width: "100%", height: "120px", borderRadius: 2, objectFit: "cover" }}
                        onError={() => console.error(`Failed to load image: ${image}`)}
                      />
                    ))}
                  </Box>
                  {selectedVenue.images.length > 2 && (
                    <Box sx={{ flex: 2 }}>
                      <CardMedia
                        component="img"
                        image={selectedVenue.images[2]}
                        alt={`${selectedVenue.name}-2`}
                        sx={{ width: "100%", height: "120px", borderRadius: 2, objectFit: "cover" }}
                        onError={() => console.error(`Failed to load image: ${selectedVenue.images[2]}`)}
                      />
                    </Box>
                  )}
                </Box>

                {/* Venue Type */}
                <Box sx={{ padding: 2, backgroundColor: "#f9f9f9", borderRadius: "8px", marginBottom: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Venue Type
                  </Typography>
                  <Typography>{selectedVenue.seatingType}</Typography>
                </Box>

                {/* Capacity Section */}
                <Box sx={{ display: "flex", gap: 2, marginBottom: 2, width: '100%' }}>
                  <Box sx={{ width: '50%', padding: 2, backgroundColor: "#f9f9f9", borderRadius: "8px", display: "flex", alignItems: "center", gap: 1 }}>
                    <PeopleIcon color="action" />
                    <Typography variant="body1">{selectedVenue.capacity.seated} Seated</Typography>
                  </Box>
                  <Box sx={{ width: '50%', padding: 2, backgroundColor: "#f9f9f9", borderRadius: "8px", display: "flex", alignItems: "center", gap: 1 }}>
                    <StandingIcon color="action" />
                    <Typography variant="body1">{selectedVenue.capacity.standing} Standing</Typography>
                  </Box>
                </Box>

                {/* Square Footage */}
                <Box sx={{ padding: 2, backgroundColor: "#f9f9f9", borderRadius: "8px", marginBottom: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Square Footage
                  </Typography>
                  <Typography>{selectedVenue.squareFootage} sq ft</Typography>
                </Box>

                {/* Additional Info: AV and Catering */}
                <Box sx={{ display: "flex", gap: 2, marginBottom: 2, width: '100%' }}>
                  <Box sx={{ width: '50%', padding: 2, backgroundColor: "#f9f9f9", borderRadius: "8px", display: "flex", alignItems: "center", gap: 1 }}>
                    <AvIcon color="action" />
                    <Typography variant="body1">
                      AV Facilities: {selectedVenue.hasAVFacilities ? "Available" : "Not Available"}
                    </Typography>
                  </Box>
                  <Box sx={{ width: '50%', padding: 2, backgroundColor: "#f9f9f9", borderRadius: "8px", display: "flex", alignItems: "center", gap: 1 }}>
                    <RestaurantIcon color="action" />
                    <Typography variant="body1">
                      Catering: {selectedVenue.hasCatering.onSite ? "On-Site" : "External Catering Available"}
                    </Typography>
                  </Box>
                </Box>

                {/* Description */}
                <Box sx={{ padding: 2, backgroundColor: "#f9f9f9", borderRadius: "8px", marginBottom: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Description
                  </Typography>
                  <Typography>{selectedVenue.description}</Typography>
                </Box>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCopyEmail}
                  sx={{ mt: 2, width: "100%", color: "white" }}
                >
                  Contact
                </Button>
              </DialogContent>
            </Dialog>
          )}
          <ToastContainer />
        </>
      )}
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