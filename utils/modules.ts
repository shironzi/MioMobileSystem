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

  if (files.length > 0) {
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, {
        uri: file.uri,
        name: file.name,
        type: file.mimeType,
      } as any);
    });
  }

  formData.append("prereq_status", hasPreRequisites.toString());
  formData.append("visibility", visibility);
  formData.append("position", position);

  if (hasPreRequisites) {
    formData.append("prerequisite_id", prerequisite_id);
    formData.append("prerequisite_type", prerequisite_type);
  }

  if (sub_sections.length > 0) {
    sub_sections.forEach((item, index) => {
      formData.append(`sub_sections[${index}][title]`, item.title);
      formData.append(`sub_sections[${index}][description]`, item.description);

      if (item.files?.length > 0) {
        item.files.forEach((file, index) => {
          formData.append(`sub_sections[${index}][files][${index}]`, {
            uri: file.uri,
            name: file.name,
            type: file.mimeType,
          } as any);
        });
      }

      if (item.videoLink && item.videoLink.length > 0) {
        item.videoLink.forEach((video, index) => {
          formData.append(
            `sub_sections[${index}][video_links][${index}]`,
            video,
          );
        });
      }
    });
  }

  const token = await getAuth().currentUser?.getIdToken(true);

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

export async function addRemedial(
  subjectId: string,
  title: string,
  description: string,
  files: FileInfo[],
  sub_sections: ModuleSection[],
  position: string,
) {
  const formData = new FormData();

  formData.append("title", title);
  formData.append("description", description);

  if (files.length > 0) {
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, {
        uri: file.uri,
        name: file.name,
        type: file.mimeType,
      } as any);
    });
  }

  formData.append("position", position);

  if (sub_sections.length > 0) {
    sub_sections.forEach((item, index) => {
      formData.append(`sub_sections[${index}][title]`, item.title);
      formData.append(`sub_sections[${index}][description]`, item.description);

      if (item.files?.length > 0) {
        item.files.forEach((file, index) => {
          formData.append(`sub_sections[${index}][files][${index}]`, {
            uri: file.uri,
            name: file.name,
            type: file.mimeType,
          } as any);
        });
      }

      if (item.videoLink && item.videoLink.length > 0) {
        item.videoLink.forEach((video, index) => {
          formData.append(
            `sub_sections[${index}][video_links][${index}]`,
            video,
          );
        });
      }
    });
  }

  const token = await getAuth().currentUser?.getIdToken(true);

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
