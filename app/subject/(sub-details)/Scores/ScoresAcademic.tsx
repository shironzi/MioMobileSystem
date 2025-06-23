import { Text, View } from "react-native";
import useHeaderConfig from "@/utils/HeaderConfig";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import {
  getStudentAssignmentAttempt,
  getStudentQuizAttempt,
} from "@/utils/query";

const ScoresAcademic = () => {
  useHeaderConfig("Scores");

  const { subjectId, activityType, activityId, studentId, role } =
    useLocalSearchParams<{
      subjectId: string;
      activityType: string;
      activityId: string;
      studentId: string;
      role: string;
    }>();

  console.log(subjectId);
  console.log(activityType);
  console.log(activityId);
  console.log(subjectId);

  useEffect(() => {
    const fetchScores = async () => {
      const res =
        activityType === "quizzes"
          ? await getStudentQuizAttempt(subjectId, activityId, studentId)
          : await getStudentAssignmentAttempt(subjectId, activityId, studentId);

      console.log(res);
    };

    fetchScores();
  });

  return (
    <View>
      <Text>Latest Attempts</Text>
    </View>
  );
};

export default ScoresAcademic;
