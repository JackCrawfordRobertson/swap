import React from 'react';
import { Box, Link as MuiLink, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

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
        minHeight: '10vh', // Set minimum height
        maxHeight: '10vh', // Set maximum height
      }}
    >
      <Box sx={{ paddingLeft: '20px' }}>
        {/* Remove nested MuiLink inside Link */}
        <Link href="/" passHref>
          <MuiLink>
            <Image
              src="/Swap.svg" // Replace with the path to your logo
              alt="Logo"
              width={100}
              height={50}
            />
          </MuiLink>
        </Link>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', paddingRight: '20px' }}>
        <Link href="/privacy" passHref>
          <MuiLink underline="none" color="inherit">
            <Typography variant="body2">Privacy Policy</Typography>
          </MuiLink>
        </Link>
        <Link href="/terms" passHref>
          <MuiLink underline="none" color="inherit">
            <Typography variant="body2">Terms & Conditions & Big Balls</Typography>
          </MuiLink>
        </Link>
        <Typography variant="body2" color="textSecondary">
          For assistance, contact{' '}
          <MuiLink href="mailto:support@ice-hub.biz" color="inherit">
            support@ice-hub.biz
          </MuiLink>
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;