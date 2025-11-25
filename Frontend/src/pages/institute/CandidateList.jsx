import React, { useEffect, useState } from 'react'
import instituteAPI from '../../api/modules/instituteAPI';
import { Box, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';

const CandidateList = () => {
    const [candidates, setCandidates] = useState([]);

    useEffect(() => {
        instituteAPI.getCandidateList()
            .then(res => setCandidates(res.data))
            .catch(err => console.log(err))
    }, []);

    return (
        <Box>
            <Typography variant='h5'>
                Candidate List
            </Typography>

            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>User ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Course</TableCell>
                            <TableCell>Skills</TableCell>
                            <TableCell>Institiute</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {/* populate data in state variable */}
                        {candidates.map((c) => (
                            <TableRow key={c.user_id}>
                                <TableCell>{c.user_id}</TableCell>
                                <TableCell>{c.user_name}</TableCell>
                                <TableCell>{c.user_email}</TableCell>
                                <TableCell>{c.course}</TableCell>
                                <TableCell>{c.skills}</TableCell>
                                <TableCell>{c.institute_name}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    )
}

export default CandidateList
