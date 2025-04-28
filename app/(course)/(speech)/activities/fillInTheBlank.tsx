import { View, StyleSheet, Dimensions } from "react-native";
import React, { useCallback, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome6 } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import ActivityProgress from "@/components/activityProgress";
import Word from "@/components/dragAndDrop/Word";
import { Box, Dropzone } from "./types";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";

const words = [
  { id: 1, word: "Can" },
  { id: 2, word: "I" },
  { id: 3, word: "borrow" },
  { id: 4, word: "your" },
  { id: 5, word: "ballpen" },
  { id: 6, word: "his" },
  { id: 7, word: "pencil" },
  { id: 8, word: "take" },
  { id: 9, word: "the" },
  { id: 10, word: "notebook" },
];

const { width, height } = Dimensions.get("window");
const BOX_SIZE = 80;
const DROP_ZONE_COUNT = 4;
const DROP_ZONE_SPACING =
  (width - DROP_ZONE_COUNT * BOX_SIZE) / (DROP_ZONE_COUNT + 1);

const fillInTheBlank = () => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerTitle: "Picture Flashcards",
        headerStyle: {
          backgroundColor: "#2264DC",
        },
        headerTintColor: "#fff",
      });

      return () => {
        navigation.setOptions({
          headerTitle: "",
          headerStyle: {
            backgroundColor: "",
          },
          headerTintColor: "",
        });
      };
    }, [navigation])
  );

  const initialDropZones: Dropzone[] = Array.from(
    { length: DROP_ZONE_COUNT },
    (_, index) => ({
      id: index + 1,
      x: DROP_ZONE_SPACING * (index + 1) + BOX_SIZE * index,
      y: 300,
      occupiedBy: null,
    })
  );

  const initialDraggableBoxes: Box[] = [
    {
      id: 1,
      x: DROP_ZONE_SPACING,
      y: 100,
      word: "hello",
    },
    {
      id: 2,
      x: DROP_ZONE_SPACING,
      y: 100,
      word: "hello",
    },
    {
      id: 3,
      x: DROP_ZONE_SPACING,
      y: 100,
      word: "hello",
    },
    {
      id: 4,
      x: DROP_ZONE_SPACING,
      y: 100,
      word: "hello",
    },
  ];

  const [dropZones, setDropZones] = useState<Dropzone[]>(initialDropZones);
  const [draggableBoxes, setDraggableBoxes] = useState<Box[]>(
    initialDraggableBoxes
  );
  const [boxArrangement, setBoxArrangement] = useState<Box[]>([]);

  const translateValues = draggableBoxes.map(() => ({
    translateX: useSharedValue(0),
    translateY: useSharedValue(0),
  }));

  return (
    <View style={styles.container}>
      <ActivityProgress
        difficulty="Easy"
        totalItems={10}
        completedItems={0}
        instruction="Drag the word to complete the sentence"
      />

      <View style={styles.cardContainer}>
        <View style={{ flex: 1 }}>
          <View style={styles.questionCard}>
            <FontAwesome6
              name="volume-high"
              size={20}
              color="#fff"
              style={styles.speakerIcon}
            />
          </View>
          <View style={{ backgroundColor: "transparent", flex: 1 }}>
            <GestureHandlerRootView>
              {draggableBoxes.map((box, index) => {
                const animatedStyle = useAnimatedStyle(() => ({
                  transform: [
                    { translateX: translateValues[index].translateX.value },
                    { translateY: translateValues[index].translateY.value },
                  ],
                }));

                return (
                  <PanGestureHandler>
                    <Animated.View
                      style={[{ left: box.x, top: box.y }, animatedStyle]}
                    >
                      <Word key={index} id={box.id} word={box.word}></Word>
                    </Animated.View>
                  </PanGestureHandler>
                );
              })}

              {dropZones.map((zone) => (
                <View key={zone.id}>
                  <Word id={zone.id} word={zone.occupiedBy || ""} />
                </View>
              ))}
            </GestureHandlerRootView>
          </View>
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
  cardContainer: {
    height: "50%",
  },
  questionCard: {
    flexDirection: "column",
    height: "70%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 17,
  },
  speakerIcon: {
    backgroundColor: "#FFBF18",
    borderRadius: 180,
    paddingHorizontal: 10,
    paddingVertical: 12,
    alignSelf: "flex-start",
  },
});

export default fillInTheBlank;
