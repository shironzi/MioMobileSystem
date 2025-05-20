import React, { memo, useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

interface MultipleChoiceQuestionProps {
  choices: Array<{ [key: string]: string }>;
  handleChoice: (choice: string | string[]) => void;
  allowsMultipleChoice: boolean;
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  choices,
  handleChoice,
  allowsMultipleChoice,
}) => {
  const [singleChoice, setSingleChoice] = useState<string | null>(null);
  const [multiChoices, setMultiChoices] = useState<string[]>([]);

  useEffect(() => {
    if (!allowsMultipleChoice) {
      if (singleChoice !== null) {
        handleChoice(singleChoice);
      }
    } else {
      handleChoice(multiChoices);
    }
  }, [singleChoice, multiChoices, allowsMultipleChoice, handleChoice]);

  const toggleMultiChoice = useCallback((letter: string) => {
    setMultiChoices((prev) =>
      prev.includes(letter)
        ? prev.filter((l) => l !== letter)
        : [...prev, letter],
    );
  }, []);

  return (
    <View style={styles.container}>
      {choices.map((opt) => {
        const [letter, text] = Object.entries(opt)[0];

        if (!allowsMultipleChoice) {
          // Single select (radio)
          const isSelected = singleChoice === letter;
          return (
            <TouchableOpacity
              key={letter}
              style={styles.optionContainer}
              onPress={() => setSingleChoice(letter)}
            >
              {isSelected ? (
                <FontAwesome6 name="circle-dot" size={24} color="#FFBF18" />
              ) : (
                <Feather name="circle" size={24} />
              )}
              <Text style={styles.optionText}>
                {letter}. {text}
              </Text>
            </TouchableOpacity>
          );
        } else {
          const isChecked = multiChoices.includes(letter);
          return (
            <TouchableOpacity
              key={letter}
              style={styles.optionContainer}
              onPress={() => toggleMultiChoice(letter)}
            >
              {isChecked ? (
                <MaterialCommunityIcons
                  name="checkbox-marked"
                  size={24}
                  color="#FFBF18"
                />
              ) : (
                <MaterialCommunityIcons
                  name="checkbox-blank-outline"
                  size={24}
                />
              )}
              <Text style={styles.optionText}>
                {letter}. {text}
              </Text>
            </TouchableOpacity>
          );
        }
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    rowGap: 10,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default memo(MultipleChoiceQuestion);
