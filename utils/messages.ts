import { api } from "@/utils/apiClient";

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

export async function getInboxMessages() {
  try {
    const { data } = await api.get(`/messages/inbox`);

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

export async function getSentMessages() {
  try {
    const { data } = await api.get(`/messages/sent`);

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

export async function sendMessage(
  receiver_id: string,
  body: string,
  files: FileInfo[] | null,
) {
  try {
    const formData = new FormData();
    formData.append("body", body);

    files?.forEach((file, index) => {
      formData.append(`files[${index}]`, {
        uri: file.uri,
        name: file.name,
        type: file.mimeType,
      } as any);
    });

    const { data } = await api.post(`/message/sent/${receiver_id}`, formData);

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

export async function replyMessage(
  receiver_id: string,
  subject: string,
  body: string,
  files: FileInfo[] | null,
) {
  try {
    const formData = new FormData();
    formData.append("body", body);

    files?.forEach((file, index) => {
      formData.append(`files[${index}]`, {
        uri: file.uri,
        name: file.name,
        type: file.mimeType,
      } as any);
    });

    const { data } = await api.post(`/message/reply/${receiver_id}`, formData);

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

export async function getConversation(conversation_id: string) {
  try {
    const { data } = await api.get(`/message/reply/${conversation_id}`);

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

export async function getSubjectTeachers() {
  try {
    const { data } = await api.get(`/message/subjectTeachers`);

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

export async function getMessagePeoples(subjectId: string) {
  try {
    const { data } = await api.get(`/message/${subjectId}/peoples`);

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

export async function getMessageSubjects() {
  try {
    const { data } = await api.get(`/message/subjects`);

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
