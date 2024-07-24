import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { Box, Typography, Grid, Card, CardContent, CardMedia, Dialog, DialogContent, DialogTitle, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getVenues } from '../src/utils/firestore';
import NavigationBar from '../src/app/components/NavigationBar';
import { AuthContext } from '../src/context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const fetchCityFromAddress = async (address) => {
  try {
    const response = await fetch(`/api/geocode?address=${encodeURIComponent(address)}`);
    const data = await response.json();
    return data.city || address;
  } catch (error) {
    console.error('Error fetching city from address:', error);
    return address;
  }
};


export default function Results() {
  const router = useRouter();
  const { eventType, guests, location } = router.query;
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      const allVenues = await getVenues();
      for (let venue of allVenues) {
        venue.city = await fetchCityFromAddress(venue.location);
      }
      const filtered = allVenues.filter(venue =>
        (!eventType || venue.eventType === eventType) &&
        (!guests || venue.capacity >= guests) &&
        (!location || venue.city.toLowerCase().includes(location.toLowerCase()))
      );
      setFilteredVenues(filtered);
    };
    fetchData();
  }, [eventType, guests, location]);

  const handleCardClick = (venue) => {
    setSelectedVenue(venue);
  };

  const handleClose = () => {
    setSelectedVenue(null);
  };

  const handleCopyEmail = () => {
    if (selectedVenue && selectedVenue.bookingEmail) {
      navigator.clipboard.writeText(selectedVenue.bookingEmail).then(() => {
        toast.success('Booking email copied to clipboard!');
      }).catch(err => {
        toast.error('Failed to copy email.');
        console.error('Error copying email: ', err);
      });
    }
  };

  return (
    <div>
      <div style={{ margin: '1em' }}>
        <NavigationBar user={user} />
      </div>
      <Box sx={{ paddingLeft: "1em", paddingRight: "1em" }}>
        <Typography variant="h4" gutterBottom>Search Results</Typography>
        <Grid container spacing={2}>
          {filteredVenues.map((venue) => (
            <Grid item key={venue.id} xs={12} sm={6} md={4}>
              <Card onClick={() => handleCardClick(venue)} sx={{ cursor: 'pointer', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.02)' } }}>
                {venue.images.length > 0 && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={venue.images[0]}
                    alt={venue.name}
                    sx={{ objectFit: 'cover' }}
                  />
                )}
                <CardContent>
                  <Typography variant="h6">{venue.name}</Typography>
                  <Typography variant="body2" color="textSecondary">Location: {venue.city}</Typography>
                  <Typography variant="body2" color="textSecondary">Capacity: {venue.capacity}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {selectedVenue && (
        <Dialog open={true} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>
            {selectedVenue.name}
            <IconButton aria-label="close" onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, marginBottom: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 2 }}>
                {selectedVenue.images.slice(0, 2).map((image, index) => (
                  <CardMedia
                    component="img"
                    key={index}
                    image={image}
                    alt={`${selectedVenue.name}-${index}`}
                    sx={{ width: '100%', height: '100%', borderRadius: 2, objectFit: 'cover' }}
                  />
                ))}
              </Box>
              {selectedVenue.images.length > 2 && (
                <Box sx={{ flex: 2 }}>
                  <CardMedia
                    component="img"
                    image={selectedVenue.images[2]}
                    alt={`${selectedVenue.name}-2`}
                    sx={{ width: '100%', height: '100%', borderRadius: 2, objectFit: 'cover' }}
                  />
                </Box>
              )}
            </Box>
            <Typography variant="body1" gutterBottom>Location: {selectedVenue.location}</Typography>
            <Typography variant="body1" gutterBottom>Capacity: {selectedVenue.capacity}</Typography>
            <Typography variant="body1" gutterBottom>Type: {selectedVenue.venueType}</Typography>
            <Typography variant="body1" gutterBottom>Description: {selectedVenue.description}</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCopyEmail}
              sx={{ mt: 2, width: '100%', color: 'white' }}
            >
              Book
            </Button>
          </DialogContent>
        </Dialog>
      )}
      <ToastContainer />
    </div>
  );
}
