import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import {
    Alert, Box, Button, Card, CardContent, CircularProgress,
    Divider, LinearProgress, Table, TableBody, TableCell,
    TableHead, TableRow, Typography, Chip
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

// normalize dates
export const normalizeExcelDate = (value) => {
    if (!value) return value;

    // JavaScript Date object (from cellDates: true)
    if (value instanceof Date) {
        return value.toISOString().split('T')[0];
    }

    // Excel serial number (e.g. 45123)
    if (!isNaN(value) && String(value).length <= 5) {
        const date = new Date((Number(value) - 25569) * 86400 * 1000);
        return date.toISOString().split('T')[0];
    }

    // Already a date string — normalize to YYYY-MM-DD
    const parsed = new Date(value);
    if (!isNaN(parsed.getTime())) {
        return parsed.toISOString().split('T')[0];
    }

    return value;
};

// ── Row status chip ───────────────────────────────────────────────────────────
const RowStatus = ({ status, error }) => {
    if (!status || status === 'pending')
        return <Chip label="Pending" size="small"
            sx={{ fontSize: '10px', background: '#f7f9fc', border: '1px solid #e2e8f0' }} />;
    if (status === 'uploading')
        return <CircularProgress size={14} />;
    if (status === 'success')
        return <Chip label="✓ Done" size="small"
            sx={{ fontSize: '10px', background: '#dcfce7', color: '#15803d', fontWeight: 600 }} />;
    return (
        <Box>
            <Chip label="Failed" size="small"
                sx={{ fontSize: '10px', background: '#fee2e2', color: '#991b1b', fontWeight: 600 }} />
            {error && (
                <Typography sx={{ fontSize: '10px', color: '#dc2626', mt: 0.25 }}>{error}</Typography>
            )}
        </Box>
    );
};

/**
 * BulkUpload — reusable bulk upload component.
 *
 * Props:
 *   columns       — array of { key, label } defining required CSV columns and preview columns
 *   onUploadRow   — async fn(row) → called for each row. Should throw on failure.
 *   templateName  — filename for the downloaded template e.g. 'student_upload_template.xlsx'
 *   previewCols   — subset of column keys to show in the preview table (default: first 4)
 *   infoMessage   — optional string shown above the dropzone
 */
const BulkUpload = ({
    columns,
    onUploadRow,
    templateName = 'upload_template.xlsx',
    previewCols,
    infoMessage,
    templateSample = [],
}) => {
    const fileInputRef = useRef();
    const [rows, setRows] = useState([]);
    const [parseError, setParseError] = useState('');
    const [uploading, setUploading] = useState(false);
    const [done, setDone] = useState(false);

    const requiredKeys = columns.map(c => c.key);
    const displayCols = previewCols
        ? columns.filter(c => previewCols.includes(c.key))
        : columns.slice(0, 4);

    const successCount = rows.filter(r => r._status === 'success').length;
    const failCount = rows.filter(r => r._status === 'error').length;
    const progress = rows.length
        ? Math.round((successCount + failCount) / rows.length * 100)
        : 0;

    // ── Download template ─────────────────────────────────────
    const downloadTemplate = () => {
        const ws = XLSX.utils.aoa_to_sheet([
            requiredKeys,
            ...templateSample,
        ]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Data');
        XLSX.writeFile(wb, templateName);
    };

    // ── Parse uploaded file ───────────────────────────────────
    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        // Reset state
        setParseError('');
        setRows([]);
        setDone(false);
        e.target.value = '';     // allow re-uploading same file

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const wb = XLSX.read(evt.target.result, { type: 'binary' });
                const ws = wb.Sheets[wb.SheetNames[0]];
                const data = XLSX.utils.sheet_to_json(ws, { raw: false, cellDates: true });

                if (!data.length) {
                    setParseError('File is empty. Add rows to the spreadsheet and try again.');
                    return;
                }

                // Validate columns — case-insensitive
                const fileCols = Object.keys(data[0]).map(c => c.toLowerCase().trim());
                const missing = requiredKeys.filter(k => !fileCols.includes(k.toLowerCase()));
                if (missing.length) {
                    setParseError(`Missing columns: ${missing.join(', ')}. Download the template to see the correct format.`);
                    return;
                }

                // Normalise keys to lowercase and add status fields
                const normalised = data.map(row => {
                    const clean = {};
                    Object.entries(row).forEach(([k, v]) => {
                        clean[k.toLowerCase().trim()] = v;
                    });
                    return { ...clean, _status: 'pending', _error: '' };
                });

                setRows(normalised);
            } catch {
                setParseError('Could not read the file. Please use .xlsx or .csv format.');
            }
        };
        reader.readAsBinaryString(file);
    };

    // ── Upload rows sequentially ──────────────────────────────
    const handleUpload = async (retryOnly = false) => {
        setUploading(true);
        setDone(false);

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            // Skip successful rows; if retrying, also skip pending
            if (row._status === 'success') continue;
            if (retryOnly && row._status !== 'error') continue;

            setRows(prev => prev.map((r, idx) =>
                idx === i ? { ...r, _status: 'uploading' } : r
            ));

            try {
                await onUploadRow(row);
                setRows(prev => prev.map((r, idx) =>
                    idx === i ? { ...r, _status: 'success', _error: '' } : r
                ));
            } catch (err) {
                const msg = err.response?.data?.detail || err.message || 'Failed';
                setRows(prev => prev.map((r, idx) =>
                    idx === i ? { ...r, _status: 'error', _error: msg } : r
                ));
            }
        }

        setUploading(false);
        setDone(true);
    };

    return (
        <Box>
            {/* ── Drop zone card ── */}
            <Card elevation={0} sx={{ border: '1px solid #e2e8f0', mb: 2 }}>
                <CardContent sx={{ p: '20px 24px !important' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                        <Box>
                            <Typography variant="h6" sx={{ mb: 0.25 }}>Upload from file</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Upload an Excel (.xlsx) or CSV file. Download the template for the correct column format.
                            </Typography>
                        </Box>
                        <Button size="small" variant="outlined" startIcon={<DownloadIcon />}
                            onClick={downloadTemplate}>
                            Download Template
                        </Button>
                    </Box>

                    {infoMessage && (
                        <Alert severity="info" sx={{ mb: 2, fontSize: '12px' }}>{infoMessage}</Alert>
                    )}

                    <Box
                        onClick={() => fileInputRef.current.click()}
                        sx={{
                            border: '2px dashed #e2e8f0', borderRadius: '10px',
                            p: 4, textAlign: 'center', cursor: 'pointer',
                            transition: 'all 0.18s',
                            '&:hover': { borderColor: '#0d9488', background: '#f0fdfa' },
                        }}>
                        <UploadFileIcon sx={{ fontSize: 36, color: '#a0aec0', mb: 1 }} />
                        <Typography sx={{ fontWeight: 500, color: '#4a5568' }}>
                            Click to upload .xlsx or .csv
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                            Required columns: <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                                {requiredKeys.join(', ')}
                            </span>
                        </Typography>
                        <input
                            ref={fileInputRef} type="file"
                            accept=".xlsx,.xls,.csv"
                            style={{ display: 'none' }}
                            onChange={handleFile}
                        />
                    </Box>

                    {parseError && (
                        <Alert severity="error" icon={<ErrorOutlineIcon />} sx={{ mt: 2 }}>
                            {parseError}
                        </Alert>
                    )}
                </CardContent>
            </Card>

            {/* ── Preview + upload table ── */}
            {rows.length > 0 && (
                <Card elevation={0} sx={{ border: '1px solid #e2e8f0' }}>
                    <CardContent sx={{ p: '20px 24px !important' }}>
                        {/* Header row */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
                            <Box>
                                <Typography variant="h6">
                                    {rows.length} record{rows.length !== 1 ? 's' : ''} ready
                                </Typography>
                                {uploading && (
                                    <Typography variant="body2" color="text.secondary">
                                        Uploading… {successCount + failCount} / {rows.length}
                                    </Typography>
                                )}
                                {done && (
                                    <Typography variant="body2"
                                        sx={{ color: failCount ? '#d97706' : '#16a34a', fontWeight: 500 }}>
                                        {successCount} uploaded{failCount ? `, ${failCount} failed` : ' — all done'}
                                    </Typography>
                                )}
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                {done && failCount > 0 && (
                                    <Button size="small" variant="outlined" color="warning"
                                        onClick={() => handleUpload(true)}
                                        disabled={uploading}>
                                        Retry {failCount} Failed
                                    </Button>
                                )}
                                {!done && (
                                    <Button variant="contained"
                                        onClick={() => handleUpload(false)}
                                        disabled={uploading || rows.length === 0}
                                        startIcon={uploading
                                            ? <CircularProgress size={16} sx={{ color: '#fff' }} />
                                            : null}>
                                        {uploading ? 'Uploading…' : `Upload All ${rows.length}`}
                                    </Button>
                                )}
                            </Box>
                        </Box>

                        {uploading && (
                            <LinearProgress variant="determinate" value={progress}
                                sx={{
                                    mb: 2, height: 6, borderRadius: 3,
                                    '& .MuiLinearProgress-bar': { background: '#0d9488' }
                                }} />
                        )}

                        <Box sx={{ overflowX: 'auto' }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        {displayCols.map(c => (
                                            <TableCell key={c.key}>{c.label}</TableCell>
                                        ))}
                                        <TableCell>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row, i) => (
                                        <TableRow key={i} sx={{
                                            background:
                                                row._status === 'error' ? '#fef2f2' :
                                                    row._status === 'success' ? '#f0fdf4' : 'transparent'
                                        }}>
                                            {displayCols.map(c => (
                                                <TableCell key={c.key}
                                                    sx={c.mono ? { fontFamily: 'monospace', fontSize: '12px', color: '#718096' } : {}}>
                                                    {row[c.key] ?? '—'}
                                                </TableCell>
                                            ))}
                                            <TableCell>
                                                <RowStatus status={row._status} error={row._error} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
};

export default BulkUpload;
