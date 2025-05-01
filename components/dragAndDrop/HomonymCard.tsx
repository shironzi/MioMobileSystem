import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import HeaderConfig from "@/components/HeaderConfig";
import { FontAwesome6 } from "@expo/vector-icons";
import { StyleSheet } from "react-native";

const HomonymCard = (props: { questions: string[]; choices: string[] }) => {
  HeaderConfig("Homonyms");

  return (
    <View>
      <View style={styles.questionsContainer}>
        {props.questions.map((question, index) => {
          const words = question.split(/\s+/);

          return (
            <View key={index} style={styles.questionCard}>
              <TouchableOpacity style={styles.audioButton}>
                <FontAwesome6 name="volume-high" size={20} color="#fff" />
              </TouchableOpacity>

              <View style={styles.wordsContainer}>
                {words.map((word, index) =>
                  word === "BLANK" ? (
                    <View key={index} style={styles.choiceHolder}></View>
                  ) : (
                    <Text key={index} style={styles.wordText}>
                      {word}{" "}
                    </Text>
                  )
                )}
              </View>
            </View>
          );
        })}
      </View>
      <View style={styles.choicesContainer}>
        {props.choices.map((option, index) => (
          <Text key={index} style={styles.choiceHolder}>
            {option}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  questionsContainer: {
    width: "100%",
    rowGap: 14,
    height: "70%",
  },
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
    width: "85%",
  },
  blankSpace: {
    width: 80,
    height: 37,
    backgroundColor: "#DEDFE2",
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.4)",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
    marginHorizontal: 10,
  },
  wordText: {
    lineHeight: 38,
    fontSize: 20,
    color: "#434242",
  },
  choicesContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  choiceHolder: {
    padding: 10,
    backgroundColor: "#DEDFE2",
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.4)",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
    marginHorizontal: 10,
    lineHeight: 20,
    fontSize: 20,
    color: "#434242",
  },
});

export default HomonymCard;
