import { AppBar, Box, Drawer, List, ListItem, ListItemButton, ListItemIcon,
         ListItemText, Toolbar, Typography } from '@mui/material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { tokens } from '../theme/theme';
import NotificationBell from '../components/NotificationBell';  // ← NEW

import DashboardIcon from '@mui/icons-material/SpaceDashboard';
import PersonIcon from '@mui/icons-material/AccountCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import GavelIcon from '@mui/icons-material/Gavel';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import GroupIcon from '@mui/icons-material/Group';
import BusinessIcon from '@mui/icons-material/Business';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ShieldIcon from '@mui/icons-material/Shield';

const DRAWER_W = 232;

const menuItems = {
    candidate: [
        { label: 'Dashboard',       path: '/candidate',              icon: DashboardIcon },
        { label: 'My Profile',      path: '/candidate/profile',      icon: PersonIcon },
        { label: 'Confirm Joining', path: '/candidate/joining_confirm', icon: CheckCircleIcon },
        { label: 'Confirm Exit',    path: '/candidate/exit_confirm', icon: ExitToAppIcon },
        { label: 'Disputes',        path: '/candidate/disputes',     icon: GavelIcon },
    ],
    institute: [
        { label: 'Dashboard',       path: '/institute',              icon: DashboardIcon },
        { label: 'Enroll Student',  path: '/institute/onboard',      icon: GroupAddIcon },
        { label: 'Candidate List',  path: '/institute/candidates',   icon: PeopleIcon },
    ],
    company: [
        { label: 'Dashboard',       path: '/company',                icon: DashboardIcon },
        { label: 'Onboard Employee',path: '/company/onboard',        icon: GroupAddIcon },
        { label: 'Employee Exits',  path: '/company/employee_exit',  icon: ExitToAppIcon },
        { label: 'Employee List',   path: '/company/employees',      icon: GroupIcon },
    ],
    admin: [
        { label: 'Dashboard',       path: '/admin',                  icon: DashboardIcon },
        { label: 'Companies',       path: '/admin/company_list',     icon: BusinessIcon },
        { label: 'Institutes',      path: '/admin/institute_list',   icon: SchoolIcon },
        { label: 'Candidates',      path: '/admin/candidate_list',   icon: PeopleIcon },
    ],
};

const roleLabel = { candidate: 'Candidate', institute: 'Institute', company: 'Company', admin: 'Admin' };
const roleIcon  = { candidate: PersonIcon, institute: SchoolIcon, company: BusinessIcon, admin: AdminPanelSettingsIcon };

const DashboardLayout = () => {
    const { user, logout } = useAuth();
    const navigate  = useNavigate();
    const location  = useLocation();
    const role      = user?.role || 'candidate';
    const items     = menuItems[role] || [];
    const RoleIcon  = roleIcon[role] || PersonIcon;

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', background: tokens.slate[50] }}>

            {/* ── Sidebar ─────────────────────────────────────────── */}
            <Drawer variant="permanent"
                sx={{ width: DRAWER_W, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: DRAWER_W, boxSizing: 'border-box' } }}>

                {/* Logo */}
                <Box sx={{ px: 2, py: 2.5, display: 'flex', alignItems: 'center', gap: 1.25,
                           borderBottom: `1px solid ${tokens.navy[700]}` }}>
                    <Box sx={{ width: 32, height: 32, borderRadius: '8px', background: tokens.amber[500],
                               display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ShieldIcon sx={{ fontSize: 18, color: tokens.navy[900] }} />
                    </Box>
                    <Box>
                        <Typography sx={{ fontFamily: '"Fraunces", serif', fontWeight: 700,
                                          fontSize: '1rem', color: '#fff', lineHeight: 1.1 }}>
                            Scame
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: tokens.slate[300],
                                          fontFamily: '"DM Mono", monospace', letterSpacing: '0.08em' }}>
                            REGULATORY SYSTEM
                        </Typography>
                    </Box>
                </Box>

                {/* Role badge */}
                <Box sx={{ px: 2, py: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, background: tokens.navy[700],
                               borderRadius: '8px', px: 1.5, py: 1 }}>
                        <RoleIcon sx={{ fontSize: 14, color: tokens.amber[400] }} />
                        <Typography sx={{ fontSize: '0.7rem', color: tokens.slate[200],
                                          fontFamily: '"DM Mono", monospace', letterSpacing: '0.06em',
                                          textTransform: 'uppercase' }}>
                            {roleLabel[role]} Portal
                        </Typography>
                    </Box>
                </Box>

                {/* Nav items */}
                <List sx={{ px: 1, flex: 1, pt: 0.5 }}>
                    {items.map(({ label, path, icon: Icon }) => {
                        const active = location.pathname === path ||
                            (path !== `/${role}` && location.pathname.startsWith(path));
                        return (
                            <ListItem key={path} disablePadding sx={{ mb: 0.25 }}>
                                <ListItemButton selected={active} onClick={() => navigate(path)}>
                                    <ListItemIcon sx={{ minWidth: 32 }}>
                                        <Icon sx={{ fontSize: 17, color: active ? tokens.amber[400] : tokens.slate[300] }} />
                                    </ListItemIcon>
                                    <ListItemText primary={label}
                                        primaryTypographyProps={{
                                            fontSize: '0.875rem',
                                            fontWeight: active ? 600 : 400,
                                            color: active ? '#fff' : tokens.slate[200]
                                        }} />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>

                {/* Logout */}
                <Box sx={{ px: 1, pb: 2, borderTop: `1px solid ${tokens.navy[700]}`, pt: 1.5 }}>
                    <ListItemButton onClick={() => { logout(); navigate('/login'); }}
                        sx={{ borderRadius: '8px' }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                            <LogoutIcon sx={{ fontSize: 17, color: tokens.slate[300] }} />
                        </ListItemIcon>
                        <ListItemText primary="Logout"
                            primaryTypographyProps={{ fontSize: '0.875rem', color: tokens.slate[200] }} />
                    </ListItemButton>
                </Box>
            </Drawer>

            {/* ── Main content ────────────────────────────────────── */}
            <Box component="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

                {/* Top bar */}
                <AppBar position="sticky" elevation={0}>
                    <Toolbar sx={{ minHeight: '52px !important', px: 3 }}>
                        <Typography sx={{ flex: 1, fontFamily: '"DM Mono", monospace',
                                          fontSize: '0.75rem', color: tokens.slate[300], letterSpacing: '0.06em' }}>
                            EMPLOYMENT LIFECYCLE & VERIFICATION PLATFORM
                        </Typography>

                        {/* ── Notification bell ── */}
                        <NotificationBell />  {/* ← ONE LINE */}

                        {/* User avatar */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1.5 }}>
                            <Box sx={{ width: 28, height: 28, borderRadius: '50%',
                                       background: tokens.navy[700], display: 'flex',
                                       alignItems: 'center', justifyContent: 'center' }}>
                                <RoleIcon sx={{ fontSize: 14, color: tokens.amber[400] }} />
                            </Box>
                            <Typography sx={{ fontSize: '0.8rem', color: tokens.slate[200] }}>
                                {user?.role || 'Guest'}
                            </Typography>
                        </Box>
                    </Toolbar>
                </AppBar>

                {/* Page content */}
                <Box sx={{ flex: 1, p: { xs: 2, md: 3 }, maxWidth: 1200, width: '100%' }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
};

export default DashboardLayout;