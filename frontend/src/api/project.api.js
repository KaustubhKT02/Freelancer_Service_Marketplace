import api from "./axios.api.js";

export const getAllProjects = () => {
    api.get(`projects/`);
}

export const getProjectById = (id) => {
    api.get(`/projects/${id}`);
}

export const createProject = (data) => {
    api.post('projects/', data);
}

export const updateProject = (id, data) => {
    api.put(`projects/update/${id}`, data);
}

export const deleteProject = (id) => {
    api.delete(`projects/delete/${id}`)
}

export const markProjectPaid = (projectId) => {
    api.patch(`projects/mark-paid/${projectId}`);
}

export const paymentLink = (projectId) => {
    api.get(`payments/direct/${projectId}`);
}

export const deliverProject = (projectId, data) => {
    api.post(`project-delivery/deliver/${projectId}`, data);
}

export const acceptDelivery = (projectId) => {
    api.post(`project-delivery/accept/${projectId}`);
}