import FillInTheBlanks from "@/components/trainingActivities/language/FillInTheBlanks";
import globalStyles from "@/styles/globalStyles";
import HeaderConfig from "@/utils/HeaderConfig";
import { createFill, editFill } from "@/utils/language";
import { FontAwesome6 } from "@expo/vector-icons";
import { useAudioPlayer } from "expo-audio";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

interface FillItem {
  id: string;
  item_id: string | null;
  text: string;
  distractors: string[];
  audio: FileInfo | null;
  filename: string | null;
  audio_path: string | null;
  audioType: "upload" | "record";
}

const FillPreview = () => {
  HeaderConfig("Fill in the Blank");

  const { data, subjectId, difficulty, activityId } = useLocalSearchParams<{
    data: string;
    subjectId: string;
    difficulty: string;
    activityId: string;
  }>();

  const items: FillItem[] = JSON.parse(data);
  const [currentItem, setCurrentItem] = useState<number>(0);

  const handleNext = async () => {
    if (currentItem >= items.length) {
      setCurrentItem(0);
      return;
    }
    setCurrentItem(currentItem + 1);
  };

  const handleSubmit = async () => {
    try {
      const res = activityId
        ? await editFill(items, difficulty, subjectId, activityId)
        : await createFill(items, difficulty, subjectId);

      if (res.success) {
        Alert.alert(
          "Success",
          "Successfully created the activity",
          [
            {
              text: "OK",
              onPress: () => {
                router.back();
                router.back();
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      Alert.alert("Error", "Submission failed. Please check your inputs.");
    }
  };

  const player = useAudioPlayer();

  const handleAudioPlay = async () => {
    player.replace({
      uri:
        items[currentItem].audio?.uri ?? items[currentItem]?.audio_path ?? "",
    });
    await player.seekTo(0);

    player.play();
    return;
  };

  return (
    <GestureHandlerRootView style={globalStyles.container}>
      <TouchableOpacity
        style={{
          backgroundColor: "#FFBF18",
          padding: 20,
          borderRadius: 15,
          maxWidth: 75,
        }}
        onPress={handleAudioPlay}
      >
        <FontAwesome6 name="volume-high" size={25} color="#fff" />
      </TouchableOpacity>

      <FillInTheBlanks
        key={currentItem}
        sentence={
          items[currentItem].text +
          " " +
          items[currentItem].distractors.join(" ")
        }
        handleAnswers={() => {}}
      />

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TouchableOpacity
          style={[globalStyles.submitButton, { width: "48%" }]}
          onPress={handleNext}
        >
          <Text style={globalStyles.submitButtonText}>Next</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[globalStyles.submitButton, { width: "48%" }]}
          onPress={handleSubmit}
        >
          <Text style={globalStyles.submitButtonText}>
            {activityId ? "Update" : "Create"}
          </Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
};

export default FillPreview;
