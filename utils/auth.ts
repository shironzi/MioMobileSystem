import { api } from "@/utils/apiClient";
import { getAuth } from "@react-native-firebase/auth";
import * as SecureStore from "expo-secure-store";
import { removeFCMToken, updateFCMToken } from "@/utils/notification";
import messaging from "@react-native-firebase/messaging";

export default async function login(email: string, password: string) {
  try {
    const auth = getAuth();
    await auth.signInWithEmailAndPassword(email, password);
    const user = auth.currentUser;

    console.log(user);

    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      const fcmToken = await messaging().getToken();
      if (fcmToken && user?.uid) {
        await updateFCMToken(user?.uid, fcmToken);
      }
    }

    try {
      const { data } = await api.post(`/sent-verification`);
      return { status: "success" };
    } catch (err: any) {
      if (err.response) {
        return err.response.status;
      } else if (err.request) {
        return { error: "No response from server" };
      } else {
        return { error: err.message };
      }
    }
  } catch (error: any) {
    throw new Error(`Login failed: ${error.message}`);
  }
}

export async function logout() {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user?.uid) {
      await removeFCMToken(user?.uid);
    }

    await getAuth().signOut();
    await SecureStore.deleteItemAsync("sessionId");

    delete api.defaults.headers.common.Authorization;
  } catch (error: any) {
    throw new Error(`Logout failed: ${error.message}`);
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
