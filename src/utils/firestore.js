// src/utils/firestore.js
import { db, storage } from '../config/firebaseConfig';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const addVenue = async (venue) => {
  try {
    const docRef = await addDoc(collection(db, 'venues'), venue);
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

const uploadImage = async (file) => {
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

const getVenues = async (userId) => {
  try {
    const q = query(collection(db, 'venues'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const venues = [];
    querySnapshot.forEach((doc) => {
      venues.push({ id: doc.id, ...doc.data() });
    });
    return venues;
  } catch (error) {
    console.error("Error getting venues: ", error);
    throw error;
  }
};

export { addVenue, getVenues, uploadImage };
