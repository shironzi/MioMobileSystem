import { api } from "@/utils/apiClient";

export async function getAnalyticsDashboard() {
  try {
    const { data } = await api.get(`/analytics/dashboard`);

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
