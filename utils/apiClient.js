import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

async function getSessionId(){
    return await SecureStore.getItemAsync("sessionId");
}

export const api = axios.create({
    baseURL: 'http://192.168.254.169:8001/api',
    headers: { Accept: 'application/json' },
    timeout: 10_000,
});

api.interceptors.request.use(
    async (config) => {
        const sessionId = await getSessionId()
        if(sessionId == null){
            const sessionId = await getSessionId()
            if (!config.headers) config.headers = {};
            config.headers.Authorization = `Bearer ${sessionId}`;
        }
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