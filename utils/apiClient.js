import { getAuth } from "@react-native-firebase/auth";
import axios from "axios";

const IPADDRESS = process.env.EXPO_PUBLIC_IP_ADDRESS;

export const api = axios.create({
  baseURL: `${IPADDRESS}`,
  headers: { Accept: "application/json" },
  timeout: 600000,
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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      return Promise.reject({ status: 408, message: "Request timed out" });
    }

    if (error.response) {
      return Promise.reject(error.response);
    } else if (error.request) {
      return Promise.reject({
        status: 500,
        message: "No response from server",
      });
    } else {
      return Promise.reject({ status: 500, message: error.message });
    }
  },
);
