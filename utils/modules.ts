import { api } from "@/utils/apiClient";

export async function getModules(subjectId: string) {
  try {
    const { data } = await api.get(`/subjects/${subjectId}/modules`);

    return data;
  } catch (err: any) {
    if (err.response) {
      console.error(err);
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
    const { data } = await api.get(`/subjects/${subjectId}/module/${moduleId}`);

    return data;
  } catch (err: any) {
    if (err.response) {
      console.error(err);
      return err.response.status;
    } else if (err.request) {
      return { error: "No response from server" };
    } else {
      return { error: err.message };
    }
  }
}
