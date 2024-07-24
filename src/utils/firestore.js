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
    const postRef = doc(db, 'venues', id);
    await updateDoc(postRef, updatedData);
  } catch (error) {
    console.error("Error updating document: ", error);
    throw error;
  }
};

// Function to upload an image to Firebase Storage
export const uploadImage = async (file) => {
  try {
    const storageRef = ref(storage, `venues/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image: ", error);
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
