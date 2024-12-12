import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Grid,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import ImagePreview from "./ImagePreview";
import LocationInput from "../AddVenue/LocationInput";

const EditPostForm = ({
  editData,
  handleEditChange,
  handleImageChange,
  handleRemoveImage,
  handleEditSubmit,
  handleDeletePost,
  handleEditClose,
  newImages = [],
}) => {
  // State for handling location errors
  const [locationError, setLocationError] = React.useState("");

  // Combine existing images and new images for preview
  const combinedImages = [
    ...(Array.isArray(editData.images) ? editData.images : []),
    ...newImages,
  ];

  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "90vw",
        height: "90vh",
        bgcolor: "background.paper",
        borderRadius: "8px",
        boxShadow: 24,
        overflow: "auto",
        padding: { xs: 2, sm: 4 },
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginBottom={2}
      >
        <Typography
          variant="h5"
          sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" } }}
        >
          Edit Venue
        </Typography>
        <IconButton aria-label="close" onClick={handleEditClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <TextField
        name="name"
        label="Venue Name"
        value={editData.name || ""}
        onChange={(e) => handleEditChange({ name: e.target.value })}
        fullWidth
        sx={{ marginBottom: 2 }}
      />

      <Grid container spacing={2} sx={{ marginBottom: 2 }}>
        <Grid item xs={12} sm={6}>
          <LocationInput
            location={editData.location || ""}
            setLocation={(location) => handleEditChange({ location })}
            error={locationError}
            setError={setLocationError} // Pass setError to LocationInput
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel shrink>Event Layout</InputLabel>
            <Select
              name="eventType"
              value={editData.eventType || ""}
              onChange={(e) => handleEditChange({ eventType: e.target.value })}
              required
              displayEmpty
            >
              <MenuItem value="" disabled>
                Select Event Layout
              </MenuItem>
              <MenuItem value="Cabaret">Cabaret</MenuItem>
              <MenuItem value="Theatre">Theatre</MenuItem>
              <MenuItem value="Boardroom">Boardroom</MenuItem>
              <MenuItem value="Banquet">Banquet</MenuItem>
              <MenuItem value="Reception (Standing)">
                Reception (Standing)
              </MenuItem>
              <MenuItem value="U-Shape">U-Shape</MenuItem>
              <MenuItem value="Classroom">Classroom</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ marginBottom: 2 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            name="capacitySeated"
            label="Seated Capacity"
            value={editData.capacity?.seated || ""}
            onChange={(e) =>
              handleEditChange({
                capacity: { ...editData.capacity, seated: e.target.value },
              })
            }
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Square Footage"
            name="squareFootage"
            value={editData.squareFootage || ""}
            onChange={(e) => handleEditChange({ squareFootage: e.target.value })}
            fullWidth
          />
        </Grid>
      </Grid>

      <TextField
        label="Description"
        name="description"
        value={editData.description || ""}
        onChange={(e) => handleEditChange({ description: e.target.value })}
        fullWidth
        multiline
        rows={4}
        sx={{ marginBottom: 2 }}
      />

      <FormControlLabel
        control={
          <Switch
            checked={!!editData.hasAVFacilities}
            onChange={(e) =>
              handleEditChange({ hasAVFacilities: e.target.checked })
            }
          />
        }
        label="Onsite AV Facilities Available"
      />

      <FormControlLabel
        control={
          <Switch
            checked={!!editData.hasCatering}
            onChange={(e) =>
              handleEditChange({ hasCatering: e.target.checked })
            }
          />
        }
        label="Onsite Catering Facilities Available"
      />

      <TextField
        label="Booking Contact Email"
        name="bookingEmail"
        type="email"
        value={editData.bookingEmail || ""}
        onChange={(e) => handleEditChange({ bookingEmail: e.target.value })}
        fullWidth
        required
        sx={{ marginY: 2 }}
      />

      <Box sx={{ textAlign: "left", marginBottom: 2 }}>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Please upload up to 3 photos of the space
        </Typography>
        <Button
          variant="contained"
          component="label"
          startIcon={<PhotoCameraIcon />}
          sx={{ width: "100%", marginBottom: 2 }}
          disabled={combinedImages.length >= 3}
        >
          Choose Files
          <input type="file" hidden multiple onChange={handleImageChange} />
        </Button>
        <ImagePreview
          images={combinedImages}
          handleRemoveImage={handleRemoveImage}
        />
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleEditSubmit}
            sx={{
              marginTop: 1,
              width: "100%",
              fontSize: { xs: "0.9rem", sm: "1rem" },
            }}
          >
            Save
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeletePost}
            sx={{
              marginTop: 1,
              width: "100%",
              fontSize: { xs: "0.9rem", sm: "1rem" },
            }}
          >
            Delete
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EditPostForm;