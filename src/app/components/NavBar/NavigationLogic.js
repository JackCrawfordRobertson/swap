"use client"; // Ensure the directive is in lowercase

import React, { useState, useContext } from 'react';
import { logout } from '@/utils/auth';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import NavigationUI from './NavigationUI'; // Import the UI component

export default function NavigationLogic() {
  const [open, setOpen] = useState(false);
  const [openPosts, setOpenPosts] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
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
    <NavigationUI
      user={user}
      open={open}
      openPosts={openPosts}
      anchorEl={anchorEl}
      handleOpen={handleOpen}
      handleClose={handleClose}
      handlePostsOpen={handlePostsOpen}
      handlePostsClose={handlePostsClose}
      handleMenuOpen={handleMenuOpen}
      handleMenuClose={handleMenuClose}
      handleLogout={handleLogout}
    />
  );
}