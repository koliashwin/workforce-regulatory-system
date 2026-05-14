import React, { useState } from 'react'
import companyAPI from '../../api/modules/companyAPI';
import { Box, Button, TextField, Typography } from '@mui/material';

const RegisterCompany = () => {
    const [form, setForm] = useState({
        "user_name": "",
        "name": "",
        "cin": "",
        "address": "",
        "contact_no": "",
        "email": "",

        // extra field (need to removed in next version)
        "verification_status": "string"
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
            const res = await companyAPI.registerCompany(form);
            
            alert("Company Created successfully");
        } catch (error) {
            console.log(error);
            alert("Failed to register company");
        }
    }

    return (
        <Box sx={{maxWidth: 500}}>
            <Typography variant='h5' sx={{mb: 2}}>
                Register Company
            </Typography>

            <form onSubmit={handleSubmit}>
                <TextField label="CIN" name='cin' fullWidth margin='normal' onChange={handleChange}/>
                <TextField label="Company Name" name='name' fullWidth margin='normal' onChange={handleChange}/>
                <TextField label="Company User" name='user_name' fullWidth margin='normal' onChange={handleChange}/>
                <TextField label="Email" name='email' fullWidth margin='normal' onChange={handleChange}/>
                <TextField label="Contact No." name='contact_no' fullWidth margin='normal' onChange={handleChange}/>
                <TextField label="Address" name='address' fullWidth margin='normal' onChange={handleChange}/>

                <Button variant='contained' type='submit' fullWidth sx={{mt: 2}}>
                    Submit
                </Button>
            </form>
        </Box>
    )
}

export default RegisterCompany
