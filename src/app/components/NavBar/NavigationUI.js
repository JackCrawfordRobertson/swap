import React from "react";
import {AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, Drawer} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import MenuIcon from "@mui/icons-material/Menu";
import DescriptionIcon from "@mui/icons-material/Description";
import {styled} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {useTheme} from "@mui/material/styles";
import Link from "next/link";
import Image from "next/image";
import VenueFormLogic from "@/app/components/NavBar/AddVenue/VenueFormLogic";
import UserPostsLogic from "@/app/components/NavBar/MyPosts/UserPostsLogic";

const swapLogo = "/Swap.svg";
const iceLogo = "/ICELogo.svg";

const StyledAppBar = styled(AppBar)({
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 1px 40px rgba(0,0,0,0.1)",
});

const NavContainer = styled(Box)({
    display: "flex",
    alignItems: "center",
    maxWidth: "300px",
    gap: "8px",
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

const NavigationUI = ({
    user,
    open,
    openPosts,
    anchorEl,
    handleOpen,
    handleClose,
    handlePostsOpen,
    handlePostsClose,
    handleMenuOpen,
    handleMenuClose,
    handleLogout,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <>
            <StyledAppBar position="static">
                <Toolbar sx={{justifyContent: "space-between"}}>
                    {isMobile ? (
                        <>
                            <Link href="/">
                                <Image
                                    src={swapLogo}
                                    alt="Swap Logo"
                                    width={80}
                                    height={80}
                                    style={{margin: "0", cursor: "pointer"}}
                                />
                            </Link>
                            <IconButton edge="end" aria-label="menu" onClick={handleMenuOpen} sx={{color: "black"}}>
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
                                        style={{margin: "0", cursor: "pointer"}}
                                    />
                                </Link>
                                <Typography variant="h6" component="div" sx={{color: "gray", mx: 0}}>
                                    |
                                </Typography>
                                <Link href="/">
                                    <Image
                                        src={iceLogo}
                                        alt="Ice Logo"
                                        width={80}
                                        height={80}
                                        style={{margin: "0", cursor: "pointer"}}
                                    />
                                </Link>
                            </NavContainer>
                            <Box>
                                {user ? (
                                    <>
                                        <StyledButton
                                            variant="outlined"
                                            startIcon={<PersonIcon style={{color: "gray"}} />}
                                            onClick={handleLogout}
                                            sx={{marginRight: 2}}
                                        >
                                            Logout
                                        </StyledButton>
                                        <StyledButton
                                            variant="outlined"
                                            startIcon={<DescriptionIcon style={{color: "gray"}} />}
                                            onClick={handlePostsOpen}
                                        >
                                            My Posts
                                        </StyledButton>
                                        <StyledButton
                                            variant="contained"
                                            startIcon={<AddBusinessIcon style={{color: "white"}} />}
                                            sx={{backgroundColor: "#5fa7d9", color: "#fff", marginLeft: 2}}
                                            onClick={handleOpen}
                                        >
                                            List a Venue
                                        </StyledButton>
                                    </>
                                ) : (
                                    <StyledButton
                                        component={Link}
                                        href="/login"
                                        variant="outlined"
                                        startIcon={<ArrowForwardIosIcon style={{color: "white"}} />}
                                        sx={{
                                            marginRight: 2,
                                            backgroundColor: "#5fa7d9",
                                            color: "white",
                                            "&:hover": {
                                                backgroundColor: "#4a90c0",
                                            },
                                        }}
                                    >
                                        Login
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

            <Drawer anchor="right" open={open} onClose={handleClose} PaperProps={{sx: {width: "400px"}}}>
                <VenueFormLogic user={user} open={open} onClose={handleClose} />
            </Drawer>

            <Drawer anchor="right" open={openPosts} onClose={handlePostsClose} PaperProps={{sx: {width: "400px"}}}>
                <UserPostsLogic user={user} open={openPosts} onClose={handlePostsClose} />
            </Drawer>
        </>
    );
};

export default NavigationUI;
