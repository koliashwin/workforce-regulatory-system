import React, { useState } from 'react'
import { Box, Button, TextField, Typography } from '@mui/material';
import companyAPI from '../../api/modules/companyAPI';

const OnboardEmployee = () => {
    const [form, setForm] = useState({
        "company_cin": "",          // this should be fetched via query or localstorage
        "user_email": "",
        "designation": "",
        "joining_date": "",

        // extra fields
        "exit_date": "2025-11-25",                  
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
            const res = await companyAPI.onboardEmployee(form);
            console.log("Employee onboarded : ", res.data);
            console.log("Form Data : ", form);
            alert("Employee Created successfully");
        } catch (error) {
            console.log(error);
            alert("Failed to onboard Employee");
        }
    }

    return (
        <Box sx={{maxWidth: 500}}>
            <Typography variant='h5' sx={{mb: 2}}>
                Onboard Employee
            </Typography>

            <form onSubmit={handleSubmit}>
                <TextField label="CIN" name='company_cin' fullWidth margin='normal' onChange={handleChange}/>
                <TextField label="Employee Email" name='user_email' fullWidth margin='normal' onChange={handleChange}/>
                <TextField label="Designation/Role" name='designation' fullWidth margin='normal' onChange={handleChange}/>
                <TextField label="Joining (YYYY-MM-DD)" name='joining_date' fullWidth margin='normal' onChange={handleChange}/>

                <Button variant='contained' type='submit' fullWidth sx={{mt: 2}}>
                    Submit
                </Button>
            </form>
        </Box>
    )
}

export default OnboardEmployee;
