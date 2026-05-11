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

// ── Document lists ────────────────────────────────────────────
const RECEIVED_DOCS = [
    { key: 'offer_letter',       label: 'Offer Letter' },
    { key: 'appointment_letter', label: 'Appointment Letter' },
    { key: 'salary_breakdown',   label: 'Salary Breakdown / CTC Structure' },
    { key: 'nda_agreement',      label: 'NDA / Non-Compete Agreement' },
    { key: 'id_card_issued',     label: 'Company ID Card' },
];

const SUBMITTED_DOCS = [
    { key: 'aadhaar_submitted',          label: 'Aadhaar Card' },
    { key: 'pan_submitted',              label: 'PAN Card' },
    { key: 'form_11_submitted',          label: 'Form 11 (PF Declaration)' },
    { key: 'bank_details_submitted',     label: 'Bank Account Details' },
    { key: 'photos_submitted',           label: 'Passport Size Photos' },
    { key: 'education_docs_submitted',   label: 'Education Certificates' },
    { key: 'prev_exp_docs_submitted',    label: 'Previous Experience Letters' },
];

const STEPS = ['Confirm Joining Date', 'Verify Documents'];

const JoiningConfirm = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading]       = useState(false);
    const [result, setResult]         = useState(null);   // null | {success, message, error, dispute_id}

    // Step 1 state
    const [companyId, setCompanyId]   = useState('');
    const [date, setDate]             = useState('');

    // Step 2 state — document checkboxes
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

                if (status === 'joining completed') {
                    setActiveStep(2);
                } else if (status === 'joining confirmed') {
                    setActiveStep(1);
                    setCompanyId(String(latest.company_id))
                };
            })
            .catch(() => {});
    }, []);

    const toggleDoc = (key) => setDocs(prev => ({ ...prev, [key]: !prev[key] }));

    // ── Step 1 submit ─────────────────────────────────────────
    const handleDateSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        try {
            const res = await candidateAPI.joiningConfirm({
                company_id: parseInt(companyId),
                joining_date: date
            });
            setResult(res.data);
            if (res.data.success) setActiveStep(1);
        } catch (err) {
            setResult({ success: false, error: err.response?.data?.detail || 'Request failed' });
        } finally {
            setLoading(false);
        }
    };

    // ── Step 2 submit ─────────────────────────────────────────
    const handleDocsSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        try {
            const res = await candidateAPI.joiningDocuments({
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

    const isComplete = activeStep === 2 ;

    return (
        <Box sx={{ maxWidth: 600 }}>
            <Typography variant="h3" sx={{ mb: 0.5 }}>Confirm Joining</Typography>
            <Typography variant="subtitle1" sx={{ mb: 3 }}>
                Verify your joining date and document checklist
            </Typography>

            <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
                {STEPS.map(label => (
                    <Step key={label}><StepLabel>{label}</StepLabel></Step>
                ))}
            </Stepper>

            {/* Result alerts */}
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

            {/* ── Step 1: Date confirmation ── */}
            {activeStep === 0 && !isComplete && (
                <Card>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 2 }}>Confirm your joining date</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Enter the date you actually joined this company.
                            If it doesn't match what the company submitted, a dispute will be automatically raised.
                        </Typography>
                        <Box component="form" onSubmit={handleDateSubmit}>
                            <TextField
                                fullWidth label="Company ID" type="number"
                                value={companyId} onChange={e => setCompanyId(e.target.value)}
                                required sx={{ mb: 2 }}
                                helperText="Your employer's Company ID — visible on your profile"
                            />
                            <TextField
                                fullWidth label="Your Joining Date" type="date"
                                value={date} onChange={e => setDate(e.target.value)}
                                required InputLabelProps={{ shrink: true }} sx={{ mb: 2 }}
                            />
                            <Button
                                type="submit" variant="contained" fullWidth disabled={loading}
                                sx={{ py: 1.25 }}>
                                {loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Confirm Date →'}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            )}

            {/* ── Step 2: Document checklist ── */}
            {activeStep === 1 && !isComplete && (
                <Card>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 0.5 }}>Document Verification</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Check only the documents you have actually received or submitted.
                            Missing received documents will raise an automatic dispute.
                        </Typography>

                        <Box component="form" onSubmit={handleDocsSubmit}>
                            {/* Received documents */}
                            <Typography sx={{ fontWeight: 600, fontSize: '13px', fontFamily: 'monospace',
                                textTransform: 'uppercase', letterSpacing: '0.06em', mb: 1, color: '#718096' }}>
                                Documents received from company
                            </Typography>
                            <Alert severity="info" sx={{ mb: 1.5, fontSize: '12px' }}>
                                Only check documents you have physically received. Unchecked items trigger a dispute.
                            </Alert>
                            {RECEIVED_DOCS.map(d => (
                                <FormControlLabel key={d.key}
                                    control={<Checkbox checked={docs[d.key]} onChange={() => toggleDoc(d.key)} />}
                                    label={d.label}
                                    sx={{ display: 'block', mb: 0.25 }}
                                />
                            ))}

                            <Divider sx={{ my: 2 }} />

                            {/* Submitted documents */}
                            <Typography sx={{ fontWeight: 600, fontSize: '13px', fontFamily: 'monospace',
                                textTransform: 'uppercase', letterSpacing: '0.06em', mb: 1, color: '#718096' }}>
                                Documents submitted to company
                            </Typography>
                            <Alert severity="success" sx={{ mb: 1.5, fontSize: '12px' }}>
                                Check documents you have submitted. These are acknowledgements only.
                            </Alert>
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
                                placeholder="Any remarks about your joining process..."
                            />

                            <Button
                                type="submit" variant="contained" fullWidth disabled={loading}
                                sx={{ py: 1.25 }}>
                                {loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Submit Document Checklist →'}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            )}

            {/* ── Complete state ── */}
            {isComplete && (
                <Card sx={{ borderLeft: '3px solid #16a34a', borderRadius: '0 12px 12px 0' }}>
                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                        <CheckCircleIcon sx={{ fontSize: 48, color: '#16a34a', mb: 1 }} />
                        <Typography variant="h5" color="success.main">Joining Complete</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Your joining is verified and recorded. Your employment record is now live.
                        </Typography>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
};

export default JoiningConfirm;
