import api from "./axios.api.js";

export const adminDashboardStats = (adminId) => {
    return api.get(`dashboard/admin/${adminId}`);
}

export const clientDashboardStats = (clientId) => {
    return api.get(`dashboard/client/${clientId}`);
}

export const freelancerDashboardStats = (freelancerId) => {
    return api.get(`dashboard/freelancer/${freelancerId}`);
}