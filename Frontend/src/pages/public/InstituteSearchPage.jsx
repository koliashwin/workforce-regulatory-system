import { useEffect, useState, useMemo } from 'react';
import {
  Box, Card, CardContent, Chip, CircularProgress, Container,
  Grid, InputAdornment, LinearProgress, TextField, Typography,
  Drawer, IconButton, Divider, Button, Alert
} from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import publicAPI from '../../api/modules/publicAPI';

import SearchIcon from '@mui/icons-material/Search';
import SchoolIcon from '@mui/icons-material/School';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import GavelIcon from '@mui/icons-material/Gavel';
import VerifiedIcon from '@mui/icons-material/Verified';
import CloseIcon from '@mui/icons-material/Close';
import WorkIcon from '@mui/icons-material/Work';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// ── Placement bar ─────────────────────────────────────────────────────────────
const PlacementBar = ({ rate }) => {
  const color = rate >= 75 ? '#16a34a' : rate >= 40 ? '#d97706' : '#dc2626';
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography sx={{ fontSize: '11px', color: '#718096', fontFamily: 'monospace' }}>Placement rate</Typography>
        <Typography sx={{ fontSize: '11px', fontWeight: 600, color, fontFamily: 'monospace' }}>{rate}%</Typography>
      </Box>
      <LinearProgress variant="determinate" value={Math.min(rate, 100)}
        sx={{ height: 5, borderRadius: 3, background: '#e2e8f0',
          '& .MuiLinearProgress-bar': { background: color, borderRadius: 3 } }} />
    </Box>
  );
};

