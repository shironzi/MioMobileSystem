import { api } from "@/utils/apiClient";
import { getAuth } from "@react-native-firebase/auth";
import * as SecureStore from 'expo-secure-store';

export default async function login(email: string, password: string) {
  try {
    await getAuth().signInWithEmailAndPassword(email, password);

    return { status: "success" }
  } catch (error: any) {
    throw new Error(`Login failed: ${error.message}`);
  }
}

export async function logout() {
  try {
    await getAuth().signOut();
    await SecureStore.deleteItemAsync('sessionId');

    delete api.defaults.headers.common.Authorization;
  } catch (error: any) {
    throw new Error(`Logout failed: ${error.message}`);
  }
}
