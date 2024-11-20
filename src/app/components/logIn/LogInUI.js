// src/components/logIn/LogInUI.js

import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  CssBaseline,
  Divider,
  FormControlLabel,
  FormLabel,
  FormControl,
  Link as MuiLink,
  TextField,
  Typography,
  Stack,
  Card as MuiCard,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ForgotPassword from '@/app/components/LogIn/ForgotPassword';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  minHeight: '90vh',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
  },
}));

export default function LogInUI({
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
  handleResetPassword, // Ensure this is passed as a prop
}) {
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [open, setOpen] = useState(false);

  const displayErrorToast = (message) => {
    toast.error(message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      icon: false,
    });
  };

  const validateInputs = () => {
    let isValid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      displayErrorToast('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
    }

    if (mode !== 'reset' && (!password || password.length < 6)) {
      setPasswordError(true);
      displayErrorToast('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
    }

    return isValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateInputs()) {
      mode === 'login'
        ? handleSignInWithEmail()
        : mode === 'register'
        ? handleRegisterWithEmail()
        : handleResetPassword();
    }
  };

  return (
    <SignInContainer direction="column" justifyContent="center">
      <CssBaseline />
      <Card variant="outlined">
        <Typography component="h1" variant="h5" align="center">
          {mode === 'login' ? 'Sign In' : mode === 'register' ? 'Register' : 'Reset Password'}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          {mode === 'register' && (
            <FormControl>
              <FormLabel htmlFor="username">Username</FormLabel>
              <TextField
                id="username"
                value={username}
                onChange={handleUsernameChange}
                error={!isUsernameValid}
                helperText={!isUsernameValid && 'Username must be at least 3 characters long.'}
                fullWidth
                required
              />
            </FormControl>
          )}
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              error={emailError}
              fullWidth
              required
            />
          </FormControl>
          {mode !== 'reset' && (
            <FormControl>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <FormLabel htmlFor="password">Password</FormLabel>
                {mode === 'login' && (
                  <MuiLink
                    component="button"
                    type="button"
                    onClick={() => setOpen(true)}
                    variant="body2"
                    sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Forgot your password?
                  </MuiLink>
                )}
              </Box>
              <TextField
                id="password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                error={passwordError}
                fullWidth
                required
              />
            </FormControl>
          )}
          {mode === 'login' && (
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Loading...' : mode === 'login' ? 'Sign In' : mode === 'register' ? 'Register' : 'Send Reset Email'}
          </Button>
        </Box>
        <Divider>or</Divider>
        <Typography textAlign="center">
          {mode === 'login' ? (
            <>
              Don&apos;t have an account?{' '}
              <MuiLink onClick={switchToRegister} sx={{ cursor: 'pointer' }}>
                Register
              </MuiLink>
            </>
          ) : mode === 'register' ? (
            <>
              Already have an account?{' '}
              <MuiLink onClick={switchToLogin} sx={{ cursor: 'pointer' }}>
                Sign in
              </MuiLink>
            </>
          ) : (
            <>
              Remembered your password?{' '}
              <MuiLink onClick={switchToLogin} sx={{ cursor: 'pointer' }}>
                Sign in
              </MuiLink>
            </>
          )}
        </Typography>
        <ToastContainer />
      </Card>
      <ForgotPassword open={open} handleClose={() => setOpen(false)} handleResetPassword={handleResetPassword} />
    </SignInContainer>
  );
}