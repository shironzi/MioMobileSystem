import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import React, { useCallback, useState } from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ActivityProgress from "@/components/activityProgress";
import Word from "@/components/trainingActivities/language/Word";
import WordList from "@/components/trainingActivities/language/WordList";
import HeaderConfig from "@/components/HeaderConfig";

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
  const [currentSentence, setCurrentSentence] = useState<string>("");

  const handleSubmit = () => {
    console.log(currentSentence);
  };

  const handleSentenceChange = useCallback((sentence: string) => {
    console.log("Working");
    setCurrentSentence(sentence);
  }, []);

  HeaderConfig("Fill in the Blank");

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
              <FontAwesome6 name="volume-high" size={25} color="#fff" />
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
    height: "70%",
  },
  wordsArea: {
    backgroundColor: "transparent",
    paddingTop: 20,
    height: 100,
  },
  speakerIcon: {
    backgroundColor: "#FFBF18",
    borderRadius: 180,
    alignSelf: "flex-start",
    height: 50,
    width: 50,
    top: -10,
    paddingTop: 13,
    paddingLeft: 10,
    left: 0,
    marginTop: 10,
    marginBottom: 10,
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
