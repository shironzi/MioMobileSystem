import { api } from "@/utils/apiClient";
import { getDateAndTime } from "@/utils/DateFormat";
import { getAuth } from "@react-native-firebase/auth";

const IPADDRESS = process.env.EXPO_PUBLIC_IP_ADDRESS;

export async function getSubjects() {
  try {
    const { data } = await api.get(`/subjects`);

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

export async function getAnnouncements(subjectId: string) {
  try {
    const { data } = await api.get(`/subject/${subjectId}/announcements`);

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

export async function deleteAnnouncements(
  subjectId: string,
  announcementId: string,
) {
  try {
    const { data } = await api.delete(
      `/subject/${subjectId}/announcement/${announcementId}`,
    );

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

export async function getAssignments(subjectId: string) {
  try {
    const { data } = await api.get(`/subject/${subjectId}/assignments`);

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

export async function submitAssignmentEval(
  studentId: string,
  assignmentId: string,
  subjectId: string,
  comments: string,
  feedback: string,
  score: string,
) {
  try {
    const newScore = parseInt(score);
    console.log({
      comments: comments,
      feedback: feedback,
      score: newScore,
    });

    const { data } = await api.put(
      `/subject/${subjectId}/assignment/${assignmentId}/${studentId}`,
      {
        comments: comments,
        feedback: feedback,
        score: newScore,
      },
    );

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

export async function deleteAssignment(
  subjectId: string,
  assignmentId: string,
) {
  try {
    const { data } = await api.delete(
      `/subject/${subjectId}/assignment/${assignmentId}`,
    );

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

enum SubmissionOptions {
  Text = "Text",
  File = "File",
}

export async function submitAssignment(
  subjectId: string,
  assignmentId: string,
  answer: string,
  answerFiles: FileInfo | undefined,
  submissionType: SubmissionOptions,
) {
  try {
    const formdata = new FormData();
    console.log(answerFiles);

    if (submissionType === SubmissionOptions.Text) {
      formdata.append("answer_text", answer);
    } else if (submissionType === SubmissionOptions.File && answerFiles) {
      formdata.append("answer_file", {
        uri: answerFiles.uri,
        name: answerFiles.name,
        type: answerFiles.mimeType,
      } as any);
    }

    const token = await getAuth().currentUser?.getIdToken(true);

    const res = await fetch(
      `${IPADDRESS}/subject/${subjectId}/assignment/${assignmentId}/answer`,
      {
        method: "POST",
        headers: {
          Accept: "multipart/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formdata,
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

export async function getAssignmentById(
  subjectId: string,
  assignmentId: string,
) {
  try {
    const { data } = await api.get(
      `/subject/${subjectId}/assignment/${assignmentId}`,
    );

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

function formatDateToCustomFormat(dateString: Date) {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function formatDateToDateOnly(dateString: Date) {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export async function createAssignment(
  subjectId: string,
  availabilityTo: string,
  availabilityFrom: string,
  title: string,
  description: string,
  attempts: number,
  submissionType: string,
  deadline: Date | null,
  points: number,
  publishDate: Date,
  fileSize: number,
  visibility: boolean,
  fileTypes: string[],
) {
  try {
    const availableTo = availabilityTo.replace(/\s?(AM|PM)/i, "").trim();
    const availableFrom = availabilityFrom.replace(/\s?(AM|PM)/i, "").trim();

    const payload = JSON.stringify({
      availabilityFrom: availableFrom,
      availabilityTo: availableTo,
      attempts: attempts,
      title: title,
      description: description,
      total: points,
      submission_type: submissionType,
      published_at: formatDateToCustomFormat(publishDate),
      deadline: deadline ? formatDateToDateOnly(deadline) : null,
      file_size: fileSize,
      visibility: visibility,
      file_types_types: fileTypes ?? null,
    });

    console.log(payload);

    const { data } = await api.post(
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

export async function editAssignment(
  subjectId: string,
  assignmentId: string,
  availabilityTo: string,
  availabilityFrom: string,
  title: string,
  description: string,
  attempts: number,
  submissionType: string,
  deadline: Date | null,
  points: number,
  publishDate: Date,
  fileSize: number,
  visibility: boolean,
  fileTypes: string[],
) {
  try {
    const availableTo = availabilityTo.replace(/\s?(AM|PM)/i, "").trim();
    const availableFrom = availabilityFrom.replace(/\s?(AM|PM)/i, "").trim();

    const payload = JSON.stringify({
      availability: {
        start: availableFrom,
        end: availableTo,
      },
      attempts: attempts,
      title: title,
      description: description,
      total: points,
      submission_type: submissionType,
      published_at: formatDateToCustomFormat(publishDate),
      deadline: deadline ? formatDateToDateOnly(deadline) : null,
      file_size: fileSize,
      visibility: visibility,
      file_types_types: fileTypes ?? null,
    });

    console.log(payload);

    const { data } = await api.put(
      `/subject/${subjectId}/assignment/${assignmentId}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );

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

export async function getQuizById(subjectId: string, quizId: string) {
  try {
    const { data } = await api.get(`/subject/${subjectId}/quiz/${quizId}`);

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

export async function getScores(subjectId: string | string[]) {
  try {
    const { data } = await api.get(`/subject/${subjectId}/scores`);

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

export async function getStudents(subjectId: string) {
  try {
    const { data } = await api.get(`/subject/${subjectId}/peoples`);

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

export async function getAttemptStudent(
  subjectId: string,
  activityType: string,
  activityId: string,
  attemptId: string,
) {
  try {
    const { data } = await api.get(
      `/subject/${subjectId}/student/scores/${activityType}/${activityId}/${attemptId}`,
    );

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

export async function getAttendance(subjectId: string) {
  try {
    const { data } = await api.get(`/subject/${subjectId}/attendance`);

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

export async function getAttendanceById(
  subjectId: string,
  attendanceId: string,
) {
  try {
    const { data } = await api.get(
      `/subject/${subjectId}/attendance/${attendanceId}`,
    );

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

export async function getAttendanceStudents(subjectId: string) {
  try {
    const { data } = await api.get(`/subject/${subjectId}/attendance/students`);
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

export async function getProfile() {
  try {
    const { data } = await api.get(`profile`);

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

    const res = await fetch(`${IPADDRESS}/subject/${subjectId}/create/quiz`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formdata,
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

export async function getQuizzes(subjectId: string) {
  try {
    const { data } = await api.get(`/subject/${subjectId}/quiz`);

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

export async function getQuiz(subjectId: string, quizId: string) {
  try {
    const { data } = await api.get(`/subject/${subjectId}/quiz/${quizId}`);
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

export async function getScoreActivityAttemptStudent(
  subjectId: string,
  activityType: string,
  activityId: string,
) {
  try {
    const { data } = await api.get(
      `/subject/${subjectId}/student/scores/${activityType}/${activityId}`,
    );

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

export async function getScoreActivityAttempt(
  subjectId: string,
  activityType: string,
  activityId: string,
  userId: string,
) {
  try {
    const { data } = await api.get(
      `/subject/${subjectId}/teacher/scores/${activityType}/${activityId}/${userId}`,
    );

    console.log(
      `/subject/${subjectId}/scores/${activityType}/${activityId}/${userId}`,
    );

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

export async function getQuizAttempts(subjectId: string, quizId: string) {
  try {
    const { data } = await api.get(`/subject/${subjectId}/quiz/${quizId}`);

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

export async function takeQuiz(subjectId: string, quizId: string) {
  try {
    const { data } = await api.post(`/subject/${subjectId}/quiz/${quizId}`);

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

export async function getStudentQuizAttempt(
  subjectId: string,
  quizId: string,
  studentId: string,
) {
  try {
    const { data } = await api.get(
      `/subject/${subjectId}/check/quiz/${quizId}/${studentId}`,
    );
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

export async function getStudentAssignmentAttempt(
  subjectId: string,
  assignment: string,
  studentId: string,
) {
  try {
    const { data } = await api.get(
      `/subject/${subjectId}/scores/assignment/${assignment}/${studentId}`,
    );
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
