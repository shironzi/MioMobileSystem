import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import React, { useCallback, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome6 } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ActivityProgress from "@/components/activityProgress";
import Word from "@/components/dragAndDrop/Word";
import WordList from "@/components/dragAndDrop/WordList";

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

const fillInTheBlank = () => {
  const navigation = useNavigation();
  const [currentSentence, setCurrentSentence] = useState<string>("");

  const handleSubmit = () => {
    console.log(currentSentence);
  };

  const handleSentenceChange = useCallback((sentence: string) => {
    console.log("Working");
    setCurrentSentence(sentence);
  }, []);

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerTitle: "Fill in the Blank",
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
    <GestureHandlerRootView>
      <View style={styles.container}>
        <View style={styles.progressContainer}>
          <ActivityProgress
            difficulty="Easy"
            totalItems={10}
            completedItems={0}
            instruction="Drag the words to complete the sentence"
          />
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.sentenceContainer}>
            <View style={styles.speakerIcon}>
              <FontAwesome6 name="volume-high" size={20} color="#fff" />
            </View>
            <View style={styles.wordsArea}>
              <WordList onSentenceChange={handleSentenceChange}>
                {words.map((word) => (
                  <Word key={word.id} {...word} />
                ))}
              </WordList>
            </View>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleSubmit} style={styles.button}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  progressContainer: {},
  contentContainer: {},
  cardContainer: {},
  sentenceContainer: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: "63%",
  },
  wordsArea: {
    backgroundColor: "transparent",
    paddingTop: 20,
    height: 300,
  },
  speakerIcon: {
    backgroundColor: "#FFBF18",
    borderRadius: 180,
    alignSelf: "flex-start",
    height: 50,
    width: 50,
    alignContent: "center",
  },
  button: {
    backgroundColor: "#FFBF18",
    padding: 15,
    borderRadius: 50,
    alignItems: "center",
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonContainer: {
    justifyContent: "flex-end",
  },
});

export default fillInTheBlank;
