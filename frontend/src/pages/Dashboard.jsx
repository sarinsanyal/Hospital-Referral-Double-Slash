import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress, AppBar, Toolbar, Avatar, Menu, MenuItem, Divider, ListItemIcon, Snackbar, Alert } from "@mui/material";
import Logout from '@mui/icons-material/Logout';


export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    const [anchorPFMenu, setAnchorPFMenu] = useState(null);
    const [alert, setAlert] = useState({ open: false, message: '', level: 'info' });

    const showAlert = (msg, level) => {
        setAlert({ open: true, message: msg, level });
    };

    const handleCloseSnackbar = () => {
        setAlert({ ...alert, open: false });
    };

    const handlePFClick = (event) => {
        setAnchorPFMenu(event.currentTarget);
    };
    const handlePFMenuClose = () => {
        setAnchorPFMenu(null);
    };

    const checkLoginStatus = async () => {
        try {
            const response = await fetch("/api/whoami", {
                method: "GET",
                credentials: "include"
            });
            const data = await response.json();
            if (data.loggedIn) {
                setUser(data.user);
            } else {
                navigate("/login");
            }
        } catch (error) {
            navigate("/login");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setAnchorPFMenu(null);
        try {
            const response = await fetch("/api/auth/logout", {
                method: "GET",
                credentials: "include"
            });
            if (response.ok) {
                navigate("/login");
            } else {
                showAlert("Error Logging out. Please try again.", "error");
            }
        } catch (error) {
            console.error("Error logging out:", error);
            showAlert("Error Logging out. Please try again.", "error");
        }
    };

    useEffect(() => {
        checkLoginStatus();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <Box sx={{ flexGrow: 1 }}></Box>
                        <Avatar
                            alt={user?.name} src={user?.avatar}
                            sx={{ cursor: 'pointer', borderStyle: 'solid', borderWidth: '1px', borderColor: 'grey.900' }}
                            onClick={handlePFClick}
                        />
                        <Menu
                            anchorEl={anchorPFMenu}
                            open={!!anchorPFMenu}
                            onClose={handlePFMenuClose}
                            onClick={handlePFMenuClose}
                            slotProps={{
                                paper: {
                                    elevation: 0,
                                    sx: {
                                        overflow: 'visible',
                                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                        mt: 1.5,
                                        '& .MuiAvatar-root': {
                                            width: 32,
                                            height: 32,
                                            ml: -0.5,
                                            mr: 1,
                                        },
                                        '&::before': {
                                            content: '""',
                                            display: 'block',
                                            position: 'absolute',
                                            top: 0,
                                            right: 14,
                                            width: 10,
                                            height: 10,
                                            bgcolor: 'background.paper',
                                            transform: 'translateY(-50%) rotate(45deg)',
                                            zIndex: 0,
                                        },
                                    },
                                },
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <MenuItem onClick={() => navigate('/profile')}>
                                <Avatar alt={user?.name} src={user?.avatar} /> Profile
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={handleLogout}>
                                <ListItemIcon>
                                    <Logout fontSize="small" />
                                </ListItemIcon>
                                Logout
                            </MenuItem>
                        </Menu>
                    </Toolbar>
                </AppBar>
                <Snackbar
                    open={alert.open}
                    autoHideDuration={3000}
                    onClose={handleCloseSnackbar}
                >
                    <Alert onClose={handleCloseSnackbar} severity={alert.level} sx={{ width: '100%' }}>
                        {alert.message}
                    </Alert>
                </Snackbar>
            </Box>
        </>
    );
}
