// src/app/components/Auth.js
import React from 'react';
import { Button } from '@mui/material';
import { signInWithGoogle, logout } from '../../utils/auth';

const Auth = ({ user }) => {
  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.displayName}</p>
          <Button variant="contained" color="primary" onClick={logout}>Logout</Button>
        </div>
      ) : (
        <Button variant="contained" color="primary" onClick={signInWithGoogle}>Login with Google</Button>
      )}
    </div>
  );
};

export default Auth;
