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

  const handleImageChange = (e) => {
    setNewImages(e.target.files);
  };

  const handleRemoveImage = async (index) => {
    console.log("Attempting to remove image at index:", index);
    try {
      await deleteImage(editData.images[index]);
      const updatedImages = Array.from(editData.images);
      updatedImages.splice(index, 1);
      console.log("Updated images after removal:", updatedImages);
      setEditData({ ...editData, images: updatedImages });
    } catch (error) {
      console.error("Error removing image:", error);
    }
  };

  const handleEditSubmit = async () => {
    console.log("Submitting edit with data:", editData);
    try {
      let imageUrls = editData.images;

      if (newImages.length > 0) {

        console.log("Uploading new images:", newImages);
        const imageUploadPromises = newImages.map((image) => uploadImage(image));

        

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
        await deleteImage(imageUrl);
      }
      await deletePost(editPost.id);
      console.log("Post successfully deleted");
      setOpenEdit(false);
      setSnackbarMessage("Successfully deleted post");
      setOpenSnackbar(true);
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleCloseSnackbar = () => {
    console.log("Closing snackbar");
    setOpenSnackbar(false);
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
      handleImageUpload={handleImageUpload}
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