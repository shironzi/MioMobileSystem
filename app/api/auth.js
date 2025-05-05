export default async function login(email, password) {
    try {
      const response = await fetch("http://192.168.254.171:8000/api/user-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  }

  export async function logout() {
    try {
      const response = await fetch("http://192.168.254.171:8000/api/logout", {
        method: "POST",
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  }