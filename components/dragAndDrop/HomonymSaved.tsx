// import { View, Text, TouchableOpacity } from "react-native";
// import React, { useMemo } from "react";
// import HeaderConfig from "@/components/HeaderConfig";
// import { FontAwesome6 } from "@expo/vector-icons";
// import { StyleSheet } from "react-native";

// const HomonymCard = (props: { questions: string[]; choices: string[] }) => {
//   HeaderConfig("Homonyms");

//   // 1. find the longest choice string length
//   const maxCharCount = useMemo(
//     () => Math.max(...props.choices.map((opt) => opt.length), 0),
//     [props.choices]
//   );

//   const approxCharWidth = 0.6 * styles.choiceText.fontSize;
//   const dynamicWidth =
//     maxCharCount * approxCharWidth + styles.choiceHolder.padding * 2;

//   return (
//     <View>
//       <View style={styles.questionsContainer}>
//         {props.questions.map((question, index) => {
//           const words = question.split(/\s+/);

//           return (
//             <View key={index} style={styles.questionCard}>
//               <TouchableOpacity style={styles.audioButton}>
//                 <FontAwesome6 name="volume-high" size={20} color="#fff" />
//               </TouchableOpacity>

//               <View style={styles.wordsContainer}>
//                 {words.map((word, index) =>
//                   word === "BLANK" ? (
//                     <View
//                       key={index}
//                       style={[
//                         styles.choiceHolder,
//                         { width: dynamicWidth, padding: 20 },
//                       ]}
//                     ></View>
//                   ) : (
//                     <Text key={index} style={styles.wordText}>
//                       {word}{" "}
//                     </Text>
//                   )
//                 )}
//               </View>
//             </View>
//           );
//         })}
//       </View>
//       <View style={styles.choicesContainer}>
//         {props.choices.map((option, index) => (
//           <Text key={index} style={styles.choiceHolder}>
//             {option}
//           </Text>
//         ))}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   questionsContainer: {
//     width: "100%",
//     rowGap: 14,
//     height: "70%",
//   },
//   questionCard: {
//     flexDirection: "row",
//     alignItems: "center",
//     columnGap: 20,
//     backgroundColor: "#fff",
//     padding: 15,
//     borderRadius: 10,
//   },
//   audioButton: {
//     backgroundColor: "#FFBF18",
//     paddingHorizontal: 10,
//     paddingVertical: 12,
//     borderRadius: 180,
//   },
//   wordsContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     flexWrap: "wrap",
//     width: "85%",
//   },
//   blankSpace: {
//     width: 80,
//     height: 37,
//     backgroundColor: "#DEDFE2",
//     borderRadius: 5,
//     borderWidth: 0.5,
//     borderColor: "rgba(0,0,0,0.4)",
//     shadowColor: "#000",
//     shadowOffset: { width: 2, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 5,
//     elevation: 5,
//     marginHorizontal: 10,
//   },
//   wordText: {
//     lineHeight: 38,
//     fontSize: 20,
//     color: "#434242",
//   },
//   choicesContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//   },
//   choiceHolder: {
//     padding: 10,
//     backgroundColor: "#DEDFE2",
//     borderRadius: 5,
//     borderWidth: 0.5,
//     borderColor: "rgba(0,0,0,0.4)",
//     shadowColor: "#000",
//     shadowOffset: { width: 2, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 5,
//     elevation: 5,
//     marginHorizontal: 10,
//     lineHeight: 20,
//     fontSize: 20,
//     color: "#434242",
//   },
//   choiceText: {
//     fontSize: 20,
//     lineHeight: 24,
//     color: "#434242",
//     textAlign: "center",
//   },
// });

// export default HomonymCard;

// HomonymCard.tsx
import React, { useRef, useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutChangeEvent,
  Dimensions,
} from "react-native";
import HeaderConfig from "@/components/HeaderConfig";
import { FontAwesome6 } from "@expo/vector-icons";
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";

// Type for our blank/drop-zone rectangles
type Rect = { x: number; y: number; width: number; height: number };

