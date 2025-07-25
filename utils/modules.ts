import { api } from "@/utils/apiClient";
import { getAuth } from "@react-native-firebase/auth";

const IPADDRESS = process.env.EXPO_PUBLIC_IP_ADDRESS;

export async function getModules(subjectId: string) {
  try {
    const { data } = await api.get(`/subject/${subjectId}/modules`);

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

export async function deleteModule(subjectId: string, moduleId: string) {
  try {
    const { data } = await api.delete(
      `/subject/${subjectId}/module/${moduleId}`,
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

export async function getModuleById(subjectId: string, moduleId: string) {
  try {
    const { data } = await api.get(`/subject/${subjectId}/module/${moduleId}`);

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

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

interface ModuleSection {
  id: string;
  title: string;
  description: string;
  files: FileInfo[];
  videoLink?: string[];
}

export async function addModule(
  subjectId: string,
  title: string,
  description: string,
  files: FileInfo[],
  hasPreRequisites: boolean,
  visibility: string,
  prerequisite_id: string,
  prerequisite_type: string,
  sub_sections: ModuleSection[],
  position: string,
) {
  const formData = new FormData();

  formData.append("title", title);
  formData.append("description", description);
  formData.append("prereq_status", hasPreRequisites.toString());
  formData.append("visibility", visibility);
  formData.append("position", position);

  if (files.length > 0) {
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, {
        uri: file.uri,
        name: file.name,
        type: file.mimeType,
      } as any);
    });
  }

  if (hasPreRequisites) {
    formData.append("prerequisite_id", prerequisite_id);
    formData.append("prerequisite_type", prerequisite_type);
  }

  if (sub_sections.length > 0) {
    sub_sections.forEach((item, index) => {
      formData.append(`sub_sections[${index}][title]`, item.title);
      formData.append(`sub_sections[${index}][description]`, item.description);

      if (item.files?.length > 0) {
        item.files.forEach((file, fileIndex) => {
          formData.append(`sub_sections[${index}][files][${fileIndex}]`, {
            uri: file.uri,
            name: file.name,
            type: file.mimeType,
          } as any);
        });
      }

      if (item.videoLink && item.videoLink.length > 0) {
        item.videoLink.forEach((video, videoIndex) => {
          formData.append(
            `sub_sections[${index}][video_links][${videoIndex}]`,
            video,
          );
        });
      }
    });
  }

  const token = await getAuth().currentUser?.getIdToken(true);
  console.log(formData);

  try {
    const res = await fetch(`${IPADDRESS}/subject/${subjectId}/module`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    return await res.json();
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

const getMimeType = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.headers.get("Content-Type") ?? "unrecognized";
  } catch (error) {
    console.error("Failed to get MIME type:", error);
    return "unrecognized";
  }
};

export async function updateModule(
  subjectId: string,
  moduleId: string,
  title: string,
  description: string,
  files: FileInfo[],
  hasPreRequisites: boolean,
  visibility: string,
  prerequisite_id: string,
  prerequisite_type: string,
  sub_sections: ModuleSection[],
  position: string,
) {
  const formData = new FormData();

  formData.append("title", title);
  formData.append("description", description);

  if (files.length > 0) {
    for (const file of files) {
      const index = files.indexOf(file);
      if (!file.uri || !file.name) continue;

      let fileType = file.mimeType;
      if (!fileType) {
        fileType = await getMimeType(file.uri);
      }

      formData.append(`files[${index}]`, {
        uri: file.uri,
        name: file.name,
        type: fileType,
      } as any);
    }
  }

  formData.append("prereq_status", hasPreRequisites.toString());
  formData.append("visibility", visibility);
  formData.append("position", position);

  if (hasPreRequisites) {
    formData.append("prerequisite_id", prerequisite_id);
    formData.append("prerequisite_type", prerequisite_type);
  }

  if (sub_sections.length > 0) {
    for (const item of sub_sections) {
      const index = sub_sections.indexOf(item);
      formData.append(`sub_sections[${index}][title]`, item.title);
      formData.append(`sub_sections[${index}][description]`, item.description);

      if (item.files.length > 0) {
        for (const file of item.files) {
          const fileIndex = item.files.indexOf(file);
          if (!file.uri || !file.name) continue;

          let fileType = file.mimeType;
          if (!fileType) {
            fileType = await getMimeType(file.uri);
          }

          formData.append(`sub_sections[${index}][files][${fileIndex}]`, {
            uri: file.uri,
            name: file.name,
            type: fileType,
          } as any);
        }
      }

      if (item.videoLink && item.videoLink.length > 0) {
        item.videoLink.forEach((video, videoIndex) => {
          formData.append(
            `sub_sections[${index}][video_links][${videoIndex}]`,
            video,
          );
        });
      }
    }
  }

  const token = await getAuth().currentUser?.getIdToken(true);

  console.log(formData);

  try {
    const res = await fetch(
      `${IPADDRESS}/subject/${subjectId}/module/${moduleId}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      },
    );

    return await res.json();
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

export async function addRemedial(
  subjectId: string,
  title: string,
  description: string,
  files: FileInfo[],
  sub_sections: ModuleSection[],
  focus_ipa: string,
) {
  const formData = new FormData();

  formData.append("title", title);
  formData.append("description", description);
  formData.append("focus_ipa", focus_ipa);

  if (files.length > 0) {
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, {
        uri: file.uri,
        name: file.name,
        type: file.mimeType,
      } as any);
    });
  }

  if (sub_sections.length > 0) {
    sub_sections.forEach((item, index) => {
      formData.append(`sub_sections[${index}][title]`, item.title);
      formData.append(`sub_sections[${index}][description]`, item.description);

      if (item.files?.length > 0) {
        item.files.forEach((file, fileIndex) => {
          formData.append(`sub_sections[${index}][files][${fileIndex}]`, {
            uri: file.uri,
            name: file.name,
            type: file.mimeType,
          } as any);
        });
      }

      if (item.videoLink && item.videoLink.length > 0) {
        item.videoLink.forEach((video, videoIndex) => {
          formData.append(
            `sub_sections[${index}][video_links][${videoIndex}]`,
            video,
          );
        });
      }
    });
  }

  const token = await getAuth().currentUser?.getIdToken(true);
  console.log(formData);

  try {
    const res = await fetch(
      `${IPADDRESS}/subject/${subjectId}/module/remedial`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      },
    );

    return await res.json();
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

interface Word {
  id: string;
  word: string;
  media: FileInfo | null;
  video_link: string;
}

export async function addRemedialAuditory(
  subjectId: string,
  title: string,
  description: string,
  files: FileInfo[],
  sub_sections: ModuleSection[],
  remedial_for: string,
  words: Word[],
) {
  const formData = new FormData();

  formData.append("title", title);
  formData.append("description", description);
  formData.append("remedial_for", remedial_for);

  if (files.length > 0) {
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, {
        uri: file.uri,
        name: file.name,
        type: file.mimeType,
      } as any);
    });
  }

  if (sub_sections.length > 0) {
    sub_sections.forEach((item, index) => {
      formData.append(`sub_sections[${index}][title]`, item.title);
      formData.append(`sub_sections[${index}][description]`, item.description);

      if (item.files?.length > 0) {
        item.files.forEach((file, fileIndex) => {
          formData.append(`sub_sections[${index}][files][${fileIndex}]`, {
            uri: file.uri,
            name: file.name,
            type: file.mimeType,
          } as any);
        });
      }

      if (item.videoLink && item.videoLink.length > 0) {
        item.videoLink.forEach((video, videoIndex) => {
          formData.append(
            `sub_sections[${index}][video_links][${videoIndex}]`,
            video,
          );
        });
      }
    });
  }

  if (words.length > 0) {
    words.forEach((item, index) => {
      formData.append(`words[${index}][word]`, item.word);

      if (item.media) {
        formData.append(`words[${index}][file]`, {
          uri: item.media.uri,
          name: item.media.name,
          type: item.media.mimeType,
        } as any);
      }

      if (item.video_link) {
        formData.append(`words[${index}][video_link]`, item.video_link);
      }
    });
  }

  const token = await getAuth().currentUser?.getIdToken(true);
  console.log(formData);

  try {
    const res = await fetch(
      `${IPADDRESS}/subject/${subjectId}/module/remedial/auditory`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      },
    );

    return await res.json();
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

export async function updateRemedialAuditory(
  subjectId: string,
  title: string,
  description: string,
  files: FileInfo[],
  sub_sections: ModuleSection[],
  remedial_for: string,
  words: Word[],
  moduleId: string,
) {
  const formData = new FormData();

  formData.append("title", title);
  formData.append("description", description);
  formData.append("remedial_for", remedial_for);

  if (files.length > 0) {
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, {
        uri: file.uri,
        name: file.name,
        type: file.mimeType,
      } as any);
    });
  }

  if (sub_sections.length > 0) {
    sub_sections.forEach((item, index) => {
      formData.append(`sub_sections[${index}][title]`, item.title);
      formData.append(`sub_sections[${index}][description]`, item.description);

      if (item.files?.length > 0) {
        item.files.forEach((file, fileIndex) => {
          formData.append(`sub_sections[${index}][files][${fileIndex}]`, {
            uri: file.uri,
            name: file.name,
            type: file.mimeType,
          } as any);
        });
      }

      if (item.videoLink && item.videoLink.length > 0) {
        item.videoLink.forEach((video, videoIndex) => {
          formData.append(
            `sub_sections[${index}][video_links][${videoIndex}]`,
            video,
          );
        });
      }
    });
  }

  if (words.length > 0) {
    words.forEach((item, index) => {
      formData.append(`words[${index}][word]`, item.word);

      if (item.media) {
        formData.append(`words[${index}][file]`, {
          uri: item.media.uri,
          name: item.media.name,
          type: item.media.mimeType,
        } as any);
      }

      if (item.video_link) {
        formData.append(`words[${index}][video_link]`, item.video_link);
      }
    });
  }

  const token = await getAuth().currentUser?.getIdToken(true);
  console.log(formData);

  try {
    const res = await fetch(
      `${IPADDRESS}/subject/${subjectId}/module/remedial/auditory/${moduleId}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      },
    );

    return await res.json();
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

export async function updateRemedial(
  subjectId: string,
  title: string,
  description: string,
  files: FileInfo[],
  sub_sections: ModuleSection[],
  focus_ipa: string,
  moduleId: string,
) {
  const formData = new FormData();

  formData.append("title", title);
  formData.append("description", description);
  formData.append("focus_ipa", focus_ipa);

  if (files.length > 0) {
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, {
        uri: file.uri,
        name: file.name,
        type: file.mimeType,
      } as any);
    });
  }

  if (sub_sections.length > 0) {
    sub_sections.forEach((item, index) => {
      formData.append(`sub_sections[${index}][title]`, item.title);
      formData.append(`sub_sections[${index}][description]`, item.description);

      if (item.files?.length > 0) {
        item.files.forEach((file, fileIndex) => {
          formData.append(`sub_sections[${index}][files][${fileIndex}]`, {
            uri: file.uri,
            name: file.name,
            type: file.mimeType,
          } as any);
        });
      }

      if (item.videoLink && item.videoLink.length > 0) {
        item.videoLink.forEach((video, videoIndex) => {
          formData.append(
            `sub_sections[${index}][video_links][${videoIndex}]`,
            video,
          );
        });
      }
    });
  }

  const token = await getAuth().currentUser?.getIdToken(true);
  console.log(formData);

  try {
    const res = await fetch(
      `${IPADDRESS}/subject/${subjectId}/module/remedial/${moduleId}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      },
    );

    return await res.json();
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
