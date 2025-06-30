import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Picker } from "@react-native-picker/picker";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import React, { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

interface HomonymItem {
  id: string;
  item_id: string | null;
  text: string[];
  answer: string[];
  distractors: string[];
  audio: FileInfo[];
  audio_path: string[];
  filename: string[];
  audioType: ("upload" | "record")[];
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
  const status = useAudioPlayerStatus(player);

  const handleAudioPlay = (index: number) => {
    player.pause();
    player.replace({
      uri: activity.audio?.[index]?.uri ?? activity.audio_path[index],
    });

    player.seekTo(0);
    player.play();
    return;
  };

  const answer = answers?.filter((ans) => ans.id === activity.id)[0];

  useEffect(() => {
    return () => {
      if (status.playing) {
        player.pause();
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={[styles.questionCard, styles.questionRow]}>
        <TouchableOpacity
          onPress={() => handleAudioPlay(0)}
          style={[
            styles.audioControl,
            // { backgroundColor: isPlaying ? "#FFBF18" : "#ddd" },
          ]}
          // disabled={isPlaying}
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
                    dropdownIconColor={"#FFBF18"}
                    style={styles.picker}
                    mode={"dropdown"}
                    selectedValue={activity.answer[0] ?? ""}
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

      <View style={[styles.questionCard, styles.questionRow]}>
        <TouchableOpacity
          onPress={() => handleAudioPlay(1)}
          style={[
            styles.audioControl,
            // { backgroundColor: isPlaying ? "#FFBF18" : "#ddd" },
          ]}
          // disabled={isPlaying}
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
                    selectedValue={activity.answer[1] ?? ""}
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
  container: {
    height: 100,
  },
  questionCard: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    padding: 9,
    borderRadius: 20,
    flexWrap: "wrap",
    alignItems: "flex-start",
    minWidth: "100%",
  },
  questionRow: {
    flexDirection: "row",
    columnGap: 10,
  },
  audioControl: {
    backgroundColor: "#FFBF18",
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 12,
    justifyContent: "flex-start",
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
    borderColor: "#ddd",
  },
  pickerError: {
    borderColor: "#db4141",
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
});

export default HomonymPreviewCard;
