import React from "react";
import {
  Box,
  TextField,
  Typography,
  IconButton,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import ImagePreview from "./ImagePreview"; // New component for image preview and deletion

const EditPostForm = ({
  editData,
  handleEditChange,
  handleImageChange,
  handleRemoveImage,
  handleEditSubmit,
  handleDeletePost,
  handleEditClose,
}) => {
  return (
    <Box
      sx={{
        position: "absolute", // Keep the popup in the middle of the screen
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)", // Centre the popup
        width: "90vw", // Set width to 90% of the viewport
        height: "90vh", // Set height to 90% of the viewport
        bgcolor: "background.paper",
        borderRadius: "8px",
        boxShadow: 24,
        overflow: "auto", // Enable scrolling for content overflow
        padding: { xs: 2, sm: 4 }, // Responsive padding
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
        <Typography variant="h6" sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" } }}>
          Edit Venue
        </Typography>
        <IconButton aria-label="close" onClick={handleEditClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Form Fields */}
      <TextField
        name="name"
        label="Venue Name"
        value={editData.name}
        onChange={(e) => handleEditChange({ name: e.target.value })}
        fullWidth
        sx={{ marginBottom: 2 }}
      />

      <TextField
        name="location"
        label="Location"
        value={editData.location}
        onChange={(e) => handleEditChange({ location: e.target.value })}
        fullWidth
        required
        sx={{ marginBottom: 2 }}
      />

      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <InputLabel>Event Type</InputLabel>
        <Select
          name="eventType"
          value={editData.eventType}
          onChange={(e) => handleEditChange({ eventType: e.target.value })}
          required
        >
          <MenuItem value="Cabaret">Cabaret</MenuItem>
          <MenuItem value="Theatre">Theatre</MenuItem>
          <MenuItem value="Boardroom">Boardroom</MenuItem>
          <MenuItem value="Banquet">Banquet</MenuItem>
          <MenuItem value="Reception">Reception</MenuItem>
          <MenuItem value="U-Shape">U-Shape</MenuItem>
          <MenuItem value="Classroom">Classroom</MenuItem>
        </Select>
      </FormControl>

      <TextField
        name="capacitySeated"
        label="Seated Capacity"
        value={editData.capacity.seated}
        onChange={(e) =>
          handleEditChange({
            capacity: { ...editData.capacity, seated: e.target.value },
          })
        }
        fullWidth
        sx={{ marginBottom: 2 }}
      />

      <TextField
        label="Square Footage"
        name="squareFootage"
        value={editData.squareFootage}
        onChange={(e) => handleEditChange({ squareFootage: e.target.value })}
        fullWidth
        sx={{ marginBottom: 2 }}
      />

      <TextField
        label="Description"
        name="description"
        value={editData.description}
        onChange={(e) => handleEditChange({ description: e.target.value })}
        fullWidth
        multiline
        rows={4}
        sx={{ marginBottom: 2 }}
      />

      <FormControlLabel
        control={
          <Switch
            checked={editData.hasAVFacilities}
            onChange={(e) => handleEditChange({ hasAVFacilities: e.target.checked })}
          />
        }
        label="Onsite AV Facilities Available"
      />

      <FormControlLabel
        control={
          <Switch
            checked={editData.hasCatering}
            onChange={(e) => handleEditChange({ hasCatering: e.target.checked })}
          />
        }
        label="Onsite Catering Facilities Available"
      />

      <TextField
        label="Booking Contact Email"
        name="bookingEmail"
        type="email"
        value={editData.bookingEmail}
        onChange={(e) => handleEditChange({ bookingEmail: e.target.value })}
        fullWidth
        required
        sx={{ marginY: 2 }}
      />

      {/* Image Upload and Preview */}
      <Box sx={{ textAlign: "left", marginBottom: 2 }}>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Please upload 3 photos of the space
        </Typography>
        <Button
          variant="contained"
          component="label"
          startIcon={<PhotoCameraIcon />}
          sx={{ width: "100%", marginBottom: 2 }}
        >
          Choose Files
          <input type="file" hidden multiple onChange={handleImageChange} />
        </Button>
        <ImagePreview images={editData.images} handleRemoveImage={handleRemoveImage} />
      </Box>

      {/* Submit and Delete Buttons */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleEditSubmit}
        sx={{ marginTop: 2, width: "100%", fontSize: { xs: "0.9rem", sm: "1rem" } }}
      >
        Save
      </Button>
      <Button
        variant="contained"
        color="error"
        onClick={handleDeletePost}
        sx={{ marginTop: 1, width: "100%", fontSize: { xs: "0.9rem", sm: "1rem" } }}
      >
        Delete
      </Button>
    </Box>
  );
};

export default EditPostForm;