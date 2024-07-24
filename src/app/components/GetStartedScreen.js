// src/app/components/GetStartedScreen.js
import React, { useContext, useEffect } from 'react';
import { Button, Box, Typography } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import { signInWithGoogle } from '../../utils/auth';
import { useRouter } from 'next/router';
import PersonIcon from '@mui/icons-material/Person';
import { styled } from '@mui/material/styles';

const BackgroundBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  textAlign: 'center',
  backgroundImage: 'url(/background-image.jpg)', // Replace with your background image
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  padding: theme.spacing(4),
  color: theme.palette.common.white,
}));

const Overlay = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(rgba(236, 240, 241,1.0)',
});

const ContentBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  color: theme.palette.text.primary,
  boxShadow: theme.shadows[3],
}));

export default function GetStartedScreen() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  return (
    <BackgroundBox>
      <Overlay />
      <ContentBox>
        <Typography variant="h4" gutterBottom>
          Welcome to Swap
        </Typography>
        <Typography variant="body1" gutterBottom>
          Please log in to continue.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PersonIcon />}
          onClick={signInWithGoogle}
          sx={{ color: 'white', margin:'1em' }} // Set text color to white
        >
          Login with Google
        </Button>
      </ContentBox>
    </BackgroundBox>
  );
}