export default function HomonymCard({
  questions,
  choices,
}: {
  questions: string[];
  choices: string[];
}) {
  HeaderConfig("Homonyms");

  // 1. Prepare to save each BLANK's on-screen rect
  const choicesPosition = useRef<Rect[]>([]);
  const recordPosition = (i: number) => (e: LayoutChangeEvent) => {
    const { x, y, width, height } = e.nativeEvent.layout;
    choicesPosition.current[i] = { x, y, width, height };
  };

  // 2. Track which blank (by index) has which word
  const [placed, setPlaced] = useState<Record<number, string>>({});

  // 3. When drag ends, check if the drop landed in any rect
  const handleDrop = (
    choiceIndex: number,
    absX: number,
    absY: number,
    reset: () => void
  ) => {
    const zoneIndex = choicesPosition.current.findIndex((rect) => {
      if (!rect) return false;
      return (
        absX >= rect.x &&
        absX <= rect.x + rect.width &&
        absY >= rect.y &&
        absY <= rect.y + rect.height
      );
    });

    if (zoneIndex >= 0) {
      // Drop succeeded: assign word to blank
      setPlaced((prev) => ({
        ...prev,
        [zoneIndex]: choices[choiceIndex],
      }));
    }
    // always reset the bubble back
    runOnJS(reset)();
  };

  // 4. Render one draggable choice bubble
  const renderChoice = (option: string, idx: number) => {
    // shared values for translation
    const tX = useSharedValue(0);
    const tY = useSharedValue(0);

    // animated style that applies translateX/Y
    const aStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: tX.value }, { translateY: tY.value }],
    }));

    // function to reset back to [0,0] with spring
    const resetPosition = () => {
      tX.value = withSpring(0);
      tY.value = withSpring(0);
    };

    // the pan gesture
    const pan = Gesture.Pan()
      .onUpdate((evt) => {
        tX.value = evt.translationX;
        tY.value = evt.translationY;
      })
      .onEnd((evt) => {
        // pass drop coords and reset fn into JS world
        runOnJS(handleDrop)(idx, evt.absoluteX, evt.absoluteY, resetPosition);
      });

    return (
      <GestureDetector key={idx} gesture={pan}>
        <Animated.View style={[styles.choiceHolder, aStyle]}>
          <Text style={styles.choiceText}>{option}</Text>
        </Animated.View>
      </GestureDetector>
    );
  };

  return (
    <GestureHandlerRootView style={styles.root}>
      {/* QUESTIONS WITH BLANKS */}
      <View style={styles.questionsContainer}>
        {questions.map((q, qi) => {
          const words = q.split(/\s+/);
          return (
            <View key={qi} style={styles.questionCard}>
              <TouchableOpacity style={styles.audioButton}>
                <FontAwesome6 name="volume-high" size={20} color="#fff" />
              </TouchableOpacity>
              <View style={styles.wordsContainer}>
                {words.map((w, wi) =>
                  w === "BLANK" ? (
                    <View
                      key={wi}
                      onLayout={recordPosition(wi)}
                      style={styles.blankSpace}
                    >
                      {placed[wi] && (
                        <Text style={styles.wordText}>{placed[wi]}</Text>
                      )}
                    </View>
                  ) : (
                    <Text key={wi} style={styles.wordText}>
                      {w}{" "}
                    </Text>
                  )
                )}
              </View>
            </View>
          );
        })}
      </View>

      {/* DRAGGABLE CHOICES */}
      <View style={styles.choicesContainer}>
        {choices.map((opt, ci) => renderChoice(opt, ci))}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 12 },
  questionsContainer: { marginBottom: 24 },
  questionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  audioButton: {
    backgroundColor: "#FFBF18",
    padding: 8,
    borderRadius: 999,
    marginRight: 8,
  },
  wordsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    flex: 1,
  },
  blankSpace: {
    width: 80,
    height: 40,
    backgroundColor: "#DEDFE2",
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    margin: 4,
  },
  wordText: { fontSize: 18, lineHeight: 24 },
  choicesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  choiceHolder: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#DEDFE2",
    borderRadius: 5,
    margin: 6,
    // shadows for depth
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  choiceText: { fontSize: 18, textAlign: "center" },
});
