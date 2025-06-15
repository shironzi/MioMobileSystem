import { api } from "@/utils/apiClient";
import { getAuth } from "@react-native-firebase/auth";

const IPADDRESS = process.env.EXPO_PUBLIC_IP_ADDRESS;

export async function updateFCMToken(student_id: string, token: string) {
  try {
    const { data } = await api.post(`/updateFCMToken/${student_id}`, {
      token: token,
    });

    console.log(token);

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function removeFCMToken(student_id: string) {
  try {
    const { data } = await api.put(`/removeFCMToken/${student_id}`);

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
