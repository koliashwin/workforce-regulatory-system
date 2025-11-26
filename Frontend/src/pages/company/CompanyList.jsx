import React, { useEffect, useState } from 'react'
import companyAPI from '../../api/modules/companyAPI';
import { Box, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';

const CompanyList = () => {
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        companyAPI.companyList()
            .then(res => setCompanies(res.data))
            .catch(err => console.log(err))
    }, []);

    return (
        <Box>
            <Typography variant='h5'>
                Companies
            </Typography>

            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Sr. no.</TableCell>
                            <TableCell>Company Name</TableCell>
                            <TableCell>Company Email</TableCell>
                            <TableCell>Contact No.</TableCell>
                            <TableCell>CIN</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Verfy Status</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {/* populate data in state variable */}
                        {companies.map((comp, i) => (
                            <TableRow key={comp.cin}>
                                <TableCell>{i+1}</TableCell>
                                <TableCell>{comp.name}</TableCell>
                                <TableCell>{comp.email}</TableCell>
                                <TableCell>{comp.contact_no}</TableCell>
                                <TableCell>{comp.cin}</TableCell>
                                <TableCell>{comp.address}</TableCell>
                                <TableCell>{comp.verification_status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    )
}

export default CompanyList
