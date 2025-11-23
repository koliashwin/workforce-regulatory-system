import { AppBar, Box, Button, Drawer, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const drawerWidth = 240;

const DashboardLayout = () => {
    const {user, logout} = useAuth();

    const menuItems = {
        candidate: ['Profile', 'Employment History', 'Disputes'],
        institute: ['Instiute Dashboard', 'Students', 'Disputes'],
        company: ['Company Dashboard', 'Employees', 'Disputes'],
        admin: ['Admin Dashboard', 'Manage Users', 'Dispute Logs']
    };

    const role = user?.role || 'candidate';

    return (
        <Box sx={{display: 'flex'}}>
            {/* App Bar at top */}
            <AppBar position="fixed" sx={{ zIndex: 1201 }}>
                <Toolbar>
                    <Typography variant="h6" sx={{flexGrow: 1}}>
                        Dashboard ({role})
                    </Typography>
                    <Button color="inherit" href="/" onClick={logout}>Logout</Button>
                </Toolbar>
            </AppBar>

            {/* Sidebar on left*/}
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    [`& .MuiDrawer-paper`]: {width: drawerWidth, boxSizing: 'border-box'}
                }}
            >
                <Toolbar />
                <List>
                    {menuItems[role].map((text) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            {/* main content */}
            <Box component='main' sx={{ flexGrow: 1, p: 3, mt: 8 }}>
                <Outlet />
            </Box>
        </Box>
    )
}

export default DashboardLayout
