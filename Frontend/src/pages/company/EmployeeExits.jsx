import React, { useState } from 'react'
import { Box, Button, TextField, Typography } from '@mui/material';
import companyAPI from '../../api/modules/companyAPI';
import { useAuth } from '../../context/AuthContext';

const EmployeeExits = () => {
    const { user } = useAuth();
    const [form, setForm] = useState({
        "company_id": user.company_id,          // this should be fetched via query or localstorage
        "user_email": "",
        "exit_date": "",

        // extra fields
        "company_cin": "",
        "designation": "",
        "joining_date": "2025-11-25",                  
        "status": "string"
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await companyAPI.employeeExits(form);
            console.log("Employee Exits Company : ", res.data);
            console.log("Form Data : ", form);
            alert("Employee Exit Initiated");
        } catch (error) {
            console.log(error);
            alert("Failed to initiate employee exit process");
        }
    }

    return (
        <Box sx={{maxWidth: 500}}>
            <Typography variant='h5' sx={{mb: 2}}>
                Employee Exits Company
            </Typography>

            <form onSubmit={handleSubmit}>
                <TextField label="Company ID" name='company_id' defaultValue={form.company_id} fullWidth margin='normal' disabled />
                <TextField label="Employee Email" name='user_email' fullWidth margin='normal' onChange={handleChange}/>
                <TextField label="Exit Date (YYYY-MM-DD)" name='exit_date' fullWidth margin='normal' onChange={handleChange}/>

                <Button variant='contained' type='submit' fullWidth sx={{mt: 2}}>
                    Submit
                </Button>
            </form>
        </Box>
    )
}

export default EmployeeExits;
