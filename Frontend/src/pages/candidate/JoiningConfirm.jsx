import React, { useState } from 'react'
import { Box, Button, TextField, Typography } from '@mui/material';
import candidateAPI from '../../api/modules/candidateAPI';

const JoiningConfirm = () => {
    const [form, setForm] = useState({
        "company_id": "",          // this should be fetched via query or localstorage
        "user_id": "",             // this should be fetched via query or localstorage
        "date": "",
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
            const res = await candidateAPI.joiningConfirm(form);
            console.log("Employee onboarded : ", res.data);
            console.log("Form Data : ", form);
            alert("Employee Onboarding complete");
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
                <TextField label="Company ID" name='company_id' fullWidth margin='normal' onChange={handleChange}/>
                <TextField label="Candidate ID" name='user_id' fullWidth margin='normal' onChange={handleChange}/>
                <TextField label="Joining Date (YYYY-MM-DD)" name='date' fullWidth margin='normal' onChange={handleChange}/>

                <Button variant='contained' type='submit' fullWidth sx={{mt: 2}}>
                    Submit
                </Button>
            </form>
        </Box>
    )
}

export default JoiningConfirm;
