import axiosClient from "../axiosClient";

// All public endpoints — no auth required
const publicAPI = {
    // Lists
    getInstituteList: () => axiosClient.get("/public/institute_list"),
    getCompanyList: () => axiosClient.get("/public/company_list"),

    // Detailed profiles (public, read-only version)
    getInstituteProfile: (id) => axiosClient.get(`/public/institute/${id}`),
    getCompanyProfile: (id) => axiosClient.get(`/public/company/${id}`),

    // Platform-wide transparency stats
    getPlatformStats: () => axiosClient.get("/public/stats"),

    registerCompany: (data) => axiosClient.post('/public/register/company', data),
    registerInstitute: (data) => axiosClient.post('/public/register/institute', data),
    verifyCin: (cin) => axiosClient.post(`/public/verify/company?cin=${cin}`),
};

export default publicAPI;
