import axios from "axios";
import { getHeaders } from "../utils/requestHeaders";


export const apiClient = axios.create(
    {
        baseURL:import.meta.env.BASE_URL,
        headers:getHeaders()
    }
)