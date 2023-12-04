import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface HeaderProps {
    onDrawerOpen: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onDrawerOpen }) => {
    return (
        <AppBar position="static" color="default">
            <Toolbar sx={{bgcolor: "#42a5f5"}}>
                <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                    <Box display="flex" alignItems="center">
                        <IconButton edge="start" color="inherit" aria-label="menu" onClick={onDrawerOpen}>
                            <MenuIcon sx={{ color: "#fff" }}/>
                        </IconButton>
                        <Typography variant="h6" color="inherit" component="div" sx={{ color: "#fff" }}>
                            Invoice Search App
                        </Typography>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
};  
