import { Box, Button, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom';
import { Password } from '@mui/icons-material';
import authAPI from '../../api/modules/authAPI';

const redirectMap = {
    candidate: "/candidate",
    institute: "/institute",
    company: "/company",
    admin: "/admin",
};

const Login = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    // check if user alredy exist 
    // if yes then navigate to relevent landing page
    useEffect(() => {
        if (user?.role) {
            navigate(redirectMap[user.role])
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    // verify login credential and update the localStorage
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await authAPI.login({
                email: form.email,
                password: form.password
            })
            console.log("login Api response : ", res.data);

            const userData = {
                role: res.data.role,
                user_id: res.data.user_id,
                company_id: res.data.company_id,
                institute_id: res.data.institute_id
            }

            login(userData)
        } catch (err) {
            console.error("Login error : ", err);
            alert("Invalid credentials")
        }
    }

    return (
        <Box sx={{ maxWidth: 400, m: 'auto', mt: 10 }}>
            <Typography variant='h4' align='center' sx={{ mb: 3 }}>Login</Typography>
            <form onSubmit={handleLogin}>
                <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    margin="normal"
                    value={form.email}
                    onChange={handleChange}
                    required
                />

                <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    margin="normal"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
                <Button type='submit' fullWidth variant='contained'>Login</Button>
            </form>
        </Box>
    )
}

export default Login
