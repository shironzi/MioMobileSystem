import BingoCard from "@/components/trainingActivities/auditory/bingoCard";
import globalStyles from "@/styles/globalStyles";
import useHeaderConfig from "@/utils/HeaderConfig";
import { FontAwesome6 } from "@expo/vector-icons";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { router, useLocalSearchParams } from "expo-router";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { createBingoActivity, updateBingoActivity } from "@/utils/auditory";

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

interface BingoItem {
  id: string;
  image_path: FileInfo | string | null;
  image_id: string | null;
}

interface AudioItem {
  id: string;
  audio_path: string | FileInfo | null;
  audio_id: string | null;
}

const BingoPreview = () => {
  useHeaderConfig("Piddie Says");

  const {
    subjectId,
    activityId,
    activityDifficulty,
    bingoItems,
    bingoAudio,
    title,
    remedialId,
  } = useLocalSearchParams<{
    subjectId: string;
    activityId: string;
    activityDifficulty: string;
    bingoItems: string;
    bingoAudio: string;
    title: string;
    remedialId: string;
  }>();

  const parsedBingoItems = useMemo<BingoItem[]>(() => {
    try {
      return JSON.parse(bingoItems || "[]");
    } catch {
      return [];
    }
  }, [bingoItems]);

  const parsedBingoAudio = useMemo<AudioItem[]>(() => {
    try {
      return JSON.parse(bingoAudio || "[]");
    } catch {
      return [];
    }
  }, [bingoAudio]);

  const [currentAudio, setCurrentAudio] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [answers, setAnswers] = useState<
    { image_id: string; audio_id: string }[]
  >([]);
  const [isPlayed, setIsPlayed] = useState(false);

  const player = useAudioPlayer();
  const status = useAudioPlayerStatus(player);

  const activityData = parsedBingoItems.map((item) => ({
    image_id: item.id,
    image_path: item.image_path,
  }));

  const handleCardPress = (image_id: string) => {
    if (!isPlayed) return;

    // Get the corresponding audio_id for the currentAudio index
    const audio_id =
      parsedBingoAudio.find((_, index) => index === currentAudio)?.audio_id ??
      "";

    // Update the answers array with both image_id and audio_id
    setAnswers((prev) => {
      const updated = [...prev];
      updated[currentAudio] = { image_id, audio_id };
      return updated;
    });

    // Move to next audio only if valid
    if (image_id && image_id.length > 0) {
      setCurrentAudio((prev) =>
        prev >= parsedBingoAudio.length - 1 ? 0 : prev + 1,
      );
    }
  };

  useEffect(() => {
    if (status.playing) {
      setIsPlaying(true);
    } else if (status.didJustFinish) {
      setIsPlaying(false);
    }
  }, [status.playing, status.didJustFinish]);

  const playAudio = useCallback(async () => {
    const uri =
      typeof parsedBingoAudio[currentAudio].audio_path === "object"
        ? parsedBingoAudio[currentAudio].audio_path?.uri
        : parsedBingoAudio[currentAudio].audio_path;

    if (!uri) return;

    player.replace({ uri });
    player.play();
    setIsPlayed(true);
  }, [player, currentAudio, parsedBingoAudio]);

  const handleSubmit = async () => {
    if (answers.length !== parsedBingoAudio.length) {
      return;
    }

    const activity = parsedBingoItems.map((item) => {
      return {
        image_path: item.image_path,
        image_id: item.image_id,
      };
    });
    try {
      setIsCreating(true);
      const res = activityId
        ? await updateBingoActivity(
            subjectId,
            activityDifficulty,
            activityId,
            activity,
            parsedBingoAudio,
            title,
            remedialId,
            answers,
          )
        : await createBingoActivity(
            subjectId,
            activityDifficulty,
            activity,
            parsedBingoAudio,
            title,
            remedialId,
            answers,
          );

      setIsCreating(false);

      if (res.success) {
        Alert.alert(
          "Success",
          res.message,
          [
            {
              text: "OK",
              onPress: () => {
                router.back();
                router.back();
                router.back();
                router.back();
              },
            },
          ],
          { cancelable: false },
        );
      } else {
        Alert.alert("Error", res.message);
      }
    } catch (err) {
      Alert.alert("Error", "Submission failed. Please check your inputs.");
    }
  };

  return (
    <View style={[globalStyles.container, { flex: 1, padding: 20 }]}>
      <View
        style={{
          borderColor: "#ddd",
          borderWidth: 1,
          borderRadius: 20,
          padding: 10,
          marginBottom: 10,
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
          onPress={playAudio}
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
          Tap the speaker icon.{"\n"} Listen carefully!
        </Text>
      </View>
      <FlatList
        style={styles.bingoCards}
        data={activityData}
        numColumns={3}
        keyExtractor={(item) => item.image_id}
        renderItem={({ item, index }) => (
          <BingoCard
            image={
              typeof item.image_path === "object"
                ? item.image_path?.uri
                : item.image_path
            }
            isMatched={answers.some((aud) => aud.image_id === item.image_id)}
            onPress={() => handleCardPress(item.image_id ?? index.toString())}
          />
        )}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          position: "absolute",
          bottom: 30,
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
          disabled={isCreating}
        >
          <Text style={[globalStyles.submitButtonText, { top: 3 }]}>
            {activityId
              ? isCreating
                ? "Updating..."
                : "Update"
              : isCreating
                ? "Creating..."
                : "Create"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  difficulty: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textTransform: "capitalize",
  },
  bingoCards: {
    flexGrow: 0,
    marginBottom: 20,
  },
  speakerIcon: {
    borderRadius: 50,
    padding: 20,
  },
  nextButton: {
    padding: 17,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 10,
  },
  nextText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default memo(BingoPreview);
