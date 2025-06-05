import { getAuth } from "@react-native-firebase/auth";
import axios from "axios";

const IPADDRESS = process.env.EXPO_PUBLIC_IP_ADDRESS;

console.log(IPADDRESS);

export const api = axios.create({
  baseURL: `${IPADDRESS}`,
  headers: { Accept: "application/json" },
  timeout: 10_000,
});

api.interceptors.request.use(
  async (config) => {
    const sessionId = await getAuth().currentUser?.getIdToken(true);
    if (sessionId) {
      if (!config.headers) config.headers = {};
      config.headers.Authorization = `Bearer ${sessionId}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// api.interceptors.response.use(
//     response => response,
//     async error => {
//         return Promise.reject(error);
//     }
// );
