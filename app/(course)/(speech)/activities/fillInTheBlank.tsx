import { View, Text, StyleSheet } from "react-native";
import React, { useCallback, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome6 } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import ActivityProgress from "@/components/activityProgress";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Word from "@/components/dragAndDrop/Word";
import WordList from "@/components/dragAndDrop/WordList";

import { Dimensions } from "react-native";

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

const fillInTheBlank = () => {
  const navigation = useNavigation();
  const [iconBounds, setIconBounds] = useState<{
    left: number;
    top: number;
    right: number;
    bottom: number;
  } | null>(null);
  const iconRef = useRef<View | null>(null);

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

  const measureIcon = () => {
    if (iconRef.current) {
      iconRef.current.measure((x, y, width, height, pageX, pageY) => {
        const padding = 10;
        setIconBounds({
          left: pageX - padding,
          top: pageY - padding,
          right: pageX + width + padding,
          bottom: pageY + height + padding,
        });
      });
    }
  };

  return (
    <View style={styles.container}>
      <ActivityProgress
        difficulty="Easy"
        totalItems={10}
        completedItems={0}
        instruction="Drag the word to complete the sentence"
      />

      <View style={styles.questionCard}>
        <FontAwesome6
          name="volume-high"
          size={20}
          color="#fff"
          style={styles.speakerIcon}
        />
        <GestureHandlerRootView>
          <View>
            <Text>Answers</Text>
          </View>
          <WordList>
            {words.map((item) => (
              <Word key={item.id} id={item.id} word={item.word} />
            ))}
          </WordList>
        </GestureHandlerRootView>
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
  questionCard: {
    flexDirection: "column",
    backgroundColor: "#fff",
    height: height * 0.5,
    borderRadius: 10,
  },
  speakerIcon: {
    backgroundColor: "#FFBF18",
    borderRadius: 180,
    padding: 10,
    display: "flex",
  },
});

export default fillInTheBlank;
