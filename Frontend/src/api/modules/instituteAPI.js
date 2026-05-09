import axiosClient from "../axiosClient";

const instituteAPI = {
    getCandidateList: () => axiosClient.get(`/institute/candidate_list`),
    onboardStudent: (payload) => axiosClient.post("/institute/onboard_students", payload),
    instituteProfile: () => axiosClient.get(`/institute/view_profile`)
};

export default instituteAPI;