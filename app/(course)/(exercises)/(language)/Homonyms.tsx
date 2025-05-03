import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { memo, useCallback, useState } from "react";
import HeaderConfig from "@/components/HeaderConfig";
import { FontAwesome6 } from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown";
import HomonymQuestionCard from "@/components/dragAndDrop/HomonymQuestionCard";
import { router, useRouter } from "expo-router";
import ActivityProgress from "@/components/activityProgress";

const Data = [
  {
    questions: [
      "Let's BLANK tomorrow to finalize the details. Let's tomorrow to finalize the details.",
      "I want to buy fresh BLANK for the barbecue.",
    ],
    choices: ["meet", "meat"],
  },
  {
    questions: [
      "The BLANK is shining brightly today.",
      "I need to BLANK this letter to my friend.",
    ],
    choices: ["sun", "son"],
  },
  {
    questions: [
      "She will BLANK the gift with a beautiful ribbon.",
      "We took a walk around the BLANK.",
    ],
    choices: ["wrap", "rap"],
  },
  {
    questions: [
      "The BLANK of the story was very exciting.",
      "I need to BLANK the package before sending it.",
    ],
    choices: ["plot", "knot"],
  },
  {
    questions: [
      "The BLANK is too high to climb.",
      "I will BLANK the letter to my friend tomorrow.",
    ],
    choices: ["mail", "male"],
  },
  {
    questions: [
      "The BLANK is grazing in the field.",
      "I need to BLANK the fabric for my project.",
    ],
    choices: ["shear", "sheer"],
  },
  {
    questions: [
      "The BLANK is barking loudly.",
      "We will BLANK the boat at the dock.",
    ],
    choices: ["bark", "park"],
  },
  {
    questions: [
      "The BLANK is flying high in the sky.",
      "I need to BLANK the table before dinner.",
    ],
    choices: ["plane", "plain"],
  },
  {
    questions: [
      "The BLANK is flowing gently through the valley.",
      "I need to BLANK the movie before it starts.",
    ],
    choices: ["stream", "scream"],
  },
  {
    questions: [
      "The BLANK is very sharp and can cut easily.",
      "I will BLANK the rope to secure the package.",
    ],
    choices: ["tie", "die"],
  },
];

const Homonyms = () => {
  HeaderConfig("Homonyms");

  const router = useRouter();
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [items, setItems] = useState<typeof Data>(Data);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isPlaying, setIsPlaying] = useState(false);

  const currentItem = items[currentItemIndex] || { questions: [], choices: [] };

  const handleNext = () => {
    if (currentItemIndex < items.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
    } else {
      router.push({
        pathname: "/(course)/(sub-details)/scoreDetails",
      });
    }
  };
  const handleAnswerChange = (updatedAnswers: Record<string, string>) => {
    setAnswers(() => ({
      ...answers,
      ...updatedAnswers,
    }));
  };

  const handleAudioPlay = () => {
    setIsPlaying(!isPlaying);
  };

  const isAnswered =
    Object.keys(answers).length <=
    currentItem.questions.reduce(
      (count, sentence) => count + (sentence.match(/BLANK/g) || []).length,
      0
    ) *
      currentItemIndex;

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5", padding: 20 }}>
      <View style={styles.questionsContainer}>
        <ActivityProgress
          difficulty="Easy"
          totalItems={items.length}
          completedItems={currentItemIndex}
          instruction="Guess the picture"
        />
        <HomonymQuestionCard
          question={currentItem.questions}
          choices={currentItem.choices}
          onAnswerChange={handleAnswerChange}
          onAudioPlay={handleAudioPlay}
        />

        <View style={{ width: "100%" }}>
          <TouchableOpacity
            onPress={handleNext}
            style={[
              styles.button,
              isAnswered && !isPlaying
                ? { backgroundColor: "#E0E0E0" }
                : { backgroundColor: "#FFBF18" },
            ]}
            disabled={isAnswered && !isPlaying}
          >
            <Text style={styles.buttonText}>
              {currentItemIndex < items.length - 1 ? "Continue" : "Submit"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginHorizontal: "auto",
  },
});

export default memo(Homonyms);
