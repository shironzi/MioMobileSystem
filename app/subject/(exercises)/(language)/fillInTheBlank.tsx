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
import { Text, TouchableOpacity, View } from "react-native";
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
      setCurrentItem((prev) => prev + 1);
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
      console.log(activity[currentItem].audio_path);
      player.play();
    }
  };

  useEffect(() => {
    if (status.didJustFinish) {
      const itemId = activity[currentItem]?.item_id;
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
    <GestureHandlerRootView style={globalStyles.container}>
      <ActivityProgress
        difficulty="Easy"
        totalItems={activity.length}
        completedItems={currentItem}
        instruction="Guess the picture"
      />
      <View style={{ rowGap: 10 }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#FFBF18",
            padding: 20,
            borderRadius: 15,
            width: 75,
          }}
          onPress={handleAudioPlay}
        >
          <FontAwesome6 name="volume-high" size={25} color="#fff" />
        </TouchableOpacity>

        <FillInTheBlanks
          sentence={activity[currentItem].sentence}
          handleAnswers={(answers: string[]) => handleAnswer(answers)}
          hasError={inputErrors.some(
            (err) => err.item_id === activity[currentItem].item_id,
          )}
        />
      </View>
      <View style={globalStyles.submitWrapper}>
        <TouchableOpacity
          style={globalStyles.submitButton}
          onPress={handleSubmit}
          disabled={isSending}
        >
          <Text style={globalStyles.submitButtonText}>
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
