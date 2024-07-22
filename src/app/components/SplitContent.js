import React from 'react';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';

export default function SplitContent() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Use CSS variable for text color
  const textColor = 'rgb(var(--foreground-rgb))';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        marginBottom: 4,
      }}
    >
      <Box
        sx={{
          flex: 1,
          padding: 2,
          textAlign: 'left',
        }}
      >
        <Typography
          variant={isMobile ? 'h4' : 'h2'}
          component="blockquote"
          sx={{
            fontWeight: 'bold',
            color: textColor,
            lineHeight: 1,
          }}
        >
          SWAP and share your location and venues for any event.
        </Typography>
        <Typography
          variant={isMobile ? 'h4' : 'h5'}
          component="blockquote"
          sx={{
            fontWeight: 'Regular',
            color: textColor,
            lineHeight: 1,
            marginTop: 2,
          }}
        >
          Sub copy Text Sub copy Text Sub copy Text Sub copy Text Sub copy Text Sub copy Text Sub copy Text Sub copy Text Sub copy Text Sub copy Text Sub copy Text Sub copy Text Sub copy Text Sub copy Text Sub copy Text Sub copy Text Sub copy Text Sub copy Text Sub copy Text Sub copy Text Sub copy Text Sub copy Text Sub copy Text Sub copy Text Sub copy Text
        </Typography>
      </Box>
      {!isMobile && (
        <Box
          sx={{
            flex: 1,
            padding: 2,
            borderRadius: '8px',
            overflow: 'hidden',
            position: 'relative',
            height: '700px',
          }}
        >
          <Image
            src="/Landing.png" // Change this to the path of your image
            alt="Descriptive Alt Text"
            layout="fill"
            objectFit="cover"
          />
        </Box>
      )}
    </Box>
  );
}
