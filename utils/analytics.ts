import { api } from "@/utils/apiClient";

export async function getAnalyticsDashboard() {
  try {
    const { data } = await api.get(`/analytics/dashboard`);

    return data;
  } catch (err) {
    console.error();
  }
}
