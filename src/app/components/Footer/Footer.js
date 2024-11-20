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
        minHeight: '10vh',
        maxHeight: '10vh',
      }}
    >
      <Box sx={{ paddingLeft: '20px' }}>
        {/* Use MuiLink with Next.js Link */}
        <MuiLink component={Link} href="/" underline="none">
          <Image
            src="/Swap.svg"
            alt="Logo"
            width={100}
            height={50}
          />
        </MuiLink>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', paddingRight: '20px' }}>
        <MuiLink component={Link} href="/privacy" underline="none" color="inherit">
          <Typography variant="body2">Privacy Policy</Typography>
        </MuiLink>
        <MuiLink component={Link} href="/terms" underline="none" color="inherit">
          <Typography variant="body2">Terms & Conditions</Typography>
        </MuiLink>
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