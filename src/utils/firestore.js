import { db, storage } from '../config/firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

// Function to get all venues
export const getVenues = async (filters = {}) => {
  try {
    const querySnapshot = await getDocs(collection(db, 'venues'));
    let venues = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

    if (filters.location) {
      venues = venues.filter(venue => venue.location.toLowerCase().includes(filters.location.toLowerCase()));
    }

    return venues;
  } catch (error) {
    console.error("Error getting documents: ", error);
    throw error;
  }
};

// Function to add a new venue
export const addVenue = async (venue) => {
  try {
    const docRef = await addDoc(collection(db, 'venues'), venue);
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

// Function to update an existing post
export const updatePost = async (id, updatedData) => {
  try {
    console.log("Updating post with ID:", id);
    console.log("Data being updated:", updatedData);

    const postRef = doc(db, 'venues', id);
    await updateDoc(postRef, updatedData);

    console.log("Post updated successfully");
  } catch (error) {
    console.error("Error updating document: ", error);
    throw error;
  }
};

// Function to upload an image to Firebase Storage with metadata
export const uploadImage = async (file, userId) => {
  try {
    const storageRef = ref(storage, `venues/${file.name}`);
    const metadata = {
      customMetadata: {
        userId: userId // Attach the user's UID to the image metadata
      }
    };
    await uploadBytes(storageRef, file, metadata);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image: ", error);
    throw error;
  }
};

// Function to re-upload existing images with metadata
export const reuploadImagesWithMetadata = async (images, userId) => {
  try {
    const reuploadedImages = [];
    for (const image of images) {
      const storageRef = ref(storage, `venues/${image.name}`);
      const metadata = {
        customMetadata: {
          userId: userId // Set the user's UID as metadata
        }
      };
      await uploadBytes(storageRef, image, metadata);
      const downloadURL = await getDownloadURL(storageRef);
      reuploadedImages.push(downloadURL); // Store the new download URLs
    }
    return reuploadedImages; // Return the new URLs for further use
  } catch (error) {
    console.error("Error re-uploading images: ", error);
    throw error;
  }
};

// Function to get user's posts
export const getUserPosts = async (userId) => {
  try {
    const querySnapshot = await getDocs(collection(db, 'venues'));
    const posts = querySnapshot.docs
      .map(doc => ({ ...doc.data(), id: doc.id }))
      .filter(post => post.userId === userId);
    return posts;
  } catch (error) {
    console.error("Error getting user posts: ", error);
    throw error;
  }
};

// Function to delete an image from Firebase Storage
export const deleteImage = async (imageUrl) => {
  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
    console.log("Image deleted successfully");
  } catch (error) {
    console.error("Error deleting image: ", error);
    throw error;
  }
};

// Function to delete a post from Firestore
export const deletePost = async (postId) => {
  try {
    await deleteDoc(doc(db, 'venues', postId));
    console.log("Post deleted successfully");
  } catch (error) {
    console.error("Error deleting post: ", error);
    throw error;
  }
};

// Helper function to re-upload images with metadata and update post with new URLs
export const updateImagesWithMetadata = async (post, userId) => {
  try {
    // Re-upload all images with the user's UID as metadata
    const newImageUrls = await reuploadImagesWithMetadata(post.images, userId);

    // Update the post with the new image URLs
    await updatePost(post.id, { images: newImageUrls });
    console.log("Post updated with new image URLs");
  } catch (error) {
    console.error("Error updating post with new image URLs: ", error);
  }
};

// Function to update all posts of a user with re-uploaded images containing metadata
export const updateAllUserPosts = async (user) => {
  try {
    const userPosts = await getUserPosts(user.uid);

    for (const post of userPosts) {
      await updateImagesWithMetadata(post, user.uid);
    }
    console.log("All user posts updated with new image metadata");
  } catch (error) {
    console.error("Error updating all user posts: ", error);
  }
};