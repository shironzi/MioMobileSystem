import React, { memo, useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import useHeaderConfig from "@/utils/HeaderConfig";
import { useLocalSearchParams } from "expo-router";
import handleCategory from "@/app/subject/(exercises)/Category";
import { getActiveActivity } from "@/utils/specialized";

const ViewActivity = () => {
  useHeaderConfig("Activity");

  const { activity_type, difficulty, category, subjectId, activityId, role } =
    useLocalSearchParams<{
      category: string;
      activity_type: string;
      role: string;
      subjectId: string;
      activityId: string;
      difficulty: string;
    }>();

  const [attempts, setAttempts] = useState<
    { attemptId: string; score: string | null; submitted_at: string | null }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);

  const handleOnStart = () => {
    const inProgressAttempt = attempts.find(
      (attempt) => attempt.submitted_at === null,
    );

    handleCategory({
      category,
      activity_type,
      role,
      subjectId,
      activityId,
      difficulty,
      attemptId: inProgressAttempt?.attemptId || "",
    });
  };

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const res = await getActiveActivity(
          subjectId,
          activity_type,
          activityId,
        );
        const entries = Object.entries(res.attempts ?? {}).map(
          ([key, value]: [string, any]) => ({
            attemptId: key,
            submitted_at: value.submitted_at,
            score: value.score,
          }),
        );
        setAttempts(entries);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching attempts:", err);
        setAttempts([]);
      }
    };

    fetchAttempts();
  }, []);

  if (loading) {
    return (
      <View>
        <Text>Loading.......</Text>
      </View>
    );
  }

  return (
    <View>
      <View>
        <Text>
          Practice saying words by looking at pictures. This exercise helps you
          improve your speech by naming what you see using the microphone.
        </Text>
      </View>

      <View>
        <Text>Latest Attempts</Text>
        {attempts?.map((attempt, index) => (
          <View key={index} style={{ flexDirection: "row", marginVertical: 4 }}>
            <Text>Attempt {index + 1}</Text>
            <Text>Score: {attempt.score ?? "N/A"}</Text>
            <Text>Submitted at: {attempt.submitted_at ?? "Not submitted"}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity onPress={handleOnStart}>
        <Text>Start Activity</Text>
      </TouchableOpacity>
    </View>
  );
};

export default memo(ViewActivity);
