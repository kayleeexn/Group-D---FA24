import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import '../styles/CreateAccount.css'; // Ensure to create this CSS file for styling
import { validateEmail } from '../utils/validation';


const CreateAccount = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const response = await fetch('https://your-backend-server.com/api/create-account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setError('');
                localStorage.setItem('token', data.token);
                console.log('Navigating to dashboard'); // debugging
                navigate('/dashboard'); // Navigate to dashboard or a confirmation page
            } else {
                setError(data.message || 'Account creation failed.');
            }
        } catch (error) {
            setError('Something went wrong, please try again.');
        }
    };

    return (
        <div className="create-account-container">
            <h2>Create Account</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className="create-account-form">
                <TextField
                    label="Email"
                    type="email"
                    variant="outlined"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                <TextField
                    label="Confirm Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <Button variant="contained" color="primary" type="submit">
                    Create Account
                </Button>
            </form>
        </div>
    );
};

export default CreateAccount;
