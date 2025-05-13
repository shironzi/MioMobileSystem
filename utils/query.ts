import { api } from "@/utils/apiClient";

export async function getSubjects(gradeLevel: string) {
    const { data } = await api.get(`/subjects?gradeLevel=${gradeLevel}`);

    return data;
}

export async function getSubjectDetails(gradeLevel: string, subjectId: string) {
    const { data } = await api.get(`/subject?gradeLevel=${gradeLevel}&subjectId=${subjectId}`)

    return { data }
}
