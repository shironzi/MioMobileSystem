import { api } from "@/utils/apiClient";
import { getAuth } from "@react-native-firebase/auth";

const IPADDRESS = process.env.EXPO_PUBLIC_IP_ADDRESS;

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

interface PictureItem {
  id: string;
  flashcard_id: string | null;
  file: FileInfo | null;
  text: string;
  image_url: string;
}

interface Flashcard {
  id: string;
  flashcard_id: string | null;
  text: string;
}

interface Flashcard {
  id: string;
  flashcard_id: string | null;
  text: string;
}

export async function getSpecializedActivities(
  subjectId: string,
  activity_type: string,
  difficulty: string,
) {
  try {
    const { data } = await api.get(
      `/subject/${subjectId}/specialized/${activity_type}/${difficulty}`,
    );

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

export async function getActivities(subjectId: string) {
  try {
    const { data } = await api.get(`/subject/${subjectId}/scores`);

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

export async function getRemedialList(subjectId: string) {
  try {
    const { data } = await api.get(`/subject/${subjectId}/scores/remedialList`);

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

export async function getRemedialListByStudent(
  subjectId: string,
  studentId: string,
) {
  try {
    const { data } = await api.get(
      `/subject/${subjectId}/scores/remedialList/${studentId}`,
    );

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

export async function getRemedialAttempts(
  subjectId: string,
  studentId: string,
  activityType: string,
  remedialId: string,
  phoneme: string,
) {
  try {
    const { data } = await api.get(
      `/subject/${subjectId}/scores/remedialList/${studentId}/${activityType}/${remedialId}/${phoneme}`,
    );

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

export async function getAuditoryRemedialAttempts(
  subjectId: string,
  studentId: string,
  activityType: string,
  remedialId: string,
) {
  try {
    const { data } = await api.get(
      `/subject/${subjectId}/scores/remedialList/${studentId}/${activityType}/${remedialId}/auditory`,
    );

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

export async function CreateRemedialSchedule(
  studentId: string,
  subjectId: string,
  remedialId: string,
  date: Date,
  startTime: Date,
  endTime: Date,
  message: string,
  remedialType: string,
  mode: string,
  room: string,
  meetingLink: string,
) {
  try {
    const startTimeStr = startTime
      ? `${startTime.getHours().toString().padStart(2, "0")}:${startTime
          .getMinutes()
          .toString()
          .padStart(2, "0")}`
      : "";

    const endTimeStr = endTime
      ? `${endTime.getHours().toString().padStart(2, "0")}:${endTime
          .getMinutes()
          .toString()
          .padStart(2, "0")}`
      : "";

    const payload = {
      date: date.toISOString().split("T")[0],
      start: startTimeStr,
      end: endTimeStr,
      message: message.trim(),
      mode: mode,
      room: mode === "faceToFace" ? room : null,
      meetingLink: mode === "online" ? meetingLink : null,
    };

    const { data } = await api.post(
      `/schedules/${studentId}/${subjectId}/${remedialType}/${remedialId}`,
      payload,
    );

    return data;
  } catch (err: any) {
    if (err.response) {
      return err.response.status;
    } else if (err.request) {
      return { error: "No response from server", asd: err.request };
    } else {
      return { error: err.message };
    }
  }
}

export async function getRemedialResult(
  subjectId: string,
  activityType: string,
  remedialId: string,
  phoneme: string,
) {
  try {
    const { data } = await api.get(
      `/subject/${subjectId}/scores/remedialList/${activityType}/${remedialId}/${phoneme}`,
    );

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

export async function getAuditoryRemedialResult(
  subjectId: string,
  activityType: string,
  remedialId: string,
) {
  try {
    const { data } = await api.get(
      `/subject/${subjectId}/scores/remedialList/${activityType}/${remedialId}`,
    );

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

export async function getRemedialResultByStudent(
  subjectId: string,
  activityType: string,
  remedialId: string,
  phoneme: string,
  studentId: string,
  attemptId: string,
) {
  try {
    const { data } = await api.get(
      `/subject/${subjectId}/scores/remedialList/${studentId}/${activityType}/${remedialId}/${phoneme}/${attemptId}`,
    );

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

export async function getAuditoryRemedialResultByStudent(
  subjectId: string,
  activityType: string,
  remedialId: string,
  phoneme: string,
  studentId: string,
  attemptId: string,
) {
  try {
    const { data } = await api.get(
      `/subject/${subjectId}/scores/remedialList/${studentId}/${activityType}/${remedialId}/${phoneme}/${attemptId}`,
    );

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

export async function getActiveActivity(
  subjectId: string,
  activity_type: string,
  activityId: string,
  difficulty: string,
) {
  try {
    const { data } = await api.get(
      `/subject/${subjectId}/attempts/${activity_type}/${difficulty}/${activityId}`,
    );

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

export async function startRemedial(
  subjectId: string,
  activityType: string,
  remedial_id: string,
  phoneme: string,
) {
  try {
    const { data } = await api.post(
      `/subject/${subjectId}/specialized/speech/remedial/${activityType}/${remedial_id}/${phoneme}`,
    );

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
    const url = `${IPADDRESS}/subject/${subjectId}/speech/${activityType}/${activityId}/${attemptId}/${flashcardId}`;

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

    return await response.json();
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

export async function submitRemedialAnswer(
  subjectId: string,
  activityType: string,
  attemptId: string,
  remedial_id: string,
  phoneme: string,
  itemId: string,
  fileUri: string,
) {
  try {
    const url = `${IPADDRESS}/subject/${subjectId}/specialized/speech/remedial/${activityType}/${remedial_id}/${phoneme}/${attemptId}/${itemId}`;

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

    return await response.json();
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

export async function finishRemedialActivity(
  subjectId: string,
  activityType: string,
  remedial_id: string,
  attemptId: string,
) {
  try {
    const { data } = await api.patch(
      `/subject/${subjectId}/specialized/speech/remedial/${activityType}/${remedial_id}/${attemptId}`,
    );

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

export async function createPictureSpeechActivity(
  subjectId: string,
  flashcards: PictureItem[],
  activityType: string,
  difficulty: string,
  title: string,
  isRemedial: string,
  selectedActivityId: string,
) {
  try {
    const url = `${IPADDRESS}/subject/${subjectId}/specialized/speech/picture`;

    const formData = new FormData();

    formData.append("activity_type", activityType);
    formData.append("difficulty", difficulty);
    formData.append("title", title);
    formData.append("is_remedial", isRemedial);
    formData.append("activity_id", selectedActivityId);

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

export async function createSpeechActivity(
  subjectId: string,
  activityType: string,
  difficulty: string,
  flashcards: Flashcard[],
  title: string,
  isRemedial: string,
  selectedActivityId: string,
) {
  try {
    const payload = {
      activity_type: activityType,
      difficulty: difficulty,
      flashcards: flashcards,
      title,
      is_remedial: isRemedial,
      activity_id: selectedActivityId,
    };

    console.log(payload);

    const { data } = await api.post(
      `/subject/${subjectId}/specialized/speech`,
      payload,
    );

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

export async function getActivityList(subjectId: string) {
  try {
    const { data } = await api.get(`/subject/${subjectId}/specialized/speech`);

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

export async function updatePictureActivity(
  subjectId: string,
  difficulty: string,
  activityId: string,
  flashcards: PictureItem[],
  title: string,
  isRemedial: string,
) {
  try {
    const url = `${IPADDRESS}/subject/${subjectId}/specialized/speech/picture/${difficulty}/${activityId}`;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("is_remedial", isRemedial);

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
    });

    console.log(formData);

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

export async function updateSpeechActivity(
  subjectId: string,
  difficulty: string,
  activityId: string,
  activityType: string,
  flashcards: Flashcard[],
  title: string,
  isRemedial: string,
) {
  try {
    console.log(flashcards);
    const payload = { flashcards: flashcards, title, is_remedial: isRemedial };
    console.log(payload);

    const { data } = await api.put(
      `/subject/${subjectId}/specialized/speech/${activityType}/${difficulty}/${activityId}`,
      payload,
    );

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

export async function checkSpeechRemedial(
  subjectId: string,
  activityType: string,
) {
  try {
    const { data } = await api.get(
      `/subject/${subjectId}/specialized/speech/remedial/${activityType}`,
    );

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

export async function checkAuditoryRemedial(
  subjectId: string,
  activityType: string,
) {
  try {
    const { data } = await api.get(
      `/subject/${subjectId}/specialized/auditory/remedial/${activityType}`,
    );

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
