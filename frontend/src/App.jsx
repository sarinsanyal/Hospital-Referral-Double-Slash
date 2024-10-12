import { useEffect, useState } from 'react';
import { Routes, Route, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Box, Toolbar, Typography, Button } from '@mui/material';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkLoggedIn = async () => {
      const response = await fetch('/api/public/whoami');
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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
