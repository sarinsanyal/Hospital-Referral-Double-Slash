import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress, AppBar, Toolbar, Avatar, Menu, MenuItem, Divider, ListItemIcon, Snackbar, Alert, Typography } from "@mui/material";
import Logout from '@mui/icons-material/Logout';


export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    const [anchorPFMenu, setAnchorPFMenu] = useState(null);
    const [alert, setAlert] = useState({ open: false, message: '', level: 'info' });
    const [hospitals, setHospitals] = useState([]);
    const [requestedHosp, setRequestedHosp] = useState("");

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

    const fetchHospitals = async () => {
        try {
            const response = await fetch("/api/data/hospitals", {
                method: "GET",
                credentials: "include"
            });
            if (response.ok) {
                const data = await response.json();
                setHospitals(data);
            } else {
                showAlert("Error fetching hospitals. Please try again.", "error");
            }
        } catch (error) {
            console.error("Error fetching:", error);
            showAlert("Error fetching. Please try again.", "error");
        }
    }

    const requestHospital = async (to) => {
        try {
            const response = await fetch("/api/data/request", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ to: to })
            });
            console.log(response)
            if (response.ok) {
                const data = await response.json();
                setRequestedHosp(to);
                showAlert(data.message, "success");
            } else {
                showAlert("Error requesting hospital. Please try again.", "error");
            }
        } catch (error) {
            console.error("Error requesting:", error);
            showAlert("Error requesting. Please try again.", "error");
        }
    }

    useEffect(() => {
        checkLoginStatus();
    }, []);

    useEffect(() => {
        if (user.userType == 'patient') {
            fetchHospitals();
            console.log(user);
            if (user.state === "pending") {
                setRequestedHosp(user.to);
            }
        }
    }, [user]);

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
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Hi {user?.name}!
                        </Typography>
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
                <Box sx={{
                    p: 4
                }}>
                    <ul>
                        {hospitals.map((hospital, index) => (
                            <li key={index}>{hospital.name} <button onClick={() => { requestHospital(hospital.username) }} disabled={requestedHosp === hospital.username}>Request</button><button>cancel</button></li>
                        ))}
                    </ul>
                </Box>
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
