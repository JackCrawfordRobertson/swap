"use client"; // Ensure the directive is in lowercase

import React, { useState, useContext } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import VenueForm from './VenueForm';
import UserPosts from './UserPosts';
import { logout } from '../../utils/auth';
import { AuthContext } from '../../context/AuthContext';
import Link from 'next/link';
import DescriptionIcon from '@mui/icons-material/Description';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // Import next/image for optimized images

const swapLogo = '/Swap.svg';
const iceLogo = '/ICELogo.svg';

const StyledAppBar = styled(AppBar)({
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
});

const NavContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  maxWidth: '300px',
  gap: '8px',
});

const StyledButton = styled(Button)({
  borderRadius: 4,
  color: 'gray',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#5fa7d9',
    color: '#fff',
  },
});

export default function NavigationBar() {
  const [open, setOpen] = useState(false);
  const [openPosts, setOpenPosts] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const handleOpen = () => {
    if (user) {
      setOpen(true);
    } else {
      alert('You must be logged in to list a venue.');
    }
  };

  const handleClose = () => setOpen(false);

  const handlePostsOpen = () => {
    if (user) {
      setOpenPosts(true);
    } else {
      alert('You must be logged in to view your posts.');
    }
  };

  const handlePostsClose = () => setOpenPosts(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <>
      <StyledAppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {isMobile ? (
            <>
              <Link href="/">
                {/* Use next/image for optimized images */}
                <Image
                  src={swapLogo}
                  alt="Swap Logo"
                  width={80}
                  height={80}
                  style={{ margin: '0', cursor: 'pointer' }}
                />
              </Link>
              <IconButton edge="end" aria-label="menu" onClick={handleMenuOpen} sx={{ color: 'black' }}>
                <MenuIcon />
              </IconButton>
            </>
          ) : (
            <>
              <NavContainer>
                <Link href="/">
                  <Image
                    src={swapLogo}
                    alt="Swap Logo"
                    width={80}
                    height={80}
                    style={{ margin: '0', cursor: 'pointer' }}
                  />
                </Link>
                <Typography variant="h6" component="div" sx={{ color: 'gray', mx: 0 }}>
                  |
                </Typography>
                <Link href="/">
                  <Image
                    src={iceLogo}
                    alt="Ice Logo"
                    width={80}
                    height={80}
                    style={{ margin: '0', cursor: 'pointer' }}
                  />
                </Link>
              </NavContainer>
              <Box>
                {user ? (
                  <>
                    <StyledButton
                      variant="outlined"
                      startIcon={<PersonIcon style={{ color: 'gray' }} />}
                      onClick={handleLogout}
                      sx={{ marginRight: 2 }}
                    >
                      Logout
                    </StyledButton>
                    <StyledButton
                      variant="outlined"
                      startIcon={<DescriptionIcon style={{ color: 'gray' }} />}
                      onClick={handlePostsOpen}
                    >
                      My Posts
                    </StyledButton>
                    <StyledButton
                      variant="contained"
                      startIcon={<AddBusinessIcon style={{ color: 'white' }} />}
                      sx={{ backgroundColor: '#5fa7d9', color: '#fff', marginLeft: 2 }}
                      onClick={handleOpen}
                    >
                      List a Venue
                    </StyledButton>
                  </>
                ) : (
                  <StyledButton
                    component={Link}
                    href="/get-started"
                    variant="outlined"
                    startIcon={<ArrowForwardIosIcon style={{ color: 'white' }} />}
                    sx={{
                      marginRight: 2,
                      backgroundColor: '#5fa7d9',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#4a90c0',
                      },
                    }}
                  >
                    Get Started
                  </StyledButton>
                )}
              </Box>
            </>
          )}
        </Toolbar>
      </StyledAppBar>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        {user
          ? [
              <MenuItem key="logout" onClick={handleLogout}>
                Logout
              </MenuItem>,
              <MenuItem key="listVenue" onClick={handleOpen}>
                List a Venue
              </MenuItem>,
              <MenuItem key="myPosts" onClick={handlePostsOpen}>
                My Posts
              </MenuItem>,
            ]
          : [
              <MenuItem key="getStarted" component={Link} href="/get-started">
                Get Started
              </MenuItem>,
            ]}
      </Menu>
      <Drawer anchor="right" open={open} onClose={handleClose} PaperProps={{ sx: { width: '400px' } }}>
        <VenueForm user={user} open={open} onClose={handleClose} />
      </Drawer>
      <Drawer anchor="right" open={openPosts} onClose={handlePostsClose} PaperProps={{ sx: { width: '400px' } }}>
        <UserPosts user={user} open={openPosts} onClose={handlePostsClose} />
      </Drawer>
    </>
  );
}