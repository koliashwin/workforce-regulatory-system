import { useState, useEffect, useRef, useCallback } from 'react';
import {
    Badge, Box, Button, CircularProgress, ClickAwayListener,
    Divider, IconButton, Paper, Popper, Typography
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/NotificationsOutlined';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import GavelIcon from '@mui/icons-material/Gavel';
import WorkIcon from '@mui/icons-material/WorkOutline';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import CircleIcon from '@mui/icons-material/Circle';
import notificationAPI from '../api/modules/notificationAPI';
import { tokens } from '../theme/theme';

// ── Icon per notification type ────────────────────────────────────────────────
const typeIcon = (type) => {
    const s = { fontSize: 15 };
    if (type?.includes('DISPUTE'))   return <GavelIcon sx={{ ...s, color: '#d97706' }} />;
    if (type?.includes('EXIT'))      return <ExitToAppIcon sx={{ ...s, color: '#0d9488' }} />;
    if (type?.includes('JOINING'))   return <WorkIcon sx={{ ...s, color: '#161b26' }} />;
    return <CircleIcon sx={{ ...s, color: '#718096' }} />;
};

// ── Time ago helper ───────────────────────────────────────────────────────────
const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1)   return 'just now';
    if (mins < 60)  return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24)   return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
};

// ── Single notification row ───────────────────────────────────────────────────
const NotifRow = ({ notif, onRead }) => (
    <Box
        onClick={() => !notif.is_read && onRead(notif.notification_id)}
        sx={{
            px: 2, py: 1.5,
            display: 'flex', gap: 1.25, alignItems: 'flex-start',
            background: notif.is_read ? 'transparent' : `${tokens.amber[500]}08`,
            borderLeft: notif.is_read ? '3px solid transparent' : `3px solid ${tokens.amber[400]}`,
            cursor: notif.is_read ? 'default' : 'pointer',
            transition: 'background 0.15s',
            '&:hover': { background: tokens.slate[50] },
        }}
    >
        <Box sx={{ mt: '2px', flexShrink: 0 }}>{typeIcon(notif.type)}</Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{
                fontSize: '13px', fontWeight: notif.is_read ? 400 : 600,
                color: tokens.navy[800], lineHeight: 1.3, mb: 0.25,
            }}>
                {notif.title}
            </Typography>
            <Typography sx={{
                fontSize: '12px', color: tokens.slate[300], lineHeight: 1.5,
                display: '-webkit-box', WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
                {notif.message}
            </Typography>
            <Typography sx={{ fontSize: '11px', color: tokens.slate[200], mt: 0.5, fontFamily: 'monospace' }}>
                {timeAgo(notif.created_on)}
            </Typography>
        </Box>
        {!notif.is_read && (
            <Box sx={{ width: 7, height: 7, borderRadius: '50%', background: tokens.amber[400], mt: '5px', flexShrink: 0 }} />
        )}
    </Box>
);

// ── Main component ────────────────────────────────────────────────────────────
const NotificationBell = () => {
    const [open, setOpen]               = useState(false);
    const [anchorEl, setAnchorEl]       = useState(null);
    const [notifications, setNotifs]    = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading]         = useState(false);
    const pollRef                       = useRef(null);

    // ── Fetch unread count (polls every 30s) ──────────────────
    const fetchCount = useCallback(async () => {
        try {
            const res = await notificationAPI.getUnreadCount();
            setUnreadCount(res.data.count || 0);
        } catch { /* silent */ }
    }, []);

    useEffect(() => {
        fetchCount();
        pollRef.current = setInterval(fetchCount, 30000);
        return () => clearInterval(pollRef.current);
    }, [fetchCount]);

    // ── Open dropdown — fetch notifications ───────────────────
    const handleOpen = async (e) => {
        setAnchorEl(e.currentTarget);
        setOpen(true);
        setLoading(true);
        try {
            const res = await notificationAPI.getAll(20);
            setNotifs(res.data || []);
        } catch { /* silent */ }
        finally { setLoading(false); }
    };

    // ── Mark one read ─────────────────────────────────────────
    const handleMarkOne = async (id) => {
        try {
            await notificationAPI.markOneRead(id);
            setNotifs(prev => prev.map(n =>
                n.notification_id === id ? { ...n, is_read: true } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch { /* silent */ }
    };

    // ── Mark all read ─────────────────────────────────────────
    const handleMarkAll = async () => {
        try {
            await notificationAPI.markAllRead();
            setNotifs(prev => prev.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);
        } catch { /* silent */ }
    };

    const hasUnread = unreadCount > 0;

    return (
        <ClickAwayListener onClickAway={() => setOpen(false)}>
            <Box>
                <IconButton onClick={handleOpen} size="small"
                    sx={{ color: hasUnread ? tokens.amber[400] : tokens.slate[300] }}>
                    <Badge
                        badgeContent={unreadCount > 9 ? '9+' : unreadCount}
                        color="warning"
                        sx={{ '& .MuiBadge-badge': { fontSize: '10px', minWidth: 16, height: 16 } }}
                    >
                        {hasUnread
                            ? <NotificationsActiveIcon sx={{ fontSize: 20 }} />
                            : <NotificationsIcon sx={{ fontSize: 20 }} />
                        }
                    </Badge>
                </IconButton>

                <Popper open={open} anchorEl={anchorEl} placement="bottom-end"
                    style={{ zIndex: 1300 }} modifiers={[{ name: 'offset', options: { offset: [0, 8] } }]}>
                    <Paper elevation={4}
                        sx={{ width: 340, maxHeight: 480, display: 'flex', flexDirection: 'column',
                              border: `1px solid ${tokens.slate[100]}`, borderRadius: '12px',
                              overflow: 'hidden' }}>

                        {/* Header */}
                        <Box sx={{ px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between',
                                   alignItems: 'center', borderBottom: `1px solid ${tokens.slate[100]}` }}>
                            <Typography sx={{ fontWeight: 600, fontSize: '14px' }}>
                                Notifications
                                {unreadCount > 0 && (
                                    <Box component="span"
                                        sx={{ ml: 1, fontSize: '11px', fontFamily: 'monospace',
                                             color: tokens.amber[600], fontWeight: 500 }}>
                                        {unreadCount} unread
                                    </Box>
                                )}
                            </Typography>
                            {hasUnread && (
                                <Button size="small" onClick={handleMarkAll}
                                    startIcon={<CheckCircleOutlineIcon sx={{ fontSize: '14px !important' }} />}
                                    sx={{ fontSize: '11px', color: tokens.teal[600], p: '2px 6px' }}>
                                    Mark all read
                                </Button>
                            )}
                        </Box>

                        {/* Body */}
                        <Box sx={{ flex: 1, overflowY: 'auto' }}>
                            {loading && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                    <CircularProgress size={20} />
                                </Box>
                            )}
                            {!loading && notifications.length === 0 && (
                                <Box sx={{ py: 5, textAlign: 'center' }}>
                                    <NotificationsIcon sx={{ fontSize: 32, color: tokens.slate[200], mb: 1 }} />
                                    <Typography variant="body2" color="text.secondary">
                                        No notifications yet
                                    </Typography>
                                </Box>
                            )}
                            {!loading && notifications.map((n, i) => (
                                <Box key={n.notification_id}>
                                    <NotifRow notif={n} onRead={handleMarkOne} />
                                    {i < notifications.length - 1 && (
                                        <Divider sx={{ borderColor: tokens.slate[100] }} />
                                    )}
                                </Box>
                            ))}
                        </Box>

                    </Paper>
                </Popper>
            </Box>
        </ClickAwayListener>
    );
};

export default NotificationBell;
