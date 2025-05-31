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

export async function startActivity(
  subjectId: string,
  activityType: string,
  difficulty: string,
  activityId: string,
) {
  try {
    const { data } = await api.post(
      `/subject/${subjectId}/speech/${activityType}/${difficulty}/${activityId}`,
    );

    return data;
  } catch (err) {
    console.error("Failed to post take activity" + err);
  }
}

import { getAuth } from "@react-native-firebase/auth";

export async function submitAnswer(
  subjectId: string,
  activityType: string,
  difficulty: string,
  activityId: string,
  attemptId: string,
  flashcardId: string,
  fileUri: string,
) {
  try {
    const url = `http://192.168.254.169:8001/api/subject/${subjectId}/speech/${activityType}/${activityId}/${attemptId}/${flashcardId}`;

    const mimeMap: Record<string, string> = {
      mp3: "audio/mpeg",
      m4a: "audio/mp4",
      webm: "audio/webm",
    };

    const filename = fileUri.split("/").pop()!;
    const mimeType = "audio/mpeg";

    const formData = new FormData();
    formData.append("audio_file", {
      uri: fileUri,
      name: filename,
      type: mimeType,
    } as any);

    const token = await getAuth().currentUser?.getIdToken(true);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Upload failed ${response.status}: ${text}`);
    }

    return await response.json();
  } catch (err) {
    console.error(err);
  }
}

export async function finishActivity(
  subjectId: string,
  activityType: string,
  difficulty: string,
  activityId: string,
  attemptId: string,
) {
  try {
    const { data } = await api.patch(
      `/subject/${subjectId}/speech/${activityType}/${difficulty}/${activityId}/${attemptId}`,
    );

    return data;
  } catch (err) {
    console.error("Submit Activity Failed: " + err);
  }
}
