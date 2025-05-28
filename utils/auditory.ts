import { api } from "@/utils/apiClient";

export async function takeAuditoryActivity(
  subjectId: string,
  activityType: string,
  difficulty: string,
  activityId: string,
) {
  try {
    const { data } = await api.post(
      `/subject/${subjectId}/auditory/${activityType}/${difficulty}/${activityId}`,
    );

    return data;
  } catch (err) {
    console.error("Take Activity Failed");
  }
}

export async function submitAuditoryActivity(
  subjectId: string,
  activityType: string,
  difficulty: string,
  activityId: string,
  attemptId: string,
  payload: { activity: { image_no: number; answer: string }[] },
) {
  try {
    const { data } = await api.patch(
      `/subject/${subjectId}/auditory/${activityType}/${difficulty}/${activityId}/${attemptId}`,
      payload,
    );

    return data;
  } catch (err) {
    console.error("Take Activity Failed");
  }
}
