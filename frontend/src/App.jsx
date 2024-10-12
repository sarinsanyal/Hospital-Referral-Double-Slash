import { Routes, Route, NavLink } from 'react-router-dom';
import { AppBar, Box, IconButton, Toolbar, Typography, Button } from '@mui/material';
import { Menu } from '@mui/icons-material';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';


function App() {
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{bgcolor: 'primary.dark'}}>
          <Toolbar>
            <NavLink to='/' style={{ color: 'inherit', textDecoration: 'none' }}>
              <Typography variant="h6" component="div">
                Hospital Management
              </Typography>
            </NavLink>
            <Box sx={{ flexGrow: 1 }}></Box>
            <NavLink to='/login'>
              <Button variant='contained'>Login</Button>
            </NavLink>
          </Toolbar>
        </AppBar>
      </Box>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  )
}

export default App
