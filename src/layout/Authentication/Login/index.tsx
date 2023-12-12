import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleButton from 'react-google-button';
import { useTranslation } from "react-i18next";

// MUI Imports
import { useTheme } from "@mui/material/styles";
import {
    Typography,
    Grid,
    Box
} from '@mui/material';

// Firebase Import
import { getAuth, signInWithRedirect, GoogleAuthProvider, getRedirectResult } from 'firebase/auth';
import { useAuth } from 'src/interface/Firebase/requestAuth';

//Image Import
import LoginImg from "src/assets/img/lucas-k-wQLAGv4_OYs-unsplash.jpg"

// Context Imports
import { useSnackbar } from "src/contexts/SnackbarContext";
import { sendCustomTraceLog } from 'src/interface/Axiom Log/sendCustomTraceLog';

export const Login: React.FC = () => {
    const { user, loading } = useAuth();
    const auth = getAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { showSnackbar } = useSnackbar();

    // Theme Settings
    const getCurrentTheme = useTheme();

    useEffect(() => {
        if (!user) {
            getRedirectResult(auth)
                .then((result) => {
                    if (result) {
                        navigate("/dashboard");
                    }
                })
                .catch((error) => {
                    console.error("Failed to Login Redirect: " + error);
                });
        }
    }, [auth, user, navigate]);

    if (loading) {
        return (
            <Grid container component="main" sx={{ height: '100%' }}>
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
                            borderRadius: '16px',
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
                            {t("Loading")}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        );
    }

    const HandleLoginWithGoogle = () => {
        try {
            const provider = new GoogleAuthProvider();
            signInWithRedirect(auth, provider).catch((error) => {
                console.error(error)
            });
        } catch (error) {
            showSnackbar("Failed to login.", "error");
            sendCustomTraceLog(null, "Failed to login: " + error, "error", "Login/index.tsx");
        }
    };

    return user ? (
        <Grid container component="main" sx={{ height: '100%' }}>
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
                        maxWidth: 500,
                        borderRadius: '16px',
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
                        {t("LoggedInGreetings")}<br/>{t("LoggedInHello")}{user.displayName}
                    </Typography>
                </Box>
            </Grid>
        </Grid>
    ) : (
        <Grid container component="main" sx={{ height: '100%' }}>
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
                        maxWidth: 400,
                        borderRadius: '16px',
                    }}
                >
                    <Typography
                        component="h1"
                        variant="h1"
                        sx={{
                            mb: 2,
                            fontWeight: "bold",
                            color: getCurrentTheme.palette.mode === "dark" ? "#fff" : "#000",
                            userSelect: "none",
                        }}
                    >
                        {t("LoginGreetings")}
                    </Typography>
                    <GoogleButton onClick={HandleLoginWithGoogle} style={{ width: '240px', marginBottom: '16px' }} />
                </Box>
            </Grid>
        </Grid>
    );
};