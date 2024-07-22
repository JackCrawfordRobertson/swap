// src/utils/firestore.js
import { db, storage } from '../config/firebaseConfig';
import { collection, addDoc, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const addVenue = async (venue) => {
  try {
    const docRef = await addDoc(collection(db, 'venues'), venue);
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

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

export const getUserPosts = async (userId) => {
  try {
    const q = query(collection(db, 'venues'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return posts;
  } catch (error) {
    console.error("Error fetching user posts: ", error);
    throw error;
  }
};

export const updatePost = async (postId, updatedData) => {
  try {
    const postRef = doc(db, 'venues', postId);
    await updateDoc(postRef, updatedData);
    console.log("Document updated with ID: ", postId);
  } catch (error) {
    console.error("Error updating document: ", error);
    throw error;
  }
};
