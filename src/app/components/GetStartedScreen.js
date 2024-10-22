"use client"; // Ensure the directive is in lowercase

import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Box,
  Typography,
  TextField,
  Grid,
  Alert,
  CircularProgress,
  Link as MuiLink,
} from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import { signInWithEmail, registerWithEmail, resetPassword } from '../../utils/auth';
// Removed useRouter import
// import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image'; // If you use images
import Link from 'next/link'; // Import Next.js Link component if needed

// Styled Components
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
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
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

export default function GetStartedScreen() {
  const { user } = useContext(AuthContext);
  // Removed useRouter
  // const router = useRouter();

  // Mode can be 'login', 'register', 'reset'
  const [mode, setMode] = useState('login');

  // Common States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register-specific State
  const [username, setUsername] = useState('');

  // Error and Loading States
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Validation States
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isUsernameValid, setIsUsernameValid] = useState(true);

  useEffect(() => {
    console.log('AuthContext User:', user);
    if (user) {
      console.log('User is authenticated. Redirecting to home page.');
      window.location.href = '/'; // Redirect without useRouter
    }
  }, [user]);

  // Handlers for Input Changes with Validation
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    console.log('Email Input Changed:', value);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(value));
    console.log('Is Email Valid:', emailRegex.test(value));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    console.log('Password Input Changed:', value);
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    console.log('Username Input Changed:', value);

    // Username must be at least 3 characters
    setIsUsernameValid(value.length >= 3);
    console.log('Is Username Valid:', value.length >= 3);
  };

  // Handlers for Modes
  const switchToRegister = () => {
    console.log('Switching to Register Mode');
    setError(null);
    setMode('register');
  };

  const switchToLogin = () => {
    console.log('Switching to Login Mode');
    setError(null);
    setMode('login');
  };

  const switchToReset = () => {
    console.log('Switching to Reset Password Mode');
    setError(null);
    setMode('reset');
  };

  // Handler for Login
  const handleSignInWithEmail = async () => {
    try {
      console.log('Attempting to sign in with Email:', email);
      setError(null);
      setLoading(true);
      if (!email) throw new Error('Email is required');
      if (!password) throw new Error('Password is required');

      // Basic email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address.');
      }

      const signedInUser = await signInWithEmail(email, password);
      console.log('Sign-in successful:', signedInUser);
      toast.success('Login successful! Redirecting...');
      window.location.href = '/'; // Redirect without useRouter
    } catch (error) {
      console.error('Error during sign-in:', error);
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
      console.log('Sign-in process completed.');
    }
  };

  // Handler for Registration
  const handleRegisterWithEmail = async () => {
    try {
      console.log('Attempting to register with Email:', email, 'Username:', username);
      setError(null);
      setLoading(true);
      if (!username) throw new Error('Username is required');
      if (!email) throw new Error('Email is required');
      if (!password) throw new Error('Password is required');

      // Basic email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address.');
      }

      const registeredUser = await registerWithEmail(email, password, username);
      console.log('Registration successful:', registeredUser);
      toast.success('Registration successful! Please verify your email before logging in.');
      setMode('login');
      setEmail('');
      setPassword('');
      setUsername('');
    } catch (error) {
      console.error('Error during registration:', error);
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
      console.log('Registration process completed.');
    }
  };

  // Handler for Password Reset
  const handleResetPassword = async () => {
    try {
      console.log('Attempting to reset password for Email:', email);
      setError(null);
      setLoading(true);
      if (!email) throw new Error('Email is required');

      // Basic email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address.');
      }

      await resetPassword(email);
      console.log('Password reset email sent to:', email);
      toast.success('Password reset email sent! Please check your inbox.');
      setMode('login');
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Error during password reset:', error);
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
      console.log('Password reset process completed.');
    }
  };

  return (
    <BackgroundBox>
      <Overlay />
      <ContentBox>
        <Typography variant="h4" gutterBottom>
          Welcome to Swap
        </Typography>

        {/* Mode-specific Subheading */}
        {mode === 'login' && (
          <Typography variant="body1" gutterBottom>
            Please log in to continue.
          </Typography>
        )}
        {mode === 'register' && (
          <Typography variant="body1" gutterBottom>
            Create a new account.
          </Typography>
        )}
        {mode === 'reset' && (
          <Typography variant="body1" gutterBottom>
            Reset your password.
          </Typography>
        )}

        {/* Display error message */}
        {error && <Alert severity="error">{error}</Alert>}

        <Grid container spacing={2} justifyContent="center">
          {/* Username Field - Only in Register Mode */}
          {mode === 'register' && (
            <Grid item xs={12}>
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                value={username}
                onChange={handleUsernameChange}
                error={(!!error && error.toLowerCase().includes('username')) || !isUsernameValid}
                helperText={
                  error && error.toLowerCase().includes('username')
                    ? error
                    : !isUsernameValid
                    ? 'Username must be at least 3 characters long.'
                    : ''
                }
              />
            </Grid>
          )}

          {/* Email Field */}
          <Grid item xs={12}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={handleEmailChange}
              error={!!error && (error.toLowerCase().includes('email domain') || !isEmailValid)}
              helperText={
                !!error &&
                (error.toLowerCase().includes('email domain') || !isEmailValid)
                  ? error.toLowerCase().includes('email domain')
                    ? error
                    : 'Please enter a valid email address.'
                  : ''
              }
            />
          </Grid>

          {/* Password Field - Not in Reset Mode */}
          {mode !== 'reset' && (
            <Grid item xs={12}>
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={handlePasswordChange}
                error={
                  !!error &&
                  (error.toLowerCase().includes('password') || error.toLowerCase().includes('sign in'))
                }
                helperText={
                  !!error &&
                  (error.toLowerCase().includes('password') || error.toLowerCase().includes('sign in'))
                    ? error
                    : ''
                }
              />
            </Grid>
          )}

          {/* Submit Button */}
          <Grid item xs={12}>
            {mode === 'login' && (
             <Button
             variant="contained"
             color="primary"
             onClick={handleSignInWithEmail}
             sx={{ color: 'white', margin: '0.5em 0' }}
             fullWidth
             disabled={loading}
           >
             {loading ? (
               <CircularProgress size={36} color="inherit" /> // Increase size for more visibility
             ) : (
               'Login with Email'
             )}
           </Button>
            )}

            {mode === 'register' && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleRegisterWithEmail}
                sx={{ color: 'white', margin: '0.5em 0' }}
                fullWidth
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Register with Email'}
              </Button>
            )}

            {mode === 'reset' && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleResetPassword}
                sx={{ color: 'white', margin: '0.5em 0' }}
                fullWidth
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Password Reset Email'}
              </Button>
            )}
          </Grid>

          {/* Mode-specific Links */}
          <Grid item xs={12}>
            {mode === 'login' && (
              <Box>
                <Typography variant="body2">
                  Don't have an account?{' '}
                  <MuiLink href="#" onClick={switchToRegister}>
                    Register here
                  </MuiLink>
                </Typography>
                <Typography variant="body2">
                  Forgot your password?{' '}
                  <MuiLink href="#" onClick={switchToReset}>
                    Reset Password
                  </MuiLink>
                </Typography>
              </Box>
            )}

            {mode === 'register' && (
              <Box>
                <Typography variant="body2">
                  Already have an account?{' '}
                  <MuiLink href="#" onClick={switchToLogin}>
                    Login here
                  </MuiLink>
                </Typography>
              </Box>
            )}

            {mode === 'reset' && (
              <Box>
                <Typography variant="body2">
                  Remembered your password?{' '}
                  <MuiLink href="#" onClick={switchToLogin}>
                    Login here
                  </MuiLink>
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>

        {/* Toast Container for Notifications */}
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
      </ContentBox>
    </BackgroundBox>
  );
}