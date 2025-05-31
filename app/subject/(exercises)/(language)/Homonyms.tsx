import ActivityProgress from "@/components/activityProgress";
import HeaderConfig from "@/utils/HeaderConfig";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  startHomonymsActivity,
  submitHomonymsActivity,
} from "@/utils/language";
import { FontAwesome6 } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import globalStyles from "@/styles/globalStyles";
import { getApp } from "@react-native-firebase/app";
import {
  getDownloadURL,
  getStorage,
  ref,
} from "@react-native-firebase/storage";
import { useAudioPlayer } from "expo-audio";

const Homonyms = () => {
  HeaderConfig("Homonyms");

  const { subjectId, activityType, difficulty, category, activityId } =
    useLocalSearchParams<{
      subjectId: string;
      activityType: string;
      difficulty: string;
      category: string;
      activityId: string;
    }>();

  const [activity, setActivity] = useState<
    { sentence: string; sentence_id: string; audio_path: string }[][]
  >([]);
  const [choices, setChoices] = useState<string[][]>([]);
  const [itemId, setItemId] = useState<string[]>([]);
  const [attemptId, setAttemptId] = useState<string>();
  const [currentItem, setCurrentItem] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [answers, setAnswers] = useState<
    { item_id: string; answers: { sentence_id: string; answer: string }[] }[]
  >([]);

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
    }, 200); // 200ms is usually enough, or tweak as needed
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
        console.error("No Attempt ID");
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
              activity: activityType,
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

        <View style={{ width: "120%" }}>
          {activity[currentItem].map((value, index) => {
            const words = value.sentence.split(" ");

            return (
              <View
                key={index}
                style={{
                  marginBottom: 20,
                  columnGap: 20,
                  flexDirection: "row",
                  borderWidth: 1,
                  borderColor: "#00000024",
                  padding: 9,
                  marginHorizontal: 40,
                  borderRadius: 20,
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: "#FFBF18",
                    padding: 20,
                    borderRadius: 15,
                  }}
                  onPress={() => handleAudioPlay(index)}
                >
                  <FontAwesome6 name="volume-high" size={25} color="#fff" />
                </TouchableOpacity>

                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    alignItems: "center",
                    marginVertical: "auto",
                    maxWidth: "75%",
                  }}
                >
                  {words.map((word, i) => {
                    if (word === "_____") {
                      return (
                        <View
                          key={`picker-${i}`}
                          style={[
                            {
                              borderWidth: 1,
                              borderRadius: 10,
                              marginRight: 10,
                              marginLeft: 5,
                              flexDirection: "row",
                              alignItems: "center",
                            },
                            emptyInput
                              ? { borderColor: "red" }
                              : { borderColor: "#00000024" },
                          ]}
                        >
                          <Text style={{ position: "absolute", left: 10 }}>
                            {answers
                              .find((a) => a.item_id === itemId[currentItem])
                              ?.answers.find(
                                (ans) => ans.sentence_id === value.sentence_id,
                              )?.answer || ""}
                          </Text>
                          <Picker
                            selectedValue={
                              answers
                                .find((a) => a.item_id === itemId[currentItem])
                                ?.answers.find(
                                  (ans) =>
                                    ans.sentence_id === value.sentence_id,
                                )?.answer || ""
                            }
                            placeholder={"hello"}
                            dropdownIconColor={"#FFBF19"}
                            style={{
                              width: 125,
                              height: 30,
                            }}
                            onValueChange={(itemValue) =>
                              handleAnswer(itemValue, value.sentence_id)
                            }
                            mode={"dropdown"}
                          >
                            {choices[currentItem].map((choice) => (
                              <Picker.Item
                                label={choice}
                                value={choice}
                                key={choice}
                              />
                            ))}
                          </Picker>
                        </View>
                      );
                    } else {
                      return (
                        <Text
                          key={`word-${i}`}
                          style={{ marginRight: 5, fontSize: 16 }}
                        >
                          {word}
                        </Text>
                      );
                    }
                  })}
                </View>
              </View>
            );
          })}
        </View>

        <View style={{ width: "100%" }}>
          <TouchableOpacity
            onPress={handleNext}
            style={[styles.button, globalStyles.submitButton]}
            // disabled={isAnswered && !isPlaying}
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
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  questionsContainer: {
    height: "70%",
    justifyContent: "space-between",
    flexDirection: "column",
    alignItems: "center",
  },
  button: {
    borderRadius: 50,
    padding: 15,
  },
  activeButton: {
    backgroundColor: "#FFBF18",
  },
  disabledButton: {
    backgroundColor: "#E0E0E0",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default Homonyms;
