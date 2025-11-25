import { AppBar, Box, Button, Drawer, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const drawerWidth = 240;

const DashboardLayout = () => {
    const {user, logout} = useAuth();
    const navigate = useNavigate();

    const menuItems = {
        candidate: [
            {label: "Dashboard", path: "/candidate"},
            {label: "Employment History", path: "/candidate/history"}
        ],
        institute: [
            {label: "Dashboard", path: "/institute"},
            {label: "Onboard Candidate", path: "/institute/onboard"},
            {label: "Candidate List", path: "/institute/candidates"}
        ],
        company: [
            {label: "Dashboard", path: "/company"}
        ],
        admin: [
            {label: "Dashboard", path: "/admin"}
        ]
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
                    {menuItems[role].map((item) => (
                        <ListItem key={item.label} disablePadding>
                            <ListItemButton onClick={() => navigate(item.path)}>
                                <ListItemText primary={item.label} />
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
