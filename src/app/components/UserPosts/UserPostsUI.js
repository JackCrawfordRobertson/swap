// src/components/UserPosts/UserPostsUI.js

import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Snackbar,
  Modal,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import EditPostForm from "./EditPostForm";

const UserPostsUI = ({
  posts,
  open,
  onClose,
  handleEditOpen,
  openEdit,
  handleEditClose,
  editData,
  handleEditChange,
  handleImageChange,
  handleRemoveImage,
  handleEditSubmit,
  handleDeletePost,
  openSnackbar,
  snackbarMessage,
  handleCloseSnackbar,
}) => {
  return (
    <>
      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box sx={{ width: 400, padding: 2 }}>
          <IconButton onClick={onClose} sx={{ position: "absolute", right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" gutterBottom>
            Your Posts
          </Typography>
          <List>
            {posts.map((post) => (
              <ListItem key={post.id} button onClick={() => handleEditOpen(post)}>
                {post.images.length > 0 && (
                  <img
                    src={post.images[0]}
                    alt={`preview-${post.id}`}
                    width="100%"
                    style={{
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginBottom: 8,
                    }}
                  />
                )}
                <ListItemText
                  primary={post.name}
                  secondary={`Location: ${post.location}, Capacity: ${post.capacity.seated} seated, ${post.capacity.standing} standing`}
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
        <EditPostForm
          editData={editData}
          handleEditChange={handleEditChange}
          handleImageChange={handleImageChange}
          handleRemoveImage={handleRemoveImage}
          handleEditSubmit={handleEditSubmit}
          handleDeletePost={handleDeletePost}
          handleEditClose={handleEditClose}
        />
      </Modal>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnackbar}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </>
  );
};

export default UserPostsUI;