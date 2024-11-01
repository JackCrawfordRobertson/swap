// app/reset-password/page.js
"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
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

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await verifyPasswordResetCode(auth, oobCode);
      await confirmPasswordReset(auth, oobCode, newPassword);
      setMessage("Your password has been successfully reset. Redirecting to login...");
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      setError("Invalid or expired code. Please request a new password reset.");
    }
  };

  return (
    <Box sx={{ padding: "2rem", textAlign: "center", maxWidth: 400, margin: "0 auto", height:'90vh' }}>
      <Typography variant="h4" gutterBottom>
        Reset Your Password
      </Typography>
      {message ? (
        <Alert severity="success">{message}</Alert>
      ) : (
        <>
          {error && <Alert severity="error" sx={{ marginBottom: "1rem" }}>{error}</Alert>}
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
      )}
    </Box>
  );
}