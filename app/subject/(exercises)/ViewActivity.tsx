import handleCategory from "@/app/subject/(exercises)/Category";
import LoadingCard from "@/components/loadingCard";
import globalStyles from "@/styles/globalStyles";
import useHeaderConfig from "@/utils/HeaderConfig";
import { getActiveActivity } from "@/utils/specialized";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { memo, useCallback, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const ViewActivity = () => {
  useHeaderConfig("Activity");

  const getInstruction = () => {
    const speechActivities = ["picture", "pronunciation", "phrase", "question"];
    const auditoryActivities = ["bingo", "matching"];
    const languageActivities = ["fill", "homonyms"];

    if (speechActivities.includes(activity_type)) {
      return "Look at the prompt. Tap the microphone and say it out loud. Try to pronounce it as clearly as you can.";
    }

    if (auditoryActivities.includes(activity_type)) {
      return "Listen carefully to the sound. Then tap the correct answer that matches what you heard.";
    }

    if (languageActivities.includes(activity_type)) {
      return "Read the sentence carefully. Choose or drag the correct word that best completes the meaning.";
    }

    return "Follow the instructions for this activity.";
  };

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

  useFocusEffect(
    useCallback(() => {
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
          setAttempts([]);
        }
      };

      fetchAttempts();
    }, [subjectId, activity_type, activityId]),
  );

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
        <LoadingCard></LoadingCard>
      </View>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={[globalStyles.container, { backgroundColor: "#fff" }]}
    >
      <View>
        <View
          style={{
            marginHorizontal: 10,
            borderColor: "#ddd",
            borderWidth: 1,
            borderRadius: 20,
            paddingHorizontal: 10,
            paddingVertical: 15,
          }}
        >
          <Text
            style={{
              marginHorizontal: 10,
              textAlign: "justify",
              fontWeight: 500,
              fontSize: 18,
              color: "#2264dc",
            }}
          >
            Piddie Tips!
          </Text>
          <Text
            style={{
              margin: 10,
              textAlign: "justify",
              fontWeight: 300,
              lineHeight: 20,
            }}
          >
            {getInstruction()}
          </Text>
        </View>

        <View
          style={{
            marginVertical: 20,
            marginHorizontal: 10,
            borderColor: "#ddd",
            borderWidth: 1,
            borderRadius: 20,
            paddingHorizontal: 20,
            paddingVertical: 15,
          }}
        >
          <Text style={{ fontWeight: 500, fontSize: 16, marginBottom: 8 }}>
            Latest Attempts
          </Text>
          <View
            style={{
              flexDirection: "row",
              paddingVertical: 6,
              borderBottomWidth: 1,
            }}
          >
            <Text style={{ flex: 1, fontWeight: 500 }}>Attempt</Text>
            <Text style={{ flex: 1, fontWeight: 500 }}>Score</Text>
            <Text style={{ flex: 2, fontWeight: 500 }}>Submitted At</Text>
          </View>
          {attempts.map((attempt, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                paddingVertical: 6,
                borderBottomWidth: 0.5,
                borderColor: "#aaa",
              }}
            >
              <Text style={{ flex: 1 }}>{index + 1}</Text>
              <Text style={{ flex: 1 }}>{attempt.score ?? "N/A"}</Text>
              <Text style={{ flex: 2 }}>
                {attempt.submitted_at ?? "Not submitted"}
              </Text>
            </View>
          ))}
          <TouchableOpacity
            style={[
              globalStyles.submitButton,
              { marginTop: 20, alignSelf: "center" },
            ]}
            onPress={handleOnStart}
          >
            <Text style={globalStyles.submitButtonText}>Start Activity</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default memo(ViewActivity);
