import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import StatusChip from './StatusChip';
import { tokens } from '../theme/theme';

/**
 * DataTable — replaces PreviewTable with proper design
 * columns: [{ label, key, render?, isStatus?, mono? }]
 * isStatus columns auto-render StatusChip
 * mono columns render in monospace (CIN, IDs, dates)
 */
const DataTable = ({ data = [], columns = [], maxRows, viewAllPath, emptyText = 'No records found.' }) => {
  const navigate = useNavigate();
  const rows = maxRows ? data.slice(0, maxRows) : data;

  if (!data.length) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">{emptyText}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ overflowX: 'auto' }}>
        <Table size="small" sx={{ minWidth: 400 }}>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.key}>{col.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow key={i}>
                {columns.map((col) => {
                  let content;
                  if (col.render) {
                    content = col.render(row);
                  } else if (col.isStatus) {
                    content = <StatusChip value={row[col.key]} />;
                  } else {
                    content = row[col.key] ?? '—';
                  }
                  return (
                    <TableCell
                      key={col.key}
                      sx={col.mono ? { fontFamily: '"DM Mono", monospace', fontSize: '0.8rem', color: tokens.slate[400] } : {}}
                    >
                      {content}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      {viewAllPath && data.length > (maxRows || 0) && (
        <Box sx={{ mt: 1.5, display: 'flex', justifyContent: 'flex-end' }}>
          <Button size="small" variant="text" onClick={() => navigate(viewAllPath)}>
            View all {data.length} records →
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default DataTable;
