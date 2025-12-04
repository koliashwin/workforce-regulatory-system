import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import React from 'react'
import { useNavigate } from 'react-router-dom'

const PreviewTable = ({ title, data, columns, maxRows = 5, viewAllPath }) => {

    const navigate = useNavigate();
    const preview = data.slice(0, maxRows);
    // console.log(data)
    return (
        <Box sx={{ mb: 3 }}>
            <Typography variant='h6' sx={{ mb: 1 }}>
                {title}
            </Typography>

            <Table>
                <TableHead>
                    <TableRow>
                        {columns.map((col) => (
                            <TableCell>{col.label}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {preview.map((row, rowIndex) => (
                        <TableRow key={rowIndex} sx={{ backgroundColor: rowIndex % 2 === 0 ? "grey.300" : "white" }}>
                            {columns.map((col) => (
                                <TableCell key={col.key}>
                                    {col.render ? col.render(row) : row[col.key] ?? "N/A"}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {data.length > maxRows && (
                <Button
                    variant="text"
                    sx={{ mt: 1 }}
                    onClick={() => navigate(viewAllPath)}
                >
                    View All
                </Button>
            )}
        </Box>
    )
}

export default PreviewTable
