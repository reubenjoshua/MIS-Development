const API_BASE_URL = 'http://localhost:5000';

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: `${API_BASE_URL}/api/auth/login`,
    },
    USER: {
        PROFILE: `${API_BASE_URL}/api/user/profile`,
        ALL: `${API_BASE_URL}/users`,
    },
    AREA: {
        ALL: `${API_BASE_URL}/areas`,
    },
    BRANCH: {
        ALL: `${API_BASE_URL}/branches`,
    },
    ROLE: {
        ALL: `${API_BASE_URL}/roles`,
    },
    REPORT: {
        DAILY: `${API_BASE_URL}/daily-reports`,
    }
};

export default API_BASE_URL; 