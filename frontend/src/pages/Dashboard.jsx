import { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { Box, Button, CircularProgress, Typography, AppBar, Toolbar, Avatar, Menu, MenuItem } from "@mui/material";

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({});
    const navigate = useNavigate();

    const [anchorPFMenu, setAnchorPFMenu] = useState(null);
    const openPFMenu = Boolean(anchorPFMenu);


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
            // navigate("/login");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setAnchorPFMenu(null);
        try {
            await fetch("/api/auth/logout", {
                method: "GET",
                credentials: "include"
            });
            navigate("/login");
        } catch (error) { }
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
                <AppBar position="static" sx={{ bgcolor: 'primary.dark' }}>
                    <Toolbar>
                        <NavLink to='/' style={{ color: 'inherit', textDecoration: 'none' }}>
                            <Typography variant="h6" component="div">
                                Hospital Management
                            </Typography>
                        </NavLink>
                        <Box sx={{ flexGrow: 1 }}></Box>
                        <Avatar
                            alt={user?.name} src={user?.avatar}
                            sx={{ cursor: 'pointer', borderStyle: 'solid', borderWidth: '1px', borderColor: 'grey.900' }}
                            id="pf-btn"
                            aria-controls={open ? 'pf-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handlePFClick}
                        />
                        <Menu
                            id="pf-menu"
                            anchorEl={anchorPFMenu}
                            open={openPFMenu}
                            onClose={handlePFMenuClose}
                            MenuListProps={{
                                'aria-labelledby': 'pf-button',
                            }}
                        >
                            <MenuItem onClick={handlePFMenuClose}>
                                <NavLink to="/profile" style={{ color: 'inherit', textDecoration: 'none' }} >Profile</NavLink>
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </Toolbar>
                </AppBar>
            </Box>
            <Box sx={{ p: 4 }}>
                <Typography variant="h4">Hi, {user?.name} &#128075;</Typography>
            </Box>
        </>
    );
}
