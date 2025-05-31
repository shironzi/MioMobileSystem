import { api } from "@/utils/apiClient";

export async function startHomonymsActivity(
  subjectId: string,
  difficulty: string,
  activityId: string,
) {
  try {
    const { data } = await api.post(
      `/subject/${subjectId}/language/homonyms/${difficulty}/${activityId}`,
    );

    return data;
  } catch (err) {
    console.error("Failed to start homonyms activity: ", err);
  }
}

export async function startFillActivity(
  subjectId: string,
  difficulty: string,
  activityId: string,
) {
  try {
    const { data } = await api.post(
      `/subject/${subjectId}/language/fill/${difficulty}/${activityId}`,
    );

    return data;
  } catch (err) {
    console.error("Failed to start fill in the blanks activity: ", err);
  }
}

export async function submitHomonymsActivity(
  subjectId: string,
  difficulty: string,
  activityId: string,
  attemptId: string,
  payload: {
    item_id: string;
    answers: { sentence_id: string; answer: string }[];
  }[],
) {
  try {
    const { data } = await api.patch(
      `/subject/${subjectId}/language/homonyms/${difficulty}/${activityId}/${attemptId}`,
      { answers: payload },
    );

    return data;
  } catch (err) {
    console.error("Take Activity Failed");
  }
}
