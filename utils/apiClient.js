import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

const IPADDRESS = process.env.EXPO_PUBLIC_IP_ADDRESS;

export const api = axios.create({
  baseURL: `${IPADDRESS}`,
  timeout: 600000,
});

api.interceptors.request.use(
  async (config) => {
    const sessionId = await SecureStore.getItemAsync("token");

    if (sessionId) {
      if (!config.headers) config.headers = {};
      config.headers.Authorization = `Bearer ${sessionId}`;
    }

    if (!config.headers["Content-Type"]) {
      if (config.data instanceof FormData) {
        config.headers["Content-Type"] = "multipart/form-data";
      } else {
        config.headers["Content-Type"] = "application/json";
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // unauthorized remove saved credentials
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("id");
      await SecureStore.deleteItemAsync("email");
      await SecureStore.deleteItemAsync("role");
      await SecureStore.deleteItemAsync("name");
      await SecureStore.deleteItemAsync("firstname");
      await SecureStore.deleteItemAsync("photo_url");
      await SecureStore.deleteItemAsync("gradeLevel");
      await SecureStore.deleteItemAsync("studentid");

      router.replace("/");
    }

    if (!error.response) {
      // Server didn’t respond at all
      return Promise.reject({
        status: 500,
        message: "No response from server",
      });
    }

    // Forward the original error response
    return Promise.reject(error.response);
  },
);
