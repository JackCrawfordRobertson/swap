// src/app/components/CategorySelect.js
import React, { useState, useEffect } from 'react';
import { Box, FormControl, InputLabel, TextField, InputAdornment, Button, MenuItem, Select } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import PlaceIcon from '@mui/icons-material/Place';
import SearchIcon from '@mui/icons-material/Search';
import { useMediaQuery, useTheme } from '@mui/material';
import { useRouter } from 'next/router';

export default function CategorySelect({ category, handleCategoryChange, venues }) {
  const [eventType, setEventType] = useState('');
  const [guests, setGuests] = useState('');
  const [location, setLocation] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();

  const locations = Array.from(new Set(venues.map(venue => venue.location)));
  const guestRange = Array.from(new Set(venues.map(venue => venue.capacity))).sort((a, b) => a - b);

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
    router.push({
      pathname: '/results',
      query: { eventType, guests, location }
    });
  };

  return (
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
      <FormControl variant="outlined" sx={{ flex: 1 }}>
        <TextField
          value={eventType}
          onChange={handleEventTypeChange}
          label="Event Type"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EventIcon style={{ color: 'gray' }} />
              </InputAdornment>
            ),
            style: { color: 'black' }
          }}
          fullWidth
        />
      </FormControl>

      <FormControl variant="outlined" sx={{ flex: 1 }}>
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
            style: { color: 'black' }
          }}
          fullWidth
        />
      </FormControl>

      <FormControl variant="outlined" sx={{ flex: 1 }}>
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
          {locations.map((loc, index) => (
            <MenuItem key={index} value={loc}>{loc}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        sx={{ height: '56px', marginTop: isMobile ? '16px' : '0px', borderRadius: 3, backgroundColor: '#5fa7d9', color: '#fff' }}
        startIcon={<SearchIcon />}
        onClick={handleSearch}
      >
        Search
      </Button>
    </Box>
  );
}
