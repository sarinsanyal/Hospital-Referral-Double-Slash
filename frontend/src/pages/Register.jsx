import { useState } from 'react'
import { Paper, Box, TextField, MenuItem, Stack, Button, Select, InputLabel, FormControl } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { MuiTelInput } from 'mui-tel-input'

export default function Register() {
    const [phVal, setPhVal] = useState('');
    const [userType, setUserType] = useState(0);
    const [specialty, setSpecialty] = useState('');

    const handlePhChange = (val) => {
        setPhVal(val);
    }

    const handleTypeChange = (ev) => {
        setUserType(ev.target.value);
    }

    const handleSpecialtyChange = (ev) => {
        setSpecialty(ev.target.value);
    }

    // List of common doctor specialties
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
                <Stack spacing={2}>
                    <Box>
                        <i>I'm a ?</i>
                        <Select
                            sx={{ ml: 2, maxHeight: '2rem' }}
                            value={userType}
                            onChange={handleTypeChange}
                        >
                            <MenuItem value={0}>Patient</MenuItem>
                            <MenuItem value={1}>Doctor</MenuItem>
                        </Select>
                    </Box>

                    <TextField label="Name" fullWidth={true} variant="outlined" />

                    {userType === 1 && (
                        <FormControl fullWidth>
                            <InputLabel>Specialty</InputLabel>
                            <Select
                                value={specialty}
                                onChange={handleSpecialtyChange}
                                label="Specialty"
                            >
                                {specialties.map((spec) => (
                                    <MenuItem key={spec} value={spec}>{spec}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}

                    <TextField label="Email" fullWidth={true} variant="outlined" type='email' />
                    {userType !== 1 && (
                        <MuiTelInput label="Ph no." fullWidth={true} value={phVal} onChange={handlePhChange} />
                    )}

                    <TextField label="Password" fullWidth={true} variant="outlined" />

                    <Button variant="contained">Register</Button>

                    <NavLink to='/login'>
                        <Button variant="contained" color="secondary" fullWidth={true}>Login</Button>
                    </NavLink>
                </Stack>
            </Paper>
        </Box>
    )
}
