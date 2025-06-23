import { Text, View } from "react-native";
import useHeaderConfig from "@/utils/HeaderConfig";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";

const ScoresAcademic = () => {
  useHeaderConfig("Scores");

  const { subjectId, activityType, activityId, userId, role } =
    useLocalSearchParams<{
      subjectId: string;
      activityType: string;
      activityId: string;
      userId: string;
      role: string;
    }>();

  useEffect(() => {
    const fetchScores = () => {};
  });

  return (
    <View>
      <Text>Latest Attempts</Text>
    </View>
  );
};

export default ScoresAcademic;
