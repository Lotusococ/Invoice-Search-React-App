import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Typography, Avatar, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FactCheckIcon from '@mui/icons-material/FactCheck';

interface DrawerMenuProps {
    visible: boolean;
    onClose: () => void;
}

export const DrawerMenu: React.FC<DrawerMenuProps> = ({ visible, onClose }) => {
    const [mode, setMode] = useState('single');

    const handleModeChange = (newMode: string) => {
        setMode(newMode);
    };

    return (
        <Drawer anchor="left" open={visible} onClose={onClose} sx={{ width: 350 }}>
            <List sx={{ p: 0, width: 350 }}>
                <ListItem sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                    <Box>
                        <Avatar sx={{ width: 75, height: 75, mr: 2 }} />
                        <Box sx={{ paddingTop: 2 }}>
                            <Typography variant="subtitle1">Guest User</Typography>
                            <Typography variant="body2">No Email Address</Typography>
                        </Box>
                    </Box>
                </ListItem>
                <Divider />
                <ListItem
                    button
                    key="single"
                    selected={mode === 'single'}
                    onClick={() => handleModeChange('single')}
                    sx={{
                        borderLeft: mode === 'single' ? '5px solid #4dabf5' : '5px solid #e3f2fd',
                        bgcolor: mode === 'single' ? '#e3f2fd' : 'transparent',
                        mt: 2,  
                    }}
                >
                    <ListItemIcon sx={{ color: mode === 'single' ? '#4dabf5' : 'inherit' }}>
                        <SearchIcon />
                    </ListItemIcon>
                    <ListItemText primary="複数検索モード" sx={{ color: mode === 'single' ? '#4dabf5' : 'inherit' }} />
                </ListItem>
                <ListItem
                    button
                    key="multiple"
                    selected={mode === 'multiple'}
                    onClick={() => handleModeChange('multiple')}
                    sx={{
                        borderLeft: mode === 'multiple' ? '5px solid #4dabf5' : '5px solid #e3f2fd',
                        bgcolor: mode === 'multiple' ? '#e3f2fd' : 'transparent',
                    }}
                >
                    <ListItemIcon sx={{ color: mode === 'multiple' ? '#4dabf5' : 'inherit' }}>
                        <FactCheckIcon />
                    </ListItemIcon>
                    <ListItemText primary="整合性確認モード" sx={{ color: mode === 'multiple' ? '#4dabf5' : 'inherit' }} />
                </ListItem>
            </List>
        </Drawer>
    );
};  
