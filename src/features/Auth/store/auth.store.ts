import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UserProfile } from '../types/auth';

interface AuthState {
  user: Omit<UserProfile, 'jwtTokens'> | null;
  bffPublicKey: string | null;
  isAuthenticated: boolean;
  error: string | null;
  setAuth: (user: Omit<UserProfile, 'jwtTokens'> | null) => void;
  setPublicKey: (key: string | null) => void;
  setError: (error: string | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      bffPublicKey: null,
      isAuthenticated: false,
      error: null,
      setAuth: (user) => 
        set({ 
          user, 
          isAuthenticated: !!user, 
          error: null 
        }),
      
      setPublicKey: (bffPublicKey) => set({ bffPublicKey }),
      setError: (error) => set({ error }),
      clearAuth: () => {
        set({ 
          user: null, 
          isAuthenticated: false, 
          bffPublicKey: null, 
          error: null 
        });
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