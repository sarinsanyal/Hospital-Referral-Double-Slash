import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Box, Toolbar, Typography, Button, Container, Paper } from '@mui/material';
import Grid from '@mui/material/Grid2';

export default function Home() {
    const [loggedIn, setLoggedIn] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const checkLoggedIn = async () => {
            const response = await fetch('/api/whoami');
            if (response.ok) {
                const data = await response.json();
                setLoggedIn(data.loggedIn);
            }
        };
        checkLoggedIn();
    }, [navigate]);

    const showButton = location.pathname === '/';

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" sx={{ bgcolor: 'primary.dark' }}>
                    <Toolbar>
                        <NavLink to='/' style={{ color: 'inherit', textDecoration: 'none' }}>
                            <Typography variant="h6" component="div">
                                Hospital Management
                            </Typography>
                        </NavLink>
                        <Box sx={{ flexGrow: 1 }}></Box>
                        {showButton && (
                            <NavLink to={loggedIn ? '/dashboard' : '/login'}>
                                <Button variant='contained'>{loggedIn ? 'Dashboard' : 'Login'}</Button>
                            </NavLink>
                        )}
                    </Toolbar>
                </AppBar>
            </Box>

            <Container sx={{ mt: 4 }}>
                {/* Hero Section */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h3" gutterBottom>
                        Welcome to Hospital Management System
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        Efficiently manage patients, staff, and hospital operations with ease.
                    </Typography>
                    <NavLink to={loggedIn ? '/dashboard' : '/login'}>
                        <Button variant="contained" size="large" sx={{ mt: 3 }}>
                            {loggedIn ? 'Go to Dashboard' : 'Get Started'}
                        </Button>
                    </NavLink>
                </Box>

                {/* Services/Features Section */}
                <Grid container spacing={4} sx={{ mt: 4 }}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="h5" gutterBottom>Patient Management</Typography>
                            <Typography variant="body1">
                                Manage patient records, medical histories, and treatments efficiently.
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="h5" gutterBottom>Appointment Scheduling</Typography>
                            <Typography variant="body1">
                                Streamline appointment booking for doctors and patients.
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="h5" gutterBottom>Staff Management</Typography>
                            <Typography variant="body1">
                                Handle staff schedules, payroll, and performance with ease.
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="h5" gutterBottom>Billing and Invoicing</Typography>
                            <Typography variant="body1">
                                Generate bills and manage payments quickly and accurately.
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="h5" gutterBottom>Inventory Management</Typography>
                            <Typography variant="body1">
                                Track and manage medical supplies, equipment, and pharmaceuticals.
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="h5" gutterBottom>Reporting & Analytics</Typography>
                            <Typography variant="body1">
                                Generate reports and gain insights to improve operations.
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}
