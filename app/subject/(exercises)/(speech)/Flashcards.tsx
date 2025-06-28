import ActivityProgress from "@/components/activityProgress";
import LoadingCard from "@/components/loadingCard";
import AudioPlayer from "@/components/trainingActivities/AudioPlayer";
import FlashcardMicrophone from "@/components/trainingActivities/speech/FlashcardMicrophone";
import HeaderConfigQuiz from "@/utils/HeaderConfigQuiz";
import { startActivity, submitAnswer } from "@/utils/specialized";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { memo, useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import FeedbackAlert from "@/components/FeedbackAlert";

const Flashcards = () => {
  const router = useRouter();

  HeaderConfigQuiz("Flashcards");

  const { subjectId, difficulty, activity_type, activityId } =
    useLocalSearchParams<{
      activity_type: string;
      difficulty: string;
      subjectId: string;
      activityId: string;
    }>();

  const [cards, setCards] = useState<{ flashcard_id: string; text: string }[]>(
    [],
  );
  const [isRecording, setIsRecording] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [recordingAudio, setRecordingAudio] = useState<string | null>();
  const [loading, setLoading] = useState(true);
  const [attemptId, setAttemptId] = useState<string | undefined>();
  const [currentCard, setCurrentCard] = useState<number>(0);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleNextCard = async () => {
    if (!attemptId) return;
    if (!recordingAudio) return;
    setIsSending(true);

    const res = await submitAnswer(
      subjectId,
      activity_type,
      difficulty,
      activityId,
      attemptId,
      cards[currentCard].flashcard_id,
      recordingAudio,
    );

    if (res.feedbacks) {
      setFeedback(res.feedbacks);
    }

    setTimeout(() => {
      if (currentCard === cards.length - 1) {
        router.push({
          pathname: "/subject/(sub-details)/scoreDetails",
          params: {
            subjectId,
            activity_type,
            difficulty,
            activityId,
            attemptId,
          },
        });

        return;
      }

      if (res.success) {
        setCurrentCard(currentCard + 1);
        setIsAnswered(false);
      }
      setIsSending(false);
    }, 5000);
  };

  useEffect(() => {
    const fetchActivity = async () => {
      const res = await startActivity(
        subjectId,
        activity_type,
        difficulty,
        activityId,
      );

      if (res.success && res.flashcards) {
        console.log(res.flashcards);
        const fetchedFlashcards = Object.entries(res.flashcards).map(
          ([key, value]: [string, any]) => ({
            flashcard_id: key,
            text: value.text,
          }),
        );

        setAttemptId(res.attemptId);
        setCards(fetchedFlashcards);
        setCurrentCard(res.currentItem);
      } else {
        Alert.alert("Failed to start the activity");
        router.back();
      }

      setLoading(false);
    };
    fetchActivity();
  }, []);

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

  if (!cards) {
    return (
      <View style={styles.container}>
        <Text>No flashcards available.</Text>
      </View>
    );
  }
  const getInstruction =
    "Look at the word. Tap and hold the microphone and read the word out loud. Try to pronounce it clearly.";

  return (
    <GestureHandlerRootView>
      <ScrollView style={styles.container}>
        <ActivityProgress
          difficulty={difficulty}
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
            <Text style={styles.flashcardText}>{cards[currentCard]?.text}</Text>
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

export default memo(Flashcards);
