import handleCategory from "@/app/subject/(exercises)/Category";
import LoadingCard from "@/components/loadingCard";
import globalStyles from "@/styles/globalStyles";
import useHeaderConfig from "@/utils/HeaderConfig";
import { getActiveActivity } from "@/utils/specialized";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { memo, useCallback, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface Attempt {
  attemptId: string;
  score: string | null;
  submitted_at: string | null;
}

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

  const getInstruction = useCallback(() => {
    const speechActivities = ["picture", "pronunciation", "phrase", "question"];
    const auditoryActivities = ["bingo", "matching"];
    const languageActivities = ["fill", "homonyms"];

    if (speechActivities.includes(activity_type)) {
      return "Look at the prompt. Tap the microphone and say it out loud. Try to pronounce it as clearly as you can.";
    }

    if (auditoryActivities.includes(activity_type)) {
      return "Listen carefully to the sound. Then tap the correct image that matches what you heard.";
    }

    if (languageActivities.includes(activity_type)) {
      return "Read the sentence carefully. Choose the correct word that best completes the meaning.";
    }

    return "Follow the instructions for this activity.";
  }, [activity_type]);

  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [activeAttempt, setActiveAttempt] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>(true);
  const [totalAttempts, setTotalAttempts] = useState<number>(0);
  const [isPassed, setIsPassed] = useState<boolean>(false);

  const handleOnStart = useCallback(() => {
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
  }, [
    attempts,
    category,
    activity_type,
    role,
    subjectId,
    activityId,
    difficulty,
  ]);

  useFocusEffect(
    useCallback(() => {
      const fetchAttempts = async () => {
        try {
          const res = await getActiveActivity(
            subjectId,
            activity_type,
            activityId,
          );

          if (res.success) {
            const sortedAttempts: Attempt[] = [
              ...(Object.values(res.attempts) as Attempt[]),
            ].sort((a: any, b: any) => {
              const aDate = a.submitted_at ?? "";
              const bDate = b.submitted_at ?? "";

              if (!aDate && bDate) return -1;
              if (!bDate && aDate) return 1;
              if (!aDate && !bDate) return 0;

              return aDate > bDate ? -1 : 1;
            });

            setAttempts(sortedAttempts);
            setActiveAttempt(res.has_active_attempt);
            setTotalAttempts(res.total_attempt);
            setIsPassed(res.is_passed);
          }
        } catch (err) {
          setAttempts([]);
        }
        setLoading(false);
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
    <ScrollView style={[globalStyles.container, { backgroundColor: "#fff" }]}>
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
          {attempts?.map((attempt, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                paddingVertical: 6,
                borderBottomWidth: 0.5,
                borderColor: "#aaa",
              }}
            >
              <Text style={{ flex: 1 }}>{totalAttempts - index}</Text>
              <Text style={{ flex: 1 }}>{attempt.score ?? "N/A"}</Text>
              <Text style={{ flex: 2 }}>
                {attempt.submitted_at ?? "In-progress"}
              </Text>
            </View>
          ))}
          {totalAttempts >= 10 ? (
            <TouchableOpacity
              style={[
                globalStyles.submitButton,
                { marginTop: 20, alignSelf: "center", width: 200 },
              ]}
              onPress={handleOnStart}
            >
              <Text style={[globalStyles.submitButtonText]}>
                {isPassed ? "" : "Try with Teacher’s Help"}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                globalStyles.submitButton,
                { marginTop: 20, alignSelf: "center" },
              ]}
              onPress={handleOnStart}
            >
              <Text style={globalStyles.submitButtonText}>
                {activeAttempt ? "Continue Exercise" : "Start Exercise"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default memo(ViewActivity);
