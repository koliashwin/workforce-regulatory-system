import axios from "axios";

// connect with backend 
const axiosClient = axios.create({
    baseURL: "http://localhost:8000",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    }
});

// Check for token
axiosClient.interceptors.request.use(
    (config) => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            const { token } = JSON.parse(savedUser);
            if (token) config.headers.Authorization = `Bearer ${token}`;
        }
        // console.log(token)
        return config;
    },
    (error) => Promise.reject(error)
);

// error logging
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API ERROR : ", error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default axiosClient;