// src/components/VenueForm.js

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Input,
  LinearProgress,
  IconButton,
  Typography,
  MenuItem,
  FormControlLabel,
  Select,
  FormControl,
  InputLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
} from '@mui/material';
import { addVenue, uploadImage } from '../../utils/firestore';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';

const VenueForm = ({ user, onClose }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [venueType, setVenueType] = useState(''); // Changed from seatingType to venueType
  const [capacity, setCapacity] = useState({ seated: '', standing: '' });
  const [squareFootage, setSquareFootage] = useState('');
  const [description, setDescription] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [hasAVFacilities, setHasAVFacilities] = useState(false);
  const [hasCatering, setHasCatering] = useState({ onSite: false, external: false });
  const [errors, setErrors] = useState({});

  // Validation helper function
  const validate = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'Venue Name is required';
    if (!location) newErrors.location = 'Location is required';
    if (!bookingEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingEmail)) {
      newErrors.bookingEmail = 'Valid email is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const imageUploadPromises = Array.from(images).map((image) => uploadImage(image));
      const imageUrls = await Promise.all(imageUploadPromises);

      const venue = {
        name,
        location,
        venueType, // Changed field
        capacity,
        squareFootage,
        description,
        bookingEmail,
        hasAVFacilities,
        hasCatering,
        images: imageUrls,
        userId: user.uid,
      };

      await addVenue(venue);

      // Reset form after submission
      setName('');
      setLocation('');
      setVenueType(''); // Reset venueType
      setCapacity({ seated: '', standing: '' });
      setSquareFootage('');
      setDescription('');
      setBookingEmail('');
      setImages([]);
      setImagePreviews([]);
      setHasAVFacilities(false);
      setHasCatering({ onSite: false, external: false });
      setUploadComplete(true);
    } catch (error) {
      console.error('Error submitting venue: ', error);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setUploadComplete(false);
        onClose();
      }, 2000);
    }
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    setImages(files);

    const previews = Array.from(files).map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleRemoveImage = (index) => {
    const newImages = Array.from(images);
    const newPreviews = Array.from(imagePreviews);
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleVenueTypeChange = (e) => {
    setVenueType(e.target.value); // Changed field name
    setCapacity({ seated: '', standing: '' });
  };

  const handleCapacityChange = (e, key) => {
    setCapacity({ ...capacity, [key]: e.target.value });
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '600px', padding: 4 }}>
      <IconButton onClick={onClose} sx={{ alignSelf: 'flex-end' }}>
        <CloseIcon />
      </IconButton>
      <Typography variant="h6" gutterBottom>
        Add Venue
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Venue Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          error={!!errors.name}
          helperText={errors.name}
        />
        <TextField
          label="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          error={!!errors.location}
          helperText={errors.location}
        />
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel>Venue Type</InputLabel>
          <Select
            value={venueType} // Changed to venueType
            onChange={handleVenueTypeChange}
            required
          >
            <MenuItem value="Cabaret">Cabaret</MenuItem>
            <MenuItem value="Theatre">Theatre</MenuItem>
            <MenuItem value="Boardroom">Boardroom</MenuItem>
            <MenuItem value="Banquet">Banquet</MenuItem>
            <MenuItem value="U-Shape">U-Shape</MenuItem>
            <MenuItem value="Classroom">Classroom</MenuItem>
          </Select>
        </FormControl>

        {venueType && ( // Changed from seatingType to venueType
          <>
            <TextField
              label={`Seated Capacity for ${venueType} Style`} // Changed to venueType
              value={capacity.seated}
              onChange={(e) => handleCapacityChange(e, 'seated')}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label={`Standing Capacity for ${venueType} Style`} // Changed to venueType
              value={capacity.standing}
              onChange={(e) => handleCapacityChange(e, 'standing')}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
          </>
        )}

        <TextField
          label="Square Footage"
          value={squareFootage}
          onChange={(e) => setSquareFootage(e.target.value)}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={4}
          sx={{ marginBottom: 2 }}
        />

        <FormControlLabel
          control={
            <Switch
              checked={hasAVFacilities}
              onChange={(e) => setHasAVFacilities(e.target.checked)}
            />
          }
          label="Onsite AV Facilities Available"
        />

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Catering Services</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControlLabel
              control={
                <Switch
                  checked={hasCatering.onSite}
                  onChange={(e) => setHasCatering({ ...hasCatering, onSite: e.target.checked })}
                />
              }
              label="On-Site Catering"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={hasCatering.external}
                  onChange={(e) => setHasCatering({ ...hasCatering, external: e.target.checked })}
                />
              }
              label="External Catering Allowed"
            />
          </AccordionDetails>
        </Accordion>

        <TextField
          label="Booking Contact Email"
          type="email"
          value={bookingEmail}
          onChange={(e) => setBookingEmail(e.target.value)}
          required
          error={!!errors.bookingEmail}
          helperText={errors.bookingEmail}
        />

        <Input type="file" inputProps={{ multiple: true }} onChange={handleImageChange} sx={{ marginBottom: 2 }} />

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', marginTop: 2 }}>
          {imagePreviews.map((src, index) => (
            <Box key={index} sx={{ position: 'relative', width: '100px', height: '100px' }}>
              <img
                src={src}
                alt={`preview-${index}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
              />
              <IconButton
                onClick={() => handleRemoveImage(index)}
                sx={{ position: 'absolute', top: 0, right: 0, padding: '2px', color: 'red' }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
        </Box>

        <Button type="submit" variant="contained" color="primary">
          Add Venue
        </Button>

        {loading && <LinearProgress sx={{ marginTop: 2 }} />}
        {uploadComplete && (
          <Typography variant="body1" color="green" sx={{ marginTop: 2 }}>
            Upload Complete
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default VenueForm;