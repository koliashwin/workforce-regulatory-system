import { useState } from 'react';
import {
    Alert, Box, Button, Card, CardContent, CircularProgress,
    Tab, Tabs, TextField, Typography
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import instituteAPI from '../../api/modules/instituteAPI';
import BulkUpload, {normalizeExcelDate} from '../../components/BulkUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const STUDENT_COLUMNS = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email', mono: true },
    { key: 'contact_no', label: 'Contact' },
    { key: 'dob', label: 'DOB', mono: true },
    { key: 'course', label: 'Course' },
    { key: 'passout_year', label: 'Passout', mono: true },
    { key: 'skills', label: 'Skills' },
];

const SingleForm = ({ instituteId }) => {
    const [form, setForm] = useState({
        name: '', email: '', contact_no: '',
        dob: '', course: '', passout_year: '', skills: '',
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        try {
            await instituteAPI.onboardStudent({
                ...form,
                institute_id: instituteId,
                passout_year: parseInt(form.passout_year),
            });
            setResult({ success: true });
            setForm({ name: '', email: '', contact_no: '', dob: '', course: '', passout_year: '', skills: '' });
        } catch (err) {
            setResult({ success: false, error: err.response?.data?.detail || 'Failed to enroll student' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card elevation={0} sx={{ border: '1px solid #e2e8f0', mt: 2 }}>
            <CardContent sx={{ p: '24px !important' }}>
                {result?.success && (
                    <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 2 }}>
                        Student enrolled. They can log in with their email and default password.
                    </Alert>
                )}
                {result && !result.success && (
                    <Alert severity="error" sx={{ mb: 2 }}>{result.error}</Alert>
                )}
                <Box component="form" onSubmit={handleSubmit}
                    sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    <TextField label="Full Name" name="name" value={form.name}
                        onChange={handleChange} required sx={{ gridColumn: '1 / -1' }} />
                    <TextField label="Email" name="email" type="email" value={form.email}
                        onChange={handleChange} required helperText="Student's login email" />
                    <TextField label="Contact Number" name="contact_no" value={form.contact_no}
                        onChange={handleChange} required inputProps={{ maxLength: 10 }} />
                    <TextField label="Date of Birth" name="dob" type="date" value={form.dob}
                        onChange={handleChange} required InputLabelProps={{ shrink: true }} />
                    <TextField label="Course / Programme" name="course" value={form.course}
                        onChange={handleChange} required placeholder="e.g. B.Tech CSE" />
                    <TextField label="Passout Year" name="passout_year" type="number"
                        value={form.passout_year} onChange={handleChange} required placeholder="e.g. 2024" />
                    <TextField label="Skills" name="skills" value={form.skills}
                        onChange={handleChange} placeholder="e.g. Python, React, SQL"
                        helperText="Comma separated" sx={{ gridColumn: '1 / -1' }} />
                    <Alert severity="info" sx={{ gridColumn: '1 / -1', fontSize: '12px' }}>
                        Default password is <strong>Abced@12345</strong>, student should change on first login.
                    </Alert>
                    <Button type="submit" variant="contained" fullWidth disabled={loading}
                        sx={{ py: 1.25, gridColumn: '1 / -1' }}>
                        {loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Enroll Student →'}
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

const OnboardStudent = () => {
    const { user } = useAuth();
    const [tab, setTab] = useState(0);

    const uploadStudentRow = (row) =>
        instituteAPI.onboardStudent({
            name: row.name,
            email: row.email,
            contact_no: row.contact_no,
            dob: normalizeExcelDate(row.dob),
            course: row.course,
            passout_year: parseInt(row.passout_year),
            skills: row.skills || '',
            institute_id: user.institute_id,
        });

    return (
        <Box sx={{ maxWidth: 720 }}>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h3" sx={{ mb: 0.5 }}>Enroll Students</Typography>
                <Typography variant="subtitle1">
                    Add students individually or upload a bulk list from Excel or CSV.
                </Typography>
            </Box>
            <Tabs value={tab} onChange={(_, v) => setTab(v)}
                sx={{ borderBottom: '1px solid #e2e8f0' }}>
                <Tab label="Single Student" icon={<PersonAddIcon />} iconPosition="start"
                    sx={{ textTransform: 'none', fontWeight: 500, minHeight: 48 }} />
                <Tab label="Bulk Upload" icon={<UploadFileIcon />} iconPosition="start"
                    sx={{ textTransform: 'none', fontWeight: 500, minHeight: 48 }} />
            </Tabs>
            {tab === 0 && <SingleForm instituteId={user.institute_id} />}
            {tab === 1 && (
                <Box sx={{ mt: 2 }}>
                    <BulkUpload
                        columns={STUDENT_COLUMNS}
                        onUploadRow={uploadStudentRow}
                        templateName="student_upload_template.xlsx"
                        previewCols={['name', 'email', 'course', 'passout_year']}
                        templateSample={[
                            ['Aaditi Sharma', 'aaditi@example.com', '9876543210', '2001-06-15', 'B.Tech CSE', '2024', 'Python, React'],
                            ['Rohan Mehta', 'rohan@example.com', '9123456780', '2000-03-22', 'MBA Finance', '2023', 'Finance, Excel'],
                        ]}
                        infoMessage="Each student gets an account with default password Abced@12345. Duplicate emails will fail, check the status column after upload."
                    />
                </Box>
            )}
        </Box>
    );
};

export default OnboardStudent;
