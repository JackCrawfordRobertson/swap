// src/components/VenueForm/VenueFormUI.js

import React from "react";
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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";

const VenueFormUI = ({
  name,
  setName,
  location,
  setLocation,
  eventType,
  setEventType,
  capacity,
  setCapacity,
  squareFootage,
  setSquareFootage,
  description,
  setDescription,
  bookingEmail,
  setBookingEmail,
  images,
  imagePreviews,
  loading,
  uploadComplete,
  hasAVFacilities,
  setHasAVFacilities,
  hasCatering,
  setHasCatering,
  errors,
  handleSubmit,
  handleImageChange,
  handleRemoveImage,
  handleEventTypeChange,
  handleCapacityChange,
  onClose,
}) => {
  return (
    <Box sx={{ width: "100%", maxWidth: "600px", padding: 4 }}>
      <IconButton onClick={onClose} sx={{ alignSelf: "flex-end" }}>
        <CloseIcon />
      </IconButton>
      <Typography variant="h6" gutterBottom>
        Add Venue
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
          <InputLabel>Event Type</InputLabel>
          <Select value={eventType} onChange={handleEventTypeChange} required>
            <MenuItem value="Cabaret">Cabaret</MenuItem>
            <MenuItem value="Theatre">Theatre</MenuItem>
            <MenuItem value="Boardroom">Boardroom</MenuItem>
            <MenuItem value="Banquet">Banquet</MenuItem>
            <MenuItem value="Reception">Reception</MenuItem>
            <MenuItem value="U-Shape">U-Shape</MenuItem>
            <MenuItem value="Classroom">Classroom</MenuItem>
          </Select>
        </FormControl>

        {eventType && (
          <>
            <TextField
              label={`Seated Capacity for ${eventType} Style`}
              value={capacity.seated}
              onChange={(e) => handleCapacityChange(e, "seated")}
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
          control={<Switch checked={hasAVFacilities} onChange={(e) => setHasAVFacilities(e.target.checked)} />}
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

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", marginTop: 2 }}>
          {imagePreviews.map((src, index) => (
            <Box key={index} sx={{ position: "relative", width: "100px", height: "100px" }}>
              <img
                src={src}
                alt={`preview-${index}`}
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }}
              />
              <IconButton onClick={() => handleRemoveImage(index)} sx={{ position: "absolute", top: 0, right: 0 }}>
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

export default VenueFormUI;