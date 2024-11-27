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
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import LocationInput from "./LocationInput"; // Import the new LocationInput component

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
        <Box sx={{width: "100%", maxWidth: "600px", padding: 4}}>
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
                onSubmit={handleSubmit}
                sx={{display: "flex", flexDirection: "column", gap: 2, position: "relative"}}
            >
                <TextField
                    label="Venue Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    error={!!errors.name}
                    helperText={errors.name}
                />

                {/* Replace the TextField for Location with the new LocationInput component */}
                <Box sx={{position: "relative", zIndex: 2}}>
                    {" "}
                    {/* Ensure LocationInput is above other fields */}
                    <LocationInput location={location} setLocation={setLocation} error={errors.location} />
                </Box>

                <FormControl fullWidth sx={{marginBottom: 2}}>
                    <InputLabel>Event Layout</InputLabel>
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
                            sx={{marginBottom: 2}}
                        />
                    </>
                )}

                <TextField
                    label="Square Footage"
                    value={squareFootage}
                    onChange={(e) => setSquareFootage(e.target.value)}
                    fullWidth
                    sx={{marginBottom: 2}}
                />
                <TextField
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    multiline
                    rows={4}
                    sx={{marginBottom: 2}}
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
                            onChange={(e) => setHasCatering({...hasCatering, onSite: e.target.checked})}
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
                        startIcon={<PhotoCameraIcon />}
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
                                <DeleteIcon />
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
