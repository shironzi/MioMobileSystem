import { api } from "@/utils/apiClient";
import { getAuth } from "@react-native-firebase/auth";

const IPADDRESS = process.env.EXPO_PUBLIC_IP_ADDRESS;

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

interface HomonymItem {
  id: string;
  item_id: string | null;
  text: string[];
  answer: string[];
  distractors: string[];
  audio: FileInfo[];
  audio_path: string[];
  audioType: ("upload" | "record")[];
}

interface FillItem {
  id: string;
  item_id: string | null;
  text: string;
  distractors: string[];
  audio: FileInfo | null;
  filename: string | null;
  audio_path: string | null;
  audioType: "upload" | "record";
}

export async function getFillActivity(
  subjectId: string,
  activityType: string,
  difficulty: string,
  activityId: string,
) {
  try {
    const { data } = await api.get(
      `/subject/${subjectId}/language/fill/${difficulty}/${activityId}`,
    );

    return data;
  } catch (err) {
    console.error(err);
  }
}

export async function getHomonymActivity(
  subjectId: string,
  activityType: string,
  difficulty: string,
  activityId: string,
) {
  try {
    const { data } = await api.get(
      `/subject/${subjectId}/language/homonyms/${difficulty}/${activityId}`,
    );

    return data;
  } catch (err) {
    console.error(err);
  }
}

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
    answer: string[];
  }[],
) {
  try {
    console.log({ answers: payload });
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
    const { data } = await api.patch(
      `/subject/${subjectId}/language/fill/${difficulty}/${activityId}/${attemptId}`,
      { answers: payload },
    );

    return data;
  } catch (err) {
    console.error("Take Activity Failed");
  }
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

    item.audio.forEach((audioFile, j) => {
      formData.append(`homonyms[${i}][audio][${j}]`, {
        uri: audioFile.uri,
        name: audioFile.name,
        type: audioFile.mimeType,
      } as any);
    });

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
    }

    return data;
  } catch (err) {
    console.error("Network or submission error:", err);
    throw err;
  }
}

export async function createFill(
  activity: FillItem[],
  difficulty: string,
  subjectId: string,
) {
  const formData = new FormData();
  formData.append("difficulty", difficulty);

  for (let index = 0; index < activity.length; index++) {
    const item = activity[index];

    formData.append(`activity[${index}][sentence]`, item.text);

    formData.append(`activity[${index}][audio]`, {
      uri: item.audio?.uri,
      name: item.audio?.name,
      type: item.audio?.mimeType,
    } as any);

    item.distractors.forEach((dist, j) => {
      formData.append(`activity[${index}][distractors][${j}]`, dist);
    });
  }

  try {
    const token = await getAuth().currentUser?.getIdToken(true);

    const res = await fetch(
      `${IPADDRESS}/subject/${subjectId}/specialized/language/fill`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      },
    );

    const data = await res.json();

    if (!res.ok) {
      console.error("Validation or server error:", data);
    }

    return data;
  } catch (err) {
    console.error("Network or submission error:", err);
    throw err;
  }
}

export async function editHomonyms(
  activity: HomonymItem[],
  difficulty: string,
  subjectId: string,
  activityId: string,
) {
  const formData = new FormData();

  formData.append("difficulty", difficulty);

  for (let index = 0; index < activity.length; index++) {
    const item = activity[index];

    formData.append(`homonyms[${index}][sentences][0]`, item.text[0]);
    formData.append(`homonyms[${index}][sentences][1]`, item.text[1]);

    formData.append(`homonyms[${index}][answers][0]`, item.answer[0]);
    formData.append(`homonyms[${index}][answers][1]`, item.answer[1]);

    item.audio.forEach((audio, j) => {
      if (audio) {
        formData.append(`homonyms[${index}][audio][${j}]`, {
          uri: audio.uri,
          name: audio.name,
          type: audio.mimeType,
        } as any);
      }
    });

    item.distractors.forEach((dist, j) => {
      formData.append(`homonyms[${index}][distractors][${j}]`, dist);
    });
  }

  try {
    const token = await getAuth().currentUser?.getIdToken(true);

    const res = await fetch(
      `${IPADDRESS}/subject/${subjectId}/specialized/language/homonyms/${difficulty}/${activityId}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      },
    );

    const data = await res.json();

    if (!res.ok) {
      console.error("Validation or server error:", data);
    }

    return data;
  } catch (err) {
    console.error("Network or submission error:", err);
    throw err;
  }
}

interface FillItem {
  id: string;
  item_id: string | null;
  text: string;
  distractors: string[];
  audio: FileInfo | null;
  filename: string | null;
  audio_path: string | null;
  audioType: "upload" | "record";
}

export async function editFill(
  activity: FillItem[],
  difficulty: string,
  subjectId: string,
  activityId: string,
) {
  const formData = new FormData();

  for (let index = 0; index < activity.length; index++) {
    const item = activity[index];

    if (item.item_id) {
      formData.append(`activity[${index}][item_id]`, item.item_id);
    }

    formData.append(`activity[${index}][sentence]`, item.text);
    formData.append(`activity[${index}][audioType]`, item.audioType);

    if (item.audio) {
      formData.append(`activity[${index}][audio]`, {
        uri: item.audio.uri,
        name: item.audio.name,
        type: item.audio.mimeType,
      } as any);
    }

    item.distractors.forEach((dist, j) => {
      formData.append(`activity[${index}][distractors][${j}]`, dist);
    });
  }

  try {
    const token = await getAuth().currentUser?.getIdToken(true);

    const res = await fetch(
      `${IPADDRESS}/subject/${subjectId}/specialized/language/fill/${difficulty}/${activityId}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      },
    );

    const data = await res.json();

    if (!res.ok) {
      console.error("Validation or server error:", data);
    }

    return data;
  } catch (err) {
    console.error("Network or submission error:", err);
    throw err;
  }
}
