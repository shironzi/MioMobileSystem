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

export async function startActivity(
  subjectId: string,
  activityType: string,
  difficulty: string,
  activityId: string,
) {
  try {
    const { data } = await api.post(
      `/subject/${subjectId}/specialized/${activityType}/${difficulty}/${activityId}`,
    );

    return data;
  } catch (err) {
    console.error("Failed to post take activity" + err);
  }
}

// export async function submitAnswer(
//   subjectId: string,
//   activityType: string,
//   difficulty: string,
//   activityId: string,
//   attemptId: string,
//   flashcardId: string,
//   fileUri: string,
// ) {
//   try {
//     // // Derive name + type
//     // const fileUri =
//     //   "file:///data/…/recording-8143cd9c-d360-414a-b419-7246b0bb3a4f.m4a";
//     // const filename = fileUri.split("/").pop()!; // "recording-8143cd9c-d360-414a-b419-7246b0bb3a4f.m4a"
//     // const mimeType = `audio/${filename.split(".").pop()}`; // "audio/m4a"
//     //
//     // const formData = new FormData();
//     // formData.append("audio_file", {
//     //   uri: fileUri,
//     //   name: filename,
//     //   type: mimeType,
//     // } as any);
//     //
//     // console.log(attemptId);
//     //
//     // const url = `/subject/${subjectId}/specialized/${activityType}/${difficulty}/${activityId}/${attemptId}/${flashcardId}`;
//     // console.log(url);
//     //
//     // const response = await api.post(url);
//     // return response.data;
//   } catch (err) {
//     console.error("Failed to save", err);
//     throw err;
//   }
// }

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
  const url = `http://192.168.254.169:8001/api/subject/${subjectId}/specialized/${activityType}/${difficulty}/${activityId}/${attemptId}/${flashcardId}`;

  const filename = fileUri.split("/").pop()!;
  const ext = filename.split(".").pop()!;
  const mimeType = `audio/${ext}`;

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
}

export async function finishActivity(
  subjectId: string,
  activityType: string,
  difficulty: string,
  activityId: string,
  attemptId: string,
) {
  try {
    console.log(
      `/subject/${subjectId}/specialized/${activityType}/${difficulty}/${activityId}/${attemptId}`,
    );

    const { data } = await api.patch(
      `/subject/${subjectId}/specialized/${activityType}/${difficulty}/${activityId}/${attemptId}`,
    );

    return data;
  } catch (err) {
    console.error("Submit Activity Failed: " + err);
  }
}

export async function getActivityScore(
  subjectId: string,
  activityId: string,
  attemptId: string,
) {
  try {
    const { data } = await api.get(
      `/subject/${subjectId}/specialized/${activityId}/${attemptId}`,
    );

    return data;
  } catch (err) {
    console.error("Get Activity Scores Failed" + err);
  }
}
