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
  file: FileInfo | null;
  image_path: string | null;
  image_id: string | null;
}

interface AudioItem {
  id: string;
  audio: FileInfo | null;
  audio_path: string | null;
  audio_id: string | null;
}

const BingoPreview = () => {
  useHeaderConfig("Piddie Says");

  const {
    subjectId,
    activityType,
    activityId,
    activityDifficulty,
    bingoItems,
    bingoAudio,
    title,
    remedialId,
  } = useLocalSearchParams<{
    subjectId: string;
    activityType: string;
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
  const [answers, setAnswers] = useState<string[]>([]);
  const [audioAnswers, setAudioAnswers] = useState<string[]>([]);
  const [isPlayed, setIsPlayed] = useState(false);

  const player = useAudioPlayer();
  const status = useAudioPlayerStatus(player);

  const activityData = parsedBingoItems.map((item) => ({
    image_id: item.id,
    image_url: item.file?.uri ?? item.image_path ?? "",
  }));

  const handleCardPress = (image_id: string) => {
    if (!isPlayed) return;

    // let current = currentAudio - 1;
    // if (current < 0) {
    //   current = 0;
    // }

    const newImage = [...answers];
    newImage[currentAudio] = image_id;
    setAnswers(newImage);

    const newAudio = [...audioAnswers];
    newAudio[currentAudio] =
      parsedBingoAudio.find((_, index) => index === currentAudio)?.audio_id ??
      "";
    setAudioAnswers(newAudio);

    if (!newImage[currentAudio] || newImage[currentAudio].length < 0) {
      return;
    }
    setCurrentAudio((prev) =>
      prev >= parsedBingoAudio.length - 1 ? 0 : prev + 1,
    );

    console.log(audioAnswers);
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
      parsedBingoAudio[currentAudio].audio?.uri ??
      parsedBingoAudio[currentAudio].audio_path;
    if (!uri) return;

    player.replace({ uri });
    player.play();
    setIsPlayed(true);

    console.log(currentAudio);
    console.log(uri);
  }, [player, currentAudio, parsedBingoAudio]);

  const handleSubmit = async () => {
    const activity = parsedBingoItems.map((item) => {
      return {
        file: item.file,
        image_path: item.image_path,
        image_id: item.image_id,
      };
    });
    try {
      setIsCreating(true);
      const res = activityId
        ? await updateBingoActivity(
            subjectId,
            activityType,
            activityDifficulty,
            activityId,
            activity,
            parsedBingoAudio,
            title,
            remedialId,
            answers,
            audioAnswers,
          )
        : await createBingoActivity(
            subjectId,
            activityType,
            activityDifficulty,
            activity,
            parsedBingoAudio,
            title,
            remedialId,
            answers,
          );

      console.log(res);
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
            image={item.image_url}
            isMatched={answers.some(
              (aud) => aud === index.toString() || aud === item.image_id,
            )}
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
