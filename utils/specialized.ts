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

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

export async function createPictureSpeechActivity(
  subjectId: string,
  flashcards: {
    flashcard_id: string | null;
    file: FileInfo | null;
    image_path: string | null;
    text: string | null;
  }[],
  activityType: string,
  difficulty: string,
) {
  try {
    const url = `http://192.168.254.169:8001/api/subject/${subjectId}/specialized/speech/picture`;

    const formData = new FormData();

    formData.append("activity_type", activityType);
    formData.append("difficulty", difficulty);

    flashcards.forEach((item, index) => {
      if (item.file && item.text) {
        const { uri, name, mimeType } = item.file;

        formData.append(`flashcards[${index}][text]`, item.text);
        formData.append(`flashcards[${index}][image]`, {
          uri,
          name,
          type: mimeType,
        } as any);
      }
    });

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

    return await response.json();
  } catch (err) {
    console.error("Error creating speech picture activity:", err);
    throw err;
  }
}

export async function createSpeechActivity(
  subjectId: string,
  activityType: string,
  difficulty: string,
  flashcards: { text: string | null }[],
) {
  try {
    const payload = {
      activity_type: activityType,
      difficulty: difficulty,
      flashcards: flashcards,
    };

    const { data } = await api.post(
      `/subject/${subjectId}/specialized/speech`,
      payload,
    );

    return data;
  } catch (err) {
    console.error("Submit Activity Failed:", err);
    throw err;
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
      `/subject/${subjectId}/speech/${activityType}/${difficulty}/${activityId}`,
    );

    return data;
  } catch (err) {
    console.error("fetch activity by Id failed: ", err);
  }
}

export async function updatePictureActivity(
  subjectId: string,
  difficulty: string,
  activityId: string,
  flashcards: {
    flashcard_id: string | null;
    file: FileInfo | null;
    image_path: string | null;
    text: string | null;
    firebase_path: string | null;
  }[],
) {
  try {
    const url = `http://192.168.254.169:8001/api/subject/${subjectId}/specialized/speech/picture/${difficulty}/${activityId}`;

    const formData = new FormData();

    flashcards.forEach((item, index) => {
      formData.append(`flashcards[${index}][text]`, item.text ?? "");

      if (item.flashcard_id) {
        formData.append(
          `flashcards[${index}][flashcard_id]`,
          item.flashcard_id,
        );
      }

      if (item.file) {
        const { uri, name, mimeType } = item.file;
        formData.append(`flashcards[${index}][image]`, {
          uri,
          name,
          type: mimeType,
        } as any);
      }

      if (!item.file && item.firebase_path) {
        formData.append(`flashcards[${index}][remotePath]`, item.firebase_path);
      }
    });

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

    return await response.json();
  } catch (err) {
    console.error("Error updating speech picture activity:", err);
    throw err;
  }
}

export async function updateSpeechActivity(
  subjectId: string,
  difficulty: string,
  activityId: string,
  activityType: string,
  flashcards: { text: string | null }[],
) {
  try {
    const { data } = await api.put(
      `/subject/${subjectId}/specialized/speech/${activityType}/${difficulty}/${activityId}`,
      { flashcards: flashcards },
    );

    return data;
  } catch (err) {
    console.error(`Error updating speech ${activityType} activity:`, err);
  }
}
