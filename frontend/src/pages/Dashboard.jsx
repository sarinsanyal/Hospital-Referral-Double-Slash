import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, CircularProgress, Typography } from "@mui/material";

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [loggedIn, setLoggedIn] = useState(false);
    const [role, setRole] = useState("");
    const navigate = useNavigate();

    const checkLoginStatus = async () => {
        try {
            const response = await fetch("/api/public/whoami", {
                method: "GET",
                credentials: "include"
            });
            const data = await response.json();
            if (data.loggedIn) {
                setLoggedIn(true);
                setRole(data.role);
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
        try {
            await fetch("/api/auth/logout", {
                method: "GET",
                credentials: "include"
            });
            setLoggedIn(false);
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
        <Box sx={{ p: 4 }}>
            <Typography variant="h4">Welcome, {role}</Typography>
            <Button variant="contained" onClick={handleLogout} sx={{ mt: 2 }}>
                Logout
            </Button>
        </Box>
    );
}
