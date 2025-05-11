import * as SecureStore from 'expo-secure-store';
import { api } from '@/utils/apiClient';

export default async function login(email, password) {
    try {
      const response = await fetch("http://192.168.254.169:8001/api/user-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({email: email, password: password }),
      });

      const userData = await  response.json();

      const sessionData = {
        sessionId: userData.session_id,
        userId: userData.user.uid,
        role: userData.user.role,
        email: userData.user.email,
        name: userData.user.name,
      };

      await SecureStore.setItemAsync('sessionData', JSON.stringify(sessionData));

      return response.status;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  }

  export async function logout() {
    const {response} = await api.get("/validate/token");

    await SecureStore.deleteItemAsync('sessionData')
    return response
  }

export async function verifyToken() {
  try {
    // call your endpoint; axios will return parsed JSON in `response.data`
    const {data} = await api.get("/validate/token");

    const sessionData = await SecureStore.getItemAsync("sessionData")

    if (!sessionData) {
      console.warn('No sessionData found')
      return false
    }

    const { userId } = JSON.parse(sessionData)
    return data.user_id === userId
  } catch (error) {
    console.error("Error during token validation:", error);
    return null;
  }
}