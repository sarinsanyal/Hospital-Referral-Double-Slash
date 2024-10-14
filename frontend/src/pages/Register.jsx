import { useState, useEffect } from 'react';
import { Paper, Box, TextField, MenuItem, Stack, Button, Select, InputLabel, FormControl, Snackbar, Alert, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { NavLink, useNavigate } from 'react-router-dom';
import { MuiTelInput } from 'mui-tel-input';
import validator from 'validator';

export default function Register() {
    const [phVal, setPhVal] = useState('');
    const [userType, setUserType] = useState('patient');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [specialty, setSpecialty] = useState('');
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

    const handlePhChange = (val) => {
        setPhVal(val.replaceAll(" ", ""));
    };

    const handleTypeChange = (ev) => {
        setUserType(ev.target.value);
    };

    const handleSpecialtyChange = (ev) => {
        setSpecialty(ev.target.value);
    };

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
        if (!nameRegex.test(name)) {
            setSnackbarMessage('Name must contain only English letters and dot(.)');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return false;
        }

        if (name.length > 100) {
            setSnackbarMessage('Name must be 100 characters or less');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return false;
        }

        if (!validator.isEmail(email)) {
            setSnackbarMessage('Invalid email format');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return false;
        }

        if (userType === 'doctor' && !specialties.includes(specialty)) {
            setSnackbarMessage('Specialty is not valid');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return false;
        }
        if (userType === 'patient' && !validator.isMobilePhone(phVal.replaceAll(" ", ""))) {
            setSnackbarMessage('Invalid phone number format');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return false;
        }

        const allowedCharsRegex = /^[A-Za-z\d@$!%*?&]+$/;

        if (password.length < 6) {
            setSnackbarMessage('Password must be at least 6 characters long');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return false;
        }

        if (!allowedCharsRegex.test(password)) {
            setSnackbarMessage('Password can only contain letters, numbers, and the special characters @$!%*?&');
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
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    role: userType,
                    name,
                    email,
                    phone: userType === 'patient' ? phVal : undefined,
                    password,
                    specialty: userType === 'doctor' ? specialty : undefined,
                }),
            });

            const data = await response.json();
            setSnackbarMessage(data.message);
            setSnackbarSeverity(response.ok ? 'success' : 'error');
            setSnackbarOpen(true);

            if (response.ok) {
                navigate('/login');
            }
        } catch (error) {
            setSnackbarMessage('Error during registration');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <Box sx={{ height: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconButton
                onClick={() => navigate('/')}
                sx={{ position: 'absolute', top: 16, left: 16, borderRadius: '12px', borderStyle: 'solid', borderWidth: '1px', borderColor: 'grey.900', color: 'grey.900' }}>
                <ArrowBackIcon />
            </IconButton>
            <Paper sx={{ p: 3, maxWidth: '350px', width: '100%' }}>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <Box>
                            <i>I'm a ?</i>
                            <Select
                                sx={{ ml: 2, maxHeight: '2rem' }}
                                value={userType}
                                onChange={handleTypeChange}
                            >
                                <MenuItem value='patient'>Patient</MenuItem>
                                <MenuItem value='doctor'>Doctor</MenuItem>
                            </Select>
                        </Box>

                        <TextField
                            label="Name"
                            fullWidth
                            variant="outlined"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />

                        {userType === 'doctor' && (
                            <FormControl fullWidth>
                                <InputLabel>Specialty</InputLabel>
                                <Select
                                    value={specialty}
                                    onChange={handleSpecialtyChange}
                                    label="Specialty"
                                    required
                                >
                                    {specialties.map((spec) => (
                                        <MenuItem key={spec} value={spec}>{spec}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}

                        <TextField
                            label="Email"
                            fullWidth
                            variant="outlined"
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        {userType === 'patient' && (
                            <MuiTelInput
                                label="Ph no."
                                fullWidth
                                value={phVal}
                                onChange={handlePhChange}
                                required
                            />
                        )}

                        <TextField
                            label="Password"
                            fullWidth
                            variant="outlined"
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <Button type="submit" variant="contained">Register</Button>

                        <NavLink to='/login'>
                            <Button variant="contained" color="secondary" fullWidth>Login</Button>
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
