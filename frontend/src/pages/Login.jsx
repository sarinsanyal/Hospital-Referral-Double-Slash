import { useState, useEffect } from 'react';
import { Paper, Box, TextField, Stack, Button } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            alert(data.message);
            if (response.ok) {
                navigate('/dashboard');
            }
        } catch (error) {
            alert('Error during login');
        }
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
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <TextField
                            label="Password"
                            fullWidth
                            variant="outlined"
                            type='password'
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
        </Box>
    );
}
