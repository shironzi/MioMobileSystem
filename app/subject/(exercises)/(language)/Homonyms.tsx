import HomonymCard from "@/app/subject/(exercises)/(language)/HomonymCard";
import ActivityProgress from "@/components/activityProgress";
import LoadingCard from "@/components/loadingCard";
import globalStyles from "@/styles/globalStyles";
import getCurrentDateTime from "@/utils/DateFormat";
import HeaderConfig from "@/utils/HeaderConfig";
import {
  getAttemptActivityLanguage,
  startHomonymsActivity,
  submitHomonymsActivity,
} from "@/utils/language";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HomonymItem {
  item_id: string | null;
  sentence_1: string;
  sentence_2: string;
  audio_path_1: string;
  audio_path_2: string;
  choices: string[];
}

const Homonyms = () => {
  HeaderConfig("Homonyms");

  const { subjectId, difficulty, activityId, activity_type, prevAttemptId } =
    useLocalSearchParams<{
      subjectId: string;
      difficulty: string;
      activityId: string;
      activity_type: string;
      prevAttemptId: string;
    }>();
  const [items, setItems] = useState<HomonymItem[]>([]);
  const [currentItem, setCurrentItem] = useState(0);
  const [answers, setAnswers] = useState<
    { item_id: string; answer: string[] }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [attemptId, setAttemptId] = useState<string>();
  const [inputError, setInputError] = useState<
    { item_id: string | null; index: number[] }[]
  >([]);
  const [answerLogs, setAnswerLogs] = useState<
    {
      item_id: string;
      answers_1: string[];
      answers_2: string[];
      answered_at_1: string[];
      answered_at_2: string[];
    }[]
  >([]);
  const [audioLogs, setAudioLogs] = useState<
    { item_id: string; played_at_1: string[]; played_at_2: string[] }[]
  >([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handleAnswer = (answer: string, index: number) => {
    const item_id = items[currentItem]?.item_id;
    if (!item_id) return;
    if (!answer.trim()) return;

    setAnswers((prev) => {
      const existing = prev.find((ans) => ans.item_id === item_id);

      if (existing) {
        return prev.map((ans) => {
          if (ans.item_id === item_id) {
            const updatedAnswers = [...ans.answer];
            updatedAnswers[index] = answer;
            return { ...ans, answer: updatedAnswers };
          }
          return ans;
        });
      } else {
        const newAnswers = Array(index + 1).fill("");
        newAnswers[index] = answer;
        return [...prev, { item_id, answer: newAnswers }];
      }
    });

    setInputError((prev) =>
      prev
        .map((err) => {
          if (err.item_id === item_id) {
            const filteredIndexes = err.index.filter((i) => i !== index);
            return { ...err, index: filteredIndexes };
          }
          return err;
        })
        .filter((err) => err.index.length > 0),
    );

    setAnswerLogs((prev) => {
      const now = getCurrentDateTime();
      const existingIndex = prev.findIndex((log) => log.item_id === item_id);

      if (existingIndex !== -1) {
        const updated = [...prev];
        const existing = updated[existingIndex];

        if (index === 0) {
          updated[existingIndex] = {
            ...existing,
            answers_1: [...existing.answers_1, answer],
            answered_at_1: [...existing.answered_at_1, now],
          };
        } else if (index === 1) {
          updated[existingIndex] = {
            ...existing,
            answers_2: [...existing.answers_2, answer],
            answered_at_2: [...existing.answered_at_2, now],
          };
        }

        return updated;
      } else {
        return [
          ...prev,
          {
            item_id,
            answers_1: index === 0 ? [answer] : [],
            answers_2: index === 1 ? [answer] : [],
            answered_at_1: index === 0 ? [now] : [],
            answered_at_2: index === 1 ? [now] : [],
          },
        ];
      }
    });
  };

  const getInstruction =
    "Click the speaker to read and listen to the sentences. Choose the correct word that fits each sentence.";

  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async () => {
    const currentAnswers = answers[currentItem]?.answer || [];
    let hasError = false;
    const errorIndexes: number[] = [];

    if (!currentAnswers[0]?.trim()) {
      errorIndexes.push(0);
      hasError = true;
    }

    if (!currentAnswers[1]?.trim()) {
      errorIndexes.push(1);
      hasError = true;
    }

    if (hasError) {
      setInputError((prev) => [
        ...prev,
        { item_id: items[currentItem].item_id, index: errorIndexes },
      ]);
      return;
    }

    setInputError((prev) =>
      prev.filter((err) => err.item_id !== items[currentItem].item_id),
    );

    if (currentItem >= items.length) {
      setCurrentItem(currentItem + 1);
    } else {
      if (!attemptId) return;

      setIsSending(true);

      const res = await submitHomonymsActivity(
        subjectId,
        difficulty,
        activityId,
        attemptId,
        answers,
        answerLogs,
        audioLogs,
      );

      if (res.success) {
        router.push({
          pathname: "/subject/(exercises)/AuditoryScores",
          params: {
            score: res.score,
            totalItems: items.length * 2,
            activity: activity_type,
            difficulty: difficulty,
          },
        });
      }

      setIsSending(false);
    }
  };

  const handleAudioLogs = (index: number) => {
    const item_id = items[currentItem]?.item_id;
    if (!item_id) return;

    setAudioLogs((prev) => {
      const now = getCurrentDateTime();
      const existingIndex = prev.findIndex((log) => log.item_id === item_id);

      if (existingIndex !== -1) {
        const updated = [...prev];
        const existing = updated[existingIndex];

        if (index === 0) {
          updated[existingIndex] = {
            ...existing,
            played_at_1: [...existing.played_at_1, now],
          };
        } else if (index === 1) {
          updated[existingIndex] = {
            ...existing,
            played_at_2: [...existing.played_at_2, now],
          };
        }

        return updated;
      } else {
        return [
          ...prev,
          {
            item_id,
            played_at_1: index === 0 ? [now] : [],
            played_at_2: index === 1 ? [now] : [],
          },
        ];
      }
    });
  };

  useEffect(() => {
    const fetchActivity = async () => {
      const res = prevAttemptId
        ? await getAttemptActivityLanguage(
            subjectId,
            activity_type,
            activityId,
            prevAttemptId,
          )
        : await startHomonymsActivity(subjectId, difficulty, activityId);

      console.log(res);

      Object.entries(res.activity).map(([key, value]: [string, any]) => {
        setItems((prev) => [
          ...prev,
          {
            item_id: key,
            sentence_1: value.sentence_1,
            sentence_2: value.sentence_2,
            audio_path_1: value.audio_path_1,
            audio_path_2: value.audio_path_2,
            choices: value.choices,
          },
        ]);
      });

      setAttemptId(res.attemptId);

      setLoading(false);
    };

    fetchActivity();
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
        <LoadingCard></LoadingCard>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <View style={{ marginTop: 10 }}>
        <ActivityProgress
          difficulty={difficulty}
          totalItems={items.length}
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
          // left: -5,
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
      <View style={[styles.questionsContainer, { height: "90%" }]}>
        <HomonymCard
          activity={items[currentItem]}
          emptyInput={false}
          handleAnswer={(answer, index) => handleAnswer(answer, index)}
          answers={answers[currentItem]}
          inputError={inputError.find(
            (err) => err.item_id === items[currentItem].item_id,
          )}
          handleAudioLogs={(index: number) => handleAudioLogs(index)}
          setIsPlaying={setIsPlaying}
        />
      </View>
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
          style={[
            globalStyles.submitButton,
            { width: "100%" },
            // styles.nextButton,
            // isPlaying && matchedIds.length > 0
            // 	? { backgroundColor: "#ffbf18" }
            // 	: { backgroundColor: "#ddd" },
          ]}
          disabled={isPlaying || isSending}
          onPress={handleSubmit}
        >
          <Text style={[globalStyles.submitButtonText, { top: 3 }]}>
            {isSending ? "Submitting" : "Submit"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  questionsContainer: {
    height: "70%",
    justifyContent: "space-between",
    flexDirection: "column",
    alignItems: "center",
  },
});

export default Homonyms;
