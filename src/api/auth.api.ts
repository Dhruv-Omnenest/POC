import { apiClient } from "./axios"
export const preAuthHandShake = async () => {
    try {
        const payload = {
            devicePublicKey: "LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0NCk1Gd3dEUVlKS29aSWh2Y05BUUVCQlFBRFN3QXdTQUpCQUxmQUp0Uy9ZcjVWSCtNUTVUZmkvTG1zNUZldDNMM3g2SUNYMW9zME15RWpjUC9ldmFGdFYrZkJOTTBKRG5WQ3h3alZwRkNHaElybkt1S3d1Y2pUUndrQ0F3RUFBUT09DQotLS0tLUVORCBQVUJMSUMgS0VZLS0tLS0=",
        }
        const response = await apiClient.post(
            '/v1/api/auth/pre-auth-handshake',
            payload
        )
        return response.data;
    }
    catch (error: any) {
        if (error.response) {
            console.error("Handshake Error Details:", error.response.data);
        }
        throw error;
    }
}
export const loginUser = async (username: string, password: string) => {
    try {
        const payload = {
            username,
            password
        }
        const response = await apiClient.post(
            '/v1/api/auth/login',
            payload
        )
        return response.data;
    }
    catch (error: any) {
        if (error.response) {
            console.error("Login Api Failed:", error.response.data);
        }
        throw error;
    }
}


export const validateOtp = async (username: string, otp: number) => {
    try {
        const payload = {
            username,
            otp
        }
        const response = await apiClient.post(
            '/v2/api/auth/validate-otp',
            payload
        )

        const token = response.data.jwtTokens;
       localStorage.setItem('auth_token', token.accessToken);
        localStorage.setItem('refresh_token', token.refreshToken);
        return response.data;
    }
    catch (error: any) {
        if (error.response) {
            console.error("Login Api Failed:", error.response.data);
        }
        throw error;
    }
}


export const forgotUser = async (panNumber: string, emailId: string) => {
    try {
        const payload = {
            panNumber,
            emailId
        }
        const response = await apiClient.post(
            'v1/api/auth/forgot-user-id',
            payload
        )
        return response.data;
    }
    catch (error: any) {
        if (error.response) {
            console.error("Forget User Id Failed:", error.response.data);
        }
        throw error;
    }
}

export const forgotPassword = async (panNumber: string, username: string) => {
    try {
        const payload = {
            panNumber,
            username
        }
        const response = await apiClient.post(
            '/v1/api/auth/forgot-password',
            payload
        )
        return response.data;
    }
    catch (error: any) {
        if (error.response) {
            console.error("Forget Password Failed:", error.response.data);
        }
        throw error;
    }
}

export const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
        const payload = {
            oldPassword,
            newPassword
        }
        const response = await apiClient.post(
            'v1/api/auth/change-password ',
            payload
        )
        return response.data;
    }
    catch (error: any) {
        if (error.response) {
            console.error("Change Password Failed:", error.response.data);
        }
        throw error;
    }
}
export const setPassword = async (username: string, password: string) => {
    try {
        const payload = {
            username,
            password
        };
        const response = await apiClient.post(
            '/v1/api/auth/set-password',
            payload
        );
        return response.data;
    }
    catch (error: any) {
        if (error.response) {
            console.error("Set Password API Failed:", error.response.data);
        }
        throw error;
    }
};


export const unblockUser = async (panNumber: string, username: string) => {
  try{  const response = await apiClient.post('/v1/api/auth/unblock-user', { panNumber, username });
    return response.data;
}
 catch (error: any) {
        if (error.response) {
            console.error("Set Password API Failed:", error.response.data);
        }
        throw error;
    }
};

export const authenticateOtp = async (username: string, otp: number) => {
   try{ const response = await apiClient.post('/v1/api/auth/authenticate-otp', {
        username,
        otp,
        isUserBlocked: true
    });
    return response.data;
}
catch (error: any) {
        if (error.response) {
            console.error("Set Password API Failed:", error.response.data);
        }
        throw error;
    }
};
export const getAuthToken = (): string | null => {
    return localStorage.getItem('auth_token');
};

export const logoutUser = async () => {
  try {
    await apiClient.get('v1/api/auth/logout');
  } catch (error: any) {
    console.error("Logout API signaled an error, proceeding with local cleanup:", error.message);
  } finally {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  }
};