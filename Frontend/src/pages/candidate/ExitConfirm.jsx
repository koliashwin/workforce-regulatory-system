import { useState, useEffect } from 'react';
import {
    Alert, Box, Button, Card, CardContent, Checkbox,
    CircularProgress, Divider, FormControlLabel,
    Step, StepLabel, Stepper, TextField, Typography
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import candidateAPI from '../../api/modules/candidateAPI';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GavelIcon from '@mui/icons-material/Gavel';

const RECEIVED_DOCS = [
    { key: 'experience_letter', label: 'Experience Letter' },
    { key: 'relieving_letter', label: 'Relieving Letter' },
    { key: 'fnf_settlement', label: 'Full & Final Settlement (F&F)' },
    { key: 'salary_slip_last3', label: 'Last 3 Months Salary Slips' },
    { key: 'pf_contribution_letter', label: 'PF Contribution Statement' },
    { key: 'no_dues_certificate', label: 'No Dues Certificate' },
    { key: 'form_16', label: 'Form 16 (Tax Certificate)' },
];

const SUBMITTED_DOCS = [
    { key: 'resignation_email', label: 'Resignation Email / Letter' },
    { key: 'company_id_returned', label: 'Company ID Card Returned' },
    { key: 'company_assets_returned', label: 'Company Assets Returned (laptop, access cards)' },
    { key: 'nda_compliance', label: 'NDA / Exit Agreement Signed' },
];

const STEPS = ['Confirm Exit Date', 'Verify Exit Documents'];

const ExitConfirm = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const [companyId, setCompanyId] = useState('');
    const [date, setDate] = useState('');

    const [docs, setDocs] = useState(() => {
        const init = {};
        [...RECEIVED_DOCS, ...SUBMITTED_DOCS].forEach(d => { init[d.key] = false; });
        return init;
    });
    const [notes, setNotes] = useState('');

    // Auto-detect step from profile status
    useEffect(() => {
        candidateAPI.getProfile()
            .then(res => {
                const emp = res.data?.employment_history || [];
                const latest = emp[0];
                if (!latest) return;

                const status = latest.status;
                
                if (status === 'exit completed'){
                    setActiveStep(2);
                } else if (status === 'exit confirmed') {
                    setActiveStep(1);
                    setCompanyId(String(latest.company_id))
                };
            })
            .catch(() => { });
    }, []);

    const toggleDoc = (key) => setDocs(prev => ({ ...prev, [key]: !prev[key] }));

    const handleDateSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        try {
            const res = await candidateAPI.exitConfirm({
                company_id: parseInt(companyId),
                exit_date: date
            });
            setResult(res.data);
            if (res.data.success) setActiveStep(1);
        } catch (err) {
            setResult({ success: false, error: err.response?.data?.detail || 'Request failed' });
        } finally {
            setLoading(false);
        }
    };

    const handleDocsSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        try {
            const res = await candidateAPI.exitDocuments({
                company_id: parseInt(companyId),
                ...docs,
                notes
            });
            setResult(res.data);
            if (res.data.success) setActiveStep(2);
        } catch (err) {
            setResult({ success: false, error: err.response?.data?.detail || 'Request failed' });
        } finally {
            setLoading(false);
        }
    };

    const isComplete = activeStep === 2;

    return (
        <Box sx={{ maxWidth: 600 }}>
            <Typography variant="h3" sx={{ mb: 0.5 }}>Confirm Exit</Typography>
            <Typography variant="subtitle1" sx={{ mb: 3 }}>
                Verify your exit date and confirm receipt of exit documents
            </Typography>

            <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
                {STEPS.map(label => (
                    <Step key={label}><StepLabel>{label}</StepLabel></Step>
                ))}
            </Stepper>

            {result && result.success && (
                <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 2 }}>
                    {result.message}
                </Alert>
            )}
            {result && !result.success && result.dispute_id && (
                <Alert severity="warning" icon={<GavelIcon />} sx={{ mb: 2 }}>
                    <strong>Dispute raised (#{result.dispute_id})</strong><br />
                    {result.error}
                    {result.company_date && (
                        <Box sx={{ mt: 0.5, fontSize: '12px' }}>
                            Company date: <strong>{result.company_date}</strong> &nbsp;|&nbsp;
                            Your date: <strong>{result.your_date}</strong>
                        </Box>
                    )}
                    {result.missing_documents && (
                        <Box sx={{ mt: 0.5, fontSize: '12px' }}>
                            Missing: <strong>{result.missing_documents.join(', ')}</strong>
                        </Box>
                    )}
                </Alert>
            )}
            {result && !result.success && !result.dispute_id && (
                <Alert severity="error" sx={{ mb: 2 }}>{result.error}</Alert>
            )}

            {/* ── Step 1: Exit date confirmation ── */}
            {activeStep === 0 && !isComplete && (
                <Card>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 0.5 }}>Confirm your exit date</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Enter your actual last working day. If it doesn't match
                            the company's record, a dispute is automatically raised.
                        </Typography>
                        <Box component="form" onSubmit={handleDateSubmit}>
                            <TextField
                                fullWidth label="Company ID" type="number"
                                value={companyId} onChange={e => setCompanyId(e.target.value)}
                                required sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth label="Your Last Working Day" type="date"
                                value={date} onChange={e => setDate(e.target.value)}
                                required InputLabelProps={{ shrink: true }} sx={{ mb: 2 }}
                            />
                            <Button
                                type="submit" variant="contained" fullWidth disabled={loading}
                                sx={{ py: 1.25 }}>
                                {loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Confirm Exit Date →'}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            )}

            {/* ── Step 2: Exit document checklist ── */}
            {activeStep === 1 && !isComplete && (
                <Card>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 0.5 }}>Exit Document Verification</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Check only the documents you have actually received.
                            Missing documents will raise an automatic dispute against your employer.
                        </Typography>

                        <Box component="form" onSubmit={handleDocsSubmit}>
                            <Typography sx={{
                                fontWeight: 600, fontSize: '13px', fontFamily: 'monospace',
                                textTransform: 'uppercase', letterSpacing: '0.06em', mb: 1, color: '#718096'
                            }}>
                                Documents to receive from company
                            </Typography>
                            <Alert severity="warning" sx={{ mb: 1.5, fontSize: '12px' }}>
                                These are your legal entitlements. Only check what you have received.
                                Unchecked items raise a dispute.
                            </Alert>
                            {RECEIVED_DOCS.map(d => (
                                <FormControlLabel key={d.key}
                                    control={<Checkbox checked={docs[d.key]} onChange={() => toggleDoc(d.key)} />}
                                    label={d.label}
                                    sx={{ display: 'block', mb: 0.25 }}
                                />
                            ))}

                            <Divider sx={{ my: 2 }} />

                            <Typography sx={{
                                fontWeight: 600, fontSize: '13px', fontFamily: 'monospace',
                                textTransform: 'uppercase', letterSpacing: '0.06em', mb: 1, color: '#718096'
                            }}>
                                Documents submitted to company
                            </Typography>
                            {SUBMITTED_DOCS.map(d => (
                                <FormControlLabel key={d.key}
                                    control={<Checkbox checked={docs[d.key]} onChange={() => toggleDoc(d.key)} />}
                                    label={d.label}
                                    sx={{ display: 'block', mb: 0.25 }}
                                />
                            ))}

                            <Divider sx={{ my: 2 }} />

                            <TextField
                                fullWidth label="Additional notes (optional)" multiline rows={2}
                                value={notes} onChange={e => setNotes(e.target.value)}
                                sx={{ mb: 2 }}
                                placeholder="Any issues with your exit process..."
                            />

                            <Button
                                type="submit" variant="contained" fullWidth disabled={loading}
                                sx={{ py: 1.25 }}>
                                {loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Submit Exit Documents →'}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            )}

            {isComplete && (
                <Card sx={{ borderLeft: '3px solid #16a34a', borderRadius: '0 12px 12px 0' }}>
                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                        <CheckCircleIcon sx={{ fontSize: 48, color: '#16a34a', mb: 1 }} />
                        <Typography variant="h5" color="success.main">Exit Complete</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Your exit is fully verified and recorded. This employment record is now closed and tamper-proof.
                        </Typography>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
};

export default ExitConfirm;
