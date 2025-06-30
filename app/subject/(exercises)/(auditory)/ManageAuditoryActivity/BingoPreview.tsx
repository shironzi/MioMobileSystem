import BingoCard from "@/components/trainingActivities/auditory/bingoCard";
import globalStyles from "@/styles/globalStyles";
import useHeaderConfig from "@/utils/HeaderConfig";
import { createBingoActivity, updateBingoActivity } from "@/utils/auditory";
import { FontAwesome6 } from "@expo/vector-icons";
import { useAudioPlayer } from "expo-audio";
import { router, useLocalSearchParams } from "expo-router";
import React, { memo, useCallback, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
  audio: FileInfo | null;
  audio_path: string | null;
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
  } = useLocalSearchParams<{
    subjectId: string;
    activityType: string;
    activityId: string;
    activityDifficulty: string;
    bingoItems: string;
    bingoAudio: string;
    title: string;
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
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const player = useAudioPlayer();

  const activityData = parsedBingoItems.map((item) => ({
    image_id: item.id,
    image_url: item.file?.uri ?? item.image_path ?? "",
  }));

  const handleCardPress = (image_id: string) => {
    setMatchedIds((prev) => {
      if (!prev.includes(image_id)) {
        return [...prev, image_id];
      } else {
        return prev.filter((id) => id !== image_id);
      }
    });
  };

  const playAudio = useCallback(async () => {
    const uri =
      parsedBingoAudio[currentAudio].audio?.uri ??
      parsedBingoAudio[currentAudio].audio_path;
    if (!uri) return;

    player.replace({ uri });
    player.play();
    setIsPlaying(true);

    setTimeout(async () => {
      setIsPlaying(false);
      setCurrentAudio((prev) =>
        prev >= parsedBingoAudio.length - 1 ? 0 : prev + 1,
      );
    }, 1500);
  }, [player, currentAudio, parsedBingoAudio]);

  const handleSubmit = async () => {
    const activity = parsedBingoItems.map((item) => {
      return {
        file: item.file,
        image_path: item.image_path,
        image_id: item.image_id,
        is_answer: matchedIds.includes(item.id),
      };
    });

    try {
      const res = activityId
        ? await updateBingoActivity(
            subjectId,
            activityType,
            activityDifficulty,
            activityId,
            activity,
            parsedBingoAudio,
            title,
          )
        : await createBingoActivity(
            subjectId,
            activityType,
            activityDifficulty,
            activity,
            parsedBingoAudio,
            title,
          );

      console.log(res);

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
      Alert.alert("Error", "Submission failed. Please check your inputs.");
    }
  };

  return (
    <View style={[globalStyles.container, { flex: 1, padding: 20 }]}>
      {/* <Text style={styles.difficulty}></Text> */}
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
        renderItem={({ item }) => (
          <BingoCard
            image={item.image_url}
            isMatched={matchedIds.includes(item.image_id)}
            onPress={() => handleCardPress(item.image_id)}
          />
        )}
      />

      {/* <View
        style={{ height: 120, justifyContent: "center", alignItems: "center" }}
      >
        <TouchableOpacity
          style={[
            styles.speakerIcon,
            isPlaying
              ? { backgroundColor: "#FFBF18" }
              : { backgroundColor: "#DEDFE2" },
          ]}
          onPress={playAudio}
          disabled={isPlaying}
        >
          <FontAwesome6 name="volume-high" size={25} color="#fff" />
        </TouchableOpacity>
      </View> */}
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
        >
          <Text style={[globalStyles.submitButtonText, { top: 3 }]}>
            {activityId ? "Update" : "Create"}
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
