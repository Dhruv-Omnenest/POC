import { create } from 'zustand';
import type { HandshakeResponse, UserProfile } from '../types/auth';
import { loginUser, preAuthHandShake, validateOtp, removeLargeToken, getAuthToken } from '../api/auth.api';

interface AuthState {
    user: Omit<UserProfile, 'jwtTokens'> | null;
    bffPublicKey: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    executeHandshake: () => Promise<void>;
    executeLogin: (username: string, password: string) => Promise<void>;
    executeOtpValidation: (username: string, otp: number) => Promise<void>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    bffPublicKey: null,
    isAuthenticated: !!getAuthToken(),
    isLoading: false,
    error: null,

    executeHandshake: async () => {
        set({ isLoading: true, error: null });
        try {
            const data: HandshakeResponse = await preAuthHandShake();
            console.log(data);
            set({ bffPublicKey: data.bffPublicKey, isLoading: false });
        } catch (err: any) {
            set({ error: err.response?.data?.message || err.message || "Handshake failed", isLoading: false });
            throw err;
        }
    },

    executeLogin: async (username, password) => {
        set({ isLoading: true, error: null });
        try {
            await loginUser(username, password);
            set({ isLoading: false });
        } catch (err: any) {
            set({ error: err.response?.data?.message || err.message || "Invalid username or password", isLoading: false });
            throw err;
        }
    },

    executeOtpValidation: async (username, otp) => {
        set({ isLoading: true, error: null });
        try {
            const data: UserProfile = await validateOtp(username, otp);
            console.log(data);
            const { jwtTokens, ...userProfile } = data;

            set({
                user: userProfile,
                isAuthenticated: true,
                isLoading: false
            });
        } catch (err: any) {
            set({ error: err.response?.data?.message || err.message || "OTP validation failed", isLoading: false });
            throw err;
        }
    },
    logout: () => {
        removeLargeToken('auth_token');
        removeLargeToken('refresh_token');
        set({ user: null, isAuthenticated: false, bffPublicKey: null, error: null });
    },
}));