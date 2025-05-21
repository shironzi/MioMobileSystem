import { api } from "@/utils/apiClient";

export async function getSubjects(gradeLevel: string) {
  try {
    const { data } = await api.get(`/subjects?gradeLevel=${gradeLevel}`);

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function getModules(subjectId: string) {
  try {
    const { data } = await api.get(`/subject/${subjectId}/modules`);

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function getAnnouncements(subjectId: string) {
  try {
    const { data } = await api.get(`/subject/${subjectId}/announcements`);

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function editAnnouncements(
  subjectId: string,
  announcementId: string,
  title: string,
  description: string,
) {
  try {
    const payload = JSON.stringify({ title, description });

    const { data } = await api.put(
      `/subject/${subjectId}/announcement/${announcementId}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function createAnnouncement(
  subjectId: string,
  title: string,
  description: string,
) {
  try {
    const payload = JSON.stringify({
      title: title,
      description: description,
    });

    const { data } = await api.post(
      `/subject/${subjectId}/announcement`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function deleteAnnouncements(
  subjectId: string,
  announcementId: string,
) {
  try {
    const { data } = await api.delete(
      `/subject/${subjectId}/announcement/${announcementId}`,
    );

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function getAssignments(subjectId: string | string[]) {
  try {
    const { data } = await api.get(`/subject/${subjectId}/assignments`);

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function createAssignment(
  subjectId: string,
  availability: { start: string | null; end: string | null },
  title: string,
  description: string,
  attempts: number,
  submissionType: string,
  deadline: string | null,
  points: number,
) {
  try {
    const payload = JSON.stringify({
      availability: {
        start: availability.start,
        end: availability.end,
      },
      attempts: attempts,
      title: title,
      description: description,
      total: points,
      submission_type: submissionType,
      deadline: deadline,
      published_at: null,
    });

    const { data } = await api.post(
      `/subject/${subjectId}/assignment/`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function getScores(subjectId: string | string[]) {
  try {
    const { data } = await api.get(`/subject/${subjectId}/scores`);

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
