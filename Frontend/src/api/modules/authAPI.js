import axiosClient from "../axiosClient";

const authAPI = {
    login: (payload) => axiosClient.post("/auth/login", payload),
    // register: (payload) => axiosClient.post("/auth/register", payload),
};

export default authAPI;