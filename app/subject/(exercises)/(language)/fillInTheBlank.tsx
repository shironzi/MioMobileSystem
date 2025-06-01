import HeaderConfig from "@/utils/HeaderConfig";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import FillInTheBlanks from "@/components/trainingActivities/language/FillInTheBlanks";
import ActivityProgress from "@/components/activityProgress";
import globalStyles from "@/styles/globalStyles";
import { router, useLocalSearchParams } from "expo-router";
import { startFillActivity, submitFillActivity } from "@/utils/language";
import { FontAwesome6 } from "@expo/vector-icons";
import { useAudioPlayer } from "expo-audio";

const fillInTheBlank = () => {
  HeaderConfig("Fill in the Blank");

  const { subjectId, activityType, difficulty, category, activityId } =
    useLocalSearchParams<{
      subjectId: string;
      activityType: string;
      difficulty: string;
      category: string;
      activityId: string;
    }>();

  const [loading, setLoading] = useState<boolean>(true);
  const [attemptId, setAttemptId] = useState<string>();
  const [activity, setActivity] = useState<
    { sentence: string; audio_path: string }[]
  >([]);
  const [itemId, setItemId] = useState<string[]>([]);
  const [currentItem, setCurrentItem] = useState<number>(0);
  const [answers, setAnswers] = useState<
    { item_id: string; sentence: string }[]
  >([]);

  const handleSubmit = async () => {
    if (currentItem >= activity.length - 1) {
      try {
        if (!attemptId) {
          console.error("Attempt id is empty");
          return;
        }

        const res = await submitFillActivity(
          subjectId,
          difficulty,
          activityId,
          attemptId,
          answers,
        );

        if (res.success) {
          router.push({
            pathname: "/subject/(exercises)/AuditoryScores",
            params: {
              score: res.score,
              totalItems: activity.length,
              activity: activityType,
              difficulty: difficulty,
            },
          });
        } else {
          console.error("Unable to submit", res);
        }
      } catch (err) {
        console.error("failed to submit: " + err);
      }
      return;
    }

    setCurrentItem(currentItem + 1);
  };

  const handleAnswer = useCallback(
    (answers: string[]) => {
      const currentAnswer = answers.join(" ");
      const currentItemId = itemId[currentItem];

      setAnswers((prev) => {
        const existingIndex = prev.findIndex(
          (entry) => entry.item_id === currentItemId,
        );

        if (existingIndex !== -1) {
          const updated = [...prev];
          updated[existingIndex] = {
            item_id: currentItemId,
            sentence: currentAnswer,
          };
          return updated;
        }

        return [
          ...prev,
          {
            item_id: currentItemId,
            sentence: currentAnswer,
          },
        ];
      });
    },
    [itemId, currentItem],
  );

  const player = useAudioPlayer();

  const handleAudioPlay = async () => {
    await player.seekTo(0);
    if (player.isLoaded) {
      player.play();
      console.log(player.isBuffering);
    }
  };

  useEffect(() => {
    const fetchActivity = async () => {
      const res = await startFillActivity(subjectId, difficulty, activityId);

      Object.entries(res.activity).map(async ([id, data]: [string, any]) => {
        setItemId((prev) => [...prev, id]);
        setActivity((prev) => [
          ...prev,
          { sentence: data.sentence, audio_path: data.audio_path },
        ]);
      });

      setAttemptId(res.attempt_id);
      setLoading(false);

      setCurrentItem(0);
    };

    fetchActivity();
  }, []);

  useEffect(() => {
    if (loading) return;
    player.replace({ uri: activity[currentItem].audio_path });
    player.pause();
  }, [currentItem, loading]);

  if (loading) {
    return (
      <View>
        <Text>Loading........</Text>
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
      <TouchableOpacity
        style={{
          backgroundColor: "#FFBF18",
          padding: 20,
          borderRadius: 15,
        }}
        onPress={handleAudioPlay}
      >
        <FontAwesome6 name="volume-high" size={25} color="#fff" />
      </TouchableOpacity>

      <FillInTheBlanks
        key={currentItem}
        sentence={activity[currentItem].sentence}
        handleAnswers={(answers: string[]) => handleAnswer(answers)}
      />

      <TouchableOpacity
        style={globalStyles.submitButton}
        onPress={handleSubmit}
      >
        <Text style={globalStyles.submitButtonText}>
          {currentItem >= activity.length - 1 ? "Submit" : "Next"}
        </Text>
      </TouchableOpacity>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({});

export default fillInTheBlank;
