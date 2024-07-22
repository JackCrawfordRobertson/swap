// src/app/components/CategorySelect.js
import React, { useState } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, TextField, InputAdornment, Button } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import PlaceIcon from '@mui/icons-material/Place';
import SearchIcon from '@mui/icons-material/Search';
import { useMediaQuery, useTheme } from '@mui/material';

export default function CategorySelect({ category, handleCategoryChange }) {
  const [eventType, setEventType] = useState('');
  const [guests, setGuests] = useState('');
  const [location, setLocation] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleEventTypeChange = (event) => {
    setEventType(event.target.value);
  };

  const handleGuestsChange = (event) => {
    setGuests(event.target.value);
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
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
        <InputLabel>Event Type</InputLabel>
        <TextField
          value={eventType}
          onChange={handleEventTypeChange}
          label="Event Type"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ marginRight: '8px' }}>
                <EventIcon style={{ color: 'gray' }} />
              </InputAdornment>
            ),
            style: { color: 'black' }
          }}
          fullWidth
        />
      </FormControl>

      <FormControl variant="outlined" sx={{ flex: 1 }}>
        <InputLabel>Guests</InputLabel>
        <TextField
          value={guests}
          onChange={handleGuestsChange}
          label="Number of Guests"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ marginRight: '8px' }}>
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
            <InputAdornment position="start" sx={{ marginRight: '8px' }}>
              <PlaceIcon style={{ color: 'gray' }} />
            </InputAdornment>
          }
          sx={{ color: 'black' }}
        >
          <MenuItem value="location1">Location 1</MenuItem>
          <MenuItem value="location2">Location 2</MenuItem>
          <MenuItem value="location3">Location 3</MenuItem>
        </Select>
      </FormControl>

      <Button
        variant="contained"
        sx={{ height: '56px', marginTop: '0px', borderRadius: 3, backgroundColor: '#5fa7d9', color: '#fff' }}
        startIcon={<SearchIcon />}
      >
        Search
      </Button>
    </Box>
  );
}
