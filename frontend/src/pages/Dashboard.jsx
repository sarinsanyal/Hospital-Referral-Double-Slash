import { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { Box, IconButton, Button, CircularProgress, AppBar, Toolbar, Avatar, Menu, MenuItem } from "@mui/material";
import { ArrowBackIosNew } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import Tools from './Tools';

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({});
    const [isMenuOpen, setIsMenuOpen] = useState(window.innerWidth >= 500);
    const [isPhone, setIsPhone] = useState(window.innerWidth < 500);
    const phoneStyles = isPhone ? { position: 'absolute', bgcolor: 'background.paper', height: '100%' } : {};
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            setIsMenuOpen(window.innerWidth >= 500);
            setIsPhone(window.innerWidth < 500);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const [anchorPFMenu, setAnchorPFMenu] = useState(null);
    const openPFMenu = Boolean(anchorPFMenu);

    const toggleMenuOpen = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    const handlePFClick = (event) => {
        setAnchorPFMenu(event.currentTarget);
    };
    const handlePFMenuClose = () => {
        setAnchorPFMenu(null);
    };

    const checkLoginStatus = async () => {
        try {
            const response = await fetch("/apii/whoami", {
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
            await fetch("/apii/auth/logout", {
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
                        <Button variant="outlined" color="text" sx={{ minWidth: 0, p: 1 }} onClick={toggleMenuOpen} >
                            {isMenuOpen ? <ArrowBackIosNew /> : <MenuIcon />}
                        </Button>

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
            <Tools isMenuOpen={isMenuOpen} phoneStyles={phoneStyles} />
        </>
    );
}
