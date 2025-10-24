import { api } from "@/utils/apiClient";
import { getAuth } from "@react-native-firebase/auth";
import * as SecureStore from "expo-secure-store";
import { removeFCMToken, updateFCMToken } from "@/utils/notification";
import messaging from "@react-native-firebase/messaging";

export default async function login(email: string, password: string) {
  try {
    const { data } = await api.post("/auth/login", {
      email: email,
      password: password,
    });

    const user = data.user;

    await SecureStore.setItemAsync("token", data.token);
    await SecureStore.setItemAsync("id", user.id);
    await SecureStore.setItemAsync("email", user.email);
    await SecureStore.setItemAsync("role", user.role);
    await SecureStore.setItemAsync("name", user.name);
    await SecureStore.setItemAsync("firstname", user.firstname);
    await SecureStore.setItemAsync("photo_url", user.photo_url);
    await SecureStore.setItemAsync("gradeLevel", user.gradeLevel);
    await SecureStore.setItemAsync("studentid", user.studentid ?? null);

    return data;
  } catch (error: any) {
    throw new Error(`Login failed: ${error.message}`);
  }
}

export async function verify() {
  try {
    const res = await api.post("/auth/verify", {});

    return res.data;
  } catch (error: any) {
    throw new Error(`Login failed: ${error.message}`);
  }
}

export async function logout() {
  try {
    const res = await api.post("/auth/logout", {});

    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("id");
    await SecureStore.deleteItemAsync("email");
    await SecureStore.deleteItemAsync("role");
    await SecureStore.deleteItemAsync("name");
    await SecureStore.deleteItemAsync("firstname");
    await SecureStore.deleteItemAsync("photo_url");
    await SecureStore.deleteItemAsync("gradeLevel");
    await SecureStore.deleteItemAsync("studentid");

    return res.data;
  } catch (error: any) {
    throw new Error(`Login failed: ${error.message}`);
  }
}

export async function requestOtp() {
  try {
    const { data } = await api.post(`/sent-verification`);
    return data;
  } catch (err: any) {
    if (err.response) {
      return err.response.status;
    } else if (err.request) {
      return { error: "No response from server" };
    } else {
      return { error: err.message };
    }
  }
}

export async function VerifyOtpCode(OTPCode: number) {
  try {
    const { data } = await api.post(`/verify/otp`, {
      otp_code: OTPCode,
    });
    return data;
  } catch (err: any) {
    if (err.response) {
      return err.response.status;
    } else if (err.request) {
      return { error: "No response from server" };
    } else {
      return { error: err.message };
    }
  }
}
