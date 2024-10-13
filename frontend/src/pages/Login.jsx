import { useState, useEffect } from 'react';
import { Paper, Box, TextField, Stack, Button, Snackbar, Alert } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import validator from 'validator';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const navigate = useNavigate();

    useEffect(() => {
        const checkLoggedIn = async () => {
            const response = await fetch('/api/whoami');
            if (response.ok) {
                const data = await response.json();
                if (data.loggedIn) {
                    navigate('/dashboard');
                }
            }
        };
        checkLoggedIn();
    }, [navigate]);

    const validateFields = () => {
        if (!validator.isEmail(email)) {
            setSnackbarMessage('Invalid email address');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return false;
        }

        if (password.length < 6) {
            setSnackbarMessage('Password must be at least 6 characters');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateFields()) return;

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            setSnackbarMessage(data.message);
            setSnackbarSeverity(response.ok ? 'success' : 'error');
            setSnackbarOpen(true);

            if (response.ok) {
                navigate('/dashboard');
            }
        } catch (error) {
            setSnackbarMessage('Error during login');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <Box sx={{ pt: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Paper sx={{ p: 3, maxWidth: '350px', width: '100%' }}>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <TextField
                            label="Email"
                            fullWidth
                            variant="outlined"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <TextField
                            label="Password"
                            fullWidth
                            variant="outlined"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Button type="submit" variant="contained">Login</Button>
                        <NavLink to='/register'>
                            <Button variant="contained" color="secondary" fullWidth>Register</Button>
                        </NavLink>
                    </Stack>
                </form>
            </Paper>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}
