import ActivityProgress from "@/components/activityProgress";
import HeaderConfig from "@/utils/HeaderConfig";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  finishActivity,
  getActivityById,
  startActivity,
  submitAnswer,
} from "@/utils/specialized";
import Recording from "@/components/trainingActivities/Recording";

const Flashcards = () => {
  HeaderConfig("Flashcards");
  const router = useRouter();

  const { subjectId, difficulty, activityType, category, activityId } =
    useLocalSearchParams<{
      activityType: string;
      difficulty: string;
      category: string;
      subjectId: string;
      activityId: string;
    }>();

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [cards, setCards] = useState<{ flashcard_id: string; word: string }[]>(
    [],
  );
  const [isRecording, setIsRecording] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [recordingAudio, setRecordingAudio] = useState<string | null>();
  const [loading, setLoading] = useState(true);
  const [attemptId, setAttemptId] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState<boolean>(false);

  const currentCard = useMemo(() => {
    return cards[currentCardIndex];
  }, [cards, currentCardIndex]);

  const handleNext = useCallback(async () => {
    if (!isRecording) {
      if (currentCardIndex <= cards.length - 1) {
        try {
          if (!attemptId) {
            console.error("No attemptId available");
            return;
          }

          if (!recordingAudio) {
            console.error("No recording audio");
            return;
          }

          setSubmitting(true);
          const res = await submitAnswer(
            subjectId,
            activityType,
            difficulty,
            activityId,
            attemptId,
            cards[currentCardIndex].flashcard_id,
            recordingAudio,
          );

          if (res.success) {
            console.log("success");
            setIsAnswered(false);
            setCurrentCardIndex(currentCardIndex + 1);
            setSubmitting(false);
          }
        } catch (err) {
          console.error("Failed to save: " + err);
        }
      } else {
        try {
          if (attemptId) {
            const res = await finishActivity(
              subjectId,
              activityType,
              difficulty,
              activityId,
              attemptId,
            );
            if (res.success) {
              router.push({
                pathname: "/subject/(sub-details)/scoreDetails",
                params: { subjectId, activityId, attemptId },
              });
            } else {
              Alert.alert("failed to submit");
            }
          }
        } catch (err) {
          console.error("Failed to submit");
        }
      }
    }
  }, [
    router,
    isRecording,
    currentCardIndex,
    attemptId,
    recordingAudio,
    subjectId,
    activityType,
    difficulty,
    activityId,
    cards,
  ]);

  useEffect(() => {
    let isMounted = true;
    const fetchActivity = async () => {
      try {
        const res = await getActivityById(
          subjectId,
          activityType,
          difficulty,
          activityId,
        );

        const start = await startActivity(
          subjectId,
          activityType,
          difficulty,
          activityId,
        );

        setAttemptId(start.attemptId);
        setCards(res.activities);

        if (!isMounted) return;
      } catch (error) {
        console.error("Error loading activity:", error);
        if (isMounted) {
          Alert.alert(
            "Error",
            "Unable to load activity. Please check your connection.",
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchActivity();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <View>
        <Text>Loading........</Text>
      </View>
    );
  }

  if (!currentCard) {
    return (
      <View style={styles.container}>
        <Text>No flashcards available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityProgress
        difficulty={difficulty}
        totalItems={cards.length}
        completedItems={currentCardIndex}
        instruction="Guess the picture"
      />

      <View style={styles.flashcardContainer}>
        <Image
          source={require("@/assets/images/orange.png")}
          style={{ width: 90, height: 50 }}
        />
        <View style={styles.textContainer}>
          <Text style={styles.flashcardText}>{currentCard.word}</Text>
        </View>
      </View>

      <Recording
        onStart={() => {
          setIsRecording(true);
          setIsAnswered(false);
        }}
        onStop={(uri) => {
          setIsRecording(false);
          setIsAnswered(true);
          setRecordingAudio(uri);
        }}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            isAnswered && !isRecording
              ? { backgroundColor: "#FFBF18" }
              : { backgroundColor: "#E0E0E0" },
          ]}
          onPress={handleNext}
          disabled={!isAnswered || isRecording || submitting}
        >
          <Text style={styles.continueButtonText}>
            {currentCardIndex === cards.length - 1
              ? "Submit"
              : submitting
                ? "Submitting..."
                : "Continue"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },

  flashcardContainer: {
    backgroundColor: "#fff",
    flex: 1,
    padding: 20,
    height: 300,
    borderRadius: 15,
  },
  textContainer: {
    margin: "auto",
    textAlign: "center",
  },
  flashcardText: {
    fontSize: 24,
    flexWrap: "wrap",
  },
  cardImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: -90,
  },
  buttonContainer: {
    marginTop: 70,
  },
  continueButton: {
    padding: 15,
    borderRadius: 50,
    alignItems: "center",
  },
  continueButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default memo(Flashcards);
