import axiosClient from "../axiosClient";

// All public endpoints — no auth required
const publicAPI = {
  // Lists
  getInstituteList: ()            => axiosClient.get("/public/institute_list"),
  getCompanyList:   ()            => axiosClient.get("/public/company_list"),

  // Detailed profiles (public, read-only version)
  getInstituteProfile: (id)       => axiosClient.get(`/public/institute/${id}`),
  getCompanyProfile:   (id)       => axiosClient.get(`/public/company/${id}`),

  // Platform-wide transparency stats
  getPlatformStats: ()            => axiosClient.get("/public/stats"),
};

export default publicAPI;
