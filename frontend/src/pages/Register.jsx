import { useState, useEffect } from 'react';
import { Paper, Box, TextField, MenuItem, Stack, Button, Select, InputLabel, FormControl } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import { MuiTelInput } from 'mui-tel-input';

export default function Register() {
    const [phVal, setPhVal] = useState('');
    const [userType, setUserType] = useState('patient');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [specialty, setSpecialty] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const checkLoggedIn = async () => {
            const response = await fetch('/api/public/whoami');
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
        setPhVal(val);
    };

    const handleTypeChange = (ev) => {
        setUserType(ev.target.value);
    };

    const handleSpecialtyChange = (ev) => {
        setSpecialty(ev.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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
        alert(data.message);
        if (response.ok) {
            navigate('/login');
        }
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

    return (
        <Box sx={{ pt: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
        </Box>
    );
}
