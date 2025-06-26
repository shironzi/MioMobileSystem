import { api } from "@/utils/apiClient";
import { getAuth } from "@react-native-firebase/auth";

const IPADDRESS = process.env.EXPO_PUBLIC_IP_ADDRESS;

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

export async function getBingoActivityById(
  subjectId: string,
  activityType: string,
  difficulty: string,
  activityId: string,
) {
  try {
    const { data } = await api.get(
      `/subject/${subjectId}/auditory/bingo/${difficulty}/${activityId}`,
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

export async function getMatchingActivityById(
  subjectId: string,
  activityType: string,
  difficulty: string,
  activityId: string,
) {
  try {
    const { data } = await api.get(
      `/subject/${subjectId}/auditory/matching/${difficulty}/${activityId}`,
    );

    console.log(
      "/subject/${subjectId}/auditory/matching/${difficulty}/${activityId}",
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
  title: string,
) {
  try {
    const formData = new FormData();

    formData.append("activity_type", activityType);
    formData.append("difficulty", difficulty);
    formData.append("title", title);

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
      `${IPADDRESS}/subject/${subjectId}/specialized/auditory/bingo`,
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

export async function createMatchingActivity(
  subjectId: string,
  activityType: string,
  difficulty: string,
  answers: Answer[],
  title: string,
) {
  try {
    const formData = new FormData();

    formData.append("activity_type", activityType);
    formData.append("difficulty", difficulty);
    formData.append("title", title);

    answers.forEach((item, index) => {
      formData.append(`activity[${index}][image]`, {
        uri: item.image?.uri,
        name: item.image?.name,
        type: item.image?.mimeType,
      } as any);

      formData.append(`activity[${index}][audio]`, {
        uri: item.audio?.uri,
        name: item.audio?.name,
        type: item.audio?.mimeType,
      } as any);
    });

    const token = await getAuth().currentUser?.getIdToken(true);

    const response = await fetch(
      `${IPADDRESS}/subject/${subjectId}/specialized/auditory/matching`,
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

export async function updateBingoActivity(
  subjectId: string,
  activityType: string,
  difficulty: string,
  activityId: string,
  bingoItems: {
    file: FileInfo | null;
    image_path: string | null;
    image_id?: string | null;
    is_answer: boolean;
  }[],
  audioFiles: {
    audio: FileInfo | null;
    audio_path: string | null;
    audio_id?: string | null;
  }[],
  title: string,
) {
  try {
    const formData = new FormData();

    formData.append("title", title);

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

      formData.append(`activity[${index}][image_id]`, item.image_id ?? "");
    });

    audioFiles.forEach((item, index) => {
      if (item.audio) {
        formData.append(`audio[${index}][audio_file]`, {
          uri: item.audio.uri,
          name: item.audio.name,
          type: item.audio.mimeType ?? "audio/mpeg",
        } as any);
      }

      formData.append(`audio[${index}][audio_id]`, item.audio_id ?? "");
    });

    const token = await getAuth().currentUser?.getIdToken(true);

    const response = await fetch(
      `${IPADDRESS}/subject/${subjectId}/specialized/auditory/bingo/${difficulty}/${activityId}`,
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

export async function submitBingoActivity(
  subjectId: string,
  difficulty: string,
  activityId: string,
  attemptId: string,
  answers: { image_id: string; selected_at: string }[],
  totalPlay: { audio_id: string; played_at: string[] }[],
) {
  try {
    const token = await getAuth().currentUser?.getIdToken(true);

    console.log(
      JSON.stringify({
        answers,
        audio_played: totalPlay,
      }),
    );

    const response = await fetch(
      `${IPADDRESS}/subject/${subjectId}/auditory/bingo/${difficulty}/${activityId}/${attemptId}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          answers,
          audio_played: totalPlay,
        }),
      },
    );

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

interface answerLog {
  audio_id: string;
  audio_played: string[];
  selected: string[];
  image_selected_at: string[];
}

export async function submitMatchingActivity(
  subjectId: string,
  difficulty: string,
  activityId: string,
  attemptId: string,
  answerLogs: answerLog[],
  answers: { image_id: string; audio_id: string }[],
) {
  try {
    const token = await getAuth().currentUser?.getIdToken(true);
    const payload = {
      answers,
      answerLogs,
    };

    const response = await fetch(
      `${IPADDRESS}/subject/${subjectId}/auditory/matching/${difficulty}/${activityId}/${attemptId}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      },
    );

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

interface Answer {
  image_id: string | null;
  audio_id: string | null;
  audio: FileInfo | null;
  image: FileInfo | null;
}

interface FileInfo {
  uri: string;
  name: string;
  type?: string;
}

export async function updateMatchingActivity(
  subjectId: string,
  difficulty: string,
  activityId: string,
  answers: Answer[],
  title: string,
) {
  try {
    const token = await getAuth().currentUser?.getIdToken(true);
    const formData = new FormData();

    formData.append(`title`, title);
    answers.forEach((answer, index) => {
      formData.append(`activity[${index}][image_id]`, answer.image_id ?? "");
      formData.append(`activity[${index}][audio_id]`, answer.audio_id ?? "");

      if (answer.image?.uri) {
        formData.append(`activity[${index}][image]`, {
          uri: answer.image.uri,
          name: answer.image.name,
          type: answer.image.type || "image/jpeg",
        } as any);
      }

      if (answer.audio?.uri) {
        formData.append(`activity[${index}][audio]`, {
          uri: answer.audio.uri,
          name: answer.audio.name,
          type: answer.audio.type || "audio/mpeg",
        } as any);
      }
    });

    const response = await fetch(
      `${IPADDRESS}/subject/${subjectId}/specialized/auditory/matching/${difficulty}/${activityId}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      },
    );

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

export async function getAttemptActivityAuditory(
  subjectId: string,
  activity_type: string,
  activityId: string,
  attemptId: string,
) {
  try {
    const url = `${IPADDRESS}/subject/${subjectId}/attempts/auditory/${activity_type}/${activityId}/${attemptId}`;
    const token = await getAuth().currentUser?.getIdToken(true);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    // if (!response.ok) {
    //   const text = await response.text();
    //   console.error("Error: " + text);
    // }

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
