import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, Modal, IconButton, Drawer, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';
import { getUserPosts, updatePost, uploadImage } from '../../utils/firestore';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';

const UserPosts = ({ user, open, onClose }) => {
  const [posts, setPosts] = useState([]);
  const [editPost, setEditPost] = useState(null);
  const [editData, setEditData] = useState({ name: '', location: '', capacity: '', images: [] });
  const [newImages, setNewImages] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);

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
    setEditData({ name: post.name, location: post.location, capacity: post.capacity, images: post.images });
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

  const handleEditSubmit = async () => {
    try {
      let imageUrls = editData.images;

      if (newImages.length > 0) {
        const imageUploadPromises = Array.from(newImages).map((image) => uploadImage(image));
        const newImageUrls = await Promise.all(imageUploadPromises);
        imageUrls = [...imageUrls, ...newImageUrls];
      }

      const updatedData = { ...editData, images: imageUrls };
      await updatePost(editPost.id, updatedData);
      setOpenEdit(false);
      fetchPosts(); // Refresh posts
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  return (
    <>
      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box sx={{ width: 400, padding: 2 }}>
          <IconButton onClick={onClose} sx={{ alignSelf: 'flex-end' }}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" gutterBottom>Your Posts</Typography>
          <List>
            {posts.map((post) => (
              <ListItem key={post.id} button onClick={() => handleEditOpen(post)} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: 2, borderBottom: '1px solid #ddd' }}>
                {post.images.length > 0 && (
                  <img src={post.images[0]} alt={`preview-${post.id}`} width="100%" style={{ objectFit: 'cover', borderRadius: '8px', marginBottom: 8 }} />
                )}
                <ListItemText primary={post.name} secondary={`Location: ${post.location}, Capacity: ${post.capacity}`} />
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
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, bgcolor: "background.paper", border: "2px solid #000", boxShadow: 24, p: 4 }}>
          <Typography variant="h6">Edit Post</Typography>
          <TextField name="name" label="Venue Name" value={editData.name} onChange={handleEditChange} fullWidth sx={{ marginBottom: 2 }} />
          <TextField name="location" label="Location" value={editData.location} onChange={handleEditChange} fullWidth sx={{ marginBottom: 2 }} />
          <TextField name="capacity" label="Capacity" value={editData.capacity} onChange={handleEditChange} fullWidth sx={{ marginBottom: 2 }} />
          <input type="file" multiple onChange={handleImageChange} />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', marginTop: 2 }}>
            {editData.images.map((url, index) => (
              <Box key={index} sx={{ position: 'relative', width: '100px', height: '100px', marginRight: 1, marginBottom: 1 }}>
                <img src={url} alt={`img-${index}`} width="100%" height="100%" style={{ objectFit: 'cover', borderRadius: '8px' }} />
              </Box>
            ))}
          </Box>
          <Button variant="contained" color="primary" onClick={handleEditSubmit} sx={{ marginTop: 2 }}>Save</Button>
        </Box>
      </Modal>
    </>
  );
};

export default UserPosts;
