import { getAuth  } from "@react-native-firebase/auth";
import * as SecureStore from 'expo-secure-store';

export default async function login(email: string, password: string) {
  try {
    const { user } = await getAuth().signInWithEmailAndPassword(email, password);
    const token = await user.getIdToken();

    await SecureStore.setItemAsync('sessionId', token);

    return { status: "success" }
  } catch (error: any) {
    throw new Error(`Login failed: ${error.message}`);
  }
}

export async function logout(){
  try{
    await getAuth().signOut();
    await SecureStore.deleteItemAsync('sessionId');

  }catch (error: any){
    throw new Error(`Logout failed: ${error.message}`);
  }
}
