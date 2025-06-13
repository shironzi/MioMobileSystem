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
import {
  getAttemptActivityAuditory,
  submitBingoActivity,
  takeAuditoryActivity,
} from "@/utils/auditory";
import globalStyles from "@/styles/globalStyles";
import { useAudioPlayer } from "expo-audio";
import getCurrentDateTime from "@/utils/DateFormat";
import { getAttemptActivity } from "@/utils/specialized";

const bingo = () => {
  HeaderConfigQuiz("Bingo Cards");

  const { subjectId, difficulty, activity_type, activityId, prevAttemptId } =
    useLocalSearchParams<{
      activity_type: string;
      difficulty: string;
      subjectId: string;
      activityId: string;
      prevAttemptId: string;
    }>();

  const [activityData, setActivityData] = useState<
    { image_id: string; image_url: string }[]
  >([]);
  const [audioFiles, setAudioFiles] = useState<
    { audio_id: string; audio_url: string }[]
  >([]);
  const [currentAudio, setCurrentAudio] = useState<number>(0);
  const [attemptId, setAttemptId] = useState<string>();
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPlay, setTotalPlay] = useState<
    { audio_id: string; total: number; played_at: string[] }[]
  >([]);
  const [answers, setAnswers] = useState<
    { image_id: string; selected_at: string }[]
  >([]);

  const player = useAudioPlayer();

  const handleCardPress = (image_id: string): void => {
    const date = getCurrentDateTime();

    if (
      !matchedIds.includes(image_id) &&
      !answers.some((entry) => entry.image_id === image_id)
    ) {
      setMatchedIds((prev) => [...prev, image_id]);
      setAnswers((prev) => [...prev, { image_id, selected_at: date }]);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!attemptId) return;

      const payload = {
        answers: answers,
        audio_played: totalPlay,
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
          pathname: "/subject/(exercises)/AuditoryScores",
          params: {
            score: res.score,
            totalItems: activityData.length,
            activityType: activity_type,
            difficulty: difficulty,
          },
        });
      }
    } catch (err) {
      console.error("failed to submit: ", err);
    }
  };

  const playAudio = useCallback(() => {
    const audioId = audioFiles[currentAudio].audio_id;
    const date = getCurrentDateTime();

    setTotalPlay((prev) => {
      const existingIndex = prev.findIndex((item) => item.audio_id === audioId);

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          total: updated[existingIndex].total + 1,
          played_at: [...updated[existingIndex].played_at, date],
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            audio_id: audioId,
            total: 1,
            played_at: [date],
          },
        ];
      }
    });

    player.replace({
      uri: audioFiles[currentAudio].audio_url,
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
        const res = prevAttemptId
          ? await getAttemptActivityAuditory(
              subjectId,
              activity_type,
              activityId,
              prevAttemptId,
            )
          : await takeAuditoryActivity(
              subjectId,
              activity_type,
              difficulty,
              activityId,
            );

        console.log(res);
        if (!res.success) {
          console.log("failed to take activity");
        }

        setAttemptId(res.attemptId);
        if (isMounted) {
          setActivityData(res.items);

          console.log(res.items);
          setAudioFiles(res.audio_paths);
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
  }, [subjectId, activity_type, difficulty, activityId]);

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
          !isPlaying && matchedIds.length > 0
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
