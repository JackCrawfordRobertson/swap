import React, { useState } from "react";
import { Box, TextField, Button, Input, LinearProgress, IconButton, Typography, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { addVenue, uploadImage } from "../../utils/firestore";
import CloseIcon from "@mui/icons-material/Close";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import DeleteIcon from "@mui/icons-material/Delete";

const VenueForm = ({ user, onClose }) => {
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [capacity, setCapacity] = useState("");
    const [venueType, setVenueType] = useState("");
    const [customVenueType, setCustomVenueType] = useState(""); // State for custom venue type
    const [description, setDescription] = useState("");
    const [bookingEmail, setBookingEmail] = useState("");
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploadComplete, setUploadComplete] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            console.error("User not authenticated");
            return;
        }

        setLoading(true);

        try {
            const imageUploadPromises = Array.from(images).map((image) => uploadImage(image));
            const imageUrls = await Promise.all(imageUploadPromises);

            const venue = {
                name,
                location,
                capacity,
                venueType: venueType === "Other" ? customVenueType : venueType, // Use custom venue type if "Other"
                description,
                bookingEmail,
                images: imageUrls,
                userId: user.uid,
            };

            await addVenue(venue);

            setName("");
            setLocation("");
            setCapacity("");
            setVenueType("");
            setCustomVenueType(""); // Reset custom venue type
            setDescription("");
            setBookingEmail("");
            setImages([]);
            setImagePreviews([]);
            setUploadComplete(true);
        } catch (error) {
            console.error("Error submitting venue: ", error);
        } finally {
            setLoading(false);
            setTimeout(() => {
                setUploadComplete(false);
                onClose();
            }, 2000); // Close drawer after 2 seconds
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

    const handleSelect = async (address) => {
        const results = await geocodeByAddress(address);
        const latLng = await getLatLng(results[0]);
        setLocation(address);
    };

    const handleDescriptionChange = (e) => {
        const words = e.target.value.split(/\s+/);
        if (words.length <= 100) {
            setDescription(e.target.value);
        }
    };

    return (
        <Box sx={{ width: 400, padding: 4 }}>
            <IconButton onClick={onClose} sx={{ alignSelf: "flex-end" }}>
                <CloseIcon />
            </IconButton>
            <Typography variant="h6" gutterBottom>
                Add Venue
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField label="Venue Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <PlacesAutocomplete value={location} onChange={setLocation} onSelect={handleSelect}>
                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                        <div>
                            <TextField
                                {...getInputProps({
                                    label: "Location",
                                    placeholder: "Search Places ...",
                                    fullWidth: true,
                                    required: true,
                                })}
                            />
                            <Box sx={{ position: "relative", zIndex: 1000 }}>
                                {loading && <div>Loading...</div>}
                                {suggestions.length > 0 && (
                                    <Box
                                        sx={{
                                            border: "1px solid #ddd",
                                            borderRadius: "4px",
                                            marginTop: 1,
                                            backgroundColor: "#fff",
                                        }}
                                    >
                                        {suggestions.map((suggestion, index) => {
                                            const style = suggestion.active
                                                ? { backgroundColor: "#a8dadc", cursor: "pointer", padding: "10px" }
                                                : { backgroundColor: "#fff", cursor: "pointer", padding: "10px" };
                                            return (
                                                <Box {...getSuggestionItemProps(suggestion, { style })} key={index}>
                                                    {suggestion.description}
                                                </Box>
                                            );
                                        })}
                                    </Box>
                                )}
                            </Box>
                        </div>
                    )}
                </PlacesAutocomplete>
                <TextField label="Capacity" value={capacity} onChange={(e) => setCapacity(e.target.value)} required />
                <TextField
                    label="Booking Contact Email"
                    type="email"
                    value={bookingEmail}
                    onChange={(e) => setBookingEmail(e.target.value)}
                    required
                />
                <FormControl fullWidth>
                    <InputLabel>Venue Type</InputLabel>
                    <Select value={venueType} onChange={(e) => setVenueType(e.target.value)} required>
                        <MenuItem value="Awards">Awards</MenuItem>
                        <MenuItem value="Conference">Conference</MenuItem>
                        <MenuItem value="Leadership Lunch">Leadership Lunch</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                    </Select>
                </FormControl>
                {venueType === "Other" && (
                    <TextField
                        label="Custom Venue Type"
                        value={customVenueType}
                        onChange={(e) => setCustomVenueType(e.target.value)}
                        required
                    />
                )}
                <TextField
                    label="Description"
                    value={description}
                    onChange={handleDescriptionChange}
                    multiline
                    rows={4}
                    inputProps={{ maxLength: 500 }}
                    helperText={`${description.split(/\s+/).length}/100 words`}
                    required
                />
                <Input type="file" inputProps={{ multiple: true }} onChange={handleImageChange} required sx={{ marginBottom: 2 }} />
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", marginTop: 2 }}>
                    {imagePreviews.map((src, index) => (
                        <Box key={index} sx={{ position: "relative", width: "100px", height: "100px" }}>
                            <img
                                src={src}
                                alt={`preview-${index}`}
                                width="100"
                                height="100"
                                style={{ objectFit: "cover", borderRadius: "8px" }}
                            />
                            <IconButton
                                onClick={() => handleRemoveImage(index)}
                                sx={{ position: "absolute", top: 0, right: 0, padding: "2px", color: "red" }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    ))}
                </Box>
                <Button type="submit" variant="contained" color="primary" sx={{ color: "white" }}>
                    Add Venue
                </Button>
                {loading && <LinearProgress sx={{ marginTop: 2 }} />}
                {uploadComplete && <Typography variant="body1" color="green" sx={{ marginTop: 2 }}>Upload Complete</Typography>}
            </Box>
        </Box>
    );
};

export default VenueForm;
