import React, {useState, useEffect} from "react";
import {
    Box,
    Typography,
    Button,
    TextField,
    Modal,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Snackbar,
} from "@mui/material";
import {getUserPosts, updatePost, uploadImage, deleteImage, deletePost} from "../../utils/firestore";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import PlacesAutocomplete, {geocodeByAddress, getLatLng} from "react-places-autocomplete";
import {getCityFromAddress} from "../../utils/geocode"; // Import the function

const UserPosts = ({user, open, onClose}) => {
    const [posts, setPosts] = useState([]);
    const [editPost, setEditPost] = useState(null);
    const [editData, setEditData] = useState({
        name: "",
        location: "",
        capacity: "",
        venueType: "",
        description: "",
        bookingEmail: "",
        images: [],
    });
    const [newImages, setNewImages] = useState([]);
    const [openEdit, setOpenEdit] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    useEffect(() => {
        if (user) {
            fetchPosts();
        }
    }, [user]);

    const fetchPosts = async () => {
        try {
            const userPosts = await getUserPosts(user.uid);

            // Fetch city names for each post
            const postsWithCity = await Promise.all(
                userPosts.map(async (post) => {
                    const city = await getCityFromAddress(post.location);
                    return {...post, city};
                })
            );

            setPosts(postsWithCity);
        } catch (error) {
            console.error("Error fetching user posts:", error);
        }
    };

    const handleEditOpen = (post) => {
        setEditPost(post);
        setEditData({
            name: post.name,
            location: post.location,
            capacity: post.capacity,
            venueType: post.venueType,
            description: post.description,
            bookingEmail: post.bookingEmail,
            images: post.images,
        });
        setOpenEdit(true);
    };

    const handleEditClose = () => setOpenEdit(false);

    const handleEditChange = (e) => {
        const {name, value} = e.target;
        setEditData({...editData, [name]: value});
    };

    const handleImageChange = (e) => {
        setNewImages(e.target.files);
    };

    const handleRemoveImage = async (index) => {
        try {
            await deleteImage(editData.images[index]);
            const newImages = Array.from(editData.images);
            newImages.splice(index, 1);
            setEditData({...editData, images: newImages});
        } catch (error) {
            console.error("Error removing image: ", error);
        }
    };

    const handleSelect = async (address) => {
        const results = await geocodeByAddress(address);
        const latLng = await getLatLng(results[0]);
        setEditData({...editData, location: address});
    };

    const handleEditSubmit = async () => {
        try {
            let imageUrls = editData.images;

            if (newImages.length > 0) {
                const imageUploadPromises = Array.from(newImages).map((image) => uploadImage(image));
                const newImageUrls = await Promise.all(imageUploadPromises);
                imageUrls = [...imageUrls, ...newImageUrls];
            }

            const updatedData = {...editData, images: imageUrls};
            await updatePost(editPost.id, updatedData);
            setOpenEdit(false);
            fetchPosts(); // Refresh posts
        } catch (error) {
            console.error("Error updating post:", error);
        }
    };

    const handleDeletePost = async () => {
        try {
            // Delete images from storage
            for (const imageUrl of editData.images) {
                await deleteImage(imageUrl);
            }
            // Delete post from Firestore
            await deletePost(editPost.id);
            setOpenEdit(false);
            setSnackbarMessage("Successfully deleted post");
            setOpenSnackbar(true);
            fetchPosts(); // Refresh posts
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <>
            <Drawer anchor="right" open={open} onClose={onClose}>
                <Box sx={{width: 400, padding: 2}}>
                    <IconButton onClick={onClose} sx={{position: "absolute", right: 8, top: 8, color: "grey.500"}}>
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" gutterBottom>
                        Your Posts
                    </Typography>
                    <List>
                        {posts.map((post) => (
                            <ListItem
                                key={post.id}
                                button
                                onClick={() => handleEditOpen(post)}
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                    padding: 2,
                                    borderBottom: "1px solid #ddd",
                                }}
                            >
                                {post.images.length > 0 && (
                                    <img
                                        src={post.images[0]}
                                        alt={`preview-${post.id}`}
                                        width="100%"
                                        style={{objectFit: "cover", borderRadius: "8px", marginBottom: 8}}
                                    />
                                )}
                                <ListItemText
                                    primary={post.name}
                                    secondary={`Location: ${post.city}, Capacity: ${post.capacity}`}
                                />{" "}
                                {/* Use city instead of full location */}
                                <ListItemSecondaryAction>
                                    <IconButton edge="end" onClick={() => handleEditOpen(post)}>
                                        <EditIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
            <Modal open={openEdit} onClose={handleEditClose}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        border: "2px solid #000",
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <IconButton
                        aria-label="close"
                        onClick={handleEditClose}
                        sx={{position: "absolute", right: 8, top: 8, color: "grey.500"}}
                    >
                        <CloseIcon />
                    </IconButton>

                    <Typography variant="h6">Edit Post</Typography>
                    <TextField
                        name="name"
                        label="Venue Name"
                        value={editData.name}
                        onChange={handleEditChange}
                        fullWidth
                        sx={{marginBottom: 2, marginTop: 2}}
                    />
                    <PlacesAutocomplete
                        value={editData.location}
                        onChange={(location) => setEditData({...editData, location})}
                        onSelect={handleSelect}
                    >
                        {({getInputProps, suggestions, getSuggestionItemProps, loading}) => (
                            <div>
                                <TextField
                                    {...getInputProps({
                                        label: "Location",
                                        placeholder: "Search Places ...",
                                        fullWidth: true,
                                        required: true,
                                    })}
                                />
                                <Box sx={{position: "relative", zIndex: 1000}}>
                                    {loading && <div>Loading...</div>}
                                    {suggestions.length > 0 && (
                                        <Box
                                            sx={{
                                                border: "1px solid #ddd",
                                                borderRadius: "4px",
                                                marginTop: 1,
                                                backgroundColor: "#fff",
                                            }}
                                        >
                                            {suggestions.map((suggestion, index) => {
                                                const style = suggestion.active
                                                    ? {backgroundColor: "#a8dadc", cursor: "pointer", padding: "10px"}
                                                    : {backgroundColor: "#fff", cursor: "pointer", padding: "10px"};
                                                return (
                                                    <Box {...getSuggestionItemProps(suggestion, {style})} key={index}>
                                                        {suggestion.description}
                                                    </Box>
                                                );
                                            })}
                                        </Box>
                                    )}
                                </Box>
                            </div>
                        )}
                    </PlacesAutocomplete>
                    <TextField
                        name="capacity"
                        label="Capacity"
                        value={editData.capacity}
                        onChange={handleEditChange}
                        fullWidth
                        sx={{marginBottom: 2, marginTop: 2}}
                    />
                    <FormControl fullWidth sx={{marginBottom: 2}}>
                        <InputLabel>Venue Type</InputLabel>
                        <Select name="venueType" value={editData.venueType} onChange={handleEditChange} required>
                            <MenuItem value="Concert Hall">Concert Hall</MenuItem>
                            <MenuItem value="Conference Center">Conference Center</MenuItem>
                            <MenuItem value="Outdoor Space">Outdoor Space</MenuItem>
                            <MenuItem value="Restaurant">Restaurant</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        name="description"
                        label="Description"
                        value={editData.description}
                        onChange={handleEditChange}
                        multiline
                        rows={4}
                        fullWidth
                        sx={{marginBottom: 2}}
                    />
                    <TextField
                        name="bookingEmail"
                        label="Booking Email"
                        type="email"
                        value={editData.bookingEmail}
                        onChange={handleEditChange}
                        fullWidth
                        sx={{marginBottom: 2}}
                    />
                    <input type="file" multiple onChange={handleImageChange} />
                    <Box sx={{display: "flex", flexWrap: "wrap", marginTop: 2}}>
                        {editData.images.map((url, index) => (
                            <Box
                                key={index}
                                sx={{
                                    position: "relative",
                                    width: "100px",
                                    height: "100px",
                                    marginRight: 1,
                                    marginBottom: 1,
                                }}
                            >
                                <img
                                    src={url}
                                    alt={`img-${index}`}
                                    width="100%"
                                    height="100%"
                                    style={{objectFit: "cover", borderRadius: "8px"}}
                                />
                                <IconButton
                                    onClick={() => handleRemoveImage(index)}
                                    sx={{position: "absolute", top: 0, right: 0, padding: "2px", color: "red"}}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        ))}
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleEditSubmit}
                        sx={{marginTop: 2, width: "100%", color: "white"}}
                    >
                        Save
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            marginTop: 2,
                            width: "100%",
                            backgroundColor: "rgba(231, 76, 60, 1.0)",
                            color: "white",
                            fontWeight: "bold",
                            "&:hover": {
                                backgroundColor: "rgba(192, 57, 43, 1.0)",
                            },
                        }}
                        onClick={handleDeletePost}
                    >
                        Delete
                    </Button>
                </Box>
            </Modal>
        </>
    );
};

export default UserPosts;
