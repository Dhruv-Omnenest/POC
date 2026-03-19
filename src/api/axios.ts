import axios from "axios";
import { getHeaders } from "../utils/requestHeaders";
import { addTokenInterceptor, errorInterceptor } from "./interceptors";


export const apiClient = axios.create(
    {
        baseURL:import.meta.env.BASE_URL,
        headers:getHeaders()
    }
)
apiClient.interceptors.request.use(addTokenInterceptor);
apiClient.interceptors.response.use((response) => response, errorInterceptor);