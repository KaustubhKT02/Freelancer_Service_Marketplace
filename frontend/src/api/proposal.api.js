import api from "./axios.api.js";

export const Propsal = async (data) => {
    return await api.post('proposals/', data);
}

export const getMyProposals = async () => {
    return await api.get('proposals/my');
}

export const getProposalForProject = async (projectId) => {
    return await api.get(`proposals/project/${projectId}`);
}

export const updateProposalStatus = async (proposalId, status) => {
    return await api.put(`proposals/${proposalId}/status`, status);
}