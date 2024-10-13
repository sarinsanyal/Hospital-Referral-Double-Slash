import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Stack, CircularProgress, Snackbar, Alert, Avatar, Card, IconButton, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function Profile() {
    const [user, setUser] = useState({});
    const [initialUser, setInitialUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const navigate = useNavigate();

    // List of specialties
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

    const checkLoginStatus = async () => {
        try {
            const response = await fetch('/api/whoami', { credentials: 'include' });
            const data = await response.json();
            if (data.loggedIn) {
                setUser(data.user);
                setInitialUser(data.user);  // Store the initial data
                setFormData(data.user);     // Use the data for form fields
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
                sx={{ position: 'absolute', top: 16, left: 16, borderRadius: '12px', border: '1px solid gray' }}>
                <ArrowBackIcon />
            </IconButton>

            <Card sx={{ width: 400, padding: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <Avatar src={user.avatar} sx={{ width: 100, height: 100 }} />
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
