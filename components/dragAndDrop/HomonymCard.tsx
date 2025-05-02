import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  UIManager,
  findNodeHandle,
} from "react-native";
import React, { useMemo, useRef, useState } from "react";
import HeaderConfig from "@/components/HeaderConfig";
import { FontAwesome6 } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const HomonymCard = (props: { questions: string[]; choices: string[] }) => {
  HeaderConfig("Homonyms");

  // const [positions, setPositions] = useState<{ x: number; y: number }[]>([]);
  const blankRefs = useRef<(View | null)[]>([]);

  const maxCharCount = useMemo(
    () => Math.max(...props.choices.map((opt) => opt.length), 0),
    [props.choices]
  );
  const approxCharWidth = 0.6 * styles.choiceText.fontSize;
  const dynamicWidth =
    maxCharCount * approxCharWidth + styles.blankSpace.padding * 2;

  // RENDER A DRAGGABLE CHOICE
  const renderChoice = (option: string, idx: number) => {
    const translationX = useSharedValue(0);
    const translationY = useSharedValue(0);
    const prevX = useSharedValue(0);
    const prevY = useSharedValue(0);

    const style = useAnimatedStyle(() => ({
      transform: [
        { translateX: translationX.value },
        { translateY: translationY.value },
      ],
    }));

    const pan = Gesture.Pan()
      .onStart(() => {
        prevX.value = translationX.value;
        prevY.value = translationY.value;
      })
      .onUpdate((e) => {
        translationX.value = prevX.value + e.translationX;
        translationY.value = prevY.value + e.translationY;
      })
      .onEnd(() => {
        console.log("X: " + translationX.value);
        console.log("Y: " + translationY.value);
        // let snapped = false;
        // const threshold = 50; // px
        // for (const key in positions) {
        //   const { x: tx, y: ty } = positions[key];
        //   const dx = Math.abs(translationX.value - tx);
        //   const dy = Math.abs(translationY.value - ty);
        //   if (dx <= threshold && dy <= threshold) {
        //     translationX.value = withSpring(tx);
        //     translationY.value = withSpring(ty);
        //     snapped = true;
        //     break;
        //   }
        // }
        // if (!snapped) {
        //   translationX.value = withSpring(0);
        //   translationY.value = withSpring(0);
        // }
      });

    return (
      <GestureDetector key={idx} gesture={pan}>
        <Animated.View style={[styles.choiceHolder, style]}>
          <Text style={styles.choiceText}>{option}</Text>
        </Animated.View>
      </GestureDetector>
    );
  };

  const dropZoneRefs = useRef<Record<number, View | null>>({});

  const onDropZoneLayout = (idx: number) => {
    const node = findNodeHandle(dropZoneRefs.current[idx]);
    if (!node) return;

    UIManager.measure(node, (_x, _y, width, height, pageX, pageY) => {
      console.log(_x, _y, width, height, pageX, pageY);
    });
  };

  console.log();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.questionsContainer}>
        {props.questions.map((q, qIdx) => {
          const words = q.split(/\s+/);
          return (
            <View key={qIdx} style={styles.questionCard}>
              <TouchableOpacity style={styles.audioButton}>
                <FontAwesome6 name="volume-high" size={20} color="#fff" />
              </TouchableOpacity>
              <View style={styles.wordsContainer}>
                {words.map((w, wIdx) =>
                  w === "BLANK" ? (
                    <View
                      key={wIdx}
                      ref={(ref) => (dropZoneRefs.current[wIdx] = ref)}
                      onLayout={() => onDropZoneLayout(wIdx)}
                      style={styles.blankSpace}
                    />
                  ) : (
                    <Text key={wIdx} style={styles.wordText}>
                      {w}{" "}
                    </Text>
                  )
                )}
              </View>
            </View>
          );
        })}
      </View>
      <View style={styles.choicesContainer}>
        {props.choices.map((opt, ci) => renderChoice(opt, ci))}
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  questionsContainer: { flex: 1, padding: 10, rowGap: 14 },
  questionCard: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 20,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
  },
  audioButton: {
    backgroundColor: "#FFBF18",
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 180,
  },
  wordsContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    width: "80%",
  },
  blankSpace: {
    backgroundColor: "#DEDFE2",
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.4)",
    marginHorizontal: 10,
    padding: 10,
  },
  wordText: {
    lineHeight: 38,
    fontSize: 20,
    color: "#434242",
  },
  choicesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 20,
  },
  choiceHolder: {
    padding: 10,
    backgroundColor: "#DEDFE2",
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.4)",
    marginHorizontal: 10,
  },
  choiceText: {
    fontSize: 20,
    lineHeight: 38,
    color: "#434242",
    textAlign: "center",
  },
});

export default HomonymCard;
