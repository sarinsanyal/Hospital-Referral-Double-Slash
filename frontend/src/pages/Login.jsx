import { useState, useEffect } from 'react';
import { Paper, Box, TextField, Stack, Button, Snackbar, Alert, IconButton, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { NavLink, useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const [formErrors, setFormErrors] = useState({
        username: '',
        password: '',
    });

    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [alert, setAlert] = useState({ open: false, message: '', level: 'info' });

    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                const response = await fetch('/api/whoami');
                if (response.ok) {
                    const data = await response.json();
                    if (data.loggedIn) {
                        navigate('/dashboard');
                    }
                }
            } catch (error) {
                console.error('Error checking login status:', error);
                showAlert('Error checking login status. Please try again.', 'error');
            }
        };
        checkLoggedIn();
    }, [navigate]);

    const showAlert = (msg, level) => {
        setAlert({ open: true, message: msg, level });
    };

    const handleCloseSnackbar = () => {
        setAlert({ ...alert, open: false });
    };

    const validateFields = (field, value) => {
        if (field === 'username') {
            const usernameRegex = /^[A-Za-z0-9_.]+$/;
            if (value.length < 4) {
                return 'Username must be at least 4 characters long.';
            }
            if (!usernameRegex.test(value)) {
                return 'Username can only contain letters, numbers, _ or .';
            }
        } else if (field === 'password') {
            const allowedCharsRegex = /^[A-Za-z\d@$!%*?&]+$/;
            if (value.length < 6) {
                return 'Password must be at least 6 characters long.';
            }
            if (!allowedCharsRegex.test(value)) {
                return 'Password can only contain letters, numbers, and the special characters @$!%*?&';
            }
        }
        return '';
    };

    const handleChange = (field) => (event) => {
        const value = event.target.value;
        setFormData((prev) => ({ ...prev, [field]: value }));
        const errorMessage = validateFields(field, value);
        setFormErrors((prev) => ({ ...prev, [field]: errorMessage }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate fields before submission
        const usernameError = validateFields('username', formData.username);
        const passwordError = validateFields('password', formData.password);

        if (usernameError || passwordError) {
            setFormErrors({
                username: usernameError,
                password: passwordError,
            });
            return;
        }

        setIsLoggingIn(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                showAlert(data.message, 'success');
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1000);
            } else {
                showAlert(data.message || 'Login failed. Please try again.', 'error');
            }
        } catch (error) {
            showAlert('Something went wrong. Please try again.', 'error');
        } finally {
            setIsLoggingIn(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100dvh' }}>
            <IconButton
                onClick={() => navigate('/')}
                sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    borderRadius: '12px',
                    borderStyle: 'solid',
                    borderWidth: '1px',
                    borderColor: 'grey.900',
                    color: 'grey.900',
                }}
            >
                <ArrowBackIcon />
            </IconButton>

            <Paper sx={{ p: 3, maxWidth: '350px', width: '100%' }}>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <TextField
                            label="Username"
                            fullWidth
                            variant="outlined"
                            value={formData.username}
                            onChange={handleChange('username')}
                            error={!!formErrors.username}
                            helperText={formErrors.username}
                        />

                        <TextField
                            label="Password"
                            fullWidth
                            variant="outlined"
                            type="password"
                            value={formData.password}
                            onChange={handleChange('password')}
                            error={!!formErrors.password}
                            helperText={formErrors.password}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={
                                !formData.username ||
                                !formData.password ||
                                !!formErrors.username ||
                                !!formErrors.password ||
                                isLoggingIn
                            }
                        >
                            {isLoggingIn ? <CircularProgress size={20} /> : 'Login'}
                        </Button>

                        <NavLink to="/register">
                            <Button variant="contained" color="secondary" fullWidth>
                                Register
                            </Button>
                        </NavLink>
                    </Stack>
                </form>
            </Paper>

            <Snackbar
                open={alert.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity={alert.level} sx={{ width: '100%' }}>
                    {alert.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
