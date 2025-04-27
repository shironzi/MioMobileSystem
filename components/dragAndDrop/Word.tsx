import { Dimensions, StyleSheet } from "react-native";
import React from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  clamp,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

const Word = (props: { id: number; word: string }) => {
  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const prevTranslationX = useSharedValue(0);
  const prevTranslationY = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      { translateX: translationX.value },
      { translateY: translationY.value },
    ],
  }));

  const pan = Gesture.Pan()
    .minDistance(1)
    .onStart(() => {
      prevTranslationX.value = translationX.value;
      prevTranslationY.value = translationY.value;
    })
    .onUpdate((event) => {
      const maxTranslateX = width;
      const maxTranslateY = height * 0.1;

      translationX.value = clamp(
        prevTranslationX.value + event.translationX,
        -maxTranslateX,
        maxTranslateX
      );
      translationY.value = clamp(
        prevTranslationY.value + event.translationY,
        -maxTranslateY,
        maxTranslateY
      );
    })
    .runOnJS(true);
  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.wordContainer, animatedStyles]}>
        <Animated.Text style={styles.text}>{props.word}</Animated.Text>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  wordContainer: {
    backgroundColor: "#E8F1FD",
    borderRadius: 8,
    padding: 8,
    paddingHorizontal: 12,
  },
  text: {
    fontSize: 16,
    color: "#333",
  },
});

export default Word;
