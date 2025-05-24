import { api } from "@/utils/apiClient";

export async function getActivities(
  subjectId: string,
  activityType: string,
  difficulty: string,
) {
  try {
    const { data } = await api.get(
      `/subject/${subjectId}/specialized/${activityType}/${difficulty}`,
    );

    return data;
  } catch (err) {
    console.error("Get Activities Fetch Failed: " + err);
  }
}

export async function getActivityById(
  subjectId: string,
  activityType: string,
  difficulty: string,
  activityId: string,
) {
  try {
    const { data } = await api.get(
      `/subject/${subjectId}/specialized/${activityType}/${difficulty}/${activityId}`,
    );

    return data;
  } catch (err) {
    console.error("Get Activity by Id Fetch Failed: " + err);
  }
}
