import axios from 'axios';
import API_BASE_URL, { API_ENDPOINTS } from '../config/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for handling cookies/sessions
});

// Request interceptor for adding auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth services
export const authService = {
    login: async (credentials) => {
        const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
        return response.data;
    },
    logout: async () => {
        const response = await api.post(API_ENDPOINTS.AUTH.LOGOUT);
        return response.data;
    },
    register: async (userData) => {
        const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
        return response.data;
    },
};

// User services
export const userService = {
    getProfile: async () => {
        const response = await api.get(API_ENDPOINTS.USER.PROFILE);
        return response.data;
    },
    updateProfile: async (userData) => {
        const response = await api.put(API_ENDPOINTS.USER.UPDATE, userData);
        return response.data;
    },
};

// Dashboard services
export const dashboardService = {
    getStats: async () => {
        const response = await api.get(API_ENDPOINTS.DASHBOARD.STATS);
        return response.data;
    },
};

export default api; 