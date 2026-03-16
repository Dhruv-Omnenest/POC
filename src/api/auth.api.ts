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


export const setLargeToken = (name: string, value: string) => {
    localStorage.setItem(name, value);
};

export const getLargeToken = (name: string): string | null => {
    return localStorage.getItem(name);
};

export const removeLargeToken = (name: string) => {
    localStorage.removeItem(name);
};

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

        // The backend API actually returns `userToken` instead of `accessToken`
        // We will aggressively search for it to ensure the cookie is set regardless of nesting
        const jwtObj = response.data?.jwtTokens || response.data?.data?.jwtTokens || response.data;
        const accessToken = jwtObj?.userToken || jwtObj?.accessToken || response.data?.userToken;
        const refreshToken = jwtObj?.refreshToken || response.data?.refreshToken;

        console.log("Extracted Tokens to Set:", { accessToken: !!accessToken, refreshToken: !!refreshToken });

        if (accessToken) {
            setLargeToken('auth_token', accessToken);
        }

        if (refreshToken) {
            setLargeToken('refresh_token', refreshToken);
        }

        return response.data;
    }
    catch (error: any) {
        if (error.response) {
            console.error("Login Api Failed:", error.response.data);
        }
        throw error;
    }
}

export const getAuthToken = (): string | null => {
    return getLargeToken('auth_token');
};