import React, { memo, useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import globalStyles from "@/styles/globalStyles";

const FillInTheBlanks = (props: {
  sentence: string;
  handleAnswers: (answers: string[]) => void;
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
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          height: 250,
          width: "100%",
          borderWidth: 1,
          borderRadius: 20,
          padding: 20,
        }}
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
  );
};

const styles = StyleSheet.create({
  wordsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 20,
  },
  wordWrapper: {
    marginRight: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 15,
    padding: 10,
    borderColor: "#ccc",
  },
  wordText: {
    fontSize: 18,
  },
});

export default memo(FillInTheBlanks);
