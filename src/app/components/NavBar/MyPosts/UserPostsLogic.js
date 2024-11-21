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
      console.log("Fetching posts for user:", user.uid);
      fetchPosts();
    }
  }, [user]);

  const fetchPosts = async () => {
    try {
      const userPosts = await getUserPosts(user.uid);
      console.log("Fetched posts:", userPosts);
      setPosts(userPosts);
    } catch (error) {
      console.error("Error fetching user posts:", error);
    }
  };

  const handleEditOpen = (post) => {
    console.log("Opening edit for post:", post);
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
    setNewImages([]); // Reset new images on edit open
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    console.log("Closing edit modal");
    setOpenEdit(false);
    setNewImages([]); // Reset new images on edit close
  };

  const handleEditChange = (e) => {
    if (e && e.target) {
      const { name, value } = e.target;
      console.log(`Changing field ${name} to ${value}`);
      setEditData({ ...editData, [name]: value });
    } else {
      console.log("Updating editData with object:", e);
      setEditData({ ...editData, ...e });
    }
  };

  // Updated function to handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prevImages) => [...prevImages, ...files]);
  };

  // Updated function to handle image removal
  const handleRemoveImage = async (index) => {
    console.log("Attempting to remove image at index:", index);
    const existingImagesCount = editData.images.length;
  
    if (index < existingImagesCount) {
      // Remove from existing images
      const imageUrlToDelete = editData.images[index];
      try {
        await deleteImage(imageUrlToDelete);
        console.log("Deleted image from storage:", imageUrlToDelete);
      } catch (error) {
        console.error("Error deleting image from storage:", error);
      }
  
      const updatedImages = [...editData.images];
      updatedImages.splice(index, 1);
      console.log("Updated images after removal:", updatedImages);
      setEditData({ ...editData, images: updatedImages });
    } else {
      // Remove from new images
      const newImageIndex = index - existingImagesCount;
      const updatedNewImages = [...newImages];
      updatedNewImages.splice(newImageIndex, 1);
      setNewImages(updatedNewImages);
      console.log("Updated newImages after removal:", updatedNewImages);
    }
  };

  // Updated function to handle form submission
  const handleEditSubmit = async () => {
    console.log("Submitting edit with data:", editData);
    try {
      let imageUrls = editData.images;

      if (newImages.length > 0) {
        console.log("Uploading new images:", newImages);
        const imageUploadPromises = newImages.map((image) =>
          uploadImage(image, user.uid)
        );

        const newImageUrls = await Promise.all(imageUploadPromises);
        console.log("Uploaded new image URLs:", newImageUrls);
        imageUrls = [...imageUrls, ...newImageUrls];
      }

      const updatedData = { ...editData, images: imageUrls };
      console.log("Final data to update post:", updatedData);

      await updatePost(editPost.id, updatedData);

      setSnackbarMessage("Changes saved successfully!");
      setOpenSnackbar(true);

      setNewImages([]); // Clear new images after submission

      setOpenEdit(false);
      fetchPosts();
    } catch (error) {
      console.error("Error during submit:", error);
      setSnackbarMessage("Failed to save changes");
      setOpenSnackbar(true);
    }
  };

  const handleDeletePost = async () => {
    console.log("Deleting post with ID:", editPost.id);
    try {
      for (const imageUrl of editData.images) {
        console.log("Deleting image:", imageUrl);
        try {
          await deleteImage(imageUrl);
        } catch (error) {
          console.error("Error deleting image from storage:", error);
        }
      }
      await deletePost(editPost.id);
      console.log("Post successfully deleted");
      setOpenEdit(false);
      setSnackbarMessage("Successfully deleted post");
      setOpenSnackbar(true);
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      setSnackbarMessage("Failed to delete post");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    console.log("Closing snackbar");
    setOpenSnackbar(false);
    setSnackbarMessage("");
  };

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
      newImages={newImages}
      openSnackbar={openSnackbar}
      snackbarMessage={snackbarMessage}
      handleCloseSnackbar={handleCloseSnackbar}
    />
  );
};

export default UserPostsLogic;