import axios from "axios";

const backend_url = import.meta.env.VITE_BACKEND_URL
console.log(backend_url)
// connect with backend 
const axiosClient = axios.create({
    baseURL: backend_url,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    }
});

// Check for token
axiosClient.interceptors.request.use(
    (config) => {
        // const savedUser = localStorage.getItem('user');
        // if (savedUser) {
        //     const { token } = JSON.parse(savedUser);
        //     if (token) config.headers.Authorization = `Bearer ${token}`;
        // }

        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user?.access_token) {
            config.headers.Authorization =`Bearer ${user.access_token}`
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
        if (error.response?.status === 401) {
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        console.error("API ERROR : ", error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default axiosClient;