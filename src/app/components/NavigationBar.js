// src/app/components/NavigationBar.js
import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box, Modal, IconButton, Menu, MenuItem } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import { styled } from "@mui/material/styles";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import VenueForm from "./VenueForm";
import { signInWithGoogle, logout } from '../../utils/auth';

const swapLogo = "/Swap.svg";
const iceLogo = "/ICELogo.svg";

const StyledAppBar = styled(AppBar)({
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
});

const NavContainer = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    maxWidth: '300px',
    gap: '8px',
});

const StyledButton = styled(Button)({
    borderRadius: 4,
    color: "gray",
    textTransform: "none",
    "&:hover": {
        backgroundColor: "#5fa7d9",
        color: "#fff",
    },
});

export default function NavigationBar({ user }) {
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <StyledAppBar position="static">
                <Toolbar sx={{ justifyContent: "space-between" }}>
                    {isMobile ? (
                        <>
                            <img src={swapLogo} alt="Swap Logo" width="80" height="80" style={{ margin: '0' }} />
                            <IconButton edge="end" aria-label="menu" onClick={handleMenuOpen} sx={{ color: 'black' }}>
                                <MenuIcon />
                            </IconButton>
                        </>
                    ) : (
                        <>
                            <NavContainer>
                                <img src={swapLogo} alt="Swap Logo" width="80" height="80" style={{ margin: '0' }} />
                                <Typography variant="h6" component="div" sx={{ color: "gray", mx: 0 }}>
                                    |
                                </Typography>
                                <img src={iceLogo} alt="Ice Logo" width="80" height="80" style={{ margin: '0' }} />
                            </NavContainer>
                            <Box>
                                {user ? (
                                    <StyledButton variant="outlined" startIcon={<PersonIcon style={{ color: "gray" }} />} onClick={logout} sx={{ marginRight: 2 }}>
                                        Logout
                                    </StyledButton>
                                ) : (
                                    <StyledButton variant="outlined" startIcon={<PersonIcon style={{ color: "gray" }} />} onClick={signInWithGoogle} sx={{ marginRight: 2 }}>
                                        Login
                                    </StyledButton>
                                )}
                                <StyledButton variant="contained" startIcon={<HomeIcon style={{ color: "white" }} />} sx={{ backgroundColor: "#5fa7d9", color: "#fff" }} onClick={handleOpen}>
                                    List a Venue
                                </StyledButton>
                            </Box>
                        </>
                    )}
                </Toolbar>
            </StyledAppBar>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                {user ? (
                    <MenuItem onClick={logout}>Logout</MenuItem>
                ) : (
                    <MenuItem onClick={signInWithGoogle}>Login</MenuItem>
                )}
                <MenuItem onClick={handleOpen}>List a Venue</MenuItem>
            </Menu>
            <Modal open={open} onClose={handleClose}>
                <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, bgcolor: "background.paper", border: "2px solid #000", boxShadow: 24, p: 4 }}>
                    <VenueForm user={user} />
                </Box>
            </Modal>
        </>
    );
}
