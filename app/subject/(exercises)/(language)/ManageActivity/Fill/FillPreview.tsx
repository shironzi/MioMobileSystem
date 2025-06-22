import FillInTheBlanks from "@/components/trainingActivities/language/FillInTheBlanks";
import globalStyles from "@/styles/globalStyles";
import HeaderConfig from "@/utils/HeaderConfig";
import { createFill, editFill } from "@/utils/language";
import { FontAwesome6 } from "@expo/vector-icons";
import { useAudioPlayer } from "expo-audio";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
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
  const [isPlaying, setIsPlaying] = useState(false);
  

  const handleNext = async () => {
    if (currentItem >= items.length - 1) {
      return;
    }
    setCurrentItem(currentItem + 1);
  };

  const handlePrev = async () => {
    if (currentItem === 0) {
      return;
    }
    setCurrentItem(currentItem - 1);
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
    setIsPlaying(true);
    return;
  };
  

    return (
      <GestureHandlerRootView style={[globalStyles.container, { flex: 1 }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          // contentContainerStyle={{ paddingBottom: 150 }}
        >
          <View
            style={{
              borderColor: "#ddd",
              borderWidth: 1,
              borderRadius: 20,
              padding: 10,
              marginBottom: 20,
              flexDirection: "row",
            }}
          >
            <TouchableOpacity
              style={[
                {
                  padding: 20,
                  borderRadius: 15,
                  maxWidth: 75,
                },
                isPlaying
                  ? { backgroundColor: "#ffbf18" }
                  : { backgroundColor: "#ddd" },
              ]}
              onPress={handleAudioPlay}
              disabled={isPlaying}
              >
              <FontAwesome6 name="volume-high" size={25} color="#fff" />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "300",
                alignSelf: "center",
                left: 60,
                lineHeight: 20,
              }}
            >
              Tap the speaker icon.{"\n"}    Listen carefully!
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: -20,
              marginVertical: -10,
              marginHorizontal: -20,
            }}
          >
            <TouchableOpacity
              style={[
                globalStyles.submitButton,
                {
                  width: "30%",
                  backgroundColor: "#fff",
                  opacity: currentItem === 0 ? 0.5 : 1,
                },
              ]}
              onPress={handlePrev}
              disabled={currentItem === 0}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 5,
                }}
              >
                <FontAwesome6
                  name="arrow-left-long"
                  size={16}
                  color={currentItem === 0 ? "#1f1f1f" : "#ffbf18"}
                  style={{ top: 3 }}
                />
                <Text
                  style={[
                    globalStyles.submitButtonText,
                    { color: currentItem === 0 ? "#1f1f1f" : "#ffbf18" },
                  ]}
                >
                  Prev
                </Text>
              </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              globalStyles.submitButton,
              {
                width: "30%",
                backgroundColor: "#fff",
                opacity: currentItem >= items.length - 1 ? 0.5 : 1,
              },
            ]}
            onPress={handleNext}
            disabled={currentItem >= items.length - 1}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                gap: 5,
              }}
            >
              <Text
                style={[
                  globalStyles.submitButtonText,
                  { color: currentItem >= items.length - 1 ? "#1f1f1f" : "#ffbf18" },
                ]}
              >
                Next
              </Text>
              <FontAwesome6
                name="arrow-right-long"
                size={16}
                color={currentItem >= items.length - 1 ? "#1f1f1f" : "#ffbf18"}
                style={{ top: 3 }}
              />
            </View>
          </TouchableOpacity>
        </View>
        <FillInTheBlanks
          key={currentItem}
          sentence={
            items[currentItem].text +
            " " +
            items[currentItem].distractors.join(" ")
          }
          handleAnswers={() => {}}
        />
        </ScrollView>
    
        <View
          style={{
          flexDirection: "row",
          justifyContent: "space-between",
          position: "absolute",
          bottom: 20,
          left: 20,
          right: 20,
        }}
      >
        <TouchableOpacity
          style={[globalStyles.inactivityButton, { width: "48%" }]}
          onPress={() => router.back()}
        >
          <Text style={globalStyles.inactivityButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[globalStyles.submitButton, { width: "48%" }]}
          onPress={handleSubmit}
        >
          <Text style={[globalStyles.submitButtonText, { top: 3 }]}>
            {activityId ? "Update" : "Create"}
          </Text>
        </TouchableOpacity>
      </View>
   
      </GestureHandlerRootView>
    );
};

export default FillPreview;
