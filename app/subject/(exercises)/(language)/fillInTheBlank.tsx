import HeaderConfig from "@/utils/HeaderConfig";
import React, { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import FillInTheBlanks from "@/components/trainingActivities/language/FillInTheBlanks";
import ActivityProgress from "@/components/activityProgress";
import globalStyles from "@/styles/globalStyles";
import { useLocalSearchParams } from "expo-router";
import { startFillActivity } from "@/utils/language";

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
  const [attemptId, setAttemptId] = useState<string[]>([]);
  const [activity, setActivity] = useState<
    { sentence: string; audio_path: string }[]
  >([]);
  const [itemId, setItemId] = useState<string[]>([]);
  const [currentItem, setCurrentItem] = useState<number>(0);
  const [answers, setAnswers] = useState<
    { item_id: string; sentence: string }[]
  >([]);

  const handleSubmit = () => {
    if (currentItem >= activity.length - 1) {
      console.log("submit");
      console.log(answers);
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
    };

    fetchActivity();
  }, []);

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
