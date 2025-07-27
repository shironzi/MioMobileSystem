import ActivityProgress from "@/components/activityProgress";
import LoadingCard from "@/components/loadingCard";
import AudioPlayer from "@/components/trainingActivities/AudioPlayer";
import FlashcardMicrophone from "@/components/trainingActivities/speech/FlashcardMicrophone";
import HeaderConfigQuiz from "@/utils/HeaderConfigQuiz";
import { startRemedial, submitRemedialAnswer } from "@/utils/specialized";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { memo, useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import FeedbackAlert from "@/components/FeedbackAlert";
import RemedialSchedule from "@/components/modals/RemedialSchedule";

const RemedialFlashcards = () => {
  const router = useRouter();

  HeaderConfigQuiz("Flashcards");

  const { subjectId, activity_type, remedialId, phoneme } =
    useLocalSearchParams<{
      activity_type: string;
      subjectId: string;
      remedialId: string;
      phoneme: string;
    }>();

  const [cards, setCards] = useState<
    { item_id: string; text: string; image_url: string | null }[]
  >([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [recordingAudio, setRecordingAudio] = useState<string | null>();
  const [loading, setLoading] = useState(true);
  const [attemptId, setAttemptId] = useState<string | undefined>();
  const [currentCard, setCurrentCard] = useState<any>(0);
  const [isSending, setIsSending] = useState<boolean>(false);
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

  const handleNextCard = async () => {
    if (!attemptId) return;
    if (!recordingAudio) return;
    setIsSending(true);

    const res = await submitRemedialAnswer(
      subjectId,
      activity_type,
      attemptId,
      remedialId,
      phoneme,
      cards[currentCard].item_id,
      recordingAudio,
    );

    console.log(res);

    if (res.feedbacks) {
      setFeedback(res.feedbacks);
    }

    setTimeout(() => {
      if (currentCard === cards.length - 1) {
        router.push({
          pathname: "/subject/(exercises)/(speech)/RemedialScoreDetails",
          params: {
            subjectId,
            activity_type,
            remedialId,
            attemptId,
          },
        });

        return;
      }

      if (res.success) {
        setCurrentCard(currentCard + 1);
      }

      setIsAnswered(false);
      setIsSending(false);
    }, 5000);
  };

  useEffect(() => {
    const fetchActivity = async () => {
      const res = await startRemedial(
        subjectId,
        activity_type,
        remedialId,
        phoneme,
      );

      if (res.success) {
        setAttemptId(res.attemptId);
        setCards(res.flashcards);
        setCurrentCard(res.currentItem ?? 0);

        setLoading(false);
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
    };
    fetchActivity();
  }, []);

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

  const getInstruction =
    "Look at the word. Tap and hold the microphone and read the word out loud. Try to pronounce it clearly.";

  return (
    <GestureHandlerRootView>
      <ScrollView style={styles.container}>
        <ActivityProgress
          difficulty={"Remedial"}
          totalItems={cards.length}
          completedItems={currentCard}
          // instruction="Guess the picture"
        />
        <View
          style={{
            // marginHorizontal: 10,
            borderColor: "#ddd",
            borderWidth: 1,
            borderRadius: 20,
            paddingHorizontal: 10,
            marginBottom: 15,
            marginTop: -10,
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

        <View style={styles.flashcardContainer}>
          <Image
            source={require("@/assets/images/face/echo.png")}
            style={{ width: 90, height: 50 }}
            resizeMode="contain"
          />

          {feedback && (
            <View
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
              }}
            >
              <FeedbackAlert
                message={feedback}
                onHide={() => setFeedback(null)}
              />
            </View>
          )}

          <View style={styles.textContainer}>
            {cards[currentCard].image_url ? (
              <Image
                source={{ uri: cards[currentCard].image_url }}
                style={{
                  width: 150,
                  height: 150,
                  borderRadius: 8,
                  margin: "auto",
                }}
                resizeMode="contain"
              />
            ) : (
              <Text style={styles.flashcardText}>
                {cards[currentCard]?.text}
              </Text>
            )}
          </View>
        </View>

        <View style={{ rowGap: 5, marginTop: 15 }}>
          <FlashcardMicrophone
            onStop={(uri) => {
              setIsRecording(false);
              setIsAnswered(true);
              setRecordingAudio(uri);
            }}
          />
          {recordingAudio && (
            <View style={{ marginTop: 10 }}>
              <AudioPlayer uri={recordingAudio} />
            </View>
          )}
        </View>

        <View>
          <TouchableOpacity
            style={[
              styles.continueButton,
              isAnswered && !isRecording
                ? { backgroundColor: "#FFBF18" }
                : { backgroundColor: "#ddd" },
            ]}
            disabled={!isAnswered || isRecording || isSending}
            onPress={handleNextCard}
          >
            <Text style={styles.continueButtonText}>
              {isSending ? "Submitting...." : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 30,
    height: "100%",
  },
  flashcardContainer: {
    backgroundColor: "#fff",
    padding: 20,
    height: 230,
    borderRadius: 20,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  textContainer: {
    margin: "auto",
    textAlign: "center",
  },
  flashcardText: {
    fontSize: 22,
    flexWrap: "wrap",
    textAlign: "center",
    top: -15,
    fontWeight: 300,
    lineHeight: 35,
  },
  continueButton: {
    flex: 1,
    marginHorizontal: 5,
    left: -5,
    padding: 17,
    borderRadius: 15,
    alignItems: "center",
    width: "100%",
    top: 15,
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default memo(RemedialFlashcards);
