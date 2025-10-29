import LoadingCard from "@/components/loadingCard";
import BingoCard from "@/components/trainingActivities/auditory/bingoCard";
import globalStyles from "@/styles/globalStyles";
import getCurrentDateTime from "@/utils/DateFormat";
import HeaderConfigQuiz from "@/utils/HeaderConfigQuiz";
import { submitBingoRemedial, takeBingoRemedial } from "@/utils/auditory";
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
import FeedbackAlert from "@/components/FeedbackAlert";
import RemedialSchedule from "@/components/modals/RemedialSchedule";

const bingo = () => {
  HeaderConfigQuiz("Piddie Says");

  const getInstruction =
    "Click the speaker twice to hear the words from Piddie. Choose the picture that matches what you hear.";

  const { subjectId, activity_type, remedialId } = useLocalSearchParams<{
    subjectId: string;
    activity_type: string;
    activity_title: string;
    remedialId: string;
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
    { image_id: string; selected_at: string; audio_id: string }[]
  >([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showSchedule, setShowSchedule] = useState<boolean>(false);
  const [scheduleMessage, setScheduleMessage] = useState<{
    has_schedule: boolean;
    message: string;
    date: string;
    start_time: string;
    end_time: string;
  }>({
    has_schedule: false,
    message: "",
    date: "",
    start_time: "",
    end_time: "",
  });

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
    const audioId = audioFiles[currentAudio].audio_id;

    const existingIndex = answers.findIndex((a) => a.audio_id === audioId);

    let previousImageId: string | undefined = undefined;

    if (existingIndex !== -1) {
      previousImageId = answers[existingIndex].image_id;

      const newAnswers = [...answers];
      newAnswers[existingIndex] = {
        image_id,
        selected_at: date,
        audio_id: audioId,
      };
      setAnswers(newAnswers);
    } else {
      setAnswers((prev) => [
        ...prev,
        {
          image_id,
          selected_at: date,
          audio_id: audioId,
        },
      ]);
    }

    let newMatchedIds = [...matchedIds];
    if (previousImageId) {
      newMatchedIds = newMatchedIds.filter((id) => id !== previousImageId);
    }

    if (!newMatchedIds.includes(image_id)) {
      newMatchedIds.push(image_id);
    }

    setMatchedIds(newMatchedIds);

    if (currentAudio >= audioFiles.length - 1) {
      setCurrentAudio(0);
    } else {
      setCurrentAudio(currentAudio + 1);
    }
  };

  const handleSubmit = async () => {
    if (!attemptId) return;

    setIsSending(true);

    const res = await submitBingoRemedial(
      subjectId,
      remedialId,
      attemptId,
      answers,
      totalPlay,
    );

    if (res.success) {
      setFeedback(res.feedback);

      setTimeout(() => {
        router.push({
          pathname: "/subject/(exercises)/AuditoryScores",
          params: {
            score: res.score,
            totalItems: activityData.length,
            activityType: activity_type,
            difficulty: "Remedial",
            is_remedial: "true",
          },
        });
      }, 5000);
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
  }, [player, currentAudio, audioFiles]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await takeBingoRemedial(subjectId, remedialId);

      if (res.success) {
        setAttemptId(res.attemptId);
        setActivityData(res.items);
        setAudioFiles(res.audio_paths);
      } else {
        setShowSchedule(true);
        setScheduleMessage({
          message: res.message,
          has_schedule: res.has_schedule,
          date: res.date ?? "",
          end_time: res.end_time ?? "",
          start_time: res.start_time ?? "",
        });
      }
      setLoading(false);
    };

    fetchData();
  }, [subjectId, remedialId]);

  if (showSchedule) {
    return (
      <RemedialSchedule
        message={scheduleMessage?.message}
        has_schedule={scheduleMessage?.has_schedule}
        date={scheduleMessage.date}
        end_time={scheduleMessage.end_time}
        start_time={scheduleMessage.start_time}
      />
    );
  }

  if (loading && !showSchedule) {
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
    <View style={{ backgroundColor: "#fff", height: "100%" }}>
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
                  isPlaying
                    ? { backgroundColor: "#ffbf18" }
                    : { backgroundColor: "#ddd" },
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
                !isPlaying && matchedIds.length >= audioFiles.length
                  ? { backgroundColor: "#FFBF18" }
                  : { backgroundColor: "#ddd" },
              ]}
              disabled={
                isPlaying || isSending || matchedIds.length < audioFiles.length
              }
            >
              <Text style={styles.nextText}>
                {isSending
                  ? "Submitting...."
                  : isPlaying
                    ? "Playing..."
                    : "Submit"}
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
      {feedback && (
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FeedbackAlert message={feedback} onHide={() => setFeedback(null)} />
        </View>
      )}
    </View>
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
