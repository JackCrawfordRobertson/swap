// src/components/UserPosts/UserPostsLogic.js

import React, { useState, useEffect } from "react";
import {
  getUserPosts,
  updatePost,
  uploadImage,
  deleteImage,
  deletePost,
} from "@/utils/firestore";
import UserPostsUI from "./UserPostsUI";

const UserPostsLogic = ({ user, open, onClose }) => {
  const [posts, setPosts] = useState([]);
  const [editPost, setEditPost] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    location: "",
    eventType: "",
    capacity: { seated: "", standing: "" },
    squareFootage: "",
    description: "",
    bookingEmail: "",
    images: [],
    hasAVFacilities: false,
    hasCatering: { onSite: false, external: false },
  });
  const [newImages, setNewImages] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

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
      console.error("Error fetching user posts:", error);
    }
  };

  const handleEditOpen = (post) => {
    setEditPost(post);
    setEditData({
      name: post.name,
      location: post.location,
      eventType: post.eventType,
      capacity: post.capacity,
      squareFootage: post.squareFootage,
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
      console.error("Error removing image: ", error);
    }
  };

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

      const updatedData = {
        ...editData,
        images: imageUrls,
      };

      await updatePost(editPost.id, updatedData);

      setSnackbarMessage("Changes saved successfully!");
      setOpenSnackbar(true);

      setOpenEdit(false);
      fetchPosts();
    } catch (error) {
      console.error("Error updating post:", error);
      setSnackbarMessage("Failed to save changes");
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
      setSnackbarMessage("Successfully deleted post");
      setOpenSnackbar(true);
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  return (
    <UserPostsUI
      posts={posts}
      open={open}
      onClose={onClose}
      handleEditOpen={handleEditOpen}
      openEdit={openEdit}
      handleEditClose={handleEditClose}
      editData={editData}
      handleEditChange={handleEditChange}
      handleImageChange={handleImageChange}
      handleRemoveImage={handleRemoveImage}
      handleEditSubmit={handleEditSubmit}
      handleDeletePost={handleDeletePost}
      openSnackbar={openSnackbar}
      snackbarMessage={snackbarMessage}
      handleCloseSnackbar={handleCloseSnackbar}
    />
  );
};

export default UserPostsLogic;