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

  return (
    <View style={styles.container}>
      <ActivityProgress
        difficulty="Easy"
        totalItems={10}
        completedItems={0}
        instruction="Drag the word to complete the sentence"
      />

      <View style={styles.cardContainer}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <View style={styles.questionCard}>
            <FontAwesome6
              name="volume-high"
              size={20}
              color="#fff"
              style={styles.speakerIcon}
            />
          </View>
          <View style={{ backgroundColor: "transparent", flex: 1 }}>
            <View>
              <WordList>
                {words.map((item) => (
                  <Word key={item.id} id={item.id} word={item.word} />
                ))}
              </WordList>
            </View>
          </View>
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
