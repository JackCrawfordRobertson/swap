// src/pages/results.js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Typography, Grid, Card, CardContent, CardMedia } from '@mui/material';
import { getVenues } from '../src/utils/firestore';

export default function Results() {
  const router = useRouter();
  const { eventType, guests, location } = router.query;
  const [filteredVenues, setFilteredVenues] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const allVenues = await getVenues();
      const filtered = allVenues.filter(venue =>
        (!eventType || venue.eventType === eventType) &&
        (!guests || venue.capacity >= guests) &&
        (!location || venue.location === location)
      );
      setFilteredVenues(filtered);
    };
    fetchData();
  }, [eventType, guests, location]);

  return (
    <>
      <Box sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom>Search Results</Typography>
        <Grid container spacing={2}>
          {filteredVenues.map((venue) => (
            <Grid item key={venue.id} xs={12} sm={6} md={4}>
              <Card>
                {venue.images.length > 0 && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={venue.images[0]}
                    alt={venue.name}
                  />
                )}
                <CardContent>
                  <Typography variant="h6">{venue.name}</Typography>
                  <Typography variant="body2" color="textSecondary">{venue.location}</Typography>
                  <Typography variant="body2" color="textSecondary">Capacity: {venue.capacity}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}
