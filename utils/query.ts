import { api } from "@/utils/apiClient";
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

    console.log(formdata);

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

export async function deleteAnnouncement(
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

export async function deleteAnnouncements(
  subjectId: string,
  announcement_ids: string[],
) {
  try {
    const payload = { announcement_ids: announcement_ids };

    const { data } = await api.delete(`/subject/${subjectId}/announcement`, {
      data: payload, // ✅ CORRECT: attaches the JSON body properly
    });

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

export async function deleteQuiz(subjectId: string, assignmentId: string) {
  try {
    const { data } = await api.delete(
      `/subject/${subjectId}/quiz/${assignmentId}`,
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

const convertTo24HourFormat = (time: string): string => {
  // Regular expression to match the time and AM/PM
  const regex = /(\d{1,2}):(\d{2})\s?(AM|PM)/i;

  // Check if the time is in AM/PM format
  const match = time.match(regex);

  if (match) {
    let hour = parseInt(match[1], 10);
    const minutes = match[2];
    const period = match[3].toUpperCase(); // AM or PM

    if (period === "PM" && hour !== 12) {
      hour += 12; // Convert PM hour to 24-hour format, except 12 PM
    } else if (period === "AM" && hour === 12) {
      hour = 0; // Convert 12 AM to 00 hours
    }

    // Return the time in 24-hour format
    return `${hour}:${minutes}`;
  }

  return time; // Return the original time if no AM/PM format
};

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
    const availableTo = convertTo24HourFormat(availabilityTo);
    const availableFrom = convertTo24HourFormat(availabilityFrom);

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
    const availableTo = convertTo24HourFormat(availabilityTo);
    const availableFrom = convertTo24HourFormat(availabilityFrom);

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

export async function getStudents(subjectId: string) {
  try {
    const { data } = await api.get(`/subject/${subjectId}/students`);

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

export async function getPeoples(subjectId: string) {
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

export async function getAuditoryRemedialAttempt(
  subjectId: string,
  activityType: string,
  remedialId: string,
  studentid: string,
  attemptId: string,
) {
  try {
    const { data } = await api.get(
      `/subject/${subjectId}/scores/remedialList/${studentid}/${activityType}/${remedialId}/${attemptId}/auditory`,
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

export async function getStudentRemedialAuditory(
  subjectId: string,
  activityType: string,
  remedialId: string,
) {
  try {
    const { data } = await api.get(
      `/subject/${subjectId}/scores/remedialList/${activityType}/${remedialId}/auditory`,
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

export async function addRemedialComment(
  subjectId: string,
  activityType: string,
  studentId: string,
  attemptId: string,
  comment: string,
  remedialId: string,
  phoneme: string,
) {
  try {
    const { data } = await api.post(
      `/subject/${subjectId}/scores/remedialList/${studentId}/${activityType}/${remedialId}/${phoneme}/${attemptId}`,
      { comment: comment },
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

export async function addComment(
  subjectId: string,
  activityType: string,
  activityId: string,
  studentId: string,
  attemptId: string,
  comment: string,
) {
  try {
    const { data } = await api.post(
      `/subject/${subjectId}/teacher/scores/${activityType}/${activityId}/${studentId}/${attemptId}`,
      { comment: comment },
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

export async function addAuditoryComment(
  subjectId: string,
  activityType: string,
  remedialId: string,
  studentId: string,
  attemptId: string,
  comment: string,
) {
  try {
    const { data } = await api.post(
      `/subject/${subjectId}/scores/remedialList/${studentId}/${activityType}/${remedialId}/${attemptId}`,
      { comment: comment },
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
  deadline: Date | null;
  availableFrom: Date | null;
  availableTo: Date | null;
  attempts: number;
  access_code: string;
  time_limit: string;
  show_answer: boolean;
  visibility: string;
}

interface QuizItem {
  id: string;
  item_id?: string;
  question: string;
  choices: string[];
  answer: string[];
  questionType:
    | "multiple_choice"
    | "multiple_multiple"
    | "essay"
    | "file_upload"
    | "fill"
    | "dropdown";
  points: number;
}

const getTime = (date: Date) => {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

export async function createQuiz(
  subjectId: string,
  quizInfo: QuizInfo,
  quizItems: QuizItem[],
) {
  try {
    const formdata = new FormData();

    console.log(quizInfo.deadline);

    formdata.append("title", quizInfo.title);
    formdata.append("description", quizInfo.description);
    formdata.append("attempts", quizInfo.attempts.toString());
    formdata.append("time_limit", quizInfo.time_limit);
    formdata.append("access_code", quizInfo.access_code || "");
    formdata.append("show_correct_answers", quizInfo.show_answer.toString());
    formdata.append("visibility", quizInfo.visibility);

    if (quizInfo.deadline) {
      formdata.append(
        "deadline_date",
        quizInfo.deadline.toISOString().split("T")[0],
      );
    }

    if (quizInfo.availableFrom) {
      formdata.append("start_time", getTime(quizInfo.availableFrom));
    }
    if (quizInfo.availableTo) {
      formdata.append("end_time", getTime(quizInfo.availableTo));
    }

    quizItems.forEach((item, index) => {
      console.log(item);
      formdata.append(`questions[${index}][question]`, item.question);
      formdata.append(
        `questions[${index}][answer]`,
        Array.isArray(item.answer) ? item.answer.join("||") : item.answer,
      );
      formdata.append(`questions[${index}][points]`, item.points.toString());
      formdata.append(`questions[${index}][questionType]`, item.questionType);

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
    formdata.append("time_limit", quizInfo.time_limit);
    formdata.append("access_code", quizInfo.access_code || "");
    formdata.append("show_correct_answers", "false");

    if (quizInfo.deadline) {
      formdata.append(
        "deadline_date",
        quizInfo.deadline.toISOString().split("T")[0],
      );
    }

    if (quizInfo.availableFrom) {
      formdata.append("start_time", getTime(quizInfo.availableFrom));
    }
    if (quizInfo.availableTo) {
      formdata.append("end_time", getTime(quizInfo.availableTo));
    }

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

      if (item.choices && item.choices.length > 0) {
        item.choices.forEach((choice, optIdx) => {
          formdata.append(`questions[${index}][options][${optIdx}]`, choice);
        });
      }
    });

    const token = await getAuth().currentUser?.getIdToken(true);

    const res = await fetch(
      `${IPADDRESS}/subject/${subjectId}/update/quiz/${quizId}`,
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
    const { data } = await api.get(`/subject/${subjectId}/get/quiz/${quizId}`);
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

export async function getQuizScore(subjectId: string, quizId: string) {
  try {
    const { data } = await api.get(
      `/subject/${subjectId}/quiz/score/student/${quizId}`,
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

export async function updateStudentQuiz(
  subjectId: string,
  quizId: string,
  studentId: string,
  transformedData: { itemId: string; score: number }[],
) {
  try {
    console.log(transformedData);
    const { data } = await api.post(
      `/subject/${subjectId}/check/quiz/${quizId}/${studentId}`,
      { items: transformedData },
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

export async function getStudentAssignmentScore(
  subjectId: string,
  assignmentId: string,
) {
  try {
    const { data } = await api.get(
      `/subject/${subjectId}/score/assignments/${assignmentId}`,
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
