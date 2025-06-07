import ActivityProgress from "@/components/activityProgress";
import HeaderConfig from "@/utils/HeaderConfig";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  startHomonymsActivity,
  submitHomonymsActivity,
} from "@/utils/language";
import globalStyles from "@/styles/globalStyles";
import { getApp } from "@react-native-firebase/app";
import {
  getDownloadURL,
  getStorage,
  ref,
} from "@react-native-firebase/storage";
import { useAudioPlayer } from "expo-audio";
import HomonymCard from "@/app/subject/(exercises)/(language)/HomonymCard";

interface Activity {
  sentence: string;
  sentence_id: string;
  audio_path: string;
}

interface Answer {
  item_id: string;
  answers: { sentence_id: string; answer: string }[];
}

const Homonyms = () => {
  HeaderConfig("Homonyms");

  const { subjectId, activity_type, difficulty, category, activityId } =
    useLocalSearchParams<{
      subjectId: string;
      activity_type: string;
      difficulty: string;
      category: string;
      activityId: string;
    }>();

  const [activity, setActivity] = useState<Activity[][]>([]);
  const [choices, setChoices] = useState<string[][]>([]);
  const [itemId, setItemId] = useState<string[]>([]);
  const [attemptId, setAttemptId] = useState<string>();
  const [currentItem, setCurrentItem] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const handleAnswer = (answer: string, sentence_id: string) => {
    setAnswers((prevAnswers) => {
      const currentItemKey = itemId[currentItem];

      const existingIndex = prevAnswers.findIndex(
        (entry) => entry.item_id === currentItemKey,
      );

      if (existingIndex !== -1) {
        const updatedAnswers = [...prevAnswers];
        const existingAnswers = updatedAnswers[existingIndex].answers;

        const sentenceIndex = existingAnswers.findIndex(
          (a) => a.sentence_id === sentence_id,
        );

        if (sentenceIndex !== -1) {
          existingAnswers[sentenceIndex].answer = answer;
        } else {
          existingAnswers.push({ sentence_id, answer });
        }

        return updatedAnswers;
      } else {
        return [
          ...prevAnswers,
          {
            item_id: currentItemKey,
            answers: [{ sentence_id, answer }],
          },
        ];
      }
    });
  };

  const player = useAudioPlayer();

  const handleAudioPlay = async (index: number) => {
    player.remove();
    const app = getApp();
    const storage = getStorage(app);

    const localUri = await getDownloadURL(
      ref(storage, activity[currentItem][index].audio_path),
    );

    if (!localUri) {
      console.warn("No preloaded audio found.");
      return;
    }

    player.replace({ uri: localUri });

    setTimeout(() => {
      player.play();
    }, 3000);
  };

  const [emptyInput, setEmptyInput] = useState<boolean>(false);

  const handleNext = async () => {
    const isLastItem = currentItem >= activity.length - 1;
    const currentAnswers = answers.find(
      (a) => a.item_id === itemId[currentItem],
    );

    const hasIncomplete = activity[currentItem].some((sentence) => {
      return !currentAnswers?.answers?.some(
        (a) => a.sentence_id === sentence.sentence_id && a.answer.trim() !== "",
      );
    });

    if (hasIncomplete) {
      setEmptyInput(true);
      return;
    }
    if (isLastItem) {
      if (!attemptId) {
        console.error("Attempt id is empty");
        return;
      }
      try {
        const res = await submitHomonymsActivity(
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
              totalItems: activity[currentItem].length * activity.length,
              activity: activity_type,
              difficulty: difficulty,
            },
          });
        } else {
          console.error("Unable to submit", res);
        }
      } catch (err) {
        console.error("Submission error:", err);
      }

      return;
    }

    setCurrentItem((prev) => prev + 1);
    setEmptyInput(false);
  };

  useEffect(() => {
    const fetchActivity = async () => {
      const res = await startHomonymsActivity(
        subjectId,
        difficulty,
        activityId,
      );

      const ids: string[] = [];
      const acts: any[][] = [];
      const chs: string[][] = [];

      await Promise.all(
        Object.entries(res.activity).map(async ([id, data]: [string, any]) => {
          ids.push(id);
          acts.push(data.homonyms);
          chs.push(data.choices);
        }),
      );
      setAttemptId(res.attempt_id);
      setItemId(ids);
      setActivity(acts);
      setChoices(chs);
      setCurrentItem(0);
      setLoading(false);
    };

    fetchActivity();
  }, []);

  if (loading) {
    return (
      <View>
        <Text>Loading.......</Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <View style={styles.questionsContainer}>
        <ActivityProgress
          difficulty="Easy"
          totalItems={activity.length}
          completedItems={currentItem}
          instruction="Guess the picture"
        />

        <HomonymCard
          activity={activity}
          choices={choices}
          answers={answers}
          currentItem={currentItem}
          emptyInput={emptyInput}
          handleAnswer={(answer, sentence_id) =>
            handleAnswer(answer, sentence_id)
          }
          handleAudioPlay={(index) => handleAudioPlay(index)}
          itemId={itemId}
        />

        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            onPress={handleNext}
            style={[styles.button, globalStyles.submitButton]}
          >
            <Text style={styles.buttonText}>
              {currentItem < activity.length - 1 ? "Continue" : "Submit"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  questionsContainer: {
    height: "70%",
    justifyContent: "space-between",
    flexDirection: "column",
    alignItems: "center",
  },
  questionsWrapper: {
    width: "120%",
  },
  questionCard: {
    marginBottom: 20,
    flexDirection: "row",
    columnGap: 20,
    borderWidth: 1,
    borderColor: "#00000024",
    padding: 9,
    marginHorizontal: 40,
    borderRadius: 20,
  },
  audioButton: {
    backgroundColor: "#FFBF18",
    padding: 20,
    borderRadius: 15,
  },
  wordContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    maxWidth: "75%",
  },
  wordText: {
    marginRight: 5,
    fontSize: 16,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderRadius: 10,
    marginRight: 10,
    marginLeft: 5,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  pickerNormal: {
    borderColor: "#00000024",
  },
  pickerError: {
    borderColor: "red",
  },
  pickerText: {
    position: "absolute",
    left: 10,
    zIndex: 1,
  },
  picker: {
    width: 125,
    height: 30,
  },
  buttonWrapper: {
    width: "100%",
  },
  button: {
    borderRadius: 50,
    padding: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default Homonyms;
