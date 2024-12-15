import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Stack, CircularProgress, Snackbar, Alert, Avatar, Card, IconButton, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import validator from 'validator';

export default function Profile() {
    const [user, setUser] = useState({});
    const [initialUser, setInitialUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const navigate = useNavigate();

    const specialties = [
        'Cardiology',
        'Dermatology',
        'Neurology',
        'Pediatrics',
        'Psychiatry',
        'Radiology',
        'Surgery',
        'Urology'
    ];

    const validateFields = () => {
        const nameRegex = /^[A-Za-z\s.]+$/;

        if (!nameRegex.test(formData.name)) {
            setErrorMessage('Name must contain only English letters and dots');
            setOpenSnackbar(true);
            return false;
        }

        if (formData.name.length > 100) {
            setErrorMessage('Name must be 100 characters or less');
            setOpenSnackbar(true);
            return false;
        }

        if (!validator.isEmail(formData.email)) {
            setErrorMessage('Invalid email format');
            setOpenSnackbar(true);
            return false;
        }

        const allowedCharsRegex = /^[A-Za-z\d@$!%*?&]+$/;

        if (formData.password) {
            if (formData.password.length < 6) {
                setErrorMessage("Password must be at least 6 characters long");
                setOpenSnackbar(true);
                return false;
            }

            if (!allowedCharsRegex.test(formData.password)) {
                setErrorMessage("Password can only contain letters, numbers, and the special characters @$!%*?&");
                setOpenSnackbar(true);
                return false;
            }
        }

        if (user.role === 'doctor' && !specialties.includes(formData.specialty)) {
            setErrorMessage('Specialty is not valid');
            setOpenSnackbar(true);
            return false;
        }

        if (user.role === 'patient' && !validator.isMobilePhone(formData.phone)) {
            setErrorMessage('Invalid phone number format');
            setOpenSnackbar(true);
            return false;
        }

        return true;
    };

    const checkLoginStatus = async () => {
        try {
            const response = await fetch('/api/whoami', { credentials: 'include' });
            const data = await response.json();
            if (data.loggedIn) {
                setUser(data.user);
                setInitialUser(data.user);
                setFormData(data.user);
            } else {
                navigate('/login');
            }
        } catch (error) {
            setErrorMessage('Failed to fetch user data. Please try again.');
            setOpenSnackbar(true);
            navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSpecialtyChange = (event) => {
        setFormData({ ...formData, specialty: event.target.value });
    };

    const handleSave = async () => {
        if (!validateFields()) return;

        if (JSON.stringify(formData) === JSON.stringify(initialUser)) {
            setEditing(false);
            return;
        }

        try {
            const response = await fetch('/api/profile/updateme', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                credentials: 'include',
            });

            const result = await response.json();
            if (response.ok) {
                setUser(result.user);
                setInitialUser(result.user);
                setEditing(false);
            } else {
                setErrorMessage(result.message || 'Failed to update profile.');
                setOpenSnackbar(true);
            }
        } catch (error) {
            setErrorMessage('Error updating profile. Please try again.');
            setOpenSnackbar(true);
        }
    };

    const handleCancel = () => {
        setFormData(initialUser);
        setEditing(false);
    };

    useEffect(() => {
        checkLoginStatus();
    }, []);

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            uploadAvatar(file);
        }
    };

    const uploadAvatar = async (file) => {
        const formData = new FormData();
        formData.append('avatar', file); // Append the file to the formData object

        try {
            const response = await fetch('/api/profile/newavatar', {
                method: 'PUT',
                body: formData, // Send formData directly
                credentials: 'include',
            });

            const result = await response.json();
            if (response.ok) {
                setUser(result.user); // Update user data with new avatar
            } else {
                setErrorMessage(result.message || 'Failed to update avatar.');
                setOpenSnackbar(true);
            }
        } catch (error) {
            setErrorMessage('Error updating avatar. Please try again.');
            setOpenSnackbar(true);
        }
    };


    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <IconButton
                onClick={handleBack}
                sx={{ position: 'absolute', top: 16, left: 16, borderRadius: '12px', borderStyle: 'solid', borderWidth: '1px', borderColor: 'grey.900', color: 'grey.900' }}>
                <ArrowBackIcon />
            </IconButton>

            <Card sx={{ width: 400, padding: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, position: 'relative' }}>
                    <Avatar
                        src={user.avatar}
                        sx={{ width: 100, height: 100, borderStyle: 'solid', borderWidth: '1px', borderColor: 'grey.900' }}
                    />
                    <IconButton
                        component="label"
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            bgcolor: 'grey.500',
                            opacity: .5,
                            borderRadius: '50%',
                            '&:hover': {
                                opacity: .8,
                                bgcolor: 'grey.500'
                            }
                        }}
                    >
                        <EditIcon />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            hidden
                        />
                    </IconButton>
                </Box>
                <Stack spacing={2}>
                    <TextField
                        label="Name"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleInputChange}
                        disabled={!editing}
                        fullWidth
                    />
                    <TextField
                        label="Email"
                        name="email"
                        value={formData.email || ''}
                        onChange={handleInputChange}
                        disabled={!editing}
                        fullWidth
                    />
                    {user.role === 'doctor' && (
                        <FormControl fullWidth>
                            <InputLabel>Specialty</InputLabel>
                            <Select
                                value={formData.specialty || ''}
                                onChange={handleSpecialtyChange}
                                label="Specialty"
                                disabled={!editing}
                            >
                                {specialties.map((spec) => (
                                    <MenuItem key={spec} value={spec}>{spec}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                    {user.role === 'patient' && (
                        <TextField
                            label="Phone"
                            name="phone"
                            value={formData.phone || ''}
                            onChange={handleInputChange}
                            disabled={!editing}
                            fullWidth
                        />
                    )}
                    <TextField
                        label="New Password"
                        name="password"
                        value={formData.password || ''}
                        onChange={handleInputChange}
                        disabled={!editing}
                        fullWidth
                    />
                    {!editing ? (
                        <Button variant="contained" onClick={() => setEditing(true)}>Edit</Button>
                    ) : (
                        <>
                            <Button variant="contained" onClick={handleSave}>Save</Button>
                            <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
                        </>
                    )}
                </Stack>
            </Card>

            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}
