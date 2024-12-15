import { useState, useEffect, useRef } from 'react';
import { Paper, Box, TextField, Stack, Button, IconButton, CircularProgress, Snackbar, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { NavLink, useNavigate } from 'react-router-dom';

export default function Register() {
    const navigate = useNavigate();
    const [isRegistering, setIsRegistering] = useState(false);
    const [alert, setAlert] = useState({ open: false, message: '', level: 'info' });

    const showAlert = (msg, level) => {
        setAlert({ open: true, message: msg, level });
    };

    const handleClose = () => {
        setAlert({ ...alert, open: false });
    };

    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: ''
    });

    const [formErrors, setFormErrors] = useState({
        name: '',
        username: '',
        password: ''
    });

    const [isUniqueUser, setIsUniqueUser] = useState(false);
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);

    const usernameCheckTimeout = useRef(null);

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


    const validateFields = (field, value) => {
        if (field === 'name') {
            const nameRegex = /^[A-Za-z]+(\s[A-Za-z]+)*$/;
            if (!nameRegex.test(value)) {
                return 'Name must contain only English letters, and spaces.';
            }
            if (value.length > 100) {
                return 'Name must be 100 characters or less';
            }
        } else if (field === 'username') {
            const usernameRegex = /^[A-Za-z0-9_.]+$/;
            if (value.length < 4) {
                return 'Username must be atleast 4 characters';
            }
            if (!usernameRegex.test(value)) {
                return 'Username must contain only letters, numbers, _ or .';
            }
        } else if (field === 'password') {
            const allowedCharsRegex = /^[A-Za-z\d@$!%*?&]+$/;
            if (value.length < 6) {
                return 'Password must be at least 6 characters long';
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

        if (field === 'username') {
            // Live format checking
            if (errorMessage) {
                setIsUniqueUser(false);
                clearTimeout(usernameCheckTimeout.current);
                return;
            }

            // Trigger unique check after 2 seconds of inactivity
            clearTimeout(usernameCheckTimeout.current);
            usernameCheckTimeout.current = setTimeout(async () => {
                setIsCheckingUsername(true);
                try {
                    const response = await fetch(`/api/username?username=${value}`);
                    const data = await response.json();
                    if (response.ok && data.available) {
                        setIsUniqueUser(true);
                        setFormErrors((prev) => ({ ...prev, username: '' }));
                    } else {
                        setIsUniqueUser(false);
                        setFormErrors((prev) => ({ ...prev, username: 'Username is already taken.' }));
                    }
                } catch (error) {
                    setIsUniqueUser(false);
                    setFormErrors((prev) => ({ ...prev, username: 'Error checking username. Please try again.' }));
                } finally {
                    setIsCheckingUsername(false);
                }
            }, 2000);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Check if all fields are valid before submission
        const nameError = validateFields('name', formData.name);
        const usernameError = validateFields('username', formData.username);
        const passwordError = validateFields('password', formData.password);

        if (nameError || usernameError || passwordError || !isUniqueUser) {
            setFormErrors({
                name: nameError,
                username: usernameError,
                password: passwordError
            });
            return;
        }

        // Submit the form
        setIsRegistering(true);
        fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(result => {
                showAlert(result.message, 'success');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            })
            .catch(error => {
                console.error('Error:', error);
                showAlert('Something went wrong. Please try again.', 'error');
            })
            .finally(() => {
                setIsRegistering(false);
            });
    };

    return (
        <Box sx={{ height: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
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
                    color: 'grey.900'
                }}
            >
                <ArrowBackIcon />
            </IconButton>
            <Paper sx={{ p: 3, maxWidth: '350px', width: '100%' }}>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <TextField
                            label="Name"
                            fullWidth
                            variant="outlined"
                            value={formData.name}
                            onChange={handleChange('name')}
                            error={!!formErrors.name}
                            helperText={formErrors.name}
                        />

                        <TextField
                            label="Username"
                            fullWidth
                            variant="outlined"
                            value={formData.username}
                            onChange={handleChange('username')}
                            error={!!formErrors.username}
                            helperText={
                                isCheckingUsername
                                    ? 'Checking username...'
                                    : formErrors.username
                            }
                            slotProps={{
                                input: {
                                    endAdornment: isCheckingUsername && <CircularProgress size={20} />,
                                },
                            }}

                            disabled={isCheckingUsername}
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
                                !formData.name ||
                                !formData.username ||
                                !formData.password ||
                                !!formErrors.name ||
                                !!formErrors.username ||
                                !!formErrors.password ||
                                isCheckingUsername ||
                                !isUniqueUser
                            }
                        >
                            {!isRegistering ? "Register" : <CircularProgress size={20} />}
                        </Button>

                        <NavLink to="/login">
                            <Button variant="contained" color="secondary" fullWidth>
                                Login
                            </Button>
                        </NavLink>
                    </Stack>
                </form>
            </Paper>
            <Snackbar
                open={alert.open}
                autoHideDuration={3000}
                onClose={handleClose}
            >
                <Alert onClose={handleClose} severity={alert.level} variant="filled">
                    {alert.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
