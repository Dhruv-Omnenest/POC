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


export const forgetUser = async (panNumber: string, emailId: string) => {
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


export const getAuthToken = (): string | null => {
    return localStorage.getItem('auth_token');
};

export const logoutUser = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
};