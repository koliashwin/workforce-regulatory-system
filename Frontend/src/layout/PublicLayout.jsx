import { useState } from 'react';
import { AppBar, Box, Button, Container, InputAdornment, TextField, Toolbar, Typography } from '@mui/material';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import ShieldIcon from '@mui/icons-material/Shield';

const NAV_LINKS = [
    { label: 'Home', path: '/' },
    { label: 'Institutes', path: '/institutes' },
    { label: 'Companies', path: '/companies' },
];

const PublicLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [q, setQ] = useState('');

    const handleSearch = (e) => {
        if (e.key === 'Enter' && q.trim()) {
            // Route to last-visited list page or default to institutes
            const target = location.pathname.includes('compan') ? '/companies' : '/institutes';
            navigate(`${target}?q=${encodeURIComponent(q.trim())}`);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f7f9fc' }}>

            {/* ── Top bar ──────────────────────────────────────────────── */}
            <AppBar position="sticky" elevation={0}
                sx={{ background: '#0d1117', borderBottom: '1px solid #1e2636' }}>
                <Toolbar sx={{ gap: 2, minHeight: '56px !important', px: { xs: 2, md: 4 } }}>

                    {/* Brand */}
                    <Box component={Link} to="/"
                        sx={{ display: 'flex', alignItems: 'center', gap: 1.25, textDecoration: 'none', mr: 2 }}>
                        <Box sx={{
                            width: 30, height: 30, borderRadius: '7px', background: '#f59e0b',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                        }}>
                            <ShieldIcon sx={{ fontSize: 16, color: '#0d1117' }} />
                        </Box>
                        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                            <Typography sx={{
                                fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: '1rem',
                                color: '#fff', lineHeight: 1
                            }}>Workforce</Typography>
                            <Typography sx={{
                                fontSize: '9px', color: '#4a5568', fontFamily: 'monospace',
                                letterSpacing: '0.08em'
                            }}>REGULATORY SYSTEM</Typography>
                        </Box>
                    </Box>

                    {/* Nav links */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5 }}>
                        {NAV_LINKS.map(({ label, path }) => {
                            const active = location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
                            return (
                                <Button key={path} component={Link} to={path}
                                    sx={{
                                        color: active ? '#f59e0b' : '#718096', fontSize: '13px', fontWeight: active ? 600 : 400,
                                        '&:hover': { color: '#fff', background: 'transparent' }
                                    }}>
                                    {label}
                                </Button>
                            );
                        })}
                    </Box>

                    {/* Search */}
                    <TextField
                        size="small" placeholder="Search institute or company…"
                        value={q} onChange={e => setQ(e.target.value)} onKeyDown={handleSearch}
                        sx={{
                            flex: 1, maxWidth: 340, mx: 'auto',
                            '& .MuiOutlinedInput-root': {
                                background: '#161b26', borderRadius: '8px', fontSize: '13px',
                                '& fieldset': { borderColor: '#263142' },
                                '&:hover fieldset': { borderColor: '#2e3d52' },
                                '&.Mui-focused fieldset': { borderColor: '#0d9488' },
                                '& input': { color: '#a0aec0', '&::placeholder': { color: '#4a5568' } },
                            },
                        }}
                        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 16, color: '#4a5568' }} /></InputAdornment> }}
                    />

                    <Box sx={{ display: 'flex', gap: 1, ml: 1 }}>
                        <Button
                            component={Link} to="/get-started"
                            variant="outlined" size="small"
                            sx={{
                                borderColor: '#f59e0b', color: '#f59e0b', fontSize: '12px',
                                '&:hover': { background: '#f59e0b18', borderColor: '#f59e0b' }
                            }}>
                            Get Started
                        </Button>
                        <Button
                            component={Link} to="/login"
                            variant="outlined" size="small"
                            sx={{
                                borderColor: '#263142', color: '#a0aec0', fontSize: '12px',
                                '&:hover': { borderColor: '#f59e0b', color: '#f59e0b', background: 'transparent' }
                            }}>
                            Sign in
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* ── Page content ─────────────────────────────────────────── */}
            <Box component="main" sx={{ flex: 1 }}>
                <Outlet />
            </Box>

            {/* ── Footer ───────────────────────────────────────────────── */}
            <Box sx={{ background: '#0d1117', borderTop: '1px solid #1e2636', py: 3, px: 4, mt: 'auto' }}>
                <Container maxWidth="lg">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                        <Typography sx={{ fontFamily: 'monospace', fontSize: '11px', color: '#4a5568', letterSpacing: '0.06em' }}>
                            WORKFORCE REGULATORY SYSTEM - EMPLOYMENT LIFECYCLE & VERIFICATION PLATFORM
                        </Typography>
                        <Typography sx={{ fontSize: '11px', color: '#4a5568' }}>
                            Built by Ashwin Koli · Open-source prototype
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default PublicLayout;
