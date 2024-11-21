// src/components/UserPosts/ImagePreview.js

import React, { useEffect } from "react";
import { Box, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const ImagePreview = ({ images, handleRemoveImage }) => {
  // State to hold the image previews
  const [imagePreviews, setImagePreviews] = React.useState([]);

  useEffect(() => {
    const previews = images.map((image) => {
      if (image instanceof File) {
        // Create an object URL for the File object
        return {
          type: "file",
          url: URL.createObjectURL(image),
        };
      } else {
        // It's an existing image URL
        return {
          type: "url",
          url: image,
        };
      }
    });

    setImagePreviews(previews);

    // Cleanup function to revoke object URLs
    return () => {
      previews.forEach((preview) => {
        if (preview.type === "file") {
          URL.revokeObjectURL(preview.url);
        }
      });
    };
  }, [images]);

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", marginTop: 2 }}>
      {imagePreviews.map((image, index) => (
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
            src={image.url}
            alt={`img-${index}`}
            width="100%"
            height="100%"
            style={{ objectFit: "cover", borderRadius: "8px" }}
          />
          <IconButton
            onClick={() => handleRemoveImage(index)}
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              padding: "2px",
              color: "red",
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}
    </Box>
  );
};

export default ImagePreview;