// src/components/UserPosts/EditPostForm.js

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
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 700,
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        p: 4,
      }}
    >
      <IconButton aria-label="close" onClick={handleEditClose} sx={{ position: "absolute", right: 8, top: 8 }}>
        <CloseIcon />
      </IconButton>

      <Typography variant="h6">Edit Post</Typography>
      <TextField
        name="name"
        label="Venue Name"
        value={editData.name}
        onChange={handleEditChange}
        fullWidth
        sx={{ marginBottom: 2, marginTop: 2 }}
      />
      <TextField
        name="location"
        label="Location"
        value={editData.location}
        onChange={handleEditChange}
        fullWidth
        required
        sx={{ marginBottom: 2 }}
      />

      <FormControl fullWidth sx={{ marginBottom: 2, marginTop: 2 }}>
        <InputLabel>Event Type</InputLabel>
        <Select name="eventType" value={editData.eventType} onChange={handleEditChange} required>
          <MenuItem value="Cabaret">Cabaret</MenuItem>
          <MenuItem value="Theatre">Theatre</MenuItem>
          <MenuItem value="Boardroom">Boardroom</MenuItem>
          <MenuItem value="Banquet">Banquet</MenuItem>
          <MenuItem value="U-Shape">U-Shape</MenuItem>
          <MenuItem value="Classroom">Classroom</MenuItem>
        </Select>
      </FormControl>

      {/* Other Fields */}
      <TextField
        name="capacitySeated"
        label="Seated Capacity"
        value={editData.capacity.seated}
        onChange={(e) =>
          handleEditChange({
            ...editData,
            capacity: { ...editData.capacity, seated: e.target.value },
          })
        }
        fullWidth
        sx={{ marginBottom: 2 }}
      />
      <TextField
        name="capacityStanding"
        label="Standing Capacity"
        value={editData.capacity.standing}
        onChange={(e) =>
          handleEditChange({
            ...editData,
            capacity: { ...editData.capacity, standing: e.target.value },
          })
        }
        fullWidth
        sx={{ marginBottom: 2 }}
      />

      {/* Image Upload and Preview */}
      <input type="file" multiple onChange={handleImageChange} />
      <ImagePreview images={editData.images} handleRemoveImage={handleRemoveImage} />

      <Button variant="contained" color="primary" onClick={handleEditSubmit} sx={{ marginTop: 2, width: "100%" }}>
        Save
      </Button>
      <Button
        variant="contained"
        color="error"
        onClick={handleDeletePost}
        sx={{ marginTop: 2, width: "100%" }}
      >
        Delete
      </Button>
    </Box>
  );
};

export default EditPostForm;