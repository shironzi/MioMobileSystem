import { api } from "@/utils/apiClient";
import { getAuth } from "@react-native-firebase/auth";

const IPADDRESS = process.env.EXPO_PUBLIC_IP_ADDRESS;

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

    const token = await getAuth().currentUser?.getIdToken(true);

    const res = await fetch(`${IPADDRESS}/message/sent/${receiver_id}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Validation or server error:", data);
    }

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
) {
  try {
    const { data } = await api.post(`/message/reply/${receiver_id}`, {
      subject: subject,
      body: body,
    });

    console.log(subject);
    console.log(body);

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

export async function getSubjectStudents(subjectId: string) {
  try {
    const { data } = await api.get(`/message/${subjectId}`);

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
