import { api } from "@/utils/apiClient";

export async function getSubjects(gradeLevel: string) {
    try {
        const { data } = await api.get(`/subjects?gradeLevel=${gradeLevel}`);

        return data;
    } catch (err) {
        console.error(err)
        throw err
    }
}

export async function getModules(subjectId: string) {
    try {
        const { data } = await api.get(`/subject/${subjectId}/modules`)

        return data
    } catch (err) {
        console.error(err)
        throw err;
    }
}

export async function getAnnouncements(subjectId: string) {
    try {
        const { data } = await api.get(`/subject/${subjectId}/announcements`)

        return data
    } catch (err) {
        console.error(err)
        throw err;
    }
}

export async function editAnnouncements(
    subjectId: string,
    announcementId: string,
    title: string,
    description: string
) {
    try {
        const payload = JSON.stringify({ title, description });

        const {data} = await api.post(
            `/subject/${subjectId}/announcements/${announcementId}`,
            payload,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function getAssignments(subjectId: string | string[]) {
    try {
        const { data } = await api.get(`/subject/${subjectId}/assignments`)

        return data
    } catch (err) {
        console.error(err)
        throw err;
    }
}

export async function getScores(subjectId: string | string[]) {
    try {
        const { data } = await api.get(`/subject/${subjectId}/scores`)

        return data
    } catch (err) {
        console.error(err)
        throw err;
    }
}
