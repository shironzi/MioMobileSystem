import { api } from "@/utils/apiClient";

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
  }[],
  audioFiles: {
    audio: FileInfo | null;
    audio_path: string | null;
  }[],
  title: string,
  remedialId: string,
  answers: string[],
) {
  try {
    const formData = new FormData();

    formData.append("activity_type", activityType);
    formData.append("difficulty", difficulty);
    formData.append("title", title);
    formData.append("remedial_id", remedialId);

    bingoItems.forEach((item, index) => {
      if (item.file) {
        formData.append(`activity[${index}][image]`, {
          uri: item.file.uri,
          name: item.file.name,
          type: item.file.mimeType ?? "image/jpeg",
        } as any);
      }
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

    answers.forEach((item, index) => {
      formData.append(`answers[${index}]`, item);
    });

    const { data } = await api.post(
      `/subject/${subjectId}/specialized/auditory/bingo`,
      formData,
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

export async function createMatchingActivity(
  subjectId: string,
  activityType: string,
  difficulty: string,
  answers: Answer[],
  title: string,
  remedialId: string,
) {
  try {
    const formData = new FormData();

    formData.append("activity_type", activityType);
    formData.append("difficulty", difficulty);
    formData.append("title", title);
    formData.append("remedial_id", remedialId);

    answers.forEach((item, index) => {
      if (
        item.image_path &&
        typeof item.image_path === "object" &&
        "uri" in item.image_path
      ) {
        formData.append(`activity[${index}][image]`, {
          uri: item.image_path.uri,
          name: item.image_path.name || `image-${index}.jpg`,
          type: item.image_path.type || "image/jpeg",
        } as any);
      }

      if (
        item.audio_path &&
        typeof item.audio_path === "object" &&
        "uri" in item.audio_path
      ) {
        formData.append(`activity[${index}][audio]`, {
          uri: item.audio_path.uri,
          name: item.audio_path.name || `audio-${index}.mp3`,
          type: item.audio_path.type || "audio/mpeg",
        } as any);
      }
    });

    const { data } = await api.post(
      `/subject/${subjectId}/specialized/auditory/matching`,
      formData,
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

export async function updateBingoActivity(
  subjectId: string,
  activityType: string,
  difficulty: string,
  activityId: string,
  bingoItems: {
    file: FileInfo | null;
    image_path: string | null;
    image_id?: string | null;
  }[],
  audioFiles: {
    audio: FileInfo | null;
    audio_path: string | null;
    audio_id?: string | null;
  }[],
  title: string,
  remedialId: string,
  answers: string[],
  audio_answers: string[],
) {
  try {
    const formData = new FormData();

    formData.append("title", title);
    formData.append("remedial_id", remedialId);

    bingoItems.forEach((item, index) => {
      if (item.file) {
        formData.append(`activity[${index}][image]`, {
          uri: item.file.uri,
          name: item.file.name,
          type: item.file.mimeType ?? "image/jpeg",
        } as any);
      }

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

    answers.forEach((item, index) => {
      formData.append(`answers[${index}][image_id]`, item);
    });

    audio_answers.forEach((item, index) => {
      formData.append(`answers[${index}][audio_id]`, item);
    });

    const { data } = await api.post(
      `/subject/${subjectId}/specialized/auditory/bingo/${difficulty}/${activityId}`,
      formData,
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

export async function takeBingoRemedial(
  subjectId: string,
  remedial_id: string,
) {
  try {
    const { data } = await api.post(
      `/subject/${subjectId}/specialized/auditory/remedial/bingo/${remedial_id}`,
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

export async function takeMatchingRemedial(
  subjectId: string,
  remedial_id: string,
) {
  try {
    const { data } = await api.post(
      `/subject/${subjectId}/specialized/auditory/remedial/matching/${remedial_id}`,
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

export async function submitMatchingRemedial(
  subjectId: string,
  remedialId: string,
  attemptId: string,
  answerLogs: answerLog[],
  answers: { image_id: string; audio_id: string }[],
) {
  try {
    const payload = {
      answers,
      answerLogs,
    };

    const { data } = await api.post(
      `/subject/${subjectId}/specialized/auditory/remedial/matching/${remedialId}/${attemptId}`,
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

export async function submitBingoActivity(
  subjectId: string,
  difficulty: string,
  activityId: string,
  attemptId: string,
  answers: { image_id: string; selected_at: string }[],
  totalPlay: { audio_id: string; played_at: string[] }[],
) {
  try {
    const jsonData = JSON.stringify({
      answers,
      audio_played: totalPlay,
    });

    const { data } = await api.post(
      `/subject/${subjectId}/auditory/bingo/${difficulty}/${activityId}/${attemptId}`,
      jsonData,
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

export async function submitBingoRemedial(
  subjectId: string,
  remedialId: string,
  attemptId: string,
  answers: { image_id: string; selected_at: string }[],
  totalPlay: { audio_id: string; played_at: string[] }[],
) {
  try {
    const { data } = await api.post(
      `/subject/${subjectId}/specialized/auditory/remedial/bingo/${remedialId}/${attemptId}`,
      JSON.stringify({
        answers,
        audio_played: totalPlay,
      }),
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
    const payload = {
      answers,
      answerLogs,
    };

    const { data } = await api.put(
      `/subject/${subjectId}/auditory/matching/${difficulty}/${activityId}/${attemptId}`,
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

interface Answer {
  image_id: string | null;
  audio_id: string | null;
  image_path: string | FileInfo | null;
  audio_path: string | FileInfo | null;
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
  remedialId: string,
) {
  try {
    const formData = new FormData();

    formData.append(`title`, title);
    formData.append("remedial_id", remedialId);
    answers.forEach((answer, index) => {
      formData.append(`activity[${index}][image_id]`, answer.image_id ?? "");
      formData.append(`activity[${index}][audio_id]`, answer.audio_id ?? "");

      if (
        answer.image_path &&
        typeof answer.image_path === "object" &&
        "uri" in answer.image_path
      ) {
        formData.append(`activity[${index}][image]`, {
          uri: answer.image_path.uri,
          name: answer.image_path.name || `image-${index}.jpg`,
          type: answer.image_path.type || "image/jpeg",
        } as any);
      }

      if (
        answer.audio_path &&
        typeof answer.audio_path === "object" &&
        "uri" in answer.audio_path
      ) {
        formData.append(`activity[${index}][audio]`, {
          uri: answer.audio_path.uri,
          name: answer.audio_path.name || `audio-${index}.mp3`,
          type: answer.audio_path.type || "audio/mpeg",
        } as any);
      }
    });

    const { data } = await api.post(
      `/subject/${subjectId}/specialized/auditory/matching/${difficulty}/${activityId}`,
      formData,
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

export async function getRemedialList(subjectId: string) {
  try {
    const { data } = await api.get(
      `/subject/${subjectId}/module/remedials/list`,
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
