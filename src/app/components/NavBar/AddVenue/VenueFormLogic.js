import React, { useState } from "react";
import { addVenue, uploadImage } from "@/utils/firestore";
import VenueFormUI from "./VenueFormUI";

const VenueFormLogic = ({ user, onClose }) => {
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [eventType, setEventType] = useState("");
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
            const imageUploadPromises = images.map((image) => uploadImage(image));
            const imageUrls = await Promise.all(imageUploadPromises);

            const venue = {
                name,
                location,
                eventType,
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
        setEventType("");
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
        const files = Array.from(e.target.files);

        if (images.length + files.length > 3) {
            alert("You can only upload up to 3 images.");
            return;
        }

        setImages([...images, ...files]);
        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setImagePreviews([...imagePreviews, ...newPreviews]);
    };

    const handleRemoveImage = (index) => {
        const newImages = [...images];
        const newPreviews = [...imagePreviews];

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
            imagePreviews={imagePreviews}
            loading={loading}
            uploadComplete={uploadComplete}
            hasAVFacilities={hasAVFacilities}
            setHasAVFacilities={setHasAVFacilities}
            hasCatering={hasCatering}
            setHasCatering={setHasCatering}
            errors={errors}
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