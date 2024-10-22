// src/components/CategorySelect.js

import React, { useState, useEffect, useContext } from 'react';
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
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import PlaceIcon from '@mui/icons-material/Place';
import SearchIcon from '@mui/icons-material/Search';
import { useMediaQuery, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import { AuthContext } from '@/context/AuthContext';
import { getVenues } from '@/utils/firestore';

export default function CategorySelect() {
  const [eventType, setEventType] = useState('');
  const [guests, setGuests] = useState('');
  const [location, setLocation] = useState('');
  const [cities, setCities] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();

  // Access the user from AuthContext
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchCitiesAndEventTypes = async () => {
      try {
        // Fetch venues from Firestore
        const venues = await getVenues();
        const uniqueCities = new Set();
        const uniqueEventTypes = new Set();

        for (const venue of venues) {
          // Use the city field directly from the venue document
          if (venue.location) {
            uniqueCities.add(venue.location);
          }
          if (venue.seatingType) {
            uniqueEventTypes.add(venue.seatingType);
          }
        }

        setCities(Array.from(uniqueCities));
        setEventTypes(Array.from(uniqueEventTypes));
      } catch (error) {
        console.error('Error fetching venues:', error);
      }
    };

    fetchCitiesAndEventTypes();
  }, []);

  const handleEventTypeChange = (event) => {
    setEventType(event.target.value);
  };

  const handleGuestsChange = (event) => {
    const value = event.target.value;
    if (value === '' || /^\d*$/.test(value)) {
      setGuests(value);
    }
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleSearch = () => {
    if (user) {
      router.push({
        pathname: '/results',
        query: { eventType, guests, location },
      });
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

  const isSearchDisabled = !eventType && !guests && !location;

  return (
    <>
      <Box
        sx={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          padding: '16px',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          gap: 2,
          marginBottom: 4,
        }}
      >
        <FormControl
          variant="outlined"
          sx={{ flex: 1 }}
          onMouseDown={handleInteraction}
          disabled={eventTypes.length === 0}
        >
          <InputLabel>Event Type</InputLabel>
          <Select
            value={eventType}
            onChange={handleEventTypeChange}
            label="Event Type"
            startAdornment={
              <InputAdornment position="start">
                <EventIcon style={{ color: 'gray' }} />
              </InputAdornment>
            }
            sx={{ color: 'black' }}
          >
            {eventTypes.map((type, index) => (
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
                  <PeopleIcon style={{ color: 'gray' }} />
                </InputAdornment>
              ),
              style: { color: 'black' },
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
                <PlaceIcon style={{ color: 'gray' }} />
              </InputAdornment>
            }
            sx={{ color: 'black' }}
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
            height: '56px',
            marginTop: isMobile ? '16px' : '0px',
            borderRadius: 3,
            backgroundColor: '#5fa7d9',
            color: '#fff',
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
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#000' }}>
            Oops!
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            Looks like you're not logged in yet! But no worries, we’ve got you covered. Hit the "Get Started" button
            and make magic happen!
          </Typography>
          <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#757575' }}>
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