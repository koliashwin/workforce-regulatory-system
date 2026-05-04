import { useEffect, useState, useMemo } from 'react';
import {
  Alert, Box, Card, CardContent, Chip, CircularProgress, Container,
  Divider, Drawer, Grid, IconButton, InputAdornment, TextField, Typography
} from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import publicAPI from '../../api/modules/publicAPI';

import SearchIcon from '@mui/icons-material/Search';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import GavelIcon from '@mui/icons-material/Gavel';
import VerifiedIcon from '@mui/icons-material/Verified';
import CloseIcon from '@mui/icons-material/Close';
import WorkIcon from '@mui/icons-material/Work';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// ── Dispute pill ──────────────────────────────────────────────────────────────
const DisputePill = ({ count, label, color }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <Box sx={{ width: 20, height: 20, borderRadius: '5px', background: `${color}18`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Typography sx={{ fontSize: '10px', fontWeight: 700, color }}>{count}</Typography>
    </Box>
    <Typography sx={{ fontSize: '12px', color: '#718096' }}>{label}</Typography>
  </Box>
);

// ── Company card ──────────────────────────────────────────────────────────────
const CompanyCard = ({ company, onClick }) => {
  const isVerified = company.verification_status?.toLowerCase() === 'registered';
  const disputes   = company.dispute_summary || {};
  const hasDisputes = disputes.pending > 0;

  return (
    <Card elevation={0} sx={{
      border: `1px solid ${hasDisputes ? '#fde68a' : '#e2e8f0'}`,
      cursor: 'pointer', transition: 'all 0.18s',
      '&:hover': { borderColor: '#0d9488', boxShadow: '0 4px 16px rgba(13,17,23,0.08)' }
    }} onClick={onClick}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Box sx={{ display: 'flex', gap: 1.5, flex: 1, minWidth: 0 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: '8px', background: '#f7f9fc',
              border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <BusinessIcon sx={{ fontSize: 18, color: '#161b26' }} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem', lineHeight: 1.2,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {company.name}
              </Typography>
              {company.cin && (
                <Typography sx={{ fontSize: '10px', color: '#718096', fontFamily: 'monospace', mt: 0.25 }}>
                  {company.cin}
                </Typography>
              )}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5, flexShrink: 0 }}>
            {isVerified
              ? <Chip label="Verified" size="small" icon={<VerifiedIcon sx={{ fontSize: '12px !important' }} />}
                  sx={{ fontSize: '11px', height: 22, background: '#dcfce7', color: '#15803d', fontWeight: 600 }} />
              : <Chip label="Unverified" size="small"
                  sx={{ fontSize: '11px', height: 22, background: '#fef3c7', color: '#92400e' }} />
            }
            {hasDisputes && (
              <Chip icon={<WarningAmberIcon sx={{ fontSize: '12px !important' }} />}
                label={`${disputes.pending} pending`} size="small"
                sx={{ fontSize: '11px', height: 22, background: '#fef3c7', color: '#92400e' }} />
            )}
          </Box>
        </Box>

        {company.address && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
            <LocationOnIcon sx={{ fontSize: 11, color: '#718096' }} />
            <Typography sx={{ fontSize: '11px', color: '#718096',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{company.address}</Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <PeopleIcon sx={{ fontSize: 13, color: '#718096' }} />
            <Typography sx={{ fontSize: '12px', color: '#4a5568', fontFamily: 'monospace' }}>
              {company.employee_count ?? '—'} employees
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <WorkIcon sx={{ fontSize: 13, color: '#718096' }} />
            <Typography sx={{ fontSize: '12px', color: '#4a5568', fontFamily: 'monospace' }}>
              {company.active_employees ?? '—'} active
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
      </CardContent>
    </Card>
  );
};

// ── Detail drawer ─────────────────────────────────────────────────────────────
const CompanyDrawer = ({ company, open, onClose }) => {
  if (!company) return null;
  const info     = company.company_info || company;
  const disputes = company.dispute_summary || {};
  const isVerified = info.verification_status?.toLowerCase() === 'registered';

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
            {info.cin && (
              <Typography sx={{ fontSize: '11px', color: '#718096', fontFamily: 'monospace', mt: 0.25 }}>
                CIN: {info.cin}
              </Typography>
            )}
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: '#718096' }}><CloseIcon fontSize="small" /></IconButton>
        </Box>
        {isVerified
          ? <Chip label="Verified on Scame" size="small" icon={<VerifiedIcon sx={{ fontSize: '12px !important' }} />}
              sx={{ background: '#dcfce7', color: '#15803d', fontSize: '11px', fontWeight: 600 }} />
          : <Chip label="Not yet verified" size="small"
              sx={{ background: '#fef3c7', color: '#92400e', fontSize: '11px' }} />
        }
      </Box>

      <Box sx={{ p: 2.5, overflowY: 'auto' }}>
        {/* Verification explanation */}
        {!isVerified && (
          <Alert severity="warning" sx={{ mb: 2, fontSize: '12px' }}>
            This company has not been verified against MCA records. Their employee onboarding
            may be restricted. Candidates should exercise caution.
          </Alert>
        )}

        {/* Employee stats */}
        <Typography sx={{ fontWeight: 600, fontSize: '13px', fontFamily: 'monospace',
          textTransform: 'uppercase', letterSpacing: '0.06em', color: '#718096', mb: 1.5 }}>
          Workforce
        </Typography>
        <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
          {[
            { label: 'Total Employees', value: company.employee_count ?? '—',   color: '#161b26' },
            { label: 'Currently Active', value: company.active_employees ?? '—', color: '#16a34a' },
          ].map(({ label, value, color }) => (
            <Grid item xs={6} key={label}>
              <Box sx={{ background: '#f7f9fc', borderRadius: '8px', p: 1.5, border: '1px solid #e2e8f0' }}>
                <Typography sx={{ fontFamily: 'monospace', fontSize: '1.5rem', fontWeight: 600, color, lineHeight: 1 }}>
                  {value}
                </Typography>
                <Typography sx={{ fontSize: '10px', color: '#718096', mt: 0.25, textTransform: 'uppercase',
                  letterSpacing: '0.05em', fontFamily: 'monospace' }}>{label}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Dispute transparency */}
        <Typography sx={{ fontWeight: 600, fontSize: '13px', fontFamily: 'monospace',
          textTransform: 'uppercase', letterSpacing: '0.06em', color: '#718096', mb: 1.5 }}>
          Dispute Transparency
        </Typography>

        {disputes.total === 0
          ? <Alert severity="success" icon={<CheckCircleIcon fontSize="small" />} sx={{ fontSize: '12px' }}>
              No disputes on record for this company. Clean hiring history.
            </Alert>
          : (
            <Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                <DisputePill count={disputes.total}        label="Total disputes"        color="#718096" />
                <DisputePill count={disputes.pending}      label="Pending resolution"    color="#d97706" />
                <DisputePill count={disputes.under_review} label="Under review"          color="#0d9488" />
                <DisputePill count={disputes.resolved}     label="Resolved"              color="#16a34a" />
              </Box>

              {disputes.pending > 0 && (
                <Alert severity="warning" sx={{ fontSize: '12px' }}>
                  This company has {disputes.pending} unresolved dispute{disputes.pending !== 1 ? 's' : ''}.
                  These may involve date mismatches in employment records.
                </Alert>
              )}
            </Box>
          )
        }

        {info.address && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography sx={{ fontWeight: 600, fontSize: '13px', fontFamily: 'monospace',
              textTransform: 'uppercase', letterSpacing: '0.06em', color: '#718096', mb: 1 }}>
              Address
            </Typography>
            <Typography variant="body2" color="text.secondary">{info.address}</Typography>
          </>
        )}
      </Box>
    </Drawer>
  );
};

// ── Filter bar ────────────────────────────────────────────────────────────────
const FILTERS = [
  { label: 'All',          value: 'all' },
  { label: 'Verified',     value: 'verified' },
  { label: 'Has Disputes', value: 'disputes' },
  { label: 'Unverified',   value: 'unverified' },
];

// ── Main page ─────────────────────────────────────────────────────────────────
const CompanySearchPage = () => {
  const [searchParams]            = useSearchParams();
  const [companies, setCompanies] = useState([]);
  const [profiles, setProfiles]   = useState({});
  const [loading, setLoading]     = useState(true);
  const [query, setQuery]         = useState(searchParams.get('q') || '');
  const [filter, setFilter]       = useState('all');
  const [selected, setSelected]   = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    publicAPI.getCompanyList()
      .then(res => setCompanies(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return companies.filter(c => {
      const matchQ = !q || c.name?.toLowerCase().includes(q) || c.cin?.toLowerCase().includes(q) || c.address?.toLowerCase().includes(q);
      const isVerified = c.verification_status?.toLowerCase() === 'registered';
      const hasDisputes = (c.dispute_summary?.pending || 0) > 0;
      const matchF = filter === 'all' || (filter === 'verified' && isVerified) ||
        (filter === 'unverified' && !isVerified) || (filter === 'disputes' && hasDisputes);
      return matchQ && matchF;
    });
  }, [companies, query, filter]);

  const handleClick = async (co) => {
    const id = co.company_id;
    setDrawerOpen(true);
    if (profiles[id]) { setSelected(profiles[id]); return; }
    setDetailLoading(true);
    try {
      const res = await publicAPI.getCompanyProfile(id);
      setProfiles(p => ({ ...p, [id]: res.data }));
      setSelected(res.data);
    } catch {
      setSelected({ company_info: co, employee_count: 0, active_employees: 0, dispute_summary: {} });
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography sx={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: '1.875rem', mb: 0.5 }}>
            Companies
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Verification status, employee count, and dispute history for every company on the platform.
          </Typography>
        </Box>

        {/* Search + filters */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2.5, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField placeholder="Search by name or CIN…" value={query}
            onChange={e => setQuery(e.target.value)} size="small"
            sx={{ flex: 1, minWidth: 240, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#718096', fontSize: 18 }} /></InputAdornment> }}
          />
          <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
            {FILTERS.map(({ label, value }) => (
              <Chip key={value} label={label} size="small"
                onClick={() => setFilter(value)}
                sx={{ fontSize: '12px', cursor: 'pointer', fontWeight: filter === value ? 600 : 400,
                  background: filter === value ? '#0d1117' : '#fff',
                  color: filter === value ? '#fff' : '#4a5568',
                  border: `1px solid ${filter === value ? '#0d1117' : '#e2e8f0'}` }}
              />
            ))}
          </Box>
        </Box>

        {loading
          ? <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
          : filtered.length === 0
            ? <Box sx={{ textAlign: 'center', py: 8 }}>
                <BusinessIcon sx={{ fontSize: 40, color: '#e2e8f0', mb: 1 }} />
                <Typography color="text.secondary">No companies found</Typography>
              </Box>
            : <>
                <Typography sx={{ fontSize: '12px', color: '#718096', mb: 2, fontFamily: 'monospace' }}>
                  {filtered.length} compan{filtered.length !== 1 ? 'ies' : 'y'} found
                </Typography>
                <Grid container spacing={2}>
                  {filtered.map(co => (
                    <Grid item xs={12} sm={6} md={4} key={co.company_id}>
                      <CompanyCard company={co} onClick={() => handleClick(co)} />
                    </Grid>
                  ))}
                </Grid>
              </>
        }
      </Container>

      <CompanyDrawer
        open={drawerOpen}
        company={detailLoading ? null : selected}
        onClose={() => setDrawerOpen(false)}
      />
    </Box>
  );
};

export default CompanySearchPage;
