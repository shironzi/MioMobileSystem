import globalStyles from "@/styles/globalStyles";
import React, { memo, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  runOnJS
} from "react-native-reanimated";

const FillInTheBlanks = (props: {
  sentence: string;
  handleAnswers: (answers: string[]) => void;
  hasError?: boolean;
}) => {
  const words = props.sentence.split(" ");

  const [inputBox, setInputBox] = useState<string[]>([]);
  const [remainingWords, setRemainingWords] = useState(words);

  const handleSelect = (index: number) => {
    const selectedWord = remainingWords[index];
    setInputBox((prev) => [...prev, selectedWord]);
    setRemainingWords((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemove = (word: string) => {
    setInputBox((prev) => prev.filter((w) => w !== word));
    setRemainingWords((prev) => [...prev, word]);
  };

  useEffect(() => {
    props.handleAnswers(inputBox);
  }, [inputBox]);

  return (
    <View style={{ flexDirection: "column" }}>
      {props.hasError && (
        <Text style={globalStyles.errorText}>
          Please complete the sentence before submitting.
        </Text>
      )}
      <View style={{ rowGap: 10 }}>
        <View
          style={[
            {
              flexDirection: "row",
              flexWrap: "wrap",
              paddingVertical:30,
              // height: 250,
              width: "100%",
              borderWidth: 1,
              borderRadius: 20,
              padding: 20,
              marginBottom:5
            },
            props.hasError
              ? { borderColor: "red" }
              : { borderColor: "#00000024" },
          ]}
        >
          {inputBox.map((word, index) => {
            const tapGesture = Gesture.Tap().onStart(() => {
              runOnJS(handleRemove)(word);
            });

            return (
              <GestureDetector gesture={tapGesture} key={index}>
                <View
                  style={[styles.wordWrapper, { backgroundColor: "#D1DFFF" }]}
                >
                  <Text style={styles.wordText}>{word}</Text>
                </View>
              </GestureDetector>
            );
          })}
        </View>

        <View style={[styles.wordsWrapper, { height: 200 }]}>
          {remainingWords.map((item, index) => {
            const tapGesture = Gesture.Tap().onStart(() => {
              runOnJS(handleSelect)(index);
            });

            return (
              <GestureDetector gesture={tapGesture} key={index}>
                <View style={[styles.wordWrapper]}>
                  <Text style={styles.wordText}>{item}</Text>
                </View>
              </GestureDetector>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wordsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  wordWrapper: {
    marginRight: 5,
    marginBottom: 5,
    borderWidth: 1,
    borderRadius: 15,
    padding: 10,
    borderColor: "#ccc",
  },
  wordText: {
    fontSize: 16,
  },
});

export default memo(FillInTheBlanks);
