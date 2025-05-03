const API_BASE_URL = 'http://localhost:5000/api';

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: `${API_BASE_URL}/auth/login`,
        LOGOUT: `${API_BASE_URL}/auth/logout`,
        REGISTER: `${API_BASE_URL}/auth/register`,
    },
    USER: {
        PROFILE: `${API_BASE_URL}/user/profile`,
        UPDATE: `${API_BASE_URL}/user/update`,
    },
    DASHBOARD: {
        STATS: `${API_BASE_URL}/dashboard/stats`,
    }
};

export default API_BASE_URL; 