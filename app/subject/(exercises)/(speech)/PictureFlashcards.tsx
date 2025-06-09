import ActivityProgress from "@/components/activityProgress";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { memo, useEffect, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { startActivity, submitAnswer } from "@/utils/specialized";
import Recording from "@/components/trainingActivities/Recording";
import HeaderConfigQuiz from "@/utils/HeaderConfigQuiz";
import {
  getStorage,
  ref,
  getDownloadURL,
} from "@react-native-firebase/storage";
import { getApp } from "@react-native-firebase/app";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const PictureFlashcards = () => {
  const router = useRouter();

  HeaderConfigQuiz("Flashcards");

  interface PictureItem {
    flashcard_id: string;
    text: string;
    image_url: string;
  }

  const { subjectId, difficulty, activity_type, activityId } =
    useLocalSearchParams<{
      activity_type: string;
      difficulty: string;
      subjectId: string;
      activityId: string;
    }>();

  const [cards, setCards] = useState<PictureItem[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [recordingAudio, setRecordingAudio] = useState<string | null>();
  const [loading, setLoading] = useState(true);
  const [attemptId, setAttemptId] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [currentCard, setCurrentCard] = useState<number>(0);

  const handleNextCard = async () => {
    if (!attemptId) return;
    if (!recordingAudio) return;

    const res = await submitAnswer(
      subjectId,
      activity_type,
      difficulty,
      activityId,
      attemptId,
      cards[currentCard].flashcard_id,
      recordingAudio,
    );

    if (currentCard === cards.length - 1) {
      router.push({
        pathname: "/subject/(sub-details)/scoreDetails",
        params: { subjectId, activity_type, difficulty, activityId, attemptId },
      });

      return;
    }

    if (res.success) {
      setCurrentCard(currentCard + 1);
      setIsAnswered(false);
      setSubmitting(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchActivity = async () => {
      try {
        const res = await startActivity(
          subjectId,
          activity_type,
          difficulty,
          activityId,
        );

        if (!res.success) {
          Alert.alert("Failed to start the activity");
          return router.back();
        }

        const fetchedFlashcards = Object.entries(res.flashcards).map(
          ([key, value]: [string, any]) => ({
            flashcard_id: key,
            text: value.text,
            image_url: value.image_url,
          }),
        );

        if (!isMounted) return;
        setCards(fetchedFlashcards);
        setAttemptId(res.attemptId);
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

  if (!cards) {
    return (
      <View style={styles.container}>
        <Text>No flashcards available.</Text>
      </View>
    );
  }

  console.log(cards[currentCard].image_url);

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <ActivityProgress
          difficulty={difficulty}
          totalItems={cards.length}
          completedItems={currentCard}
          instruction="Guess the picture"
        />

        <View style={styles.flashcardContainer}>
          <Image
            source={require("@/assets/images/orange.png")}
            style={{ width: 90, height: 50 }}
          />

          <Image
            source={{ uri: cards[currentCard].image_url }}
            style={{ width: 250, height: 250, borderRadius: 8, margin: "auto" }}
            resizeMode="contain"
          />
        </View>

        <Recording
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
            disabled={!isAnswered || isRecording || submitting}
            onPress={handleNextCard}
          >
            <Text style={styles.continueButtonText}>
              {submitting ? "loading...." : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </GestureHandlerRootView>
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

export default memo(PictureFlashcards);
