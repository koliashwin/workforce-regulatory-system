import React, { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material';
import adminAPI from '../../api/modules/adminAPI';
import DataTable from '../../components/DataTable';

const CompanyList = () => {
    const [companies, setCompanies] = useState([]);

    const companyListColumns = [
        { label: "Company Name", key: "name" },
        { label: "Company Email", key: "email" },
        { label: "Contact", key: "contact" },
        { label: "CIN", key: "cin" },
        { label: "Address", key: "address" },
        { label: "Verify Status", key: "verification_status" },
    ]
    
    useEffect(() => {
        adminAPI.allCompanyList()
            .then(res => setCompanies(res.data))
            .catch(err => console.log(err))
    }, []);

    return (
        <Box>
            <Typography variant="h3" sx={{ mb: 0.5 }}>All Companies</Typography>
            <DataTable
                // title="All Comapanies"
                data={companies}
                columns={companyListColumns}
                emptyText='No companies exist yet'
            />

        </Box>
    )
}

export default CompanyList
