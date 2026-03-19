import { useState, useCallback } from 'react';
import { useAuthStore } from '../store/auth.store';
import * as authApi from '../../../api/auth.api';

export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const store = useAuthStore();

    const handleError = useCallback((err: any, fallback: string) => {
        const message = err?.response?.data?.message || err?.message || fallback;
        store.setError(message);
    }, [store]);

    const clearError = useCallback(() => store.setError(null), [store]);

    const handleHandshake = async () => {
        setIsLoading(true);
        clearError();
        try {
            const data = await authApi.preAuthHandShake();
            store.setPublicKey(data.bffPublicKey);
        } catch (err) {
            handleError(err, "Connection handshake failed");
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

   const handleLogin = async (username: string, password: string) => {
    setIsLoading(true);
    clearError();
    try {
        await authApi.loginUser(username, password);
    } catch (err: any) {
        if (err?.response?.status === 423) {
            store.setError("USER_LOCKED");
        } else {
            handleError(err, "Invalid username or password");
        }
        throw err;
    } finally {
        setIsLoading(false);
    }
};

    const handleOtpValidation = async (identifier: string, otp: number) => {
        setIsLoading(true);
        clearError();
        try {
            const data = await authApi.validateOtp(identifier, otp);
            const { jwtTokens, ...userProfile } = data;
            store.setAuth(userProfile);
        } catch (err) {
            handleError(err, "OTP validation failed");
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotUserId = async (pan: string, email: string) => {
        setIsLoading(true);
        clearError();
        try {
            await authApi.forgotUser(pan, email);
        } catch (err) {
            handleError(err, "Could not process User ID request");
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async (pan: string, username: string) => {
        setIsLoading(true);
        clearError();
        try {
            await authApi.forgotPassword(pan, username);
        } catch (err) {
            handleError(err, "Could not process password reset request");
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangePassword = async (oldPass: string, newPass: string) => {
        setIsLoading(true);
        clearError();
        try {
            await authApi.changePassword(oldPass, newPass);
            console.log("i am there");
        } catch (err) {
            console.log("issues");
            handleError(err, "Password change failed");
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await authApi.logoutUser();
        } catch (err) {
            console.error("API Logout failed, clearing local session...", err);
        } finally {
            store.clearAuth();
            setIsLoading(false);
        }
    };

    const handleSetPassword = async (username: string, newPass: string) => {
        setIsLoading(true);
        clearError();
        try {
            await authApi.setPassword(username, newPass);
            console.log("Password set successfully");
        } catch (err) {
            handleError(err, "Failed to set new password");
            throw err;
        } finally {
            setIsLoading(false);
        }
    };


    const handleUnblockUser = async (pan: string, username: string) => {
    setIsLoading(true);
    clearError();
    try {
        await authApi.unblockUser(pan, username);
    } catch (err) {
        handleError(err, "Unblock request failed");
        throw err;
    } finally {
        setIsLoading(false);
    }

    
};


const handleUnblockOtpValidation = async (username: string, otp: number) => {
        setIsLoading(true);
        clearError();
        try {
            await authApi.authenticateUnblockOtp(username, otp);
        } catch (err) {
            handleError(err, "Unblock OTP validation failed");
            throw err;
        } finally {
            setIsLoading(false);
        }
    }


    return {
        isLoading,
        error: store.error,
        user: store.user,
        isAuthenticated: store.isAuthenticated,
        bffPublicKey: store.bffPublicKey,
        clearError,
        handleHandshake,
        handleLogin,
        handleOtpValidation,
        handleForgotUserId,
        handleForgotPassword,
        handleChangePassword,
        handleLogout,
        handleSetPassword,
        handleUnblockUser,
        handleUnblockOtpValidation,
    };
};