import api from "./axios.api.js";

export const loginUser = (data) => {
    api.post('users/login', data);
}

export const registerUser = (data) => {
    api.post('users/register', data);
}

export const getProfile = () => {
    api.get('userscurrent_user');
}

export const logoutUser = () => {
    api.post('users/logout');
}

export const refreshToken = () => {
    api.post('users/refresh_token');
}

export const updatePassword = (data) => {
    api.post('users/update_password', data);
}

export const updateUser = (data) => {
    api.patch('users/update_user', data);
}

export const updateAvatar = (data) => {
    api.patch('users/update_avatar', data);
}


export const freelancerAccount = (data) => {
    api.post('/freelancer-account/setup', data)
};

 