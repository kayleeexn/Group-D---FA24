import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import Button from '@mui/material/Button'; // For UI enhancement
import TextField from '@mui/material/TextField'; // Material-UI for styled inputs
import '../styles/Login.css'; // CSS for styling the login form

// Email validation function
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

const CreateAccount = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input fields
    if (!validateEmail(username)) {
      setError('Please enter a valid email');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      // POST the login data to the backend API
      const response = await fetch('https://your-backend-server.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Clear any errors
        setError('');
        // Store authentication token (session management)
        localStorage.setItem('token', data.token);
        // Navigate to a different page (e.g., Dashboard)
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('Something went wrong, please try again');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="login-form">
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button variant="contained" color="primary" type="submit">
          Login
        </Button>
      </form>
    </div>
  );
};

export default CreateAccount;

