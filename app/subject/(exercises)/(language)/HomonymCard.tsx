import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

interface Activity {
  sentence: string;
  sentence_id: string;
  audio_path: string;
}

interface Answer {
  item_id: string;
  answers: { sentence_id: string; answer: string }[];
}

interface Props {
  activity: Activity[][];
  currentItem: number;
  emptyInput: boolean;
  itemId: string[];
  handleAudioPlay: (index: number) => void;
  handleAnswer: (answer: string, sentence_id: string) => void;
  answers: Answer[];
  choices: string[][];
}

const HomonymCard = ({
  activity,
  currentItem,
  handleAudioPlay,
  emptyInput,
  answers,
  itemId,
  handleAnswer,
  choices,
}: Props) => {
  return (
    <View style={styles.questionsWrapper}>
      {activity[currentItem]?.map((value, index: number) => {
        const words = value.sentence.split(" ");

        return (
          <View key={index} style={styles.questionCard}>
            <TouchableOpacity
              style={styles.audioButton}
              onPress={() => handleAudioPlay(index)}
            >
              <FontAwesome6 name="volume-high" size={25} color="#fff" />
            </TouchableOpacity>

            <View style={styles.wordContainer}>
              {words.map((word, i) => {
                if (word === "_____") {
                  return (
                    <View
                      key={`picker-${i}`}
                      style={[
                        styles.pickerWrapper,
                        emptyInput ? styles.pickerError : styles.pickerNormal,
                      ]}
                    >
                      <Text style={styles.pickerText}>
                        {answers
                          .find((a) => a.item_id === itemId[currentItem])
                          ?.answers.find(
                            (ans) => ans.sentence_id === value.sentence_id,
                          )?.answer || ""}
                      </Text>
                      <Picker
                        selectedValue={
                          answers
                            .find((a) => a.item_id === itemId[currentItem])
                            ?.answers.find(
                              (ans) => ans.sentence_id === value.sentence_id,
                            )?.answer || ""
                        }
                        dropdownIconColor={"#FFBF19"}
                        style={styles.picker}
                        onValueChange={(itemValue) =>
                          handleAnswer(itemValue, value.sentence_id)
                        }
                        mode={"dropdown"}
                      >
                        {choices[currentItem]?.map((choice) => (
                          <Picker.Item
                            label={choice}
                            value={choice}
                            key={choice}
                          />
                        ))}
                      </Picker>
                    </View>
                  );
                } else {
                  return (
                    <Text key={`word-${i}`} style={styles.wordText}>
                      {word}
                    </Text>
                  );
                }
              })}
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  questionsContainer: {
    height: "70%",
    justifyContent: "space-between",
    flexDirection: "column",
    alignItems: "center",
  },
  questionsWrapper: {
    width: "120%",
  },
  questionCard: {
    marginBottom: 20,
    flexDirection: "row",
    columnGap: 20,
    borderWidth: 1,
    borderColor: "#00000024",
    padding: 9,
    marginHorizontal: 40,
    borderRadius: 20,
  },
  audioButton: {
    backgroundColor: "#FFBF18",
    padding: 20,
    borderRadius: 15,
  },
  wordContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    maxWidth: "75%",
  },
  wordText: {
    marginRight: 5,
    fontSize: 16,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderRadius: 10,
    marginRight: 10,
    marginLeft: 5,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  pickerNormal: {
    borderColor: "#00000024",
  },
  pickerError: {
    borderColor: "red",
  },
  pickerText: {
    position: "absolute",
    left: 10,
    zIndex: 1,
  },
  picker: {
    width: 125,
    height: 30,
  },
  buttonWrapper: {
    width: "100%",
  },
  button: {
    borderRadius: 50,
    padding: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default HomonymCard;
