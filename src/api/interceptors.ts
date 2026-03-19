

import type { InternalAxiosRequestConfig } from "axios";

export const addTokenInterceptor = (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
};

export const errorInterceptor = (error: any) => {
    if (error.response && error.response.status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login'; 
    }
    return Promise.reject(error);
};