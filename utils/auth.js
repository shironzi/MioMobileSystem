import * as SecureStore from 'expo-secure-store';

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
  try {
    const response = await fetch("http://192.168.254.169:8001/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await SecureStore.getItemAsync("sessionData")}`
      },
    });

    console.log(await SecureStore.getItemAsync("sessionData"))

    if (!response.ok) {
      throw new Error(`Logout failed with status ${response.status}`);
    }

    await SecureStore.deleteItemAsync("sessionData");
    return true;
  } catch (error) {
    console.error("Error during logout:", error);
    throw error;
  }
}