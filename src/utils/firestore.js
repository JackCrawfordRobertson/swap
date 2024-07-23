// src/utils/firestore.js
import { db, storage } from '../config/firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Function to get all venues
export const getVenues = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'venues'));
    const venues = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
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
