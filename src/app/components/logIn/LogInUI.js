import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { signInWithEmail, registerWithEmail, resetPassword } from '@/utils/auth';
import LogInUI from './LogInUI';
import { toast } from 'react-toastify';

export default function LogInLogic() {
  const { user } = useContext(AuthContext);
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      console.log("User already signed in:", user);
      window.location.href = '/';
    }
  }, [user]);

  const handleRegisterWithEmail = async () => {
    console.log("Starting registration for:", email);
    try {
      setLoading(true);
      const registeredUser = await registerWithEmail(email, password, username);
      toast.success("Registration successful! Awaiting approval.");
      setMode('login');
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LogInUI
      mode={mode}
      email={email}
      password={password}
      username={username}
      error={error}
      loading={loading}
      handleRegisterWithEmail={handleRegisterWithEmail}
    />
  );
}