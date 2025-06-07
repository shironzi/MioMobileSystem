import HeaderConfig from "@/utils/HeaderConfig";
import React, { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import FillInTheBlanks from "@/components/trainingActivities/language/FillInTheBlanks";
import globalStyles from "@/styles/globalStyles";
import { FontAwesome6 } from "@expo/vector-icons";
import { useAudioPlayer } from "expo-audio";
import { router, useLocalSearchParams } from "expo-router";
import * as Speech from "expo-speech";
import { createFill } from "@/utils/language";

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

interface FillItem {
  id: string;
  text: string;
  distractors: string[];
  audio: FileInfo | null;
  audioType: "upload" | "record" | "system";
}

const FillPreview = () => {
  HeaderConfig("Fill in the Blank");

  const { data, subjectId, difficulty } = useLocalSearchParams<{
    data: string;
    subjectId: string;
    difficulty: string;
  }>();

  const items: FillItem[] = JSON.parse(decodeURIComponent(data as string));
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
      const res = await createFill(items, difficulty, subjectId);

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
          { cancelable: false },
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
    if (items[currentItem].audioType !== "system") {
      player.replace({ uri: items[currentItem].audio?.uri });

      player.play();
      return;
    }

    Speech.speak(items[currentItem].text, {
      pitch: 1,
      rate: 0.5,
      language: "en-US",
      voice: "com.apple.ttsbundle.Samantha-compact",
    });
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
          <Text style={globalStyles.submitButtonText}>Create</Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
};

export default FillPreview;
