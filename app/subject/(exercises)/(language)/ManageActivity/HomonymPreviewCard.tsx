import React, { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as Speech from "expo-speech";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useAudioPlayer } from "expo-audio";

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

interface HomonymItem {
  id: string;
  text: string[];
  answer: string[];
  distractors: string[];
  audio: FileInfo[];
  audioType: ("upload" | "record" | "system")[];
}

interface Props {
  activity: HomonymItem;
  emptyInput: boolean;
  answers: { id: string; answer: string[] }[];
  handleAnswer: (answer: string, index: number) => void;
}

const HomonymPreviewCard = ({
  activity,
  emptyInput,
  handleAnswer,
  answers,
}: Props) => {
  const activitySentence1 = activity.text[0].split(" ");
  const activitySentence2 = activity.text[1].split(" ");

  const choices = Array.from(
    new Set([...activity.distractors, ...activity.answer]),
  );

  const player = useAudioPlayer();

  const handleAudioPlay = (
    activityType: string,
    text: string,
    audio: FileInfo,
  ) => {
    if (activityType !== "system") {
      player.replace({ uri: audio.uri });
      player.play();

      return;
    }

    Speech.speak(text, {
      pitch: 1,
      rate: 0.5,
      language: "en-US",
      voice: "com.apple.ttsbundle.Samantha-compact",
    });
  };

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const answer = answers?.filter((ans) => ans.id === activity.id)[0];

  return (
    <View style={{ height: 500 }}>
      <View
        style={[styles.questionCard, { flexDirection: "row", columnGap: 10 }]}
      >
        <TouchableOpacity
          onPress={() =>
            handleAudioPlay(
              activity.audioType[0],
              activity.text[0],
              activity.audio[0],
            )
          }
          style={{
            backgroundColor: "#FFBF18",
            paddingVertical: 20,
            paddingHorizontal: 25,
            borderRadius: 12,
            justifyContent: "flex-start",
          }}
        >
          <FontAwesome name="volume-up" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.wordContainer}>
          {activitySentence1.map((word, i) => {
            if (/^_+$/.test(word)) {
              return (
                <View
                  key={i}
                  style={[
                    styles.pickerWrapper,
                    emptyInput ? styles.pickerError : styles.pickerNormal,
                  ]}
                >
                  <Text style={styles.pickerText}>{answer?.answer[0]}</Text>
                  <Picker
                    dropdownIconColor={"#FFBF19"}
                    style={styles.picker}
                    mode={"dropdown"}
                    selectedValue={activity.answer[0]}
                    onValueChange={(value) => handleAnswer(value, 0)}
                  >
                    {choices.map((choice) => (
                      <Picker.Item label={choice} value={choice} key={choice} />
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

      <View
        style={[styles.questionCard, { flexDirection: "row", columnGap: 10 }]}
      >
        <TouchableOpacity
          onPress={() =>
            handleAudioPlay(
              activity.audioType[1],
              activity.text[1],
              activity.audio[1],
            )
          }
          style={{
            backgroundColor: "#FFBF18",
            paddingVertical: 20,
            paddingHorizontal: 25,
            borderRadius: 12,
            justifyContent: "flex-start",
          }}
        >
          <FontAwesome name="volume-up" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.wordContainer}>
          {activitySentence2.map((word, i) => {
            if (/^_+$/.test(word)) {
              return (
                <View
                  key={i}
                  style={[
                    styles.pickerWrapper,
                    emptyInput ? styles.pickerError : styles.pickerNormal,
                  ]}
                >
                  <Text style={styles.pickerText}>{answer?.answer[1]}</Text>
                  <Picker
                    dropdownIconColor={"#FFBF19"}
                    style={styles.picker}
                    mode={"dropdown"}
                    selectedValue={activity.answer[0]}
                    onValueChange={(value) => handleAnswer(value, 1)}
                  >
                    {choices.map((choice) => (
                      <Picker.Item label={choice} value={choice} key={choice} />
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
    </View>
  );
};

const styles = StyleSheet.create({
  questionCard: {
    marginBottom: 20,
    flexDirection: "row",
    columnGap: 20,
    borderWidth: 1,
    borderColor: "#00000024",
    backgroundColor: "#fff",
    padding: 9,
    borderRadius: 20,
    flexWrap: "wrap",
    alignItems: "flex-start",
    minWidth: "100%",
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
    rowGap: 4,
  },
  wordText: {
    marginRight: 5,
    fontSize: 16,
    flexWrap: "wrap",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderRadius: 10,
    marginRight: 10,
    marginLeft: 5,
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
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

export default HomonymPreviewCard;
