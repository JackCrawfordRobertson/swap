import React from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  LinearProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LocationInput from "./LocationInput";

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
  setErrors,
  handleSubmit,
  handleImageChange,
  handleRemoveImage,
  handleCapacityChange,
  onClose,
}) => {
  /**
   * Validates if the location contains a city.
   * Adds an error message if the validation fails.
   */
  const validateLocation = () => {
    if (!location.includes(",")) {
      setErrors((prev) => ({ ...prev, location: "Please select a valid location with a city." }));
      return false;
    }
    return true;
  };

  /**
   * Handles form submission.
   * Ensures the location is valid before submitting the form.
   * @param {Object} e - Event object.
   */
  const onFormSubmit = (e) => {
    e.preventDefault();
    const isLocationValid = validateLocation();

    if (isLocationValid) {
      handleSubmit();
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "600px", padding: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6" gutterBottom>
          Add Venue
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Box
    component="form"
    onSubmit={(e) => handleSubmit(e)} // Main form with submit handler
    sx={{ display: "flex", flexDirection: "column", gap: 2, position: "relative" }}
>
    <TextField
        label="Venue Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        error={!!errors.name}
        helperText={errors.name}
    />
    <LocationInput
        location={location}
        setLocation={setLocation}
        error={errors.location}
        setError={(error) => setErrors((prev) => ({ ...prev, location: error }))}
    />
    <FormControl fullWidth>
        <InputLabel>Event Layout</InputLabel>
        <Select value={eventType} onChange={(e) => setEventType(e.target.value)} required>
            <MenuItem value="Cabaret">Cabaret</MenuItem>
            <MenuItem value="Theatre">Theatre</MenuItem>
            <MenuItem value="Boardroom">Boardroom</MenuItem>
            <MenuItem value="Banquet">Banquet</MenuItem>
            <MenuItem value="Reception (Standing)">Reception (Standing)</MenuItem>
            <MenuItem value="U-Shape">U-Shape</MenuItem>
            <MenuItem value="Classroom">Classroom</MenuItem>
        </Select>
    </FormControl>
    {eventType && (
        <TextField
            label={`Seated Capacity for ${eventType} Style`}
            value={capacity.seated}
            onChange={(e) => handleCapacityChange(e, "seated")}
            fullWidth
            sx={{ marginBottom: 2 }}
        />
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
            <Switch checked={hasAVFacilities} onChange={(e) => setHasAVFacilities(e.target.checked)} />
        }
        label="Onsite AV Facilities Available"
    />
    <FormControlLabel
        control={
            <Switch
                checked={hasCatering.onSite}
                onChange={(e) => setHasCatering({ ...hasCatering, onSite: e.target.checked })}
            />
        }
        label="Onsite Catering Facilities Available"
    />
    <TextField
        label="Booking Contact Email"
        type="email"
        value={bookingEmail}
        onChange={(e) => setBookingEmail(e.target.value)}
        required
        error={!!errors.bookingEmail}
        helperText={errors.bookingEmail}
    />
    <Box sx={{ textAlign: "left" }}>
        <Typography variant="body2" color="textSecondary" gutterBottom>
            Please upload up to 3 photos of the space
        </Typography>
        <Button
            sx={{ width: "100%" }}
            variant="contained"
            component="label"
            disabled={images.length >= 3}
        >
            Choose Files
            <input type="file" hidden multiple accept="image/*" onChange={handleImageChange} />
        </Button>
    </Box>
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", marginTop: 2 }}>
        {imagePreviews.map((src, index) => (
            <Box key={index} sx={{ position: "relative", width: "95px", height: "95px" }}>
                <img
                    src={src}
                    alt={`preview-${index}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }}
                />
                <IconButton
                    onClick={() => handleRemoveImage(index)}
                    sx={{ position: "absolute", top: 0, right: 0 }}
                >
                    <CloseIcon />
                </IconButton>
            </Box>
        ))}
    </Box>
    {loading && <LinearProgress />}
    {uploadComplete && (
        <Typography variant="body1" color="green">
            Upload Complete
        </Typography>
    )}
    <Button type="submit" variant="contained">
        Add Venue
    </Button>
</Box>
    </Box>
  );
};

export default VenueFormUI;