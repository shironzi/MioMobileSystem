import { api } from "@/utils/apiClient";
import { getAuth } from "@react-native-firebase/auth";

const IPADDRESS = process.env.EXPO_PUBLIC_IP_ADDRESS;

export async function getInboxMessages() {
  try {
    const { data } = await api.get(`/messages/inbox`);

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function getSentMessages() {
  try {
    const { data } = await api.get(`/messages/sent`);

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function sendMessage(
  receiver_id: string,
  subject: string,
  body: string,
) {
  try {
    const { data } = await api.post(`/message/sent/${receiver_id}`, {
      subject: subject,
      body: body,
    });

    return data;
  } catch (err) {
    console.error(err);
    throw err;
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
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function getConversation(conversation_id: string) {
  try {
    const { data } = await api.get(`/message/reply/${conversation_id}`);

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function getSubjectTeachers() {
  try {
    const { data } = await api.get(`/message/subjectTeachers`);

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
