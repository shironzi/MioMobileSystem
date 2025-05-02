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

const Data = [
  {
    questions: [
      "Let's BLANK tomorrow to finalize the details. Let's tomorrow to finalize the details.",
      "I want to buy fresh BLANK for the barbercue.",
    ],
    choices: ["meet", "meat"],
  },
  {
    questions: [
      "I want to buy fresh BLANK for the barbercue.",
      "I want to buy fresh BLANK for the barbercue.",
    ],
    choices: ["meet", "meat"],
  },
  {
    questions: [
      "Let's BLANK tomorrow to finalize the details. Let's tomorrow to finalize the details.",
      "I want to buy fresh BLANK for the barbercue.",
    ],
    choices: ["meet", "meat"],
  },
];

const Homonyms = () => {
  HeaderConfig("Homonyms");

  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [items, setItems] = useState<typeof Data>(Data);

  const currentItem = items[currentItemIndex] || { questions: [], choices: [] };

  const handleNext = () => {
    setCurrentItemIndex(currentItemIndex + 1);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5", padding: 20 }}>
      <View style={styles.questionsContainer}>
        <HomonymQuestionCard
          question={currentItem.questions}
          choices={currentItem.choices}
        />

        <View style={{ width: "100%" }}>
          <TouchableOpacity onPress={handleNext} style={styles.button}>
            <Text style={styles.buttonText}>Continue</Text>
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
    backgroundColor: "#FFBF18",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginHorizontal: "auto",
  },
});

export default memo(Homonyms);
