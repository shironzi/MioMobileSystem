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

export async function submitBingoActivity(
  subjectId: string,
  difficulty: string,
  activityId: string,
  attemptId: string,
  payload: { activity: { image_no: number; answer: string }[] },
) {
  try {
    const { data } = await api.patch(
      `/subject/${subjectId}/auditory/Bingo/${difficulty}/${activityId}/${attemptId}`,
      payload,
    );

    return data;
  } catch (err) {
    console.error("Take Activity Failed");
  }
}

export async function submitMatchingActivity(
  subjectId: string,
  difficulty: string,
  activityId: string,
  attemptId: string,
  payload: { answers: { audio_id: string; image_id: string }[] },
) {
  try {
    console.log(payload);

    const { data } = await api.patch(
      `/subject/${subjectId}/auditory/matching/${difficulty}/${activityId}/${attemptId}`,
      payload,
    );

    return data;
  } catch (err) {
    console.error("Take Activity Failed");
  }
}
