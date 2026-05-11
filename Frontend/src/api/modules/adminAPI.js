import axiosClient from "../axiosClient";

const adminAPI = {
    allEmployeeHistory: () => axiosClient.get("/admin/employee_list"),
    allCompanyList: () => axiosClient.get("/admin/company_list"),
    allCandidateList: () => axiosClient.get("/admin/candidate_list"),
    allInstituteList: () => axiosClient.get("/admin/institute_list"),
    disputeList: () => axiosClient.get("/admin/disputes_list"),
    updateDispute: (id, status, note) =>
        axiosClient.put(`/admin/disputes/${id}`, { status, resolution_note: note }),

}

export default adminAPI;