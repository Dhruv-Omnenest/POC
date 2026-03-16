import { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { apiClient } from "./axios";
import { getHeaders } from "../utils/requestHeaders";
import { useAuthStore } from "../store/auth.store";
import { getAuthToken, setLargeToken } from "./auth.api";
import { addSubscriber, processQueue } from "../utils/authQueue";
import Cookies from "js-cookie";

let isRefreshing = false;

apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Generate dynamic headers for timestamp and xRequestId
        const dynamicHeaders = getHeaders();

        Object.entries(dynamicHeaders).forEach(([key, value]) => {
            if (value) {
                config.headers.set(key, value);
            }
        });

        // Attach Auth token if available
        const token = getAuthToken();
        if (token) {
            config.headers.set('Authorization', `Bearer ${token}`);
        }

        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (!error.response) {
            return Promise.reject(error);
        }

        // 401 Unauthorized handling
        if (error.response.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Return a promise that resolves when the token is refreshed
                return new Promise((resolve, reject) => {
                    addSubscriber((token: string | null) => {
                        if (token) {
                            originalRequest.headers.set('Authorization', `Bearer ${token}`);
                            resolve(apiClient(originalRequest));
                        } else {
                            reject(error);
                        }
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = Cookies.get('refresh_token');

                if (!refreshToken) {
                    throw new Error("No refresh token available");
                }

                // Call refresh endpoint directly using axios to avoid interceptor loop
                // Note: Replace '/v1/api/auth/refresh' with actual endpoint if different
                const response = await apiClient.post('/v1/api/auth/refresh', {
                    refreshToken
                }, {
                    headers: getHeaders()
                });

                const newAccessToken = response.data?.jwtTokens?.userToken || response.data?.userToken;
                const newRefreshToken = response.data?.jwtTokens?.refreshToken || response.data?.refreshToken;

                if (newAccessToken && newRefreshToken) {
                    setLargeToken('auth_token', newAccessToken);
                    setLargeToken('refresh_token', newRefreshToken);

                    isRefreshing = false;
                    processQueue(null, newAccessToken);

                    originalRequest.headers.set('Authorization', `Bearer ${newAccessToken}`);
                    return apiClient(originalRequest);
                } else {
                    throw new Error("Failed to get new tokens");
                }
            } catch (refreshError) {
                isRefreshing = false;
                processQueue(refreshError as Error, null);
                useAuthStore.getState().logout();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);