// ── Dispute pill ──────────────────────────────────────────────────────────────
const DisputePill = ({ count, label, color }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
    <Box sx={{ width: 18, height: 18, borderRadius: '4px', background: `${color}18`,
      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography sx={{ fontSize: '10px', fontWeight: 700, color }}>{count}</Typography>
    </Box>
    <Typography sx={{ fontSize: '11px', color: '#718096' }}>{label}</Typography>
  </Box>
);

// ── Institute card ────────────────────────────────────────────────────────────
const InstituteCard = ({ institute, onClick }) => {
  const info     = institute.meta || institute;
  const stats    = institute.placement_stats || {};
  const disputes = institute.dispute_summary || {};
  const isVerified = info.verification_status?.toLowerCase() === 'registered';

  return (
    <Card elevation={0} sx={{
      border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.18s',
      '&:hover': { borderColor: '#0d9488', boxShadow: '0 4px 16px rgba(13,17,23,0.08)' }
    }} onClick={onClick}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', flex: 1, minWidth: 0 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: '8px', background: '#f7f9fc',
              border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <SchoolIcon sx={{ fontSize: 18, color: '#161b26' }} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem', lineHeight: 1.2,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {info.name || '-'}
              </Typography>
              {info.address && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                  <LocationOnIcon sx={{ fontSize: 11, color: '#718096' }} />
                  <Typography sx={{ fontSize: '11px', color: '#718096', overflow: 'hidden',
                    textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{info.address}</Typography>
                </Box>
              )}
            </Box>
          </Box>
          {isVerified
            ? <Chip label="Verified" size="small" icon={<VerifiedIcon sx={{ fontSize: '12px !important' }} />}
                sx={{ fontSize: '11px', height: 22, background: '#dcfce7', color: '#15803d', fontWeight: 600, flexShrink: 0 }} />
            : <Chip label="Unverified" size="small"
                sx={{ fontSize: '11px', height: 22, background: '#fef3c7', color: '#92400e', flexShrink: 0 }} />
          }
        </Box>

        {/* Stats row */}
        <Box sx={{ display: 'flex', gap: 2, mb: 1.5, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <PeopleIcon sx={{ fontSize: 13, color: '#718096' }} />
            <Typography sx={{ fontSize: '12px', color: '#4a5568', fontFamily: 'monospace' }}>
              {stats.total ?? '-'} alumni
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <WorkIcon sx={{ fontSize: 13, color: '#718096' }} />
            <Typography sx={{ fontSize: '12px', color: '#4a5568', fontFamily: 'monospace' }}>
              {stats.placed ?? '-'} placed
            </Typography>
          </Box>
          {disputes.total > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <GavelIcon sx={{ fontSize: 13, color: '#d97706' }} />
              <Typography sx={{ fontSize: '12px', color: '#d97706', fontFamily: 'monospace' }}>
                {disputes.total} dispute{disputes.total !== 1 ? 's' : ''}
              </Typography>
            </Box>
          )}
        </Box>

        <PlacementBar rate={stats.placement_rate ?? 0} />
      </CardContent>
    </Card>
  );
};

// ── Detail drawer ─────────────────────────────────────────────────────────────
const InstituteDrawer = ({ institute, open, onClose }) => {
  if (!institute) return null;
  const info     = institute.institute_info || institute.meta || {};
  const students = institute.students || [];
  const stats    = institute.placement_stats || {};
  const disputes = institute.dispute_summary || {};

  // Group students by course for the chart
  const byCourse = institute.placement_stats?.by_course || [];

  return (
    <Drawer anchor="right" open={open} onClose={onClose}
      PaperProps={{ sx: { width: { xs: '100%', sm: 480 }, p: 0 } }}>
      {/* Header */}
      <Box sx={{ p: 2.5, background: '#0d1117', borderBottom: '1px solid #1e2636' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box>
            <Typography sx={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: '1.125rem', color: '#fff' }}>
              {info.name}
            </Typography>
            {info.address && (
              <Typography sx={{ fontSize: '12px', color: '#718096', mt: 0.25 }}>{info.address}</Typography>
            )}
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: '#718096' }}><CloseIcon fontSize="small" /></IconButton>
        </Box>
        {info.verification_status?.toLowerCase() === 'registered'
          ? <Chip label="Verified on Scame" size="small" icon={<VerifiedIcon sx={{ fontSize: '12px !important' }} />}
              sx={{ background: '#dcfce7', color: '#15803d', fontSize: '11px', fontWeight: 600 }} />
          : <Chip label="Not yet verified" size="small"
              sx={{ background: '#fef3c7', color: '#92400e', fontSize: '11px' }} />
        }
      </Box>

      <Box sx={{ p: 2.5, overflowY: 'auto', flex: 1 }}>
        {/* Placement overview */}
        <Typography sx={{ fontWeight: 600, fontSize: '13px', fontFamily: 'monospace',
          textTransform: 'uppercase', letterSpacing: '0.06em', color: '#718096', mb: 1.5 }}>
          Placement Overview
        </Typography>
        <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
          {[
            { label: 'Total Alumni',    value: stats.total ?? '-',              color: '#161b26' },
            { label: 'Placed',          value: stats.placed ?? '-',             color: '#16a34a' },
            { label: 'Not Yet Placed',  value: (stats.total - stats.placed) || '-', color: '#718096' },
            { label: 'Placement Rate',  value: `${stats.placement_rate ?? 0}%`, color: stats.placement_rate >= 75 ? '#16a34a' : '#d97706' },
          ].map(({ label, value, color }) => (
            <Grid item xs={6} key={label}>
              <Box sx={{ background: '#f7f9fc', borderRadius: '8px', p: 1.5, border: '1px solid #e2e8f0' }}>
                <Typography sx={{ fontFamily: 'monospace', fontSize: '1.375rem', fontWeight: 600, color, lineHeight: 1 }}>
                  {value}
                </Typography>
                <Typography sx={{ fontSize: '10px', color: '#718096', mt: 0.25, textTransform: 'uppercase',
                  letterSpacing: '0.05em', fontFamily: 'monospace' }}>{label}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* By course */}
        {byCourse.length > 0 && (
          <>
            <Typography sx={{ fontWeight: 600, fontSize: '13px', fontFamily: 'monospace',
              textTransform: 'uppercase', letterSpacing: '0.06em', color: '#718096', mb: 1.5 }}>
              By Programme
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2.5 }}>
              {byCourse.map(({ course, count }) => {
                const pct = stats.total ? Math.round(count / stats.total * 100) : 0;
                return (
                  <Box key={course}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography sx={{ fontSize: '12px', fontWeight: 500 }}>{course}</Typography>
                      <Typography sx={{ fontSize: '12px', color: '#718096', fontFamily: 'monospace' }}>
                        {count} ({pct}%)
                      </Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={pct}
                      sx={{ height: 4, borderRadius: 2, background: '#e2e8f0',
                        '& .MuiLinearProgress-bar': { background: '#161b26', borderRadius: 2 } }} />
                  </Box>
                );
              })}
            </Box>
          </>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Dispute transparency */}
        <Typography sx={{ fontWeight: 600, fontSize: '13px', fontFamily: 'monospace',
          textTransform: 'uppercase', letterSpacing: '0.06em', color: '#718096', mb: 1.5 }}>
          Dispute Transparency
        </Typography>
        {disputes.total === 0
          ? <Alert severity="success" sx={{ fontSize: '12px' }}>No disputes on record. Clean history.</Alert>
          : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <DisputePill count={disputes.total}       label="Total disputes"         color="#718096" />
              <DisputePill count={disputes.pending}     label="Pending resolution"     color="#d97706" />
              <DisputePill count={disputes.under_review} label="Under review"          color="#0d9488" />
              <DisputePill count={disputes.resolved}    label="Resolved"               color="#16a34a" />
            </Box>
          )
        }

        {/* Recent alumni */}
        {students.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography sx={{ fontWeight: 600, fontSize: '13px', fontFamily: 'monospace',
              textTransform: 'uppercase', letterSpacing: '0.06em', color: '#718096', mb: 1.5 }}>
              Recent Alumni
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {students.slice(0, 8).map((s, i) => (
                <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  py: 1, borderBottom: '1px solid #f7f9fc' }}>
                  <Box>
                    <Typography sx={{ fontSize: '13px', fontWeight: 500 }}>{s.student_name}</Typography>
                    <Typography sx={{ fontSize: '11px', color: '#718096' }}>{s.course} · {s.passout_year}</Typography>
                  </Box>
                  {s.company_name
                    ? <Chip label={s.company_name} size="small"
                        sx={{ fontSize: '10px', height: 20, background: '#dcfce7', color: '#15803d', maxWidth: 140,
                          overflow: 'hidden', textOverflow: 'ellipsis' }} />
                    : <Chip label="Not placed" size="small"
                        sx={{ fontSize: '10px', height: 20, background: '#f7f9fc', color: '#718096' }} />
                  }
                </Box>
              ))}
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────
const InstituteSearchPage = () => {
  const [searchParams]          = useSearchParams();
  const [institutes, setInstitutes] = useState([]);
  const [profiles, setProfiles]     = useState({});
  const [loading, setLoading]       = useState(true);
  const [query, setQuery]           = useState(searchParams.get('q') || '');
  const [selected, setSelected]     = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    publicAPI.getInstituteList()
      .then(res => setInstitutes(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return institutes.filter(i =>
      !q || i.name?.toLowerCase().includes(q) || i.address?.toLowerCase().includes(q)
    );
  }, [institutes, query]);

  const handleClick = async (inst) => {
    const id = inst.institute_id;
    setDrawerOpen(true);
    if (profiles[id]) { setSelected(profiles[id]); return; }
    setDetailLoading(true);
    try {
      const res = await publicAPI.getInstituteProfile(id);
      const data = { ...res.data, meta: inst };
      setProfiles(p => ({ ...p, [id]: data }));
      setSelected(data);
    } catch {
      setSelected({ institute_info: inst, meta: inst, students: [], placement_stats: {}, dispute_summary: {} });
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        {/* Page header */}
        <Box sx={{ mb: 4 }}>
          <Typography sx={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: '1.875rem', mb: 0.5 }}>
            Institutes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Browse all registered institutes, placement rates, alumni data and dispute history are public.
          </Typography>
        </Box>

        {/* Search */}
        <TextField fullWidth placeholder="Search by name or location…" value={query}
          onChange={e => setQuery(e.target.value)}
          sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#718096' }} /></InputAdornment> }}
        />

        {loading
          ? <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
          : filtered.length === 0
            ? <Box sx={{ textAlign: 'center', py: 8 }}>
                <SchoolIcon sx={{ fontSize: 40, color: '#e2e8f0', mb: 1 }} />
                <Typography color="text.secondary">No institutes found for "{query}"</Typography>
              </Box>
            : <>
                <Typography sx={{ fontSize: '12px', color: '#718096', mb: 2, fontFamily: 'monospace' }}>
                  {filtered.length} institute{filtered.length !== 1 ? 's' : ''} found
                </Typography>
                <Grid container spacing={2}>
                  {filtered.map(inst => (
                    <Grid item xs={12} sm={6} md={4} key={inst.institute_id}>
                      <InstituteCard
                        institute={{ meta: inst, placement_stats: {}, dispute_summary: {} }}
                        onClick={() => handleClick(inst)}
                      />
                    </Grid>
                  ))}
                </Grid>
              </>
        }
      </Container>

      <InstituteDrawer
        open={drawerOpen}
        institute={detailLoading ? null : selected}
        onClose={() => setDrawerOpen(false)}
      />
    </Box>
  );
};

export default InstituteSearchPage;
