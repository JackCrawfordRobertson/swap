// src/app/components/GetStartedScreen.js
import React, { useContext, useEffect, useState } from 'react';
import { Button, Box, Typography, TextField, Grid, Alert } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import { signInWithGoogle, signInWithEmail, registerWithEmail } from '../../utils/auth';
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
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSignInWithEmail = async () => {
    try {
      setError(null);
      if (!email) throw new Error("Email is required");
      if (!password) throw new Error("Password is required");

      await signInWithEmail(email, password);
      router.push('/');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleRegisterWithEmail = async () => {
    try {
      setError(null);
      if (!email) throw new Error("Email is required");
      if (!password) throw new Error("Password is required");

      await registerWithEmail(email, password);
      router.push('/');
    } catch (error) {
      setError(error.message);
    }
  };

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
          onClick={async () => {
            try {
              await signInWithGoogle();
              router.push('/');
            } catch (error) {
              setError(error.message);
            }
          }}
          sx={{ color: 'white', margin: '1em' }} // Set text color to white
        >
          Login with Google
        </Button>
        {error && <Alert severity="error">{error}</Alert>}
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!error}
              helperText={error && "Please enter a valid email"}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!error}
              helperText={error && "Please enter your password"}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSignInWithEmail}
              sx={{ color: 'white', margin: '0.5em' }}
            >
              Login with Email
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleRegisterWithEmail}
              sx={{ margin: '0.5em' }}
            >
              Register with Email
            </Button>
          </Grid>
        </Grid>
      </ContentBox>
    </BackgroundBox>
  );
}
