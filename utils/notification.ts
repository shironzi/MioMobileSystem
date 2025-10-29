import { api } from "@/utils/apiClient";
//
// export async function updateFCMToken(student_id: string, token: string) {
//   try {
//     const { data } = await api.post(`/updateFCMToken/${student_id}`, {
//       token: token,
//     });
//
//     return data;
//   } catch (err: any) {
//     if (err.response) {
//       return err.response.status;
//     } else if (err.request) {
//       return { error: "No response from server" };
//     } else {
//       return { error: err.message };
//     }
//   }
// }
//
// export async function removeFCMToken(student_id: string) {
//   try {
//     const { data } = await api.put(`/removeFCMToken/${student_id}`);
//
//     return data;
//   } catch (err: any) {
//     if (err.response) {
//       return err.response.status;
//     } else if (err.request) {
//       return { error: "No response from server" };
//     } else {
//       return { error: err.message };
//     }
//   }
// }

export async function getNotifications() {
  try {
    const { data } = await api.get(`/notifications`);

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

export async function dismissNotification(notificationId: string) {
  try {
    const { data } = await api.post(`/notification/${notificationId}`);

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
