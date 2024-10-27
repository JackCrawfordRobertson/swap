// src/components/logIn/LogInUI.js

import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Grid,
  Button,
  CircularProgress,
  Link as MuiLink,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BackgroundBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  textAlign: 'center',
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
  backgroundColor: '#5fa7d9',
});

const ContentBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  color: theme.palette.text.primary,
  boxShadow: theme.shadows[3],
  maxWidth: 400,
  width: '100%',
}));

const LogInUI = ({
  mode,
  email,
  password,
  username,
  loading,
  isEmailValid,
  isUsernameValid,
  handleEmailChange,
  handlePasswordChange,
  handleUsernameChange,
  switchToRegister,
  switchToLogin,
  switchToReset,
  handleSignInWithEmail,
  handleRegisterWithEmail,
  handleResetPassword,
}) => {
  return (
    <BackgroundBox>
      <Overlay />
      <ContentBox>
        <Typography variant="h4" gutterBottom>
          Welcome to Swap
        </Typography>

        {mode === 'login' && <Typography>Please log in to continue.</Typography>}
        {mode === 'register' && <Typography>Create a new account.</Typography>}
        {mode === 'reset' && <Typography>Reset your password.</Typography>}

        <Grid container spacing={2} justifyContent="center">
          {mode === 'register' && (
            <Grid item xs={12}>
              <TextField
                label="Username"
                value={username}
                onChange={handleUsernameChange}
                error={!isUsernameValid}
                helperText={!isUsernameValid && 'Username must be at least 3 characters long.'}
                fullWidth
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <TextField
              label="Email"
              value={email}
              onChange={handleEmailChange}
              error={!isEmailValid}
              helperText={!isEmailValid && 'Please enter a valid email address.'}
              fullWidth
            />
          </Grid>
          {mode !== 'reset' && (
            <Grid item xs={12}>
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                fullWidth
              />
            </Grid>
          )}
          <Grid item xs={12}>
            {mode === 'login' && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSignInWithEmail}
                fullWidth
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Login with Email'}
              </Button>
            )}
            {mode === 'register' && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleRegisterWithEmail}
                fullWidth
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Register with Email'}
              </Button>
            )}
            {mode === 'reset' && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleResetPassword}
                fullWidth
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Send Password Reset Email'}
              </Button>
            )}
          </Grid>
          <Grid item xs={12}>
            {mode === 'login' && (
              <Box>
                <Typography>
                  Don't have an account? <MuiLink onClick={switchToRegister}>Register here</MuiLink>
                </Typography>
                <Typography>
                  Forgot your password? <MuiLink onClick={switchToReset}>Reset Password</MuiLink>
                </Typography>
              </Box>
            )}
            {mode === 'register' && (
              <Box>
                <Typography>
                  Already have an account? <MuiLink onClick={switchToLogin}>Login here</MuiLink>
                </Typography>
              </Box>
            )}
            {mode === 'reset' && (
              <Box>
                <Typography>
                  Remembered your password? <MuiLink onClick={switchToLogin}>Login here</MuiLink>
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
        <ToastContainer /> {/* Only shows toast notifications */}
      </ContentBox>
    </BackgroundBox>
  );
};

export default LogInUI;