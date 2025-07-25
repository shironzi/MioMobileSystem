import ActivityProgress from "@/components/activityProgress";
import LoadingCard from "@/components/loadingCard";
import FillInTheBlanks from "@/components/trainingActivities/language/FillInTheBlanks";
import globalStyles from "@/styles/globalStyles";
import getCurrentDateTime from "@/utils/DateFormat";
import HeaderConfig from "@/utils/HeaderConfig";
import {
  getAttemptActivityLanguage,
  startFillActivity,
  submitFillActivity,
} from "@/utils/language";
import { FontAwesome6 } from "@expo/vector-icons";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const fillInTheBlank = () => {
  HeaderConfig("Fill in the Blank");

  const {
    subjectId,
    activity_type,
    difficulty,
    category,
    activityId,
    prevAttemptId,
  } = useLocalSearchParams<{
    subjectId: string;
    activity_type: string;
    difficulty: string;
    category: string;
    activityId: string;
    prevAttemptId: string;
  }>();

  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [attemptId, setAttemptId] = useState<string>();
  const [activity, setActivity] = useState<
    { item_id: string; sentence: string; audio_path: string }[]
  >([]);
  const [currentItem, setCurrentItem] = useState<number>(0);
  const [answers, setAnswers] = useState<
    { item_id: string; sentence: string }[]
  >([]);
  const [inputErrors, setInputErrors] = useState<{ item_id: string }[]>([]);
  const [audioLogs, setAudioLogs] = useState<
    { item_id: string; played_at: string[] }[]
  >([]);
  const [answerLogs, setAnswerLogs] = useState<
    { item_id: string; answers: string[]; answered_at: string[] }[]
  >([]);
  const [isSending, setIsSending] = useState<boolean>(false);

  const getInstruction =
    "Click the speaker to listen to the sentence. Then, drag the word to arrange it in the same order you heard. Listen carefully.";

  const handleSubmit = async () => {
    setIsSending(true);
    const currentAnswer = answers.find(
      (a) => a.item_id === activity[currentItem].item_id,
    );

    if (!currentAnswer || !currentAnswer.sentence.trim()) {
      setInputErrors((prev) => [
        ...prev,
        { item_id: activity[currentItem].item_id },
      ]);
      return;
    }

    if (currentItem < activity.length - 1) {
      setCurrentItem(currentItem + 1);
      console.log(currentItem);
    } else {
      if (!attemptId) {
        return;
      }

      const res = await submitFillActivity(
        subjectId,
        difficulty,
        activityId,
        attemptId,
        answers,
        audioLogs,
        answerLogs,
      );

      if (res.success) {
        router.push({
          pathname: "/subject/(exercises)/AuditoryScores",
          params: {
            score: res.score,
            totalItems: activity.length,
            activity: activity_type,
            difficulty: difficulty,
          },
        });
      }
    }
    setIsSending(false);
  };

  const handleAnswer = useCallback(
    (answers: string[]) => {
      const currentAnswer = answers.join(" ");
      const itemId = activity[currentItem].item_id;

      if (!currentAnswer.trim()) return;
      setAnswers((prev) => {
        const existingIndex = prev.findIndex(
          (entry) => entry.item_id === itemId,
        );

        if (existingIndex !== -1) {
          const updated = [...prev];
          updated[existingIndex] = {
            item_id: itemId,
            sentence: currentAnswer,
          };
          return updated;
        }

        return [
          ...prev,
          {
            item_id: activity[currentItem].item_id,
            sentence: currentAnswer,
          },
        ];
      });

      setInputErrors((prev) =>
        prev.filter((err) => err.item_id !== activity[currentItem].item_id),
      );

      setAnswerLogs((prev) => {
        const now = getCurrentDateTime();
        const existingIndex = prev.findIndex((log) => log.item_id === itemId);

        if (existingIndex !== -1) {
          const updated = [...prev];
          const existing = updated[existingIndex];
          updated[existingIndex] = {
            ...existing,
            answers: [...(existing.answers || []), currentAnswer],
            answered_at: [...(existing.answered_at || []), now],
          };

          return updated;
        } else {
          return [
            ...prev,
            {
              item_id: itemId,
              answers: [currentAnswer],
              answered_at: [now],
            },
          ];
        }
      });
    },
    [currentItem, activity],
  );

  const player = useAudioPlayer();
  const status = useAudioPlayerStatus(player);

  const handleAudioPlay = async () => {
    await player.seekTo(0);
    if (!status.playing) {
      player.replace({ uri: activity[currentItem].audio_path });
      setIsPlaying(true);
      player.play();
    }
  };

  useEffect(() => {
    if (status.didJustFinish) {
      const itemId = activity[currentItem]?.item_id;
      setIsPlaying(false);
      const now = getCurrentDateTime();

      setAudioLogs((prev) => {
        console.log(prev);
        const existingIndex = prev.findIndex((log) => log.item_id === itemId);
        if (existingIndex !== -1) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            played_at: [...updated[existingIndex].played_at, now],
          };
          return updated;
        } else {
          return [...prev, { item_id: itemId, played_at: [now] }];
        }
      });
    }
  }, [status.didJustFinish]);

  useEffect(() => {
    const fetchActivity = async () => {
      console.log(prevAttemptId);
      const res = prevAttemptId
        ? await getAttemptActivityLanguage(
            subjectId,
            activity_type,
            activityId,
            prevAttemptId,
          )
        : await startFillActivity(subjectId, difficulty, activityId);

      Object.entries(res.activity).map(async ([id, data]: [string, any]) => {
        setActivity((prev) => [
          ...prev,
          { item_id: id, sentence: data.sentence, audio_path: data.audio_path },
        ]);
      });
      setAttemptId(res.attemptId);
      setLoading(false);
      setCurrentItem(0);
    };

    fetchActivity();
  }, []);

  useEffect(() => {
    if (loading) return;
    (async () => {
      player.pause();
    })();
  }, [currentItem, loading]);

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
    <GestureHandlerRootView style={[globalStyles.container, { flex: 1 }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ marginTop: 10 }}>
          <ActivityProgress
            difficulty={difficulty}
            totalItems={activity.length}
            completedItems={currentItem}
            // instruction="Guess the picture"
          />
        </View>
        <View
          style={{
            // marginHorizontal: 10,
            borderColor: "#ddd",
            borderWidth: 1,
            borderRadius: 20,
            paddingHorizontal: 10,
            marginBottom: 15,
            marginTop: -15,
          }}
        >
          <Text
            style={{
              marginHorizontal: 10,
              textAlign: "justify",
              fontWeight: "500",
              fontSize: 16,
              color: "#2264dc",
              marginTop: 10,
            }}
          >
            Piddie Tips!
          </Text>

          <Text
            style={{
              marginTop: 5,
              margin: 10,
              textAlign: "justify",
              fontWeight: "300",
            }}
          >
            {getInstruction}
          </Text>
        </View>

        <View
          style={{
            borderColor: "#ddd",
            borderWidth: 1,
            borderRadius: 20,
            padding: 10,
            marginBottom: 20,
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            style={[
              {
                padding: 20,
                borderRadius: 15,
                maxWidth: 75,
                backgroundColor: "#ffbf18",
              },
              isPlaying
                ? { backgroundColor: "#ffbf18" }
                : { backgroundColor: "#ddd" },
            ]}
            onPress={handleAudioPlay}
            disabled={isPlaying}
          >
            <FontAwesome6 name="volume-high" size={25} color="#fff" />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "300",
              alignSelf: "center",
              left: 60,
              lineHeight: 20,
              textAlign: "center",
            }}
          >
            Tap the speaker icon.{"\n"}Listen carefully!
          </Text>
        </View>

        <View style={{ rowGap: 10 }}>
          <FillInTheBlanks
            sentence={activity[currentItem].sentence}
            handleAnswers={(answers: string[]) => handleAnswer(answers)}
            hasError={inputErrors.some(
              (err) => err.item_id === activity[currentItem].item_id,
            )}
          />
        </View>
      </ScrollView>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          position: "absolute",
          bottom: 20,
          left: 20,
          right: 20,
        }}
      >
        <TouchableOpacity
          style={[globalStyles.submitButton, { width: "100%" }]}
          onPress={handleSubmit}
          disabled={isSending || isPlaying}
        >
          <Text style={[globalStyles.submitButtonText, { top: 3 }]}>
            {currentItem >= activity.length - 1
              ? "Submit"
              : isSending
                ? "Submitting"
                : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
};

export default fillInTheBlank;
