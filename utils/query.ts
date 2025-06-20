import { api } from "@/utils/apiClient";
import { getAuth } from "@react-native-firebase/auth";
import { getDateAndTime } from "@/utils/DateFormat";

const IPADDRESS = process.env.EXPO_PUBLIC_IP_ADDRESS;

export async function getSubjects() {
  try {
    const { data } = await api.get(`/subjects`);

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

export async function getAnnouncementById(
  subjectId: string,
  announcementId: string,
) {
  try {
    const { data } = await api.get(
      `/subject/${subjectId}/announcement/${announcementId}`,
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

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

export async function createAnnouncement(
  title: string,
  description: string,
  files: FileInfo[],
  urls: string[],
  subjectId: string,
  formattedDate: string,
) {
  try {
    const formdata = new FormData();

    formdata.append("title", title);
    formdata.append("description", description);
    formdata.append("date_posted", formattedDate);

    files.forEach((file, index) => {
      formdata.append(`files[${index}][file]`, {
        name: file.name,
        uri: file.uri,
        type: file.mimeType,
      } as any);
    });

    urls.forEach((url, index) => {
      if (!url.trim()) return;
      formdata.append(`urls[${index}][url]`, url);
    });

    const token = await getAuth().currentUser?.getIdToken(true);

    const res = await fetch(`${IPADDRESS}/subject/${subjectId}/announcement`, {
      method: "POST",
      headers: {
        Accept: "multipart/json",
        "Content-Type": "multipart/form-data",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formdata,
    });

    const responseJson = await res.json();
    console.log(responseJson);
    return responseJson;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function editAnnouncement(
  title: string,
  description: string,
  files: FileInfo[],
  urls: string[],
  existingImageUrls: { url: string; name: string }[],
  subjectId: string,
  announcementId: string,
  formattedDate: string,
) {
  try {
    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("date_posted", formattedDate);

    existingImageUrls.forEach((url, idx) => {
      if (url.url.trim()) {
        formData.append(`image_urls[${idx}]`, url.url);
      }
    });

    files.forEach((file, idx) => {
      if (!file.uri) return;
      formData.append(`files[${idx}][file]`, {
        uri: file.uri,
        name: file.name,
        type: file.mimeType ?? "application/octet-stream",
      } as any);
    });

    urls.forEach((url, idx) => {
      if (url.trim()) {
        formData.append(`urls[${idx}][url]`, url);
      }
    });

    console.log(formData);

    const token = await getAuth().currentUser?.getIdToken(true);
    const res = await fetch(
      `${IPADDRESS}/subject/${subjectId}/announcement/${announcementId}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      },
    );

    if (!res.ok) {
      const text = await res.text();
      console.error(`Update failed (${res.status}): ${text}`);
    }

    return await res.json();
  } catch (err) {
    console.error("editAnnouncement error:", err);
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

export async function getAssignments(subjectId: string) {
  try {
    const { data } = await api.get(`/subject/${subjectId}/assignments`);

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function deleteAssignment(
  subjectId: string,
  assignmentId: string,
) {
  try {
    const { data } = await api.delete(
      `/subject/${subjectId}/assignment/${assignmentId}`,
    );

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function getAssignmentById(
  subjectId: string,
  assignmentId: string,
) {
  try {
    const { data } = await api.get(
      `/subject/${subjectId}/assignment/${assignmentId}`,
    );

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
        start: "2025-06-01T08:00:00Z",
        end: "2025-06-10T23:59:59Z",
      },
      attempts: 2,
      title: "Midterm Essay Submission",
      description:
        "Please submit your midterm essay as a PDF. Late submissions will be penalized.",
      total: 50,
      submission_type: "file",
      published_at: "2025-05-31T12:00:00Z",
      deadline: "2025-06-10T23:59:59Z",
    });

    const { data } = await api.put(
      `/subject/${subjectId}/assignment`,
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

export async function editAssignment(
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

export async function getQuizById(subjectId: string, quizId: string) {
  try {
    const { data } = await api.get(`/subject/${subjectId}/quiz/${quizId}`);

    return data;
  } catch (err) {
    console.error("Get Quizzes Error: " + err);
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

export async function getStudents(subjectId: string) {
  try {
    const { data } = await api.get(`/subject/${subjectId}/peoples`);

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function getAttempts(
  subjectId: string,
  activityType: string,
  activityId: string,
  userId: string,
) {
  try {
    const { data } = await api.get(
      `/subject/${subjectId}/scores/${activityType}/${activityId}/${userId}`,
    );

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function getAttempt(
  subjectId: string,
  activityType: string,
  activityId: string,
  userId: string,
  attemptId: string,
) {
  try {
    const { data } = await api.get(
      `/subject/${subjectId}/scores/${activityType}/${activityId}/${userId}/${attemptId}`,
    );

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function getAttendance(subjectId: string) {
  try {
    const { data } = await api.get(`/subject/${subjectId}/attendance`);

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function getAttendanceById(
  subjectId: string,
  attendanceId: string,
) {
  try {
    const { data } = await api.get(
      `/subject/${subjectId}/attendance/${attendanceId}`,
    );

    return data;
  } catch (err) {
    console.error(err);
  }
}

export async function getAttendanceStudents(subjectId: string) {
  try {
    const { data } = await api.get(`/subject/${subjectId}/attendance/students`);
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function addAttendance(
  subjectId: string,
  attendanceId: string,
  payload: {
    student_id: string;
    status: string;
  }[],
) {
  try {
    console.log({ students: payload });

    const { data } = await api.post(
      `/subject/${subjectId}/attendance/${attendanceId}`,
      { students: payload },
    );

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function editAttendance(
  subjectId: string,
  attendanceId: string,
  payload: {
    student_id: string;
    status: string;
  }[],
) {
  try {
    console.log({ students: payload });

    const { data } = await api.put(
      `/subject/${subjectId}/attendance/${attendanceId}`,
      {
        students: payload,
      },
    );

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function getProfile() {
  try {
    const { data } = await api.get(`profile`);

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function editProfile(picture: FileInfo | null, biography: string) {
  try {
    const formdata = new FormData();

    if (picture) {
      formdata.append(`photo`, {
        name: picture.name,
        uri: picture.uri,
        type: picture.mimeType,
      } as any);
    }
    formdata.append("biography", biography);

    const token = await getAuth().currentUser?.getIdToken(true);

    const res = await fetch(`${IPADDRESS}/profile`, {
      method: "POST",
      headers: {
        Accept: "multipart/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formdata,
    });

    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

interface QuizInfo {
  title: string;
  description: string;
  deadline: string;
  availableFrom: string;
  availableTo: string;
  attempts: number;
  access_code: string;
  time_limit: string;
}

interface QuizItem {
  id: string;
  item_id?: string;
  question: string;
  choices: string[];
  answer: string[];
  questionType:
    | "multiple_choice"
    | "essay"
    | "file_upload"
    | "fill"
    | "dropdown";
  multiple_type: "radio" | "checkbox";
  points: number;
}

export async function createQuiz(
  subjectId: string,
  quizInfo: QuizInfo,
  quizItems: QuizItem[],
) {
  try {
    const formdata = new FormData();

    formdata.append("title", quizInfo.title);
    formdata.append("description", quizInfo.description);
    formdata.append("attempts", quizInfo.attempts.toString());
    formdata.append("deadline_date", getDateAndTime(quizInfo.deadline) || "");
    formdata.append("start_time", quizInfo.availableFrom);
    formdata.append("end_time", quizInfo.availableTo);
    formdata.append("time_limit", quizInfo.time_limit);
    formdata.append("access_code", quizInfo.access_code || "");
    formdata.append("show_correct_answers", "false");

    quizItems.forEach((item, index) => {
      console.log(item);
      formdata.append(`questions[${index}][question]`, item.question);
      formdata.append(
        `questions[${index}][answer]`,
        Array.isArray(item.answer) ? item.answer.join("||") : item.answer,
      );
      formdata.append(`questions[${index}][points]`, item.points.toString());
      formdata.append(`questions[${index}][questionType]`, item.questionType);

      if (item.multiple_type) {
        formdata.append(
          `questions[${index}][multiple_type]`,
          item.multiple_type,
        );
      }

      if (item.choices && item.choices.length > 0) {
        item.choices.forEach((choice, optIdx) => {
          formdata.append(`questions[${index}][options][${optIdx}]`, choice);
        });
      }
    });

    const token = await getAuth().currentUser?.getIdToken(true);

    const res = await fetch(`${IPADDRESS}/subject/${subjectId}/quiz`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formdata,
    });

    return await res.json();
  } catch (err) {
    console.error("Quiz creation failed:", err);
    throw err;
  }
}

export async function updateQuiz(
  subjectId: string,
  quizId: string,
  quizInfo: QuizInfo,
  quizItems: QuizItem[],
) {
  try {
    const formdata = new FormData();

    formdata.append("title", quizInfo.title);
    formdata.append("description", quizInfo.description);
    formdata.append("attempts", quizInfo.attempts.toString());
    formdata.append("deadline_date", getDateAndTime(quizInfo.deadline) || "");
    formdata.append("start_time", quizInfo.availableFrom);
    formdata.append("end_time", quizInfo.availableTo);
    formdata.append("time_limit", quizInfo.time_limit);
    formdata.append("access_code", quizInfo.access_code || "");
    formdata.append("show_correct_answers", "false");

    quizItems.forEach((item, index) => {
      formdata.append(`questions[${index}][question]`, item.question);

      formdata.append(
        `questions[${index}][answer]`,
        Array.isArray(item.answer) ? item.answer.join("||") : item.answer,
      );

      formdata.append(`questions[${index}][points]`, item.points.toString());
      formdata.append(`questions[${index}][questionType]`, item.questionType);

      if (item.item_id) {
        formdata.append(`questions[${index}][item_id]`, item.item_id);
      }

      if (item.multiple_type) {
        formdata.append(
          `questions[${index}][multiple_type]`,
          item.multiple_type,
        );
      }

      if (item.choices && item.choices.length > 0) {
        item.choices.forEach((choice, optIdx) => {
          formdata.append(`questions[${index}][options][${optIdx}]`, choice);
        });
      }
    });

    const token = await getAuth().currentUser?.getIdToken(true);

    const res = await fetch(
      `${IPADDRESS}/subject/${subjectId}/quiz/${quizId}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formdata,
      },
    );

    return await res.json();
  } catch (err) {
    console.error("Quiz update failed:", err);
    throw err;
  }
}

export async function getQuizzes(subjectId: string) {
  try {
    const { data } = await api.get(`/subject/${subjectId}/quiz`);

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function getQuiz(subjectId: string, quizId: string) {
  try {
    const { data } = await api.get(`/subject/${subjectId}/quiz/${quizId}`);
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function getQuizAttempts(subjectId: string, quizId: string) {
  try {
    const { data } = await api.get(`/subject/${subjectId}/quiz/${quizId}`);

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function takeQuiz(subjectId: string, quizId: string) {
  try {
    const { data } = await api.post(`/subject/${subjectId}/quiz/${quizId}`);

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function continueQuiz(
  subjectId: string,
  quizId: string,
  attemptId: string,
) {
  try {
    const { data } = await api.get(
      `/subject/${subjectId}/quiz/${quizId}/${attemptId}`,
    );

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function submitAnswer(
  subjectId: string,
  quizId: string,
  attemptId: string,
  itemId: string,
  answer: string | string[] | null,
  file?: FileInfo[] | null,
) {
  try {
    const formdata = new FormData();

    if (typeof answer === "string") {
      formdata.append("answer_text", answer);
    } else if (Array.isArray(answer)) {
      answer.forEach((val, index) => {
        formdata.append(`answer_array[${index}]`, val);
      });
    }

    if (file && file.length > 0) {
      const firstFile = file[0];
      formdata.append("answer_file", {
        uri: firstFile.uri,
        name: firstFile.name,
        type: firstFile.mimeType,
      } as any);
    }

    const token = await getAuth().currentUser?.getIdToken(true);

    const res = await fetch(
      `${IPADDRESS}/subject/${subjectId}/quiz/${quizId}/${attemptId}/${itemId}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formdata,
      },
    );

    return await res.json();
  } catch (err) {
    console.error("Submit answer failed:", err);
    throw err;
  }
}

export async function finalizeQuiz(
  subjectId: string,
  quizId: string,
  attemptId: string,
) {
  try {
    const { data } = await api.post(
      `/subject/${subjectId}/quiz/${quizId}/${attemptId}`,
    );
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
