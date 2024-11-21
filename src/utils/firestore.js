import initializeFirebase from "../config/firebaseConfig"; // Dynamic Firebase initialization
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

// Function to initialize Firebase services dynamically
const getFirebaseServices = async () => {
  const { db, storage } = await initializeFirebase();
  return { db, storage };
};

// Function to get all venues
export const getVenues = async (filters = {}) => {
  try {
    const { db } = await getFirebaseServices();
    const querySnapshot = await getDocs(collection(db, "venues"));
    let venues = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    if (filters.location) {
      venues = venues.filter((venue) =>
        venue.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    return venues;
  } catch (error) {
    console.error("Error getting documents: ", error);
    throw error;
  }
};

// **Reverted addVenue function to its original state**
export const addVenue = async (venue) => {
  try {
    const { db } = await getFirebaseServices();
    const docRef = await addDoc(collection(db, "venues"), venue);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id; // Return the new document ID
  } catch (error) {
    console.error("Error adding venue:", error);
    throw error;
  }
};

// Function to update an existing post
export const updatePost = async (id, updatedData) => {
  try {
    const { db } = await getFirebaseServices();
    const postRef = doc(db, "venues", id);
    await updateDoc(postRef, updatedData);
    console.log("Post updated successfully");
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
};

// Function to upload an image to Firebase Storage with metadata
export const uploadImage = async (file, userId) => {
  try {
    const { storage } = await getFirebaseServices();
    const storageRef = ref(storage, `venues/${userId}/${Date.now()}_${file.name}`);
    const metadata = {
      customMetadata: {
        userId: userId, // Attach the user's UID to the image metadata
      },
    };
    await uploadBytes(storageRef, file, metadata);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

// Function to upload multiple images and get their URLs (used in update functionality)
export const uploadNewImages = async (files, userId) => {
  try {
    if (!files || files.length === 0) {
      return [];
    }
    const uploadPromises = files.map((file) => uploadImage(file, userId));
    const imageUrls = await Promise.all(uploadPromises);
    return imageUrls;
  } catch (error) {
    console.error("Error uploading new images: ", error);
    throw error;
  }
};

// Other functions remain the same...

// Function to get user's posts
export const getUserPosts = async (userId) => {
  try {
    const { db } = await getFirebaseServices();
    const querySnapshot = await getDocs(collection(db, "venues"));
    const posts = querySnapshot.docs
      .map((doc) => ({ ...doc.data(), id: doc.id }))
      .filter((post) => post.userId === userId);
    return posts;
  } catch (error) {
    console.error("Error getting user posts: ", error);
    throw error;
  }
};

// Function to delete an image from Firebase Storage
export const deleteImage = async (imageUrl) => {
  try {
    const { storage } = await getFirebaseServices();
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
    const { db } = await getFirebaseServices();
    await deleteDoc(doc(db, "venues", postId));
    console.log("Post deleted successfully");
  } catch (error) {
    console.error("Error deleting post: ", error);
    throw error;
  }
};