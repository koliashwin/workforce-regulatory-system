import axiosClient from "../axiosClient";

const candidateAPI = {
    getProfile: (id) => axiosClient.get(`candidates/view_profile?user_id=${id}`),
    exitConfirm: (payload) => axiosClient.post("candidates/exit_confirm", payload),
    joiningConfirm: (payload) => axiosClient.post("candidates/joining_confirm", payload),
    disputeList: () =>axiosClient.get("candidates/disputes_list")
};

export default candidateAPI;