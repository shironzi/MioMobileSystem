import AudioPlayer from "@/components/trainingActivities/AudioPlayer";
import FlashcardMicrophone from "@/components/trainingActivities/speech/FlashcardMicrophone";
import globalStyles from "@/styles/globalStyles";
import useHeaderConfig from "@/utils/HeaderConfig";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { memo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import takeActivity from "@/app/subject/(exercises)/(speech)/SpeechRoutes";

const MicrophoneTest = () => {
  useHeaderConfig("Microphone Test");

  const { activity_type, role, subjectId, activityId, difficulty, phoneme } =
    useLocalSearchParams<{
      activity_type: string;
      role: string;
      difficulty: string;
      subjectId: string;
      activityId: string;
      phoneme: string;
    }>();

  const [recordingAudio, setRecordingAudio] = useState<string | null>("");

  const handleTakeExercise = () => {
    takeActivity(
      role,
      subjectId,
      activity_type,
      phoneme,
      activityId,
      difficulty,
    );
  };

  return (
    <GestureHandlerRootView>
      <View
        style={[
          {
            height: "100%",
            backgroundColor: "#fff",
          },
        ]}
      >
        <View style={[globalStyles.cardContainer1, { marginBottom: 15 }]}>
          <View>
            <Image
              source={require("@/assets/mic_test.png")}
              style={[styles.image, { width: 170, height: 200 }]}
            />
            <Text style={[globalStyles.text1, styles.title]}>
              Microphone Test
            </Text>
            <Text style={[globalStyles.text1, styles.description]}>
              Say "Piddie" to test the microphone
            </Text>
          </View>
        </View>
        <View style={{ marginHorizontal: 20, marginBottom: 15 }}>
          <FlashcardMicrophone
            onStop={(uri) => {
              setRecordingAudio(uri);
            }}
          />
        </View>
        <View style={[{ marginTop: 0, marginHorizontal: 20 }]}>
          {recordingAudio && (
            <View>
              <AudioPlayer uri={recordingAudio} />

              <Text
                style={[
                  globalStyles.text1,
                  styles.description,
                  { marginVertical: 10 },
                ]}
              >
                Did you hear your voice clearly?
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                }}
              >
                <TouchableOpacity
                  style={[globalStyles.inactivityButton]}
                  onPress={() => router.back()}
                >
                  <Text style={[globalStyles.inactivityButtonText]}>No</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[globalStyles.submitButton, { width: "45%" }]}
                  onPress={handleTakeExercise}
                >
                  <Text style={globalStyles.submitButtonText}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 250,
    height: 250,
    alignSelf: "center",
    marginVertical: "auto",
  },
  title: {
    marginHorizontal: "auto",
    fontSize: 20,
    marginVertical: 10,
  },
  description: {
    marginHorizontal: "auto",
    fontSize: 14,
    fontWeight: 300,
  },
});

export default memo(MicrophoneTest);
