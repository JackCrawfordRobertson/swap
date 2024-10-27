"use client";
import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { signInWithEmail, registerWithEmail, resetPassword } from '@/utils/auth';
import LogInUI from './LogInUI'; // Import the UI component
import { toast } from 'react-toastify';

export default function LogInLogic() {
  const { user } = useContext(AuthContext);
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isUsernameValid, setIsUsernameValid] = useState(true);

  useEffect(() => {
    if (user) {
      window.location.href = '/'; // Redirect if authenticated
    }
  }, [user]);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(value));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    setIsUsernameValid(value.length >= 3);
  };

  const switchToRegister = () => {
    setError(null);
    setMode('register');
  };

  const switchToLogin = () => {
    setError(null);
    setMode('login');
  };

  const switchToReset = () => {
    setError(null);
    setMode('reset');
  };

  const handleSignInWithEmail = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!email || !password) throw new Error('Email and Password are required');
      const signedInUser = await signInWithEmail(email, password);
      toast.success('Login successful! Redirecting...');
      window.location.href = '/';
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterWithEmail = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!username || !email || !password) throw new Error('All fields are required');
      const registeredUser = await registerWithEmail(email, password, username);
      toast.success('Registration successful! We are now reviewing your account.');
      setMode('login');
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!email) throw new Error('Email is required');
      await resetPassword(email);
      toast.success('Password reset email sent!');
      setMode('login');
    } catch (error) {
      setError(error.message);
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
      isEmailValid={isEmailValid}
      isUsernameValid={isUsernameValid}
      handleEmailChange={handleEmailChange}
      handlePasswordChange={handlePasswordChange}
      handleUsernameChange={handleUsernameChange}
      switchToRegister={switchToRegister}
      switchToLogin={switchToLogin}
      switchToReset={switchToReset}
      handleSignInWithEmail={handleSignInWithEmail}
      handleRegisterWithEmail={handleRegisterWithEmail}
      handleResetPassword={handleResetPassword}
    />
  );
}