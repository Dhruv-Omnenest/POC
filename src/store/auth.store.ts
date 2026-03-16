import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from "js-cookie";
import type { HandshakeResponse, UserProfile } from '../types/auth';
import { loginUser, preAuthHandShake, validateOtp } from '../api/auth.api';

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

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            bffPublicKey: null,
            isAuthenticated: !!Cookies.get('auth_token'),
            isLoading: false,
            error: null,

            executeHandshake: async () => {
                set({ isLoading: true, error: null });
                try {
                    const data: HandshakeResponse = await preAuthHandShake();
                    console.log(data);
                    set({ bffPublicKey: data.bffPublicKey, isLoading: false });
                } catch (err: any) {
                    set({ error: "Handshake failed", isLoading: false });
                    throw err;
                }
            },

            executeLogin: async (username, password) => {
                set({ isLoading: true, error: null });
                try {
                    await loginUser(username, password);         
                    set({ isLoading: false });
                } catch (err: any) {
                    set({ error: "Invalid username or password", isLoading: false });
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
                    set({ error: "OTP validation failed", isLoading: false });
                    throw err;
                }
            },
            logout: () => {
                Cookies.remove('auth_token');
                Cookies.remove('refresh_token');
                set({ user: null, isAuthenticated: false, bffPublicKey: null, error: null });
                localStorage.removeItem('auth-storage');
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ 
                user: state.user, 
                isAuthenticated: state.isAuthenticated 
            }),
        }
    )
);