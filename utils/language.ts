import { api } from "@/utils/apiClient";
import { getAuth } from "@react-native-firebase/auth";

const IPADDRESS = process.env.EXPO_PUBLIC_IP_ADDRESS;

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

export async function submitFillActivity(
  subjectId: string,
  difficulty: string,
  activityId: string,
  attemptId: string,
  payload: { item_id: string; sentence: string }[],
) {
  try {
    console.log(payload);

    const { data } = await api.patch(
      `/subject/${subjectId}/language/fill/${difficulty}/${activityId}/${attemptId}`,
      { answers: payload },
    );

    return data;
  } catch (err) {
    console.error("Take Activity Failed");
  }
}

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

interface HomonymItem {
  id: string;
  text: string[];
  answer: string[];
  distractors: string[];
  audio: FileInfo[];
  audioType: ("upload" | "record" | "system")[];
}

export async function createHomonym(
  activity: HomonymItem[],
  difficulty: string,
  subjectId: string,
) {
  const formData = new FormData();
  formData.append("difficulty", difficulty);

  activity.forEach((item, i) => {
    item.text.forEach((sentence, j) => {
      formData.append(`homonyms[${i}][sentences][${j}]`, sentence);
    });

    item.answer.forEach((answer, j) => {
      formData.append(`homonyms[${i}][answers][${j}]`, answer);
    });

    item.audioType.forEach((type, j) => {
      formData.append(`homonyms[${i}][audio_type][${j}]`, type);
    });

    if (item.audio) {
      item.audio.forEach((audioFile, j) => {
        if (audioFile && item.audioType[j] !== "system") {
          formData.append(`homonyms[${i}][audio][${j}]`, {
            uri: audioFile.uri,
            name: audioFile.name,
            type: audioFile.mimeType ?? "audio/mp3",
          } as any);
        }
      });
    }

    item.distractors.forEach((distractor, j) => {
      formData.append(`homonyms[${i}][distractors][${j}]`, distractor);
    });
  });

  try {
    const token = await getAuth().currentUser?.getIdToken(true);

    const res = await fetch(
      `${IPADDRESS}/subject/${subjectId}/specialized/language/homonyms`,
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

    const data = await res.json();

    if (!res.ok) {
      console.error("Validation or server error:", data);
      throw new Error(data.message || "Submission failed");
    }

    console.log("Success:", data);
    return data;
  } catch (err) {
    console.error("Network or submission error:", err);
    throw err;
  }
}
