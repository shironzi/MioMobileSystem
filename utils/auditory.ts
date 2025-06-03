import { api } from "@/utils/apiClient";
import { getAuth } from "@react-native-firebase/auth";
import { useState } from "react";

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

export async function createBingoActivity(
  subjectId: string,
  activityType: string,
  difficulty: string,
  bingoItems: {
    file: FileInfo | null;
    image_path: string | null;
    is_answer: boolean;
  }[],
  audioFiles: {
    audio: FileInfo | null;
    audio_path: string | null;
  }[],
) {
  try {
    const formData = new FormData();

    formData.append("activity_type", activityType);
    formData.append("difficulty", difficulty);

    bingoItems.forEach((item, index) => {
      if (item.file) {
        formData.append(`activity[${index}][image]`, {
          uri: item.file.uri,
          name: item.file.name,
          type: item.file.mimeType ?? "image/jpeg",
        } as any);
      }

      formData.append(
        `activity[${index}][is_answer]`,
        item.is_answer ? "true" : "false",
      );
    });

    audioFiles.forEach((item, index) => {
      if (item.audio) {
        formData.append(`audio[${index}][audio_file]`, {
          uri: item.audio.uri,
          name: item.audio.name,
          type: item.audio.mimeType ?? "audio/mpeg",
        } as any);
      }
    });

    const token = await getAuth().currentUser?.getIdToken(true);

    const response = await fetch(
      `http://192.168.254.169:8001/api/subject/${subjectId}/specialized/auditory/bingo`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      },
    );

    return await response.json();
  } catch (err) {
    console.error("Submit Activity Failed:", err);
    throw err;
  }
}

export async function createMatchingActivity(
  subjectId: string,
  activityType: string,
  difficulty: string,
  activity: {
    image_id: string;
    audio_id: string;
    image: FileInfo;
    audio: FileInfo;
  }[],
) {
  try {
    console.log(activity[0]);
    const formData = new FormData();

    formData.append("activity_type", activityType);
    formData.append("difficulty", difficulty);

    activity.forEach((item, index) => {
      formData.append(`activity[${index}][image]`, {
        uri: item.image.uri,
        name: item.image.name,
        type: item.image.mimeType,
      } as any);

      formData.append(`activity[${index}][audio]`, {
        uri: item.audio.uri,
        name: item.audio.name,
        type: item.audio.mimeType,
      } as any);
    });

    const token = await getAuth().currentUser?.getIdToken(true);

    const response = await fetch(
      `http://192.168.254.169:8001/api/subject/${subjectId}/specialized/auditory/matching`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      },
    );

    return await response.json();
  } catch (err) {
    console.error("Submit Activity Failed:", err);
    throw err;
  }
}

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
  payload: { answers: { image_id: string }[] },
) {
  try {
    const { data } = await api.put(
      `/subject/${subjectId}/auditory/bingo/${difficulty}/${activityId}/${attemptId}`,
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

    const { data } = await api.put(
      `/subject/${subjectId}/auditory/matching/${difficulty}/${activityId}/${attemptId}`,
      payload,
    );

    return data;
  } catch (err) {
    console.error("Take Activity Failed");
  }
}
