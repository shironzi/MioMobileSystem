import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { memo, useEffect, useState } from "react";
import { Image } from "expo-image";
import useHeaderConfig from "@/utils/HeaderConfig";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import globalStyles from "@/styles/globalStyles";
import { router, useLocalSearchParams } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";

const audioSource = require("@/assets/audio/piddie.mp3");

const SpeakerTest = () => {
  useHeaderConfig("Flashcards");

  const {
    category,
    activity_type,
    role,
    subjectId,
    activityId,
    difficulty,
    attemptId,
  } = useLocalSearchParams<{
    category: string;
    activity_type: string;
    role: string;
    difficulty: string;
    subjectId: string;
    activityId: string;
    attemptId: string;
  }>();

  const player = useAudioPlayer(audioSource);
  const status = useAudioPlayerStatus(player);

  const [played, setPlayed] = useState<boolean>(false);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    if (status.playing) {
      setIsPlaying(true);
    } else if (status.didJustFinish) {
      setIsPlaying(false);
    }
  }, [status.playing, status.didJustFinish]);

  const handlePlayButton = () => {
    player.replace(audioSource);
    player.play();
    setPlayed(true);
  };

  const handleTakeExercise = () => {
    if (activity_type === "bingo") {
      router.push({
        pathname:
          role === "teacher"
            ? "/subject/(exercises)/(auditory)/ManageAuditoryActivity/AddAuditoryActivity"
            : "/subject/(exercises)/(auditory)/bingo",
        params: {
          subjectId,
          activity_type,
          difficulty,
          category,
          activityId,
          prevAttemptId: attemptId,
        },
      });
    }

    if (activity_type === "matching") {
      router.push({
        pathname:
          role === "teacher"
            ? "/subject/(exercises)/(auditory)/ManageAuditoryActivity/AddAuditoryActivity"
            : "/subject/(exercises)/(auditory)/MatchingCards",
        params: {
          subjectId,
          activity_type,
          difficulty,
          category,
          activityId,
          prevAttemptId: attemptId,
        },
      });
    }
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
        <View style={globalStyles.cardContainer1}>
          <View>
            <Image
              source={require("@/assets/mic_test.png")}
              style={styles.image}
            />
            <Text
              style={[
                globalStyles.text1,
                {
                  marginHorizontal: "auto",
                  fontSize: 14,
                },
              ]}
            >
              Sound check! Can you hear Piddie loud and clear?
            </Text>
            <TouchableOpacity
              style={[
                globalStyles.cardContainer1,
                { flexDirection: "row", alignItems: "center" },
                isPlaying && {
                  borderColor: "#FFBF18",
                },
              ]}
              onPress={handlePlayButton}
            >
              <FontAwesome6
                name="volume-high"
                size={30}
                color={isPlaying ? "#FFBF18" : "#0000000"}
              />
              <Text style={globalStyles.text2}>
                Tap the speaker to hear the Piddie!
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {played && (
          <View
            style={[
              globalStyles.cardContainer1,
              {
                marginTop: 0,
                flexDirection: "column",
              },
            ]}
          >
            <Text style={{ marginHorizontal: "auto" }}>
              Did you hear Piddie well?
            </Text>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TouchableOpacity
                style={[
                  globalStyles.submitButton,
                  {
                    backgroundColor: "#fff",
                    borderWidth: 1,
                    borderColor: "#FFBF18",
                    width: "45%",
                  },
                ]}
                onPress={() => router.back()}
              >
                <Text
                  style={[globalStyles.submitButtonText, { color: "#FFBF18" }]}
                >
                  No
                </Text>
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
});

export default memo(SpeakerTest);
