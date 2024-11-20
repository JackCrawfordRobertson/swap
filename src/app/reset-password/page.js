"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import { getAuth } from "@/config/firebaseConfig";
import {
  Button,
  TextField,
  Typography,
  Box,
  Alert,
  CssBaseline,
  Card as MuiCard,
  Stack,
} from "@mui/material";
import { styled } from '@mui/material/styles';

// Styled Card for the floating island effect
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

// Background container styling for the floating effect
const ResetContainer = styled(Stack)(({ theme }) => ({
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

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const oobCode = searchParams.get("oobCode");

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [isCodeVerified, setIsCodeVerified] = useState(false);

  // Initialize Firebase and retrieve the auth service
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const initialize = async () => {
      const { auth } = await initializeFirebase();
      setAuth(auth);
    };

    initialize();
  }, []);

  // Verify the oobCode on component mount
  useEffect(() => {
    const verifyCode = async () => {
      if (!auth || !oobCode) return;
      
      try {
        await verifyPasswordResetCode(auth, oobCode);
        setIsCodeVerified(true);
      } catch (error) {
        setError("Invalid or expired password reset code. Please request a new link.");
      }
    };

    verifyCode();
  }, [auth, oobCode]);

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setMessage("Your password has been successfully reset. Redirecting to login...");
      setTimeout(() => {
        // Redirect after password reset
        router.push('/login');
      }, 2000);
    } catch (error) {
      setError("Failed to reset password. Please try again.");
    }
  };

  return (
    <ResetContainer direction="column" justifyContent="center">
      <CssBaseline />
      <Card variant="outlined">
        <Typography component="h1" variant="h5" align="center">
          Reset Your Password
        </Typography>
        {message ? (
          <Alert severity="success">{message}</Alert>
        ) : (
          <>
            {error && <Alert severity="error" sx={{ marginBottom: "1rem" }}>{error}</Alert>}
            {isCodeVerified ? (
              <>
                <TextField
                  type="password"
                  label="New Password"
                  variant="outlined"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  type="password"
                  label="Confirm Password"
                  variant="outlined"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleResetPassword}
                  disabled={!newPassword || !confirmPassword}
                  fullWidth
                  sx={{ marginTop: "1rem" }}
                >
                  Reset Password
                </Button>
              </>
            ) : (
              <Typography variant="body1" align="center">
                Verifying your request...
              </Typography>
            )}
          </>
        )}
      </Card>
    </ResetContainer>
  );
}