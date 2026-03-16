import Cookies from "js-cookie";
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


export const setLargeCookie = (name: string, value: string, options: any) => {
    const chunkSize = 3000;
    const numChunks = Math.ceil(value.length / chunkSize);
    Cookies.set(`${name}_chunks`, numChunks.toString(), options);

    for (let i = 0; i < numChunks; i++) {
        Cookies.set(`${name}_${i}`, value.substring(i * chunkSize, (i + 1) * chunkSize), options);
    }
};

export const getLargeCookie = (name: string): string | undefined => {
    const numChunksStr = Cookies.get(`${name}_chunks`);
    if (!numChunksStr) {
        return Cookies.get(name); // Fallback for small tokens
    }

    const numChunks = parseInt(numChunksStr, 10);
    let value = '';

    for (let i = 0; i < numChunks; i++) {
        const chunk = Cookies.get(`${name}_${i}`);
        if (!chunk) return undefined; // Incomplete token
        value += chunk;
    }
    return value;
};

export const removeLargeCookie = (name: string) => {
    const numChunksStr = Cookies.get(`${name}_chunks`);
    Cookies.remove(name); // standard fallback removal

    if (numChunksStr) {
        const numChunks = parseInt(numChunksStr, 10);
        Cookies.remove(`${name}_chunks`);
        for (let i = 0; i < numChunks; i++) {
            Cookies.remove(`${name}_${i}`);
        }
    }
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
            setLargeCookie('auth_token', accessToken, {
                expires: 1,
                path: '/'
            });
        }

        if (refreshToken) {
            setLargeCookie('refresh_token', refreshToken, {
                expires: 7,
                path: '/'
            });
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

export const getAuthToken = (): string | undefined => {
    return getLargeCookie('auth_token');
};