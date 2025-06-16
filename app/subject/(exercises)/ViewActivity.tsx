import React, { memo, useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import useHeaderConfig from "@/utils/HeaderConfig";
import { useLocalSearchParams } from "expo-router";
import handleCategory from "@/app/subject/(exercises)/Category";
import { getActiveActivity } from "@/utils/specialized";
import globalStyles from "@/styles/globalStyles";

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
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 10, fontSize: 16, color: "#333" }}>
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <View style={[globalStyles.cardContainer, { rowGap: 50 }]}>
        <View
          style={{
            borderWidth: 1,
            borderRadius: 10,
            paddingHorizontal: 10,
            paddingVertical: 15,
          }}
        >
          <Text>
            Practice saying words by looking at pictures. This exercise helps
            you improve your speech by naming what you see using the microphone.
          </Text>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 8 }}>
            Latest Attempts
          </Text>

          {/* Table Header */}
          <View
            style={{
              flexDirection: "row",
              paddingVertical: 6,
              borderBottomWidth: 1,
            }}
          >
            <Text style={{ flex: 1, fontWeight: "bold" }}>Attempt</Text>
            <Text style={{ flex: 1, fontWeight: "bold" }}>Score</Text>
            <Text style={{ flex: 2, fontWeight: "bold" }}>Submitted At</Text>
          </View>

          {/* Table Rows */}
          {attempts.map((attempt, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                paddingVertical: 6,
                borderBottomWidth: 0.5,
                borderColor: "#ccc",
              }}
            >
              <Text style={{ flex: 1 }}>#{index + 1}</Text>
              <Text style={{ flex: 1 }}>{attempt.score ?? "N/A"}</Text>
              <Text style={{ flex: 2 }}>
                {attempt.submitted_at ?? "Not submitted"}
              </Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[globalStyles.submitButton, { marginTop: 20 }]}
          onPress={handleOnStart}
        >
          <Text style={globalStyles.submitButtonText}>Start Activity</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default memo(ViewActivity);
