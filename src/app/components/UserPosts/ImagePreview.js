import React from "react";
import { Box, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const ImagePreview = ({ images, handleRemoveImage }) => {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", marginTop: 2 }}>
      {images.map((url, index) => (
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