import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://192.168.254.169:8001/api',
    headers: { Accept: 'application/json' },
    timeout: 10_000,
});

api.interceptors.request.use(
    async (config) => {
        const sessionId = await SecureStore.getItemAsync("sessionId");
        if (sessionId) {
            if (!config.headers) config.headers = {};
            config.headers.Authorization = `Bearer ${sessionId}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// api.interceptors.response.use(
//     response => response,
//     async error => {
//         return Promise.reject(error);
//     }
// );