import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, TextField, Typography } from '@mui/material';
import React, { useMemo, useState } from 'react'

const FullTable = ({ title, data = [], columns, rowsCount = 10 }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(rowsCount);
    const [search, setSearch] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const safeData = Array.isArray(data) ? data : [];

    // search filters
    const filterData = useMemo(() => {
        if (!search) return safeData;

        const lower = search.toLocaleLowerCase();

        return safeData.filter((row) =>
            JSON.stringify(row).toLocaleLowerCase().includes(lower)
        );
    }, [search, safeData])

    // sort logic
    const sortedData = useMemo(() => {
        if (!sortConfig.key) return filterData;

        const sorted = [...filterData].sort((a, b) => {
            const aValue = a[sortConfig.key] ?? "";
            const bValue = b[sortConfig.key] ?? "";

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
        return sorted;
    }, [filterData, sortConfig]);

    // pagination
    const paginated = sortedData.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const handleSort = (key) => {
        setSortConfig((prev) => ({
            key,
            direction:
                prev.key === key && prev.direction === "asc" ? "desc" : "asc",
        }));
    };

    return (
        <Paper sx={{ p: 2 }}>
            <Typography variant='h5' sx={{ mb: 2 }}>
                {title}
            </Typography>

            {/* search bar */}
            <TextField
                label="Search"
                size='small'
                fullWidth
                sx={{ mb: 2 }}
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(0);
                }}
            />

            <TableContainer sx={{maxHeight: 400, minWidth: '70vw'}}>
                <Table stickyHeader>
                    <TableHead sx={{position: 'sticky', top: 0, background: (theme) => theme.palette.background.paper, zIndex: 2}}>
                        <TableRow>
                            <TableCell>Sr. no.</TableCell>
                            {columns.map((col) => (
                                <TableCell key={col.key}>
                                    <TableSortLabel
                                        active={sortConfig.key === col.key}
                                        direction={sortConfig.direction}
                                        onClick={() => handleSort(col.key)}
                                        disabled={col.sortable === false}
                                    >
                                        {col.label}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {paginated.map((row, rowIndex) => (
                            <TableRow key={rowIndex} sx={{ backgroundColor: rowIndex % 2 === 0 ? "grey.300" : "white" }}>
                                <TableCell>{rowIndex+1}</TableCell>
                                {columns.map((col) => (
                                    <TableCell key={col.key}>
                                        {col.render ? col.render(row) : row[col.key] ?? "N/A"}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* pagination */}
            <TablePagination
                component='div'
                count={sortedData.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={(e, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                }}
                rowsPerPageOptions={[rowsCount*1, rowsCount*2, rowsCount*4, rowsCount*10]}
            />
        </Paper>
    )
}

export default FullTable
