import { api } from "@/utils/apiClient";

export async function getStudentAssignment(
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

export async function submitAssignmentEval(
  studentId: string,
  assignmentId: string,
  subjectId: string,
  comments: string,
  score: number,
) {
  try {
    const { data } = await api.put(
      `/subject/${subjectId}/assignment/${assignmentId}/${studentId}`,
      {
        comments: comments,
        score: score,
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
