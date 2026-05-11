import axiosClient from "../axiosClient";

const candidateAPI = {
    // Profile
    getProfile:         ()     => axiosClient.get("/candidates/view_profile"),
    disputeList:        ()     => axiosClient.get("/candidates/disputes_list"),

    // Joining flow
    joiningConfirm:     (data) => axiosClient.post("/candidates/joining_confirm",   data),
    joiningDocuments:   (data) => axiosClient.post("/candidates/joining_documents", data),

    // Exit flow
    exitConfirm:        (data) => axiosClient.post("/candidates/exit_confirm",      data),
    exitDocuments:      (data) => axiosClient.post("/candidates/exit_documents",    data),
};

export default candidateAPI;