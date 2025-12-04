import React, { useEffect, useState } from 'react'
import companyAPI from '../../api/modules/companyAPI';
import { Box } from '@mui/material';
import FullTable from '../../components/FullTable';
import { useAuth } from '../../context/AuthContext';

const EmployeeList = () => {
    const [emoloyees, setEmployees] = useState([]);
    const { user } = useAuth();

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
        companyAPI.employeeList(user.company_id)
            .then(res => setEmployees(res.data))
            .catch(err => console.log(err))
    }, []);

    return (
        <Box>
            <FullTable
                title="All Employees"
                data={emoloyees}
                columns={employeeListColumns}
            />
        </Box>
    )
}

export default EmployeeList
