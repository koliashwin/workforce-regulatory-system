import React, { useEffect, useState } from 'react'
import companyAPI from '../../api/modules/companyAPI';
import { Box, Typography } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import DataTable from '../../components/DataTable';

const EmployeeList = () => {
    const [emoloyees, setEmployees] = useState([]);

    const employeeListColumns = [
        { label: "Name", key: "user_name" },
        { label: "Email", key: "user_email" },
        { label: "Contact", key: "user_contact" },
        { label: "Company", key: "company_name"},
        { label: "CIN", key: "cin"},
        { label: "Joining Date", key: "joining_date"},
        { label: "Exit Date", key: "exit_date"},
        { label: "Emp. Status", key: "employment_status"},

    ]

    useEffect(() => {
        companyAPI.employeeList()
            .then(res => setEmployees(res.data))
            .catch(err => console.log(err))
    }, []);

    return (
        <Box>
            <Typography variant="h3" sx={{ mb: 0.5 }}>All Employees</Typography>
            <DataTable
                // title="All Employees"
                data={emoloyees}
                columns={employeeListColumns}
                emptyText='No employees exist yet. you can start onboarding process in onboarding section'
            />
        </Box>
    )
}

export default EmployeeList
