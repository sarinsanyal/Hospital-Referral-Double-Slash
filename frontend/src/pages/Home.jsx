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
            const response = await fetch('/apii/whoami');
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
            <h1 style={{textAlign: 'center'}} >Hospital Management App</h1>
        </>
    );
}
