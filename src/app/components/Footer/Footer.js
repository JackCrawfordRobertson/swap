// src/components/Footer.js

import React from 'react';
import { Box, Link, Typography } from '@mui/material';
import Image from 'next/image';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px',
        backgroundColor: '#f8f8f8',
        borderTop: '1px solid #e0e0e0',
      }}
    >
      <Box sx={{ paddingLeft: '20px' }}>
        <Image
          src="/Swap.svg" // Replace with the path to your logo
          alt="Logo"
          width={100}
          height={50}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', paddingRight: '20px' }}>
        <Link href="/privacy" underline="none" color="inherit">
          <Typography variant="body2">Privacy Policy</Typography>
        </Link>
        <Link href="/terms" underline="none" color="inherit">
          <Typography variant="body2">Terms & Conditions</Typography>
        </Link>
      </Box>
    </Box>
  );
};

export default Footer;