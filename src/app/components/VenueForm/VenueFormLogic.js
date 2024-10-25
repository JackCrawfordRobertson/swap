// src/components/VenueForm/VenueFormLogic.js

"use client";
import React, { useState } from "react";
import { addVenue, uploadImage } from "@/utils/firestore";
import VenueFormUI from "./VenueFormUI"; // Import the UI component

const VenueFormLogic = ({ user, onClose }) => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [eventType, setEventType] = useState(""); // Changed from seatingType to eventType
  const [capacity, setCapacity] = useState({ seated: "", standing: "" });
  const [squareFootage, setSquareFootage] = useState("");
  const [description, setDescription] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [hasAVFacilities, setHasAVFacilities] = useState(false);
  const [hasCatering, setHasCatering] = useState({ onSite: false, external: false });
  const [errors, setErrors] = useState({});

  // Validation helper function
  const validate = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Venue Name is required";
    if (!location) newErrors.location = "Location is required";
    if (!bookingEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingEmail)) {
      newErrors.bookingEmail = "Valid email is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const imageUploadPromises = Array.from(images).map((image) => uploadImage(image));
      const imageUrls = await Promise.all(imageUploadPromises);

      const venue = {
        name,
        location,
        eventType, // Changed field
        capacity,
        squareFootage,
        description,
        bookingEmail,
        hasAVFacilities,
        hasCatering,
        images: imageUrls,
        userId: user.uid,
      };

      await addVenue(venue);

      // Reset form after submission
      resetForm();
      setUploadComplete(true);
    } catch (error) {
      console.error("Error submitting venue: ", error);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setUploadComplete(false);
        onClose();
      }, 2000);
    }
  };

  const resetForm = () => {
    setName("");
    setLocation("");
    setEventType(""); // Reset eventType
    setCapacity({ seated: "", standing: "" });
    setSquareFootage("");
    setDescription("");
    setBookingEmail("");
    setImages([]);
    setImagePreviews([]);
    setHasAVFacilities(false);
    setHasCatering({ onSite: false, external: false });
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    setImages(files);

    const previews = Array.from(files).map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleRemoveImage = (index) => {
    const newImages = Array.from(images);
    const newPreviews = Array.from(imagePreviews);
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleEventTypeChange = (e) => {
    setEventType(e.target.value);
    setCapacity({ seated: "", standing: "" });
  };

  const handleCapacityChange = (e, key) => {
    setCapacity({ ...capacity, [key]: e.target.value });
  };

  return (
    <VenueFormUI
      name={name}
      setName={setName}
      location={location}
      setLocation={setLocation}
      eventType={eventType}
      setEventType={setEventType}
      capacity={capacity}
      setCapacity={setCapacity}
      squareFootage={squareFootage}
      setSquareFootage={setSquareFootage}
      description={description}
      setDescription={setDescription}
      bookingEmail={bookingEmail}
      setBookingEmail={setBookingEmail}
      images={images}
      setImages={setImages}
      imagePreviews={imagePreviews}
      setImagePreviews={setImagePreviews}
      loading={loading}
      setLoading={setLoading}
      uploadComplete={uploadComplete}
      setUploadComplete={setUploadComplete}
      hasAVFacilities={hasAVFacilities}
      setHasAVFacilities={setHasAVFacilities}
      hasCatering={hasCatering}
      setHasCatering={setHasCatering}
      errors={errors}
      setErrors={setErrors}
      handleSubmit={handleSubmit}
      handleImageChange={handleImageChange}
      handleRemoveImage={handleRemoveImage}
      handleEventTypeChange={handleEventTypeChange}
      handleCapacityChange={handleCapacityChange}
      onClose={onClose}
    />
  );
};

export default VenueFormLogic;