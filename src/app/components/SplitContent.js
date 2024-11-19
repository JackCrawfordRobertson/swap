import React from "react";
import {Box, Typography, useMediaQuery, useTheme} from "@mui/material";
import Image from "next/image";

export default function SplitContent() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // Use CSS variable for text color
    const textColor = "rgb(var(--foreground-rgb))";

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: {xs: "column", md: "row"},
                minWidth: "auto",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                marginBottom: 4,
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    padding: isMobile ? "0" : "2",
                    textAlign: "left",
                }}
            >
                <Typography
                    variant={isMobile ? "h4" : "h2"}
                    component="blockquote"
                    sx={{
                        fontWeight: "bold",
                        color: textColor,
                        lineHeight: 1,
                    }}
                >
                    SWAP - Why not consider swapping venues with a fellow corporate planner.
                </Typography>
                <Typography
                    variant={isMobile ? "h5" : "h5"}
                    component="blockquote"
                    sx={{
                        fontWeight: "Regular",
                        color: textColor,
                        lineHeight: 1.5,
                        marginTop: 2,
                        width: isMobile ? "100%" : "80%", // Use ':' instead of '='
                    }}
                >
                    When budgets are tight and you still want your internal events to be special, use SWAP. Get started by using the button above or start searching venues today!
                </Typography>
            </Box>
            {!isMobile && (
                <Box
                    sx={{
                        flex: 1,
                        padding: 2,
                        borderRadius: "8px",
                        overflow: "hidden",
                        position: "relative",
                        height: "700px",
                    }}
                >
                    <Image
                        src="/Landing.png" // Change this to the path of your image
                        alt="Descriptive Alt Text"
                        fill // Replaces layout="fill"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Adjust this based on your layout
                        priority // Add this if the image is above the fold
                    />
                </Box>
            )}
        </Box>
    );
}
