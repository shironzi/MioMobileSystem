import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://192.168.254.169:8001/api',
    headers: { Accept: 'application/json' },
    timeout: 10_000,
});

api.interceptors.request.use(
    async (config) => {
        const raw = await SecureStore.getItemAsync('sessionData');
        if (raw) {
            const session = JSON.parse(raw);
            const token = session.sessionId;

            // correctly merge into headers
            config.headers = {
                ...(config.headers || {}),
                Authorization: `Bearer ${token}`,
            };
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    response => response,
    async  error => {
        if (error.response?.status === 401) {
            await SecureStore.deleteItemAsync('sessionData');
        }
        return Promise.reject(error);
    }
);