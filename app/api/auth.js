import validation from "validator"

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
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = response.json()
      return data;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  }