import LoadingCard from "@/components/loadingCard";
import BingoCard from "@/components/trainingActivities/auditory/bingoCard";
import globalStyles from "@/styles/globalStyles";
import getCurrentDateTime from "@/utils/DateFormat";
import HeaderConfigQuiz from "@/utils/HeaderConfigQuiz";
import {
  getAttemptActivityAuditory,
  submitBingoActivity,
  takeAuditoryActivity,
} from "@/utils/auditory";
import { FontAwesome6 } from "@expo/vector-icons";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { router, useLocalSearchParams } from "expo-router";
import React, { memo, useCallback, useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const bingo = () => {
  HeaderConfigQuiz("Piddie Says");

  const getInstruction =
    "Click the speaker twice to hear the words from Piddie. Choose the picture that matches what you hear.";

  const { subjectId, difficulty, activity_type, activityId, prevAttemptId } =
    useLocalSearchParams<{
      activity_type: string;
      difficulty: string;
      subjectId: string;
      activityId: string;
      prevAttemptId: string;
    }>();

  const [isSending, setIsSending] = useState(false);

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
    { audio_id: string; played_at: string[] }[]
  >([]);
  const [answers, setAnswers] = useState<
    { image_id: string; selected_at: string }[]
  >([]);

  const player = useAudioPlayer();
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    if (status.playing) {
      setIsPlaying(true);
    } else if (status.didJustFinish) {
      setIsPlaying(false);
    }
  }, [status.playing, status.didJustFinish]);

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
    if (!attemptId) return;

    setIsSending(true);

    const res = await submitBingoActivity(
      subjectId,
      difficulty,
      activityId,
      attemptId,
      answers,
      totalPlay,
    );

    console.log(res);

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

    setIsSending(false);
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
          played_at: [...updated[existingIndex].played_at, date],
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            audio_id: audioId,
            played_at: [date],
          },
        ];
      }
    });

    player.replace({
      uri: audioFiles[currentAudio].audio_url,
    });

    player.play();

    if (currentAudio >= audioFiles.length - 1) {
      setCurrentAudio(0);
    } else {
      setCurrentAudio(currentAudio + 1);
    }
  }, [player, currentAudio, audioFiles]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
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
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [subjectId, activity_type, difficulty, activityId]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <LoadingCard></LoadingCard>
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
    <FlatList
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
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingBottom: 50,
      }}
      ListHeaderComponent={
        <View>
          {/* <Text style={styles.difficulty}>{difficulty}</Text> */}
          <View
            style={{
              marginHorizontal: 10,
              borderColor: "#ddd",
              borderWidth: 1,
              borderRadius: 20,
              paddingHorizontal: 10,
              marginBottom: 15,
              marginTop: 20,
              left: -5,
            }}
          >
            <Text
              style={{
                marginHorizontal: 10,
                textAlign: "justify",
                fontWeight: "500",
                fontSize: 16,
                color: "#2264dc",
                marginTop: 10,
              }}
            >
              Piddie Tips!
            </Text>

            <Text
              style={{
                marginTop: 5,
                margin: 10,
                textAlign: "justify",
                fontWeight: "300",
              }}
            >
              {getInstruction}
            </Text>
          </View>
        </View>
      }
      ListFooterComponent={
        <View style={styles.footerContainer}>
          <View
            style={{
              borderColor: "#ddd",
              borderWidth: 1,
              borderRadius: 20,
              marginVertical: 15,
              marginHorizontal: 10,
              width: "93%",
              top: 0,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                marginTop: -20,
                top: 45,
                left: 10,
                fontWeight: 300,
                fontSize: 14,
              }}
            >
              Tap the speaker
            </Text>
            <TouchableOpacity
              style={[
                styles.speakerIcon,
                { backgroundColor: "#ffbf18" },
                // isPlaying
                // 	? { backgroundColor: "#ffbf18" }
                // 	: { backgroundColor: "#ddd" },
              ]}
              onPress={playAudio}
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
                : { backgroundColor: "#ddd" },
            ]}
            disabled={isPlaying || isSending}
          >
            <Text style={styles.nextText}>
              {isSending ? "Sending" : "Submit"}
            </Text>
          </TouchableOpacity>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  difficulty: {
    textTransform: "capitalize",
    fontSize: 16,
    marginTop: 15,
    marginBottom: -5,
    margin: 15,
    color: "#000",
    fontWeight: "500",
    textAlign: "left",
    left: -5,
  },
  bingoCards: {
    margin: "auto",
    height: "70%",
  },
  footerContainer: {
    gap: 10,
  },

  speakerIcon: {
    flex: 1,
    width: "16%",
    margin: 10,
    borderRadius: 10,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 12,
  },

  listen: {
    fontSize: 18,
    color: "#ffbf18",
  },
  nextButton: {
    flex: 1,
    marginTop: -10,
    marginHorizontal: 10,
    padding: 17,
    borderRadius: 15,
    alignItems: "center",
  },

  nextText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default memo(bingo);
