import BingoCard from "@/components/trainingActivities/auditory/bingoCard";
import { FontAwesome6 } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { memo, useCallback, useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import HeaderConfigQuiz from "@/utils/HeaderConfigQuiz";
import { submitBingoActivity, takeAuditoryActivity } from "@/utils/auditory";
import { getApp } from "@react-native-firebase/app";
import {
  getDownloadURL,
  getStorage,
  ref,
} from "@react-native-firebase/storage";
import globalStyles from "@/styles/globalStyles";
import { useAudioPlayer } from "expo-audio";

const bingo = () => {
  HeaderConfigQuiz("Bingo Cards");

  const { subjectId, difficulty, activityType, activityId } =
    useLocalSearchParams<{
      activityType: string;
      difficulty: string;
      subjectId: string;
      activityId: string;
    }>();

  const [activityData, setActivityData] = useState<
    { image_id: string; image_url: string }[]
  >([]);
  const [audioFiles, setAudioFiles] = useState<string[]>([]);
  const [currentAudio, setCurrentAudio] = useState<number>(0);
  const [attemptId, setAttemptId] = useState<string>();
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  const player = useAudioPlayer();

  const handleCardPress = (image_no: string): void => {
    if (!matchedIds.includes(image_no)) {
      setMatchedIds([...matchedIds, image_no]);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!attemptId) return;

      const payload = {
        answers: matchedIds.map((image_id) => ({ image_id })),
      };

      const res = await submitBingoActivity(
        subjectId,
        difficulty,
        activityId,
        attemptId,
        payload,
      );

      if (res.success) {
        router.push({
          pathname: "/subject/(exercises)/(auditory)/AuditoryScores",
          params: {
            score: res.score,
            totalScore: activityData.length,
            activityType: activityType,
            difficulty: difficulty,
          },
        });
      }
    } catch (err) {
      console.error("failed to submit: ", err);
    }
  };

  const playAudio = useCallback(() => {
    player.replace({
      uri: audioFiles[currentAudio],
    });

    player.play();

    setIsPlaying(false);
    if (currentAudio >= audioFiles.length - 1) {
      setCurrentAudio(0);
    } else {
      setCurrentAudio(currentAudio + 1);
    }

    setIsPlaying(false);
  }, [player, currentAudio, audioFiles]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const res = await takeAuditoryActivity(
          subjectId,
          activityType,
          difficulty,
          activityId,
        );
        if (!res.success) {
          console.log("failed to take activity");
        }

        setAttemptId(res.attemptId);
        const app = getApp();
        const storage = getStorage(app);

        const audioCards = await Promise.all(
          res.audio_paths.map(
            async (file: { audio_path: string }) =>
              await getDownloadURL(ref(storage, file.audio_path)),
          ),
        );

        if (isMounted) {
          setActivityData(res.items);
          setAudioFiles(audioCards);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [subjectId, activityType, difficulty, activityId]);

  if (loading) {
    return (
      <View>
        <Text>Loading........</Text>
      </View>
    );
  }

  if (!activityData) {
    return (
      <View style={globalStyles.container}>
        <Text>No flashcards available.</Text>
      </View>
    );
  }

  return (
    <View style={[globalStyles.container, { height: "100%" }]}>
      <Text style={styles.difficulty}>{difficulty}</Text>
      <FlatList
        style={styles.bingoCards}
        data={activityData}
        numColumns={3}
        renderItem={({ item }) => (
          <BingoCard
            image={item.image_url}
            isMatched={matchedIds.includes(item.image_id)}
            onPress={() => handleCardPress(item.image_id)}
          />
        )}
      />

      <View style={{ height: 200 }}>
        <TouchableOpacity
          style={[
            styles.speakerIcon,
            isPlaying
              ? { backgroundColor: "#FFBF18" }
              : { backgroundColor: "#DEDFE2" },
          ]}
          onPress={() => playAudio()}
        >
          <FontAwesome6 name="volume-high" size={25} color="#fff" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={handleSubmit}
        style={[
          styles.nextButton,
          !isPlaying && matchedIds.length > 1
            ? { backgroundColor: "#FFBF18" }
            : { backgroundColor: "#DEDFE2" },
        ]}
        disabled={isPlaying}
      >
        <Text style={styles.nextText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  difficulty: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
    height: "5%",
    left: 5,
  },
  bingoCards: {
    margin: "auto",
    height: "70%",
  },
  speakerIcon: {
    borderRadius: 180,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 12,
    padding: 100,
  },
  listen: {
    fontSize: 18,
    color: "#ffbf18",
  },
  nextButton: {
    padding: 17,
    borderRadius: 50,
    alignItems: "center",
    position: "fixed",
    bottom: 50,
  },
  nextText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default memo(bingo);
