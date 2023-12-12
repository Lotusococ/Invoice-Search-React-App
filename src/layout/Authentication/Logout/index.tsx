import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";

// MUI Import
import { useTheme } from "@mui/material/styles";
import { Grid, Box, Typography, Button } from '@mui/material';

// Firebase Import
import { getAuth, signOut } from 'firebase/auth';

// Image Import
import LoginImg from "src/assets/img/lucas-k-wQLAGv4_OYs-unsplash.jpg"
import { sendCustomTraceLog } from 'src/interface/Axiom Log/sendCustomTraceLog';
import { useAuth } from 'src/interface/Firebase/requestAuth';

export const Logout: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { user } = useAuth();

    // Theme Settings
    const getCurrentTheme = useTheme();

    const handleLogout = async () => {
        const auth = getAuth();
        try {
            await signOut(auth);
            sessionStorage.removeItem('user');
            navigate("/login");
        } catch (error) {
            sendCustomTraceLog(user, "Failed to logout: " + error, "error", "Logout/index.tsx");
        }
    };

    return (
        <Grid container component="main" sx={{ height: '100%' }}>
            <Grid item xs={12} sm={8} md={5} display="flex" justifyContent="center" alignItems="center">
                <Box
                    sx={{
                        padding: 5,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 'auto',
                        width: '100%',
                        minWidth: 400,
                        borderWidth: 0
                    }}
                >
                    <Typography
                        component="h1"
                        variant="h3"
                        sx={{
                            mb: 2,
                            fontWeight: "bold",
                            color: getCurrentTheme.palette.mode === "dark" ? "#fff" : "#000",
                            userSelect: "none",
                        }}
                    >
                        {t("LogoutGreetings")}
                    </Typography>
                    <Button variant="contained" color="primary" onClick={handleLogout} style={{ width: '240px', marginBottom: '16px' }} >
                        {t("LogoutButton")}
                    </Button>
                </Box>
            </Grid>
            <Grid item xs={false} sm={4} md={7} sx={{
                backgroundImage: `url(${LoginImg})`,
                backgroundRepeat: 'no-repeat',
                backgroundColor: (t) =>
                    t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '16px'
            }}>
            </Grid>
        </Grid>
    );
};  