// src/app/components/VenueForm.js
import React, { useState } from 'react';
import { Box, TextField, Button, Input } from '@mui/material';
import { addVenue, uploadImage } from '../../utils/firestore';

const VenueForm = ({ user }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('');
  const [images, setImages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const imageUploadPromises = Array.from(images).map((image) => uploadImage(image));
      const imageUrls = await Promise.all(imageUploadPromises);

      const venue = { name, location, capacity, images: imageUrls, userId: user.uid };
      await addVenue(venue);

      setName('');
      setLocation('');
      setCapacity('');
      setImages([]);
    } catch (error) {
      console.error("Error submitting venue: ", error);
    }
  };

  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField label="Venue Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <TextField label="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
      <TextField label="Capacity" value={capacity} onChange={(e) => setCapacity(e.target.value)} required />
      <Input type="file" inputProps={{ multiple: true }} onChange={handleImageChange} required />
      <Button type="submit" variant="contained" color="primary">Add Venue</Button>
    </Box>
  );
};

export default VenueForm;
