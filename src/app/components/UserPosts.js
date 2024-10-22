// src/components/UserPosts.js

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Modal,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Snackbar,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  getUserPosts,
  updatePost,
  uploadImage,
  deleteImage,
  deletePost,
} from '../../utils/firestore';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
// Removed unused imports
// import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
// import { getCityFromAddress } from '../../utils/geocode'; // Removed import

const UserPosts = ({ user, open, onClose }) => {
  const [posts, setPosts] = useState([]);
  const [editPost, setEditPost] = useState(null);
  const [editData, setEditData] = useState({
    name: '',
    location: '',
    seatingType: '',
    capacity: { seated: '', standing: '' },
    squareFootage: '',
    venueType: '',
    description: '',
    bookingEmail: '',
    images: [],
    hasAVFacilities: false,
    hasCatering: { onSite: false, external: false },
  });
  const [newImages, setNewImages] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  const fetchPosts = async () => {
    try {
      const userPosts = await getUserPosts(user.uid);
      setPosts(userPosts);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  const handleEditOpen = (post) => {
    setEditPost(post);
    setEditData({
      name: post.name,
      location: post.location,
      seatingType: post.seatingType,
      capacity: post.capacity,
      squareFootage: post.squareFootage,
      venueType: post.venueType,
      description: post.description,
      bookingEmail: post.bookingEmail,
      images: post.images,
      hasAVFacilities: post.hasAVFacilities,
      hasCatering: post.hasCatering,
    });
    setOpenEdit(true);
  };

  const handleEditClose = () => setOpenEdit(false);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleImageChange = (e) => {
    setNewImages(e.target.files);
  };

  const handleRemoveImage = async (index) => {
    try {
      await deleteImage(editData.images[index]);
      const newImages = Array.from(editData.images);
      newImages.splice(index, 1);
      setEditData({ ...editData, images: newImages });
    } catch (error) {
      console.error('Error removing image: ', error);
    }
  };

  // Removed handleSelect function and PlacesAutocomplete

  const handleEditSubmit = async () => {
    try {
      let imageUrls = editData.images;

      // Upload new images if any
      if (newImages.length > 0) {
        const imageUploadPromises = Array.from(newImages).map((image) =>
          uploadImage(image)
        );
        const newImageUrls = await Promise.all(imageUploadPromises);
        imageUrls = [...imageUrls, ...newImageUrls];
      }

      // Filter out undefined values
      const updatedData = {
        ...editData,
        images: imageUrls,
        venueType: editData.venueType || 'Unknown', // Set a default value if venueType is undefined
      };

      // Remove any fields with undefined values
      Object.keys(updatedData).forEach((key) => {
        if (updatedData[key] === undefined) {
          delete updatedData[key];
        }
      });

      // Firestore update call
      await updatePost(editPost.id, updatedData);

      setSnackbarMessage('Changes saved successfully!');
      setOpenSnackbar(true); // Show success message

      setOpenEdit(false);
      fetchPosts(); // Refresh posts
    } catch (error) {
      console.error('Error updating post:', error);
      setSnackbarMessage('Failed to save changes');
      setOpenSnackbar(true);
    }
  };

  const handleDeletePost = async () => {
    try {
      for (const imageUrl of editData.images) {
        await deleteImage(imageUrl);
      }
      await deletePost(editPost.id);
      setOpenEdit(false);
      setSnackbarMessage('Successfully deleted post');
      setOpenSnackbar(true);
      fetchPosts(); // Refresh posts
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box sx={{ width: 400, padding: 2 }}>
          <IconButton
            onClick={onClose}
            sx={{ position: 'absolute', right: 8, top: 8, color: 'grey.500' }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" gutterBottom>
            Your Posts
          </Typography>
          <List>
            {posts.map((post) => (
              <ListItem
                key={post.id}
                button
                onClick={() => handleEditOpen(post)}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: 2,
                  borderBottom: '1px solid #ddd',
                }}
              >
                {post.images.length > 0 && (
                  <img
                    src={post.images[0]}
                    alt={`preview-${post.id}`}
                    width="100%"
                    style={{
                      objectFit: 'cover',
                      borderRadius: '8px',
                      marginBottom: 8,
                    }}
                  />
                )}
                <ListItemText
                  primary={post.name}
                  secondary={`Location: ${post.city}, Capacity: ${post.capacity.seated} seated, ${post.capacity.standing} standing`}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => handleEditOpen(post)}>
                    <EditIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Modal open={openEdit} onClose={handleEditClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 700,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleEditClose}
            sx={{ position: 'absolute', right: 8, top: 8, color: 'grey.500' }}
          >
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
          {/* Changed to a regular TextField for location */}
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
            <InputLabel>Seating Style</InputLabel>
            <Select
              name="seatingType"
              value={editData.seatingType}
              onChange={handleEditChange}
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

          <TextField
            name="capacitySeated"
            label="Seated Capacity"
            value={editData.capacity.seated}
            onChange={(e) =>
              setEditData({
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
              setEditData({
                ...editData,
                capacity: { ...editData.capacity, standing: e.target.value },
              })
            }
            fullWidth
            sx={{ marginBottom: 2 }}
          />

          <TextField
            name="squareFootage"
            label="Square Footage"
            value={editData.squareFootage}
            onChange={handleEditChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={editData.hasAVFacilities}
                onChange={(e) =>
                  setEditData({ ...editData, hasAVFacilities: e.target.checked })
                }
              />
            }
            label="Onsite AV Facilities Available"
          />

          <FormControlLabel
            control={
              <Switch
                checked={editData.hasCatering.onSite}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    hasCatering: {
                      ...editData.hasCatering,
                      onSite: e.target.checked,
                    },
                  })
                }
              />
            }
            label="On-Site Catering"
          />

          <FormControlLabel
            control={
              <Switch
                checked={editData.hasCatering.external}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    hasCatering: {
                      ...editData.hasCatering,
                      external: e.target.checked,
                    },
                  })
                }
              />
            }
            label="External Catering Allowed"
          />

          <TextField
            name="bookingEmail"
            label="Booking Email"
            type="email"
            value={editData.bookingEmail}
            onChange={handleEditChange}
            fullWidth
            sx={{ marginBottom: 2, marginTop: 2 }}
          />

          <input type="file" multiple onChange={handleImageChange} />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', marginTop: 2 }}>
            {editData.images.map((url, index) => (
              <Box
                key={index}
                sx={{
                  position: 'relative',
                  width: '100px',
                  height: '100px',
                  marginRight: 1,
                  marginBottom: 1,
                }}
              >
                <img
                  src={url}
                  alt={`img-${index}`}
                  width="100%"
                  height="100%"
                  style={{ objectFit: 'cover', borderRadius: '8px' }}
                />
                <IconButton
                  onClick={() => handleRemoveImage(index)}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    padding: '2px',
                    color: 'red',
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={handleEditSubmit}
            sx={{ marginTop: 2, width: '100%', color: 'white' }}
          >
            Save
          </Button>
          <Button
            variant="contained"
            sx={{
              marginTop: 2,
              width: '100%',
              backgroundColor: 'rgba(231, 76, 60, 1.0)',
              color: 'white',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: 'rgba(192, 57, 43, 1.0)',
              },
            }}
            onClick={handleDeletePost}
          >
            Delete
          </Button>
        </Box>
      </Modal>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleCloseSnackbar}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </>
  );
};

export default UserPosts;