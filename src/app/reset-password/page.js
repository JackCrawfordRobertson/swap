// app/reset-password/page.js
"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import { auth } from "@/config/firebaseConfig";
import { Button, TextField, Typography, Box, Alert } from "@mui/material";

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const oobCode = searchParams.get("oobCode");

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [isCodeVerified, setIsCodeVerified] = useState(false);

  // Verify the oobCode on component mount
  useEffect(() => {
    const verifyCode = async () => {
      try {
        // Verify that the oobCode is valid
        await verifyPasswordResetCode(auth, oobCode);
        setIsCodeVerified(true); // If successful, allow password reset
      } catch (error) {
        setError("Invalid or expired password reset code. Please request a new link.");
      }
    };

    if (oobCode) verifyCode();
  }, [oobCode]);

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setMessage("Your password has been successfully reset. Redirecting to login...");
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      setError("Failed to reset password. Please try again.");
    }
  };

  return (
    <Box sx={{ padding: "2rem", textAlign: "center", maxWidth: 400, margin: "0 auto", height: '90vh' }}>
      <Typography variant="h4" gutterBottom>
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
            <Typography variant="body1">Verifying your request...</Typography>
          )}
        </>
      )}
    </Box>
  );
}