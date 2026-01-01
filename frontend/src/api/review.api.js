import api from "./axios.api.js";

export const createReview =  (projectId, data) =>{
    return api.post(`reviews/create/${projectId}`, data);
}

export const getFreelancerReviews = (freelanceId) => {
    return api.get(`reviews/freelancer/${freelanceId}`);
}

export const getProjectReviews = (projectId) => {
    return api.get(`reviews/project/${projectId}`);
}