import React, { useEffect, useState } from 'react'
import companyAPI from '../../api/modules/companyAPI';
import { Box, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';

const EmployeeList = () => {
    const [emoloyees, setEmployees] = useState([]);

    useEffect(() => {
        companyAPI.employeeList()
            .then(res => setEmployees(res.data))
            .catch(err => console.log(err))
    }, []);

    return (
        <Box>
            <Typography variant='h5'>
                Employee List
            </Typography>

            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Sr. no.</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Contact No.</TableCell>
                            <TableCell>Company</TableCell>
                            <TableCell>CIN</TableCell>
                            <TableCell>Company Joined</TableCell>
                            <TableCell>Company Left</TableCell>
                            <TableCell>Emp Status</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {/* populate data in state variable */}
                        {emoloyees.map((emp, i) => (
                            <TableRow key={i+1}>
                                <TableCell>{i+1}</TableCell>
                                <TableCell>{emp.user_name}</TableCell>
                                <TableCell>{emp.user_email}</TableCell>
                                <TableCell>{emp.user_contact}</TableCell>
                                <TableCell>{emp.company_name}</TableCell>
                                <TableCell>{emp.cin}</TableCell>
                                <TableCell>{emp.joining_date}</TableCell>
                                <TableCell>{emp.exit_date}</TableCell>
                                <TableCell>{emp.employment_status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    )
}

export default EmployeeList
