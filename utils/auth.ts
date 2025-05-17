import { getAuth } from "@react-native-firebase/auth";
import * as SecureStorage from 'expo-secure-store';

export default async function login(email: string, password: string) {
  try {
    const auth = getAuth();

    const userCredential = await auth.signInWithEmailAndPassword(
      email,
      password
    );

    const user = userCredential.user;

    const token = await user.getIdToken();

    await SecureStorage.setItemAsync('sessionId', token);

    return { status: "success" }
  } catch (error: any) {
    throw new Error(`Login failed: ${error.message}`);
  }
}
